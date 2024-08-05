import './WebChat.css';

import { Components } from 'botframework-webchat';
import { StyleOptions, type AttachmentMiddleware } from 'botframework-webchat-api';
import { FluentThemeProvider } from 'botframework-webchat-fluent-theme';
import { memo, useMemo, type FunctionComponent } from 'react';
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

  return (
    <div className="chat">
      <FluentThemeProvider>
        <Composer
          attachmentMiddleware={attachmentMiddleware}
          directLine={directLine}
          store={store}
          styleOptions={styleOptions}
        >
          <BasicWebChat />
        </Composer>
      </FluentThemeProvider>
    </div>
  );
});
