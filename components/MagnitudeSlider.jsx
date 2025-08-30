import React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import Fab from "@mui/material/Fab";
import { Tooltip as MUITooltip } from "@mui/material";

export default function MagnitudeSlider({
  isMobile,
  getTrackColor,
  magnitude,
  setMagnitude,
}) {
  const [openSlider, setOpenSlider] = useState(!isMobile);
  useEffect(() => {
    setOpenSlider(!isMobile);
  }, [isMobile]);
  const getThumbColor = (val) => getTrackColor(val);

  const marks = [
    {
      value: 0,
      label: "0",
    },
    {
      value: 1,
      label: "1",
    },
    {
      value: 2,
      label: "2",
    },
    {
      value: 3,
      label: "3",
    },
    {
      value: 4,
      label: "4",
    },
    {
      value: 5,
      label: "5",
    },
    {
      value: 6,
      label: "6",
    },
    {
      value: 7,
      label: "7",
    },
    {
      value: 8,
      label: "8",
    },
    {
      value: 9,
      label: "9",
    },
  ];
  function valuetext(value) {
    return `${value}`;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "absolute",
        bottom: 106,
        right: 26,
        zIndex: 500,
      }}
    >
      {openSlider && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: isMobile ? "1.5rem" : "2.5rem",
            height: isMobile ? 300 : 500,
            bgcolor: "rgba(255,255,255,0.9)",
            p: 2,
            borderRadius: 2,
          }}
        >
          <Grid container spacing={2} sx={{ height: 500 }}>
            <MUITooltip title="Filter earthquakes by magnitude" arrow>
              <Slider
                sx={{
                  "& .MuiSlider-rail": {
                    background:
                      "linear-gradient(to top,green 0%,green 30%,orange 30%,orange 60%,red 60%, red 70%,darkred 80%,darkred 100%)",
                  },
                  "& .MuiSlider-track": {
                    backgroundColor: "transparent",
                  },
                  "& .MuiSlider-thumb": {
                    backgroundColor: getThumbColor(magnitude),
                  },
                }}
                aria-label="Magnitude"
                min={0}
                orientation="vertical"
                value={magnitude}
                valueLabelDisplay="auto"
                onChangeCommitted={(e, val) => setMagnitude(val)}
                step={0.5}
                max={9}
                getAriaValueText={valuetext}
                marks={isMobile ? undefined : marks}
              />
            </MUITooltip>
          </Grid>
        </Box>
      )}
      {/* Magnitude Slider - Bottom Right */}
      {isMobile && (
        <MUITooltip title="Magnitude filter" arrow>
          <Fab
            size="small"
            sx={{ mt: 1 }}
            onClick={() => setOpenSlider((prev) => !prev)}
          >
            <EqualizerIcon />
          </Fab>
        </MUITooltip>
      )}
    </div>
  );
}
