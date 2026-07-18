import { useState } from "react";
import { RiUser3Line } from "react-icons/ri";

type IconType = 'blogCard' | 'comment' | 'navbar' | 'blog' | 'picker' | 'profile';

function getIconSizes(type: IconType): [string, string] {
  if (type === 'profile') {
    return ['w-24 h-24', 'w-10 h-10'];
  }

  if (type === 'picker') {
    return ['w-20 h-20', 'w-8 h-8'];
  }

  if (type === 'blog') {
    return ['w-8 h-8', 'w-4 h-4'];
  }

  if (type === 'comment' || type === 'navbar') {
    return ['w-7 h-7', 'w-3.5 h-3.5'];
  }

  return ['w-6 h-6', 'w-3 h-3'];
}

interface ProfileIconProps {
  img?: string;
  type: IconType;
}

export function ProfileIcon(props: ProfileIconProps) {
  const [useDefault, setUseDefault] = useState(false);
  const [containerClasses, iconClasses] = getIconSizes(props.type);

  if (!props.img || useDefault) {
    return (
        <div className={`${containerClasses} shrink-0 border border-(--border) bg-(--code-bg) flex items-center justify-center`}>
          <RiUser3Line className={`${iconClasses} text-(--text)`} />
        </div>
    );
  }
  return (
      <img
          src={props.img}
          alt=""
          className={`${containerClasses} shrink-0 border border-(--border) object-cover`}
          onError={() => setUseDefault(true)}
      />
  );
}