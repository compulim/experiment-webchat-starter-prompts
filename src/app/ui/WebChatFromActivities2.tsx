import './WebChat.css';

import { toDirectLineJS, type Activity } from 'copilot-studio-direct-to-engine-chat-adapter';
import { memo, useCallback, useEffect, useRef } from 'react';
import createDirectLineEmulator2, { type ActPostActivity } from '../util/createDirectLineEmulator2';
import WebChat from './WebChat';

type Props = Readonly<{ activities: readonly Activity[] }>;

export default memo(function WebChatFromActivities2({ activities }: Props) {
  const actPostActivityRef = useRef<ActPostActivity | undefined>(undefined);
  const createDirectLine = useCallback(() => {
    const { actPostActivity, emulateIncomingActivity, turnGenerator } = createDirectLineEmulator2();

    activities.length && activities.forEach(activity => emulateIncomingActivity(activity));

    actPostActivityRef.current = actPostActivity;

    return toDirectLineJS(turnGenerator);
  }, [activities]);

  useEffect(() => {
    const abortController = new AbortController();

    (async function () {
      const { signal } = abortController;

      for (; !signal.aborted; ) {
        const { resolveAll } = (await actPostActivityRef.current?.(() => {})) || {};

        if (signal.aborted || !resolveAll) {
          break;
        }

        const echoBackActivity = await resolveAll();

        console.log(echoBackActivity);
      }
    })();

    return () => abortController.abort();
  }, [createDirectLine]);

  return <WebChat createDirectLine={createDirectLine} />;
});
