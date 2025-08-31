import { useEffect, useState } from "react";
import axios from "axios";
import {
  CircleMarker,
  MapContainer,
  TileLayer,
  Popup,
  Tooltip,
} from "react-leaflet";
import { useMediaQuery } from "@mui/material";
import "leaflet/dist/leaflet.css";
import TimelineFilter from "../components/timelineFilter";
import MagnitudeSlider from "../components/MagnitudeSlider";
import MapToggle from "../components/MapToggle";
import TimelineAnimation from "../components/timelineAnimation";
import ErrorPage from "../components/ErrorPage";
function App() {
  const [earthquakes, setEarthQuakes] = useState([]);
  const [magnitude, setMagnitude] = useState(0);
  const [timeline, setTimeline] = useState("all_day");
  const [mapType, setMapType] = useState("street");
  const [isPlaying, setIsPlaying] = useState(false);
  const [openSlider, setOpenSlider] = useState(!isMobile);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isMobile = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  useEffect(() => {
    setOpenSlider(!isMobile);
  }, [isMobile]);

  const getTrackColor = (val) => {
    if (val < 3) return "#61b30fff";
    else if (val < 6) return "orange";
    else return "red";
  };

  const getRadius = (mag) => {
    return Math.max(mag * 2, 3);
  };
  const sortedQuakes = [...earthquakes].sort(
    (a, b) => a.properties.time - b.properties.time
  );
  const filtered = isPlaying
    ? sortedQuakes
        .filter((eq) => eq.properties.mag >= magnitude)
        .slice(0, currentIndex)
    : sortedQuakes.filter((eq) => eq.properties.mag >= magnitude);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${timeline}.geojson`
        );
        setEarthQuakes(data.features);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [timeline]);
  if (error) {
    return (
      <ErrorPage message={error} onRetry={() => window.location.reload()} />
    );
  }
  return (
    <div className="h-screen w-screen relative">
      {/* Map */}
      <MapContainer center={[20, 0]} zoom={2} className="h-full w-full">
        <TileLayer
          url={
            mapType === "street"
              ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
              : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          }
          attribution={
            mapType === "street"
              ? "© OpenStreetMap contributors"
              : "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community"
          }
        />
        {filtered.map((eq) => {
          const [lon, lat, depth] = eq.geometry.coordinates;
          return (
            <CircleMarker
              key={eq.id}
              center={[lat, lon]}
              radius={getRadius(eq.properties.mag)}
              color={getTrackColor(eq.properties.mag)}
            >
              <Tooltip>
                <div style={{ color: "black" }}>
                  <b>{eq.properties.place}</b> — Mag: {eq.properties.mag}
                </div>
              </Tooltip>
              <Popup>
                <div>
                  <p>
                    <b>Magnitude:</b> {eq.properties.mag}
                  </p>
                  <p>
                    <b>Place:</b> {eq.properties.place}
                  </p>
                  <p>
                    <b>Time:</b> {new Date(eq.properties.time).toLocaleString()}
                  </p>
                  <p>
                    <b>Depth:</b> {depth} km
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
      <TimelineFilter timeline={timeline} setTimeline={setTimeline} />
      <TimelineAnimation
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        earthquakes={earthquakes}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
      <MapToggle
        mapType={mapType}
        setMapType={setMapType}
        isMobile={isMobile}
      />
      <MagnitudeSlider
        isMobile={isMobile}
        getTrackColor={getTrackColor}
        magnitude={magnitude}
        setMagnitude={setMagnitude}
      />
    </div>
  );
}

export default App;
