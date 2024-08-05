import { hooks } from 'botframework-webchat-api';
import type { WebChatActivity } from 'botframework-webchat-core';
import { memo, useMemo } from 'react';

const { useActivities } = hooks;

export type ActivitiesObserverProps = {
  onActivities: (activities: readonly WebChatActivity[]) => void;
};

export default memo(function ActivitiesObserver({ onActivities }: ActivitiesObserverProps) {
  const [activities] = useActivities();

  useMemo(() => onActivities?.(activities), [activities]);

  return false;
});
