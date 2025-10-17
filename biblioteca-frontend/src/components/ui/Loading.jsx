import React from "react";

export default function Loading({ text = "Loading..." }) {
  return (
    <div className="flex flex-col justify-center items-center min-h-[60vh] text-wood-dark">
      <div className="w-12 h-12 border-4 border-wood-medium border-t-wood-dark rounded-full animate-spin mb-4"></div>

      <p className="text-lg font-medium tracking-wide">{text}</p>
    </div>
  );
}
