import './WebChat.css';

import { createStore } from 'botframework-webchat';
import { type WebChatActivity } from 'botframework-webchat-core';
import { memo, useEffect, useMemo, useState } from 'react';

import createDirectLineEmulator from '../util/createDirectLineEmulator';
import WebChat from './WebChat';

type Props = Readonly<{ activities: readonly WebChatActivity[] }>;

export default memo(function WebChatFromActivities({ activities }: Props) {
  const [ready, setReady] = useState(false);
  const store = useMemo(
    () =>
      createStore({}, () => (next: (action: unknown) => unknown) => (action: { type: string }) => {
        if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
          setReady(true);
        }

        return next(action);
      }),
    [setReady]
  );

  const { directLine } = useMemo(() => createDirectLineEmulator({ store }), [store]);

  useEffect(() => {
    activities && ready && activities.forEach(activity => directLine.emulateIncomingActivity(activity));
  }, [activities, directLine, ready]);

  useEffect(() => {
    const abortController = new AbortController();

    (async function () {
      const { signal } = abortController;

      for (; !signal.aborted; ) {
        const { resolveAll } = await directLine.actPostActivity(() => {});

        if (signal.aborted) {
          break;
        }

        const echoBackActivity = await resolveAll();

        console.log(echoBackActivity);
      }
    })();

    return () => abortController.abort();
  }, [directLine]);

  return <WebChat directLine={directLine} store={store} />;
});
