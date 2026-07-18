import { useState } from "react";
import type React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { RiChat4Line } from "react-icons/ri";
import type { BlogComment } from "../../../types";
import { commentAPI } from "../../../api";
import { useAuth } from "../../../context/Auth";
import { Button } from "../../Button";
import { CommentBox } from "./CommentBox";


interface BlogCommentProps {
  blogId: number;
  comments: BlogComment[];
  reload: () => Promise<void>;
  uniqueCommenters: number;
}

export function BlogComments(props: BlogCommentProps) {
  const auth = useAuth();
  const [commentContent, setCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const topLevel = props.comments.filter((c) => c.parentId === null);

  const repliesMap: Record<number, BlogComment[]> = {};

  for (const comment of props.comments) {
    if (comment.parentId !== null) {
      if (!repliesMap[comment.parentId]) repliesMap[comment.parentId] = [];
      repliesMap[comment.parentId].push(comment);
    }
  }

  async function comment(text: string, parentId?: number) {
    if (!auth.token || !text.trim()) {
      return;
    }

    await axios.post(
      commentAPI(props.blogId),
      {
        comment: text.trim(),
        ...(parentId != null
          ? { parentId }
          : {})
      },
      {
        headers: {
          'X-Authorization': auth.token
        }
      }
    );

    await props.reload();
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentContent.trim()) {
      return;
    }
    setSubmitting(true);
    try {
      await comment(commentContent);
      setCommentContent('');
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
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

      {auth.token ? (
        <form onSubmit={submitComment} className="flex gap-2 mb-4">
          <input
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Add a comment…"
            className="flex-1 px-3 py-2 border border-(--border) bg-(--bg) text-(--text-h) text-sm outline-none"
          />
          <Button
            buttonStyleType="submit"
            disabled={!commentContent.trim() || submitting}
          >
            Post
          </Button>
        </form>
      ) : (
        <p className="text-sm text-(--text-low-visbility) mb-4">
          <Link to="/login" className="text-(--accent) hover:underline">Log in</Link>
          {' or '}
          <Link to="/register" className="text-(--accent) hover:underline">register</Link>
          {' to comment & react.'}
        </p>
      )}

      {topLevel.length === 0 ? (
        <p className="text-sm text-(--text-low-visbility)">No comments yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {topLevel.map((c) => (
            <CommentBox
              key={c.commentId}
              comment={c}
              replies={repliesMap[c.commentId] ?? []}
              reply={(parentId, text) => comment(text, parentId)}
              canReply={!!auth.token}
            />
          ))}
        </div>
      )}
    </div>
  );
}