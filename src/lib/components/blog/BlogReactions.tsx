import type { BlogReaction } from "../../types";
import { useAuth } from "../../context/Auth";

const reactions = [
  { key: 'REACTION_1', emoji: '❤️' },
  { key: 'REACTION_2', emoji: '👍' },
  { key: 'REACTION_3', emoji: '👎' },
  { key: 'REACTION_4', emoji: '👀' },
  { key: 'REACTION_5', emoji: '🫩' },
];

interface BlogReactionProps {
  creatorId: number;
  reactions: BlogReaction[];
  reacting: boolean;
  react: (key: string) => void;
}

export function BlogReactions(props: BlogReactionProps) {
  const auth = useAuth();
  const myReaction = auth.userId
    ? (props.reactions.find((r) => r.userId === auth.userId)?.reaction ?? null)
    : null;

  const reactionCounts: Record<string, number> = {};
  for (const r of props.reactions) {
    reactionCounts[r.reaction] = (reactionCounts[r.reaction] ?? 0) + 1;
  }

  return (
    <div className="absolute bottom-2 inset-x-2 flex gap-1.5 justify-center">
      {(!!auth.token && auth.userId !== props.creatorId)
        ? reactions.map(({ key, emoji }) => {
            const count = reactionCounts[key] ?? 0;
            return (
              <button
                key={key}
                onClick={() => props.react(key)}
                disabled={props.reacting}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm backdrop-blur-sm cursor-pointer ${
                  (myReaction === key)
                    ? 'bg-(--accent-bg) ring-1 ring-color-(--accent-border)'
                    : 'bg-black/50 hover:bg-black/70'
                }`}
              >
                <span role="img">{emoji}</span>
                {count > 0 && <span className="text-white font-medium leading-none">{count}</span>}
              </button>
            );
          })
        : reactions.map(({ key, emoji }) => {
            const count = reactionCounts[key] ?? 0;
            if (count === 0) return null;
            return (
              <div
                key={key}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-sm"
              >
                <span role="img">{emoji}</span>
                <span className="text-white font-medium text-sm leading-none">{count}</span>
              </div>
            );
          })}
    </div>
  );
}