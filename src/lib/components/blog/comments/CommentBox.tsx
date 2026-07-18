import type { BlogComment } from "../../../types";
import { Link } from "react-router-dom";
import { ProfileIcon } from "../../profile/ProfileIcon";
import { formatDate } from "../../../utils";
import { slugifyUser } from "../../../blogs";
import { ReplyComment } from "./ReplyComment";

interface CommentBoxProps {
  comment: BlogComment;
  replies: BlogComment[];
}

export function CommentBox(props: CommentBoxProps) {
  const sortedReplies = [...props.replies].reverse();

  return (
    <div className="border border-(--border) p-3 bg-(--bg)">
      <div className="flex items-start gap-2">
        <ProfileIcon type="comment" />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <Link
              to={`/users/${slugifyUser(props.comment.commenterFirstName, props.comment.commenterLastName)}`}
              className="text-sm font-semibold text-(--text-h) hover:text-(--accent) truncate min-w-0 flex-1"
            >
              {props.comment.commenterFirstName} {props.comment.commenterLastName}
            </Link>
            <span className="text-xs text-(--text-low-visibility) shrink-0">
              {formatDate(props.comment.timestamp)}
            </span>
          </div>
          <p className="text-sm text-(--text) mt-1 wrap-break-word">{props.comment.comment}</p>
          {props.replies.length > 0 && (
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-(--text-low-visibility)">
                {props.replies.length} {props.replies.length === 1 ? 'reply' : 'replies'}
              </span>
            </div>
          )}
        </div>
      </div>

      {sortedReplies.length > 0 && (
        <div className="mt-3 ml-10 flex flex-col gap-2">
          {sortedReplies.map((reply) => (
            <ReplyComment key={reply.commentId} reply={reply} />
          ))}
        </div>
      )}
    </div>
  );
}