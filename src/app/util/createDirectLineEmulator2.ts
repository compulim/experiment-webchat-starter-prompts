import type { Activity, TurnGenerator } from 'copilot-studio-direct-to-engine-chat-adapter';
import uniqueId from './private/uniqueId';

type ActivityUpdater = (activity: Activity) => Activity;
type ActPostActivityInit = { id?: string | undefined };

type PostActivityCallResult = {
  outgoingActivity: Activity;
  returnPostActivityDeferred: PromiseWithResolvers<string>;
};

export type ActPostActivity = (
  fn: () => Promise<void> | void,
  init?: ActPostActivityInit | undefined
) => Promise<{
  activity: Activity;
  echoBack: (updater?: ActivityUpdater | undefined) => Promise<void>;
  rejectPostActivity: (error: Error) => void;
  resolveAll: () => Promise<Activity>;
  resolvePostActivity: () => Activity;
}>;

type EmulateIncomingActivity = (activity: Partial<Activity>) => Promise<void>;

export default function createDirectLineEmulator2(): {
  actPostActivity: ActPostActivity;
  emulateIncomingActivity: EmulateIncomingActivity;
  turnGenerator: TurnGenerator;
} {
  const postActivityCallDeferreds: PromiseWithResolvers<PostActivityCallResult>[] = [];
  const queuedIncomingActivities: (readonly [Readonly<Activity>, PromiseWithResolvers<void>])[] = [];

  const emulateIncomingActivity = (activity: Partial<Activity>) => {
    const now = new Date();

    if (typeof activity === 'string') {
      activity = {
        from: { id: 'bot', role: 'bot' },
        id: uniqueId(),
        text: activity,
        timestamp: now.toISOString(),
        type: 'message'
      };
    } else {
      const { timestamp } = activity;
      const fromRole = activity.from?.role || 'bot';

      const fromId = activity.from?.id || (fromRole === 'bot' ? 'bot' : 'user');

      activity = {
        ...activity,
        from: { ...activity.from, id: fromId, role: fromRole },
        id: activity.id || uniqueId(),
        timestamp:
          typeof timestamp === 'number'
            ? new Date(timestamp + now).toISOString()
            : typeof timestamp === 'undefined'
              ? now.toISOString()
              : timestamp,
        type: activity.type || 'message'
      };
    }

    const deferred = Promise.withResolvers<void>();

    queuedIncomingActivities.push(Object.freeze([activity as any, deferred]));

    return deferred.promise;
  };

  const createTurn: () => TurnGenerator = () => {
    let obsoleted = false;

    const turnGenerator = (async function* () {
      if (obsoleted) {
        throw new Error('Generator has already executed.');
      }

      obsoleted = true;

      for (;;) {
        const incomingActivityEntry = queuedIncomingActivities.shift();

        if (!incomingActivityEntry) {
          break;
        }

        try {
          yield incomingActivityEntry[0];

          incomingActivityEntry[1].resolve();
        } catch (error) {
          incomingActivityEntry[1].reject(error);
        }
      }

      return createTurn;
    })();

    return turnGenerator;
  };

  const actPostActivity: ActPostActivity = async (fn, { id: idFromOptions } = {}) => {
    const postActivityCallDeferred = Promise.withResolvers<PostActivityCallResult>();

    postActivityCallDeferreds.push(postActivityCallDeferred);

    await fn();

    const { outgoingActivity, returnPostActivityDeferred } = await postActivityCallDeferred.promise;
    const id = idFromOptions || uniqueId();

    let echoBackActivity: Activity = { ...outgoingActivity, id, timestamp: new Date().toISOString() };

    const echoBack = async (updater?: ActivityUpdater | undefined) => {
      if (typeof updater === 'function') {
        echoBackActivity = updater(echoBackActivity);
      }

      const echoBackActivityDeferred = Promise.withResolvers<void>();

      queuedIncomingActivities.push(Object.freeze([echoBackActivity, echoBackActivityDeferred]));

      await echoBackActivityDeferred.promise;
    };

    const rejectPostActivity = (error: Error) => returnPostActivityDeferred.reject(error);
    const resolvePostActivity = () => {
      returnPostActivityDeferred.resolve(id);

      return echoBackActivity;
    };

    const resolveAll = async (updater?: ActivityUpdater) => {
      await echoBack(updater);

      return resolvePostActivity();
    };

    return { activity: outgoingActivity, echoBack, rejectPostActivity, resolveAll, resolvePostActivity };
  };

  return {
    actPostActivity,
    emulateIncomingActivity,
    turnGenerator: createTurn()
  };
}
