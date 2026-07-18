import type { BlogReactionCount } from "../../types";

const reactions = [
  { key: 'REACTION_1', emoji: '❤️' },
  { key: 'REACTION_2', emoji: '👍' },
  { key: 'REACTION_3', emoji: '👎' },
  { key: 'REACTION_4', emoji: '👀' },
  { key: 'REACTION_5', emoji: '🫩' },
];

interface BlogReactionProps {
  reactions: BlogReactionCount[];
}

export function BlogReactions(props: BlogReactionProps) {
  return (
    <div className="absolute bottom-2 inset-x-2 flex gap-1.5 justify-center">
      {reactions.map(({ key, emoji }) => {
        const count = props.reactions.find((r) => r.reaction === key)?.count ?? 0;
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