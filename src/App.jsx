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

//  custom components
import TimelineFilter from "../components/timelineFilter";
import MagnitudeSlider from "../components/MagnitudeSlider";
import MapToggle from "../components/MapToggle";
import TimelineAnimation from "../components/timelineAnimation";
import ErrorPage from "../components/ErrorPage";

function App() {
  // State to hold earthquake data from API
  const [earthquakes, setEarthQuakes] = useState([]);

  // State for the current magnitude filter
  const [magnitude, setMagnitude] = useState(0);

  // State for timeline filter ("all_day", "all_week", etc.)
  const [timeline, setTimeline] = useState("all_day");

  // State for map type (street or satellite)
  const [mapType, setMapType] = useState("street");

  // State for timeline animation play/pause
  const [isPlaying, setIsPlaying] = useState(false);
  const isMobile = useMediaQuery("(max-width:960px)");

  // State for controlling slider visibility (on mobile it can be toggled)
  const [openSlider, setOpenSlider] = useState(!isMobile);
  const [error, setError] = useState(null);

  // State to track the current index for timeline animation
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setOpenSlider(!isMobile);
  }, [isMobile]);

  // Function to determine color of marker/slider thumb based on magnitude
  const getTrackColor = (val) => {
    if (val < 3) return "#61b30fff";
    else if (val < 6) return "orange";
    else return "red";
  };

  // Function to determine marker radius based on magnitude
  const getRadius = (mag) => {
    return Math.max(mag * 2, 3);
  };
  const sortedQuakes = [...earthquakes].sort(
    (a, b) => a.properties.time - b.properties.time
  );

  // Filter earthquakes based on magnitude and timeline animation index
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
    const interval = setInterval(fetchData, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, [timeline]);
  if (error) {
    return (
      <ErrorPage message={error} onRetry={() => window.location.reload()} />
    );
  }
  return (
    <div className="h-screen w-screen relative">
      {/* Map container */}
      <MapContainer center={[20, 0]} zoom={2} className="h-full w-full">
        {/* TileLayer for street or satellite view */}
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
      {/* Timeline filter component */}
      <TimelineFilter timeline={timeline} setTimeline={setTimeline} />

      {/* Timeline animation component */}
      <TimelineAnimation
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        earthquakes={earthquakes}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />

      {/* Map toggle (street/satellite) */}
      <MapToggle
        mapType={mapType}
        setMapType={setMapType}
        isMobile={isMobile}
      />

      {/* Magnitude slider */}
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
