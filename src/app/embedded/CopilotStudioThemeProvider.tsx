import { type ActivityMiddleware, type StyleOptions } from 'botframework-webchat-api';
import { Components } from 'botframework-webchat-component';
import { memo, useMemo, type ReactNode } from 'react';
import isStarterPromptsActivity from './isStarterPromptsActivity';
import StarterPromptsActivity from './StarterPromptsActivity';

type Props = {
  children?: ReactNode | undefined;
};

const { ThemeProvider } = Components;

export default memo(function CopilotStudioThemeProvider({ children }: Props) {
  const activityMiddleware = useMemo<readonly ActivityMiddleware[]>(
    () =>
      Object.freeze([
        () =>
          next =>
          (...args) => {
            const activity = args[0]?.activity;

            if (activity && isStarterPromptsActivity(activity)) {
              return () => <StarterPromptsActivity activity={activity} />;
            }

            return next(...args);
          }
      ]),
    []
  );

  // TODO: Should we override Web Chat default of bubble max width of 480px?
  const styleOptions = useMemo<StyleOptions>(() => ({ maxMessageLength: Infinity }), []);

  return (
    <ThemeProvider activityMiddleware={activityMiddleware} styleOptions={styleOptions}>
      {children}
    </ThemeProvider>
  );
});
