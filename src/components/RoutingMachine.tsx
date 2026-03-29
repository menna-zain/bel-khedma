"use client";

import { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// ⚠️ تعريف مؤقت لـ Routing لأن TypeScript مش شايفه
(L as any).Routing = (L as any).Routing || {};

export default function RoutingMachine({
  start,
  end,
}: {
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // إنشاء الـ Routing Control
    const routingControl = (L as any).Routing.control({
      waypoints: [L.latLng(start.lat, start.lng), L.latLng(end.lat, end.lng)],
      routeWhileDragging: true,
      show: false,
      lineOptions: {
        styles: [{ color: "#1e40af", weight: 4 }],
      },
    }).addTo(map);

    // دالة تنظيف عند إزالة الـ component
    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, start, end]); // تحديث عند تغير الخريطة أو النقاط

  return null;
}