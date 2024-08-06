import { type AttachmentMiddleware, type StyleOptions } from 'botframework-webchat-api';
import { Components } from 'botframework-webchat-component';
import { memo, useMemo, type ReactNode } from 'react';
import isStarterPromptsActivity from './isStarterPromptsActivity';
import StarterPrompts from './StarterPrompts';

type Props = {
  children?: ReactNode | undefined;
};

const { ThemeProvider } = Components;

export default memo(function CopilotStudioThemeProvider({ children }: Props) {
  const attachmentMiddleware = useMemo<readonly AttachmentMiddleware[]>(
    () =>
      Object.freeze([
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
          }
      ]),
    []
  );

  // TODO: Should we override Web Chat default of bubble max width of 480px?
  const styleOptions = useMemo<StyleOptions>(() => ({ bubbleMaxWidth: 768 }), []);

  return (
    <ThemeProvider attachmentMiddleware={attachmentMiddleware} styleOptions={styleOptions}>
      {children}
    </ThemeProvider>
  );
});
