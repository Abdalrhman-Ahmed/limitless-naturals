"use client";
import { useState } from "react";
import Photo from "./Photo";

export default function VideoCard({ src, caption, playing: initial = false }) {
  const [playing, setPlaying] = useState(initial);
  return (
    <div className="vcard" onClick={() => setPlaying((p) => !p)} role="button" tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setPlaying((p) => !p)}>
      <Photo src={src} alt="" />
      {caption && (
        <div className="cap">
          <span className="stars">★★★★★</span>
          {caption}
        </div>
      )}
      <span className="play">{playing ? "❚❚" : "▶"}</span>
    </div>
  );
}
