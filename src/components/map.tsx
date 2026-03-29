"use client";

import { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import RoutingMachine from "./RoutingMachine";

// إعداد الأيقونات
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
});

type Position = [number, number];

function ChangeView({ center }: { center: Position }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function Map({
  position,
  start,
  end,
}: {
  position: Position;
  start?: Position | null;
  end?: Position | null;
}) {
  const [markerPos, setMarkerPos] = useState(position);
  const [startPos, setStartPos] = useState<Position | null>(start || null);
  const [endPos, setEndPos] = useState<Position | null>(end || null);

  useEffect(() => setMarkerPos(position), [position]);
  useEffect(() => setStartPos(start || null), [start]);
  useEffect(() => setEndPos(end || null), [end]);

  return (
    <MapContainer center={markerPos} zoom={10} style={{ height: "500px", width: "70%"  }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker
        position={markerPos}
        draggable
        eventHandlers={{
          dragend: (e) => {
            setMarkerPos([e.target.getLatLng().lat, e.target.getLatLng().lng]);
          },
        }}
      >
        <Popup className="text-sm">
          📍 Lat: {markerPos[0].toFixed(4)}, Lng: {markerPos[1].toFixed(4)}
        </Popup>
      </Marker>

      {startPos && (
        <Marker position={startPos}>
          <Popup className="text-sm bg-green-100 p-1 rounded">نقطة البداية</Popup>
        </Marker>
      )}

      {endPos && (
        <Marker position={endPos}>
          <Popup className="text-sm bg-red-100 p-1 rounded">نقطة النهاية</Popup>
        </Marker>
      )}

      {startPos && endPos && (
        <RoutingMachine
          start={{ lat: startPos[0], lng: startPos[1] }}
          end={{ lat: endPos[0], lng: endPos[1] }}
        />
      )}

      <ChangeView center={markerPos} />
    </MapContainer>
  );
}




// "use client";

// import { useEffect, useState } from "react";
// import L from "leaflet";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import RoutingMachine from "./RoutingMachine";

// // إعداد الأيقونات (نفس اللي كنتي عاملاها)
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: "https://unpkg.com/leaflet/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
// });

// type Position = [number, number];

// function ChangeView({ center }: { center: Position }) {
//   const map = useMap();
//   useEffect(() => {
//     map.setView(center, map.getZoom());
//   }, [center, map]);
//   return null;
// }

// export default function Map({
//   position,
//   start,
//   end,
// }: {
//   position: Position;
//   start?: Position | null;
//   end?: Position | null;
// }) {
//   const [markerPos, setMarkerPos] = useState(position);
//   const [startPos, setStartPos] = useState<Position | null>(start || null);
//   const [endPos, setEndPos] = useState<Position | null>(end || null);

//   useEffect(() => setMarkerPos(position), [position]);
//   useEffect(() => setStartPos(start || null), [start]);
//   useEffect(() => setEndPos(end || null), [end]);

//   return (
//     <MapContainer center={markerPos} zoom={10} style={{ height: "500px", width: "100%" }}>
//       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//       <Marker
//         position={markerPos}
//         draggable
//         eventHandlers={{
//           dragend: (e) => {
//             setMarkerPos([e.target.getLatLng().lat, e.target.getLatLng().lng]);
//           },
//         }}
//       >
//         <Popup>
//           📍 Lat: {markerPos[0].toFixed(4)}, Lng: {markerPos[1].toFixed(4)}
//         </Popup>
//       </Marker>

//       {startPos && (
//         <Marker position={startPos}>
//           <Popup>Start</Popup>
//         </Marker>
//       )}

//       {endPos && (
//         <Marker position={endPos}>
//           <Popup>End</Popup>
//         </Marker>
//       )}

//       {/* 👉 لو Start و End موجودين نضيف المسار الحقيقي */}
//       {startPos && endPos && (
//         <RoutingMachine
//           start={{ lat: startPos[0], lng: startPos[1] }}
//           end={{ lat: endPos[0], lng: endPos[1] }}
//         />
//       )}

//       <ChangeView center={markerPos} />
//     </MapContainer>
//   );
// }


