import './WebChat.css';

import { Components } from 'botframework-webchat';
import { ActivityMiddleware } from 'botframework-webchat-api';
import { FluentThemeProvider } from 'botframework-webchat-fluent-theme';
import { toDirectLineJS, type TurnGenerator } from 'copilot-studio-direct-to-engine-chat-adapter';
import { memo, useCallback, useMemo, useRef, useState, type FormEventHandler } from 'react';
import CopilotStudioThemeProvider from '../embedded/CopilotStudioThemeProvider';
import isStarterPromptsActivity from '../embedded/isStarterPromptsActivity';
import ActivitiesObserver, { type ActivitiesObserverProps } from './ActivitiesObserver';

const { BasicWebChat, Composer } = Components;

type Props = Readonly<{
  createTurnGenerator: () => TurnGenerator;
}>;

export default memo(function Chat({ createTurnGenerator }: Props) {
  const numActivitiesRef = useRef<number>(0);

  const handleActivities = useCallback<ActivitiesObserverProps['onActivities']>(
    activities => {
      numActivitiesRef.current = activities.length;
    },
    [numActivitiesRef]
  );

  const activityMiddleware = useMemo<ActivityMiddleware>(
    () =>
      () =>
      next =>
      (...args) => {
        if (isStarterPromptsActivity(args[0].activity) && numActivitiesRef.current > 1) {
          // TODO: We could treat the card differently.
          return false;
        }

        return next(...args);
      },
    [numActivitiesRef]
  );

  const [shouldUseFluentSkinpack, setShouldUseFluentSkinpack] = useState(true);

  const handleShouldUseFluentSkinpackClick = useCallback<FormEventHandler<HTMLInputElement>>(
    ({ currentTarget: { checked } }) => {
      setShouldUseFluentSkinpack(checked);
    },
    [setShouldUseFluentSkinpack]
  );

  // Every time "shouldUseFluentSkinpack" is flipped, we will re-render Web Chat.
  // Re-render Web Chat will need a new Direct Line object as the previous one is already exhausted.
  const directLine = useMemo(
    () => toDirectLineJS(createTurnGenerator()),
    [createTurnGenerator, shouldUseFluentSkinpack]
  );

  const webChatElement = (
    <CopilotStudioThemeProvider>
      <Composer activityMiddleware={activityMiddleware} directLine={directLine}>
        <ActivitiesObserver onActivities={handleActivities} />
        <BasicWebChat />
      </Composer>
    </CopilotStudioThemeProvider>
  );

  return (
    <div className="chat">
      {shouldUseFluentSkinpack ? <FluentThemeProvider>{webChatElement}</FluentThemeProvider> : webChatElement}
      <div className="chat__fluent-toggle">
        <label>
          <input checked={shouldUseFluentSkinpack} onChange={handleShouldUseFluentSkinpackClick} type="checkbox" />
          Use Fluent skin pack
        </label>
      </div>
    </div>
  );
});
