import { useState, useEffect } from "react";
import { Tooltip as MUITooltip } from "@mui/material";
import Fab from "@mui/material/Fab";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

export default function TimelineAnimation({ isPlaying,setIsPlaying,earthquakes,currentIndex,setCurrentIndex }) {
  const handlePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      setCurrentIndex(0);
    }
  };

  useEffect(() => {
    if (!isPlaying) return;
    if (currentIndex < earthquakes.length) {
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setIsPlaying(false);
    }
  }, [isPlaying, currentIndex, earthquakes.length]);
  return (
    <div className="absolute z-[500] left-[1rem] bottom-[1rem]">
      <MUITooltip title={isPlaying ? "Pause" : "Play"} arrow>
        <Fab color="primary" onClick={() => handlePlay()}>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </Fab>
      </MUITooltip>
    </div>
  );
}
