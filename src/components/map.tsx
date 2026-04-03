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
  const [startPos, setStartPos] = useState<Position | null>(start || null);
  const [endPos, setEndPos] = useState<Position | null>(end || null);

  useEffect(() => setStartPos(start || null), [start]);
  useEffect(() => setEndPos(end || null), [end]);

  return (
    <div className="flex gap-2 items-center justify-center mt-10 relative">
      <MapContainer center={position} zoom={10} style={{ height: "500px", width: "90%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* الماركر يظهر فقط بعد اختيار البداية أو النهاية */}
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

        {/* الخط بين البداية والنهاية */}
        {startPos && endPos && (
          <RoutingMachine
            start={{ lat: startPos[0], lng: startPos[1] }}
            end={{ lat: endPos[0], lng: endPos[1] }}
          />
        )}

        {/* تغيير المركز */}
        <ChangeView center={position} />
      </MapContainer>
    </div>
  );
}

