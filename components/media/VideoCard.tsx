"use client";

import { useState } from "react";
import Photo from "./Photo";

interface VideoCardProps {
  src: string;
  caption?: string;
  playing?: boolean;
}

export default function VideoCard({ src, caption, playing: initial = false }: VideoCardProps) {
  const [playing, setPlaying] = useState(initial);
  const togglePlaying = () => setPlaying((current) => !current);

  return (
    <div
      className="vcard"
      onClick={togglePlaying}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          togglePlaying();
        }
      }}
    >
      <Photo src={src} alt="" />
      {caption && <div className="cap"><span className="stars">★★★★★</span>{caption}</div>}
      <span className="play">{playing ? "❚❚" : "▶"}</span>
    </div>
  );
}
