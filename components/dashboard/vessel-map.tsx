"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix default marker icon URLs broken by webpack
const vesselIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:32px;height:32px;
    background:#1d4ed8;
    border:2px solid white;
    border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);
    box-shadow:0 2px 6px rgba(0,0,0,0.4);
    display:flex;align-items:center;justify-content:center;
  ">
    <span style="transform:rotate(45deg);font-size:14px;line-height:1;">🚢</span>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -34],
})

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lng])
  }, [map, lat, lng])
  return null
}

interface VesselMapProps {
  name: string
  lat: number
  lng: number
  coordLabel: string
}

export function VesselMap({ name, lat, lng, coordLabel }: VesselMapProps) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={6}
      style={{ height: "220px", width: "100%", borderRadius: "0.5rem" }}
      scrollWheelZoom={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <RecenterMap lat={lat} lng={lng} />
      <Marker position={[lat, lng]} icon={vesselIcon}>
        <Popup>
          <div className="text-sm font-semibold">{name}</div>
          <div className="text-xs text-gray-500">{coordLabel}</div>
        </Popup>
      </Marker>
    </MapContainer>
  )
}
