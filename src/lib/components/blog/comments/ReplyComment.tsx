import type { BlogComment } from "../../../types";
import { imageAPI } from "../../../api";
import { formatDate } from "../../../utils";
import { ProfileIcon } from "../../profile/ProfileIcon";
import { Link } from "react-router-dom";

interface ReplyCommentProps {
  reply: BlogComment;
}

export function ReplyComment(props: ReplyCommentProps) {
  return (
    <div className="flex items-start gap-2">
      <ProfileIcon img={imageAPI(props.reply.commenterId, 'users')} type="blogCard" />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <Link
            to={`/users/${props.reply.commenterId}`}
            className="text-sm font-semibold text-(--text-h) hover:text-(--accent) truncate min-w-0 flex-1"
          >
            {props.reply.commenterFirstName} {props.reply.commenterLastName}
          </Link>
          <span className="text-xs text-(--text-low-visibility) shrink-0">
            {formatDate(props.reply.timestamp)}
          </span>
        </div>
        <p className="text-sm text-(--text) mt-1 wrap-break-word">{props.reply.comment}</p>
      </div>
    </div>
  );
}