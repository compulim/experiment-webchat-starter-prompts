import './WebChat.css';

import { Components } from 'botframework-webchat';
import { ActivityMiddleware, StyleOptions, type AttachmentMiddleware } from 'botframework-webchat-api';
import { FluentThemeProvider } from 'botframework-webchat-fluent-theme';
import { memo, useCallback, useMemo, useRef, useState, type FormEventHandler, type FunctionComponent } from 'react';
import ActivitiesObserver, { type ActivitiesObserverProps } from './ActivitiesObserver';
import StarterPrompts from './StarterPrompts';
import isStarterPromptsActivity from './isStarterPromptsActivity';

const { BasicWebChat, Composer } = Components;

type PropsOf<T> = T extends FunctionComponent<infer P> ? P : never;
type ComposerProps = PropsOf<typeof Composer>;

type Props = Readonly<{
  directLine: ComposerProps['directLine'];
  store: ComposerProps['store'];
}>;

export default memo(function Chat({ directLine, store }: Props) {
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

  const attachmentMiddleware = useMemo<AttachmentMiddleware>(
    () =>
      () =>
      next =>
      (...args) => {
        const activity = args[0]?.activity;

        if (activity && isStarterPromptsActivity(activity) && args[0]?.attachment.contentType === 'text/markdown') {
          return (
            <div>
              {next(...args)}
              <StarterPrompts cardActions={activity.suggestedActions.actions} />
            </div>
          );
        }

        return next(...args);
      },
    []
  );

  // TODO: Should we override Web Chat default of bubble max width of 480px?
  const styleOptions = useMemo<StyleOptions>(() => ({ bubbleMaxWidth: 768 }), []);

  const [shouldUseFluentSkinpack, setShouldUseFluentSkinpack] = useState(true);

  const handleShouldUseFluentSkinpackClick = useCallback<FormEventHandler<HTMLInputElement>>(
    ({ currentTarget: { checked } }) => {
      setShouldUseFluentSkinpack(checked);
    },
    [setShouldUseFluentSkinpack]
  );

  const webChatElement = (
    <Composer
      activityMiddleware={activityMiddleware}
      attachmentMiddleware={attachmentMiddleware}
      directLine={directLine}
      store={store}
      styleOptions={styleOptions}
    >
      <ActivitiesObserver onActivities={handleActivities} />
      <BasicWebChat />
    </Composer>
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
