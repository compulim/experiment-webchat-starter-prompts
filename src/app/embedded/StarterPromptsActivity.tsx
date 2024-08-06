import './StarterPromptsActivity.css';

import { hooks } from 'botframework-webchat';
import { type WebChatActivity } from 'botframework-webchat-core';
import { memo, useMemo } from 'react';
import StarterPrompts from './StarterPrompts';

type Props = {
  activity: WebChatActivity & { type: 'message' };
};

const { useRenderMarkdownAsHTML } = hooks;

export default memo(function StarterPromptsActivity({ activity }: Props) {
  const renderMarkdownAsHTML = useRenderMarkdownAsHTML();
  const html = useMemo(
    () => ({ __html: renderMarkdownAsHTML(activity.text || '') }),
    [activity.text, renderMarkdownAsHTML]
  );

  return (
    <div className="starter-prompts-activity">
      <div className="starter-prompts-activity__body" dangerouslySetInnerHTML={html}></div>
      <StarterPrompts
        cardActions={activity.suggestedActions?.actions || []}
        className="starter-prompts-activity__toolbar"
      />
    </div>
  );
});
