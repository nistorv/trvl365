import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { MdLocationOn } from "react-icons/md";
import type { BlogDetail, BlogReaction, Category, City } from "../../types";
import { blogAPI, imageAPI } from "../../api";
import { getCityName, getCategoryNames, formatDate } from "../../utils";
import { useAuth } from "../../context/Auth";
import { BlogImage } from "./BlogImage";
import { ProfileIcon } from "../profile/ProfileIcon";
import { BlogReactions } from "./BlogReactions";
import { Button } from "../Button";
import { Modal } from "../Modal";

interface BlogExpandedProps {
  blog: BlogDetail;
  categories: Category[];
  cities: City[];
  commentCount: number;
  reactions: BlogReaction[];
  reacting: boolean;
  react: (key: string) => void;
}

export function BlogExpanded(props: BlogExpandedProps) {
  const auth = useAuth();
  const navigate = useNavigate();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const cityName = getCityName(props.cities, props.blog.cityId);
  const creationDate = formatDate(props.blog.creationDate);

  async function dleteBlog() {
    setDeleting(true);
    try {
      await axios.delete(blogAPI(props.blog.blogId), {
        headers: { 'X-Authorization': auth.token },
      });
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  }

  return (
    <div>
      <BlogImage img={imageAPI(props.blog.blogId, 'blogs')} className="mb-6">
        <BlogReactions
          creatorId={props.blog.creatorId}
          reactions={props.reactions}
          reacting={props.reacting}
          react={props.react}
        />
      </BlogImage>

      <div className="mb-1">
        <h1 className="text-xl font-bold text-(--text-h) break-words">{props.blog.title}</h1>
      </div>

      {deleteModalOpen && props.commentCount > 0 && (
        <Modal title="Cannot delete blog" onClose={() => setDeleteModalOpen(false)}>
          <p className="text-sm text-(--text)">
            This blog has {props.commentCount} comment{props.commentCount !== 1 ? 's' : ''} and cannot be deleted.
          </p>
          <Button buttonStyleType="submit" onClick={() => setDeleteModalOpen(false)} className="w-full">
            OK
          </Button>
        </Modal>
      )}

      {deleteModalOpen && props.commentCount === 0 && (
        <Modal title="Delete blog?" onClose={() => !deleting && setDeleteModalOpen(false)}>
          <p className="text-sm text-(--text)">
            This will permanently delete {props.blog.title}.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => setDeleteModalOpen(false)} disabled={deleting} className="flex-1">
              Cancel
            </Button>
            <Button buttonStyleType="remove" onClick={dleteBlog} disabled={deleting} className="flex-1">
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </Modal>
      )}

      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <div className="flex items-center gap-2">
          <ProfileIcon img={imageAPI(props.blog.creatorId, 'users')} type="blog" />
          <Link
            to={`/users/${props.blog.creatorId}`}
            className="text-sm text-(--text-h) font-medium hover:text-(--accent)"
          >
            {props.blog.creatorFirstName} {props.blog.creatorLastName}
          </Link>
        </div>
        {props.blog.series && (
          <>
            <span className="text-(--border)">|</span>
            <span className="text-xs font-medium px-2 py-0.5 bg-(--accent-bg) text-(--accent) border border-(--accent-border)">
              {props.blog.series}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm text-(--text-low-visibility) mb-2 flex-wrap">
        <div className="flex items-center gap-1">
          <MdLocationOn />
          <span>{cityName}</span>
        </div>
        <span className="text-(--border)">|</span>
        <span>{creationDate}</span>
      </div>

      <p className="text-base text-(--text) whitespace-pre-wrap break-words mb-4">
        {props.blog.description}
      </p>

      {props.blog.categoryIds.length > 0 && (
        <p className="text-xs italic text-(--text-low-visibility) mb-4">
          {getCategoryNames(props.categories, props.blog.categoryIds)}
        </p>
      )}

      {auth.userId === props.blog.creatorId && (
        <div className="flex items-center justify-center gap-2 mb-4">
          <Button
            onClick={() => navigate(`/blogs/${props.blog.blogId}/edit`)}
            className="flex items-center gap-1.5"
          >
            <FiEdit2 className="w-3.5 h-3.5" />
            Edit
          </Button>
          <Button
            buttonStyleType="remove"
            onClick={() => setDeleteModalOpen(true)}
            className="flex items-center gap-1.5"
          >
            <FiTrash2 className="w-3.5 h-3.5" />
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}