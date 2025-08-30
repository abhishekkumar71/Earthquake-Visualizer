import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import SatelliteAltIcon from "@mui/icons-material/SatelliteAlt";
import MapIcon from "@mui/icons-material/Map";
import { Tooltip as MUITooltip } from "@mui/material";
import Fab from "@mui/material/Fab";
export default function MapToggle({mapType,setMapType,isMobile}) {
      const options = ["street", "satellite"];
  return (
    <div className="absolute top-[1rem] right-[2rem] z-[550] flex flex-col gap-4 p-3 rounded-lg shadow-lg">
      {isMobile ? (
        <MUITooltip
          title={mapType === "street" ? "Street Map" : "Satellite Map"}
        >
          <Fab
            color="#424242"
            onClick={() =>
              setMapType(mapType === "street" ? "satellite" : "street")
            }
          >
            {mapType === "street" ? <SatelliteAltIcon /> : <MapIcon />}{" "}
          </Fab>
        </MUITooltip>
      ) : (
        <ButtonGroup variant="contained">
          {options.map((option) => (
            <MUITooltip
              key={option}
              title={option === "street" ? "Street Map" : "Satellite Map"}
              arrow
            >
              <Button
                key={option}
                onClick={() => setMapType(option)}
                sx={{
                  backgroundColor:
                    mapType === option
                      ? option === "street"
                        ? "#424242"
                        : "#616161"
                      : "#e0e0e0",
                  color: mapType === option ? "#fff" : "#000",
                  "&:hover": {
                    backgroundColor:
                      mapType === option
                        ? option === "street"
                          ? "#424242"
                          : "#616161"
                        : "#d5d5d5",
                  },
                }}
              >
                {option}
              </Button>
            </MUITooltip>
          ))}
        </ButtonGroup>
      )}
    </div>
  );
}
