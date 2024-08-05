import './StarterPromptCardAction.css';

import { hooks } from 'botframework-webchat';
import { type DirectLineCardAction } from 'botframework-webchat-core';
import classNames from 'classnames';
import { memo, useMemo } from 'react';

const { useRenderMarkdownAsHTML } = hooks;

type Props = Readonly<{
  className?: string | undefined;
  messageBackAction: DirectLineCardAction & { type: 'messageBack' };
}>;

export default memo(function StarterPromptAction({ className, messageBackAction }: Props) {
  const renderMarkdownAsHTML = useRenderMarkdownAsHTML('message activity');
  const subtitleHTML = useMemo(
    () => ({ __html: renderMarkdownAsHTML(messageBackAction.text || '') }),
    [messageBackAction.text, renderMarkdownAsHTML]
  );

  return (
    <button className={classNames(className, 'starter-prompt-card-action')}>
      <div className="starter-prompt-card-action__title">{'title' in messageBackAction && messageBackAction.title}</div>
      {'image' in messageBackAction && messageBackAction.image && (
        <img className="starter-prompt-card-action__image" src={messageBackAction.image} />
      )}
      <div className="starter-prompt-card-action__subtitle" dangerouslySetInnerHTML={subtitleHTML} />
    </button>
  );
});
