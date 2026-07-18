import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import type { Blog } from "../../types";
import { formatDate } from "../../utils";
import { slugifyUser } from "../../blogs";
import { BlogImage } from "./BlogImage";
import { ProfileIcon } from "../profile/ProfileIcon";
import { BlogReactions } from "./BlogReactions";

interface BlogExpandedProps {
  blog: Blog;
}

export function BlogExpanded(props: BlogExpandedProps) {
  const creationDate = formatDate(props.blog.creationDate);

  return (
    <div>
      <BlogImage img={props.blog.image} className="mb-6">
        <BlogReactions reactions={props.blog.reactions ?? []} />
      </BlogImage>

      <div className="mb-1">
        <h1 className="text-xl font-bold text-(--text-h) break-words">{props.blog.title}</h1>
      </div>

      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <div className="flex items-center gap-2">
          <ProfileIcon type="blog" />
          <Link
            to={`/users/${slugifyUser(props.blog.creatorFirstName, props.blog.creatorLastName)}`}
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
          <span>{props.blog.city}</span>
        </div>
        <span className="text-(--border)">|</span>
        <span>{creationDate}</span>
      </div>

      <p className="text-base text-(--text) whitespace-pre-wrap break-words mb-4">
        {props.blog.description}
      </p>

      {props.blog.categories.length > 0 && (
        <p className="text-xs italic text-(--text-low-visibility) mb-4">
          {props.blog.categories.join(', ')}
        </p>
      )}
    </div>
  );
}