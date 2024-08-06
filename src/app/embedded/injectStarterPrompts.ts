import type { Activity, ExecuteTurnFunction, TurnGenerator } from 'copilot-studio-direct-to-engine-chat-adapter';
import { asyncGeneratorWithLastValue } from 'iter-fest';

type ExcludeUndefined<T> = Exclude<T, undefined>;
type ItemOfArray<T> = T extends (infer P)[] ? P : undefined;

type SuggestedActions = ExcludeUndefined<(Activity & { type: 'message' })['suggestedActions']>['actions'];
type CardAction = ItemOfArray<SuggestedActions>;
type MessageBackAction = CardAction & { type: 'messageBack' };

type InjectStarterPromptsInit = Readonly<{
  actions: readonly MessageBackAction[];
  allowPublicWebsites: boolean;
  botDescription: string;
  botImageURL: string;
  botName: string;
}>;

export default function injectStarterPrompts(
  turnGenerator: TurnGenerator,
  { actions, allowPublicWebsites, botDescription, botImageURL, botName }: InjectStarterPromptsInit
): TurnGenerator {
  const patchActivity = (activity: Readonly<Activity>): Activity => {
    if (activity.from.role !== 'user' && activity.type === 'message') {
      return {
        ...activity,
        entities: (activity.entities || []).map(entity => {
          if (
            entity.type === 'https://schema.org/Message' &&
            entity['@context'] === 'https://schema.org' &&
            entity['@id'] === '' &&
            entity['@type'] === 'message'
          ) {
            const keywords = new Set(entity.keywords || []).add('AIGeneratedContent');

            if (allowPublicWebsites) {
              keywords.add('MayContainsPublicWebsites');
            } else {
              keywords.delete('MayContainsPublicWebsites');
            }

            return { ...entity, keywords: Array.from(keywords) };
          }

          return entity;
        })
      };
    }

    return activity;
  };

  const patchExecuteTurn =
    (executeTurn: ExecuteTurnFunction): ExecuteTurnFunction =>
    (activity, init): TurnGenerator =>
      (async function* (turnGenerator) {
        const turnGeneratorWithLastValue = asyncGeneratorWithLastValue(turnGenerator);

        for await (const activity of turnGeneratorWithLastValue) {
          yield patchActivity(activity);
        }

        return patchExecuteTurn(turnGeneratorWithLastValue.lastValue());
      })(executeTurn(activity, init));

  return (async function* () {
    yield patchActivity({
      from: { id: '', role: 'bot' },
      suggestedActions: { to: [], actions: [...actions] },
      // text: `<img alt="" src="${encodeURI(botImageURL)}" />\n\n# ${botName}\n\n${botDescription}`,
      text: `# ${botName}\n\n${botDescription}`,
      type: 'message'
    } satisfies Activity);

    return yield* patchExecuteTurn(() => turnGenerator)({} as any);
  })();
}
