import './WebChat.css';

import { Components } from 'botframework-webchat';
import { StyleOptions, type AttachmentMiddleware } from 'botframework-webchat-api';
import { FluentThemeProvider } from 'botframework-webchat-fluent-theme';
import { memo, useCallback, useMemo, useState, type FormEventHandler, type FunctionComponent } from 'react';
import StarterPrompts from './StarterPrompts';

const { BasicWebChat, Composer } = Components;

type PropsOf<T> = T extends FunctionComponent<infer P> ? P : never;
type ComposerProps = PropsOf<typeof Composer>;

type Props = Readonly<{
  directLine: ComposerProps['directLine'];
  store: ComposerProps['store'];
}>;

export default memo(function Chat({ directLine, store }: Props) {
  const attachmentMiddleware = useMemo<AttachmentMiddleware>(
    () =>
      () =>
      next =>
      (...args) => {
        console.log('attachmentMiddleware', ...args);

        const activity = args[0]?.activity;

        if (
          activity?.type === 'message' &&
          activity.suggestedActions?.actions?.length &&
          args[0]?.attachment.contentType === 'text/markdown'
        ) {
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
      attachmentMiddleware={attachmentMiddleware}
      directLine={directLine}
      store={store}
      styleOptions={styleOptions}
    >
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
