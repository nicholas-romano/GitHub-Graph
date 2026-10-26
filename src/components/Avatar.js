import { useState } from "react";
import { AvatarImg, AvatarFallback } from "../styles/styles";

export function Avatar({ src, name, size = 88 }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <AvatarFallback $size={size} aria-hidden="true">
        {name[0]?.toUpperCase()}
      </AvatarFallback>
    );
  }
  return (
    <AvatarImg
      src={src}
      alt={`${name}'s avatar`}
      width={size}
      height={size}
      onError={() => setFailed(true)}
    />
  );
}
