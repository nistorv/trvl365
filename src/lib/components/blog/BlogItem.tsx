import { Link } from "react-router-dom"
import { MdLocationOn } from "react-icons/md"
import { FiHeart } from "react-icons/fi"
import type { Blog, Category, City } from "../../types"
import { imageAPI } from "../../api"
import { getCityName, getCategoryNames, formatDate } from "../../utils"
import { ProfileIcon } from "../profile/ProfileIcon"

interface BlogItemProps {
  blog: Blog;
  categories: Category[];
  cities: City[];
  className?: string;
}

export function BlogItem(props: BlogItemProps) {
  const categoryNames = getCategoryNames(props.categories, props.blog.categoryIds);
  const cityName = getCityName(props.cities, props.blog.cityId);

  return (
      <Link
          to={`/blogs/${props.blog.blogId}`}
          className={`border border-(--border) overflow-hidden flex flex-row hover:border-(--accent) ${props.className ?? 'h-48'}`}
      >
        <div className="relative w-2/5">
          <img
              src={imageAPI(props.blog.blogId, 'blogs')}
              alt={props.blog.title}
              className="absolute w-full h-full object-cover"
          />
        </div>

        <div className="p-2 flex flex-col flex-1 min-w-0">
          <div className="min-h-1/3 flex items-center">
            <h3 className="font-semibold text-(--text-h) line-clamp-2">
              {props.blog.title}
            </h3>
          </div>

          <div className="flex-1 flex items-center gap-1.5">
            <ProfileIcon
                img={ imageAPI(props.blog.creatorId, 'users') }
                type="blogCard"
            />
            <span className="text-xs truncate">
            {props.blog.creatorFirstName} {props.blog.creatorLastName}
          </span>
          </div>

          <div>
            <div className="flex items-center gap-1 text-xs">
              <MdLocationOn className="w-3 h-3 shrink-0" />
              <span className="truncate">{cityName}</span>
            </div>
            {categoryNames && (
                <p className="text-xs text-(--text-low-visibility) italic truncate">
                  {categoryNames}
                </p>
            )}
          </div>

          <div className="flex justify-between items-center mt-1.5 pt-1 border-t border-(--border)">
            <span className="text-xs opacity-60">{
              formatDate(props.blog.creationDate)
            }
            </span>
            <div className="flex items-center gap-1">
              <FiHeart className="w-3 h-3 shrink-0" />
              <span className="text-xs text-(--text-h)">
              {props.blog.numReactions}
            </span>
            </div>
          </div>
        </div>
      </Link>
  );
}