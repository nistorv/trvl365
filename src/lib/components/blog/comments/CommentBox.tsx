import type { BlogComment } from "../../../types";
import { useState } from "react";
import { imageAPI } from "../../../api";
import { Button } from "../../Button";
import { Link } from "react-router-dom";
import { ProfileIcon } from "../../profile/ProfileIcon";
import { formatDate } from "../../../utils";
import { ReplyComment } from "./ReplyComment";

interface CommentBoxProps {
  comment: BlogComment;
  replies: BlogComment[];
  reply: (parentId: number, text: string) => Promise<void>;
  canReply: boolean;
}

export function CommentBox(props: CommentBoxProps) {
  const [replyButtonOn, setReplyButtonOn] = useState(false);
  const [reply, setReply] = useState('');
  const [replySubmission, setReplySubmission] = useState(false);

  const sortedReplies = [...props.replies].reverse();

  return (
    <div className="border border-(--border) p-3 bg-(--bg)">
      <div className="flex items-start gap-2">
        <ProfileIcon img={imageAPI(props.comment.commenterId, 'users')} type="comment" />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <Link
              to={`/users/${props.comment.commenterId}`}
              className="text-sm font-semibold text-(--text-h) hover:text-(--accent) truncate min-w-0 flex-1"
            >
              {props.comment.commenterFirstName} {props.comment.commenterLastName}
            </Link>
            <span className="text-xs text-(--text-low-visibility) shrink-0">
              {formatDate(props.comment.timestamp)}
            </span>
          </div>
          <p className="text-sm text-(--text) mt-1 wrap-break-word">{props.comment.comment}</p>
          <div className="flex items-center gap-3 mt-1">
            {props.replies.length > 0 && (
              <span className="text-xs text-(--text-low-visibility)">
                {props.replies.length} {props.replies.length === 1 ? 'reply' : 'replies'}
              </span>
            )}
            {props.canReply && (
              <button
                onClick={() => setReplyButtonOn((s) => !s)}
                className="text-xs text-(--text-low-visibility) hover:text-(--accent) cursor-pointer"
              >
                {replyButtonOn ? 'Cancel' : 'Reply'}
              </button>
            )}
          </div>
        </div>
      </div>

      {sortedReplies.length > 0 && (
        <div className="mt-3 ml-10 flex flex-col gap-2">
          {sortedReplies.map((reply) => (
            <ReplyComment key={reply.commentId} reply={reply} />
          ))}
        </div>
      )}

      {replyButtonOn && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!reply.trim()) {
              return;
            }

            setReplySubmission(true);

            try {
              await props.reply(props.comment.commentId, reply);
              setReply('');
              setReplyButtonOn(false);
            } catch (error) {
              console.error(error);
            }
            finally {
              setReplySubmission(false);
            }
          }}
          className="mt-3 ml-10 flex gap-2"
        >
          <input
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write a reply…"
            autoFocus
            className="flex-1 px-3 py-1.5 border border-(--border) bg-(--bg) text-(--text-h) text-sm outline-none"
          />
          <Button
            buttonStyleType="submit"
            disabled={!reply.trim() || replySubmission}
          >
            Post
          </Button>
        </form>
      )}
    </div>
  );
}