import { RiChat4Line } from "react-icons/ri";
import type { BlogComment } from "../../../types";
import { CommentBox } from "./CommentBox";


interface BlogCommentProps {
  comments: BlogComment[];
  uniqueCommenters: number;
}

export function BlogComments(props: BlogCommentProps) {
  const topLevel = props.comments.filter((c) => c.parentId === null);

  const repliesMap: { [parentId: number]: BlogComment[] } = {};

  for (const comment of props.comments) {
    if (comment.parentId !== null) {
      if (!repliesMap[comment.parentId]) repliesMap[comment.parentId] = [];
      repliesMap[comment.parentId].push(comment);
    }
  }

  return (
    <div>
      <h2 className="font-semibold text-(--text-h) mb-1 tracking-wide flex items-center gap-2">
        <RiChat4Line />
        Comments
      </h2>
      <p className="text-xs text-(--text-low-visibility) mb-3">
        {props.uniqueCommenters} unique commenter{props.uniqueCommenters !== 1 ? 's' : ''}
      </p>

      {topLevel.length === 0 ? (
        <p className="text-sm text-(--text-low-visbility)">No comments yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {topLevel.map((c) => (
            <CommentBox
              key={c.commentId}
              comment={c}
              replies={repliesMap[c.commentId] ?? []}
            />
          ))}
        </div>
      )}
    </div>
  );
}