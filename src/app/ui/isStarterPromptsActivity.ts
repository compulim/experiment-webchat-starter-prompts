import type { WebChatActivity } from 'botframework-webchat-core';

export default function isStarterPromptsActivity(
  activity: WebChatActivity
): activity is WebChatActivity & { suggestedActions: { actions: [] }; type: 'message' } {
  return activity?.type === 'message' && !!activity.suggestedActions?.actions?.length;
}
