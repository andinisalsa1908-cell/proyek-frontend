import React, { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = [-2.548926, 118.014863];

// Ikon dibuat dengan divIcon supaya tidak bergantung pada file gambar
// marker bawaan Leaflet (sering rusak setelah build CRA).
const basecampIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width:38px;height:38px;border-radius:9999px;background:#fff;
      border:3px solid #24426d;display:flex;align-items:center;
      justify-content:center;box-shadow:0 6px 16px rgba(0,0,0,.25);
      font-size:18px;line-height:1;">⛺</div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -34],
});

const hikerIcon = (online) =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        width:34px;height:34px;border-radius:9999px;
        background:${online ? "#16a34a" : "#9ca3af"};
        border:3px solid #fff;display:flex;align-items:center;
        justify-content:center;box-shadow:0 6px 16px rgba(0,0,0,.3);
        font-size:16px;line-height:1;">🧭</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -30],
  });

// Pindahkan peta hanya ketika pilihan pendaki berubah, bukan setiap polling.
function MapFocus({ position, zoom = 16, focusKey }) {
  const map = useMap();
  const lastKey = useRef(null);

  useEffect(() => {
    if (!position) return;
    if (lastKey.current === focusKey) return;
    lastKey.current = focusKey;
    map.setView(position, zoom);
  }, [focusKey, position, zoom, map]);

  return null;
}

const TrackingMap = ({
  basecamp,
  position,
  trail = [],
  accuracy,
  online = true,
  focusKey,
}) => {
  const basecampPos =
    basecamp &&
    basecamp.latitude != null &&
    basecamp.longitude != null
      ? [Number(basecamp.latitude), Number(basecamp.longitude)]
      : null;

  const hikerPos =
    position && position.latitude != null && position.longitude != null
      ? [Number(position.latitude), Number(position.longitude)]
      : null;

  const focus = hikerPos || basecampPos;
  const center = focus || DEFAULT_CENTER;

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden">
      <MapContainer
        center={center}
        zoom={focus ? 15 : 5}
        scrollWheelZoom
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <MapFocus position={focus} focusKey={focusKey} />

        {basecampPos && (
          <Marker position={basecampPos} icon={basecampIcon}>
            {/* tooltip opsional */}
          </Marker>
        )}

        {trail.length > 1 && (
          <Polyline
            positions={trail}
            pathOptions={{ color: "#24426d", weight: 4, opacity: 0.85 }}
          />
        )}

        {hikerPos && (
          <>
            {accuracy > 0 && accuracy < 200 && (
              <Circle
                center={hikerPos}
                radius={accuracy}
                pathOptions={{
                  color: "#2563eb",
                  fillColor: "#3b82f6",
                  fillOpacity: 0.12,
                  weight: 1,
                }}
              />
            )}
            <Marker position={hikerPos} icon={hikerIcon(online)} />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default TrackingMap;
