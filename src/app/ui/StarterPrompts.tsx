import './StarterPrompts.css';

import { type DirectLineCardAction } from 'botframework-webchat-core';
import { memo } from 'react';

import classNames from 'classnames';
import StarterPromptCardAction from './StarterPromptCardAction';

type Props = Readonly<{
  cardActions: readonly DirectLineCardAction[];
  className?: string | undefined;
}>;

export default memo(function StarterPrompts({ cardActions, className }: Props) {
  return (
    <div className={classNames(className, 'starter-prompts')}>
      {cardActions
        .filter<DirectLineCardAction & { type: 'messageBack' }>(
          (card: DirectLineCardAction): card is DirectLineCardAction & { type: 'messageBack' } =>
            card.type === 'messageBack'
        )
        .map(cardAction => (
          <StarterPromptCardAction messageBackAction={cardAction} />
        ))}
    </div>
  );
});
