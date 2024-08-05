import './StarterPromptCardAction.css';

import { hooks } from 'botframework-webchat';
import { type DirectLineCardAction } from 'botframework-webchat-core';
import classNames from 'classnames';
import { memo, useCallback, useMemo } from 'react';

const { useFocus, useRenderMarkdownAsHTML, useSendBoxValue } = hooks;

type Props = Readonly<{
  className?: string | undefined;
  messageBackAction: DirectLineCardAction & { type: 'messageBack' };
}>;

export default memo(function StarterPromptAction({ className, messageBackAction }: Props) {
  const [_, setSendBoxValue] = useSendBoxValue();
  const focus = useFocus();
  const renderMarkdownAsHTML = useRenderMarkdownAsHTML('message activity');
  const subtitleHTML = useMemo(
    () => ({ __html: renderMarkdownAsHTML(messageBackAction.text || '') }),
    [messageBackAction.text, renderMarkdownAsHTML]
  );

  const handleClick = useCallback(() => {
    setSendBoxValue(messageBackAction.displayText || messageBackAction.text || '');

    // Focus on the send box after the value is "pasted."
    focus('sendBox');
  }, [focus, setSendBoxValue]);

  return (
    <button className={classNames(className, 'starter-prompt-card-action')} onClick={handleClick}>
      <div className="starter-prompt-card-action__title">{'title' in messageBackAction && messageBackAction.title}</div>
      {'image' in messageBackAction && messageBackAction.image && (
        <img className="starter-prompt-card-action__image" src={messageBackAction.image} />
      )}
      <div className="starter-prompt-card-action__subtitle" dangerouslySetInnerHTML={subtitleHTML} />
    </button>
  );
});
