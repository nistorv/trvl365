import { useState } from "react";

interface BlogImageProps {
  img: string;
  className?: string;
  children?: React.ReactNode;
}

export function BlogImage(props: BlogImageProps) {
  const [error, setError] = useState(false);

  return (
    <div className={`relative w-full aspect-video overflow-hidden bg-(--code-bg) ${props.className}`}>
      {!error && (
        <>
          <img
            src={props.img}
            alt=""
            className="absolute w-full h-full object-cover blur-xl opacity-100"
          />
          <img
            src={props.img}
            alt=""
            className="relative w-full h-full object-contain"
            onError={() => setError(true)}
          />
        </>
      )}
      {props.children}
    </div>
  );
}