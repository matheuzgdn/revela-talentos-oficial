import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const positions = [
  // América do Sul
  { name: 'Brasil', coords: [-14.235, -51.925] },
  { name: 'Chile', coords: [-35.6751, -71.5430] },
  { name: 'Argentina', coords: [-38.4161, -63.6167] },

  // América do Norte
  { name: 'EUA', coords: [39.8283, -98.5795] },

  // Europa
  { name: 'Portugal', coords: [38.7223, -9.1393] },
  { name: 'Espanha', coords: [40.4168, -3.7038] },
  { name: 'Itália', coords: [41.8719, 12.5674] },
  { name: 'Alemanha', coords: [51.1657, 10.4515] },
  { name: 'Suíça', coords: [46.8182, 8.2275] },
  { name: 'Áustria', coords: [47.5162, 14.5501] },
  { name: 'Eslováquia', coords: [48.6690, 19.6990] },
  { name: 'Rep. Tcheca', coords: [49.8175, 15.4730] },
  { name: 'Croácia', coords: [45.1000, 15.2000] },
  { name: 'Bósnia', coords: [43.9159, 17.6791] },
  { name: 'Finlândia', coords: [61.9241, 25.7482] },
  { name: 'Andorra', coords: [42.5063, 1.5218] },

  // Ásia
  { name: 'Dubai (EAU)', coords: [25.2769, 55.2962] },
  { name: 'China', coords: [35.8617, 104.1954] }
];

// Componente para corrigir problema de renderização do mapa
const ResizeHandler = () => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
};

// Custom Icon - Tema Neon Azul
const customIcon = L.divIcon({
  html: `<div class="relative flex items-center justify-center">
           <div class="absolute w-4 h-4 bg-cyan-400 rounded-full animate-pulse opacity-80 shadow-lg shadow-cyan-400/50"></div>
           <div class="relative w-2 h-2 bg-cyan-300 rounded-full border border-black shadow-lg"></div>
         </div>`,
  className: 'bg-transparent border-0',
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

const InteractiveMap = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <MapContainer 
      center={[30, 15]} 
      zoom={2} 
      minZoom={2}
      maxZoom={2}
      style={{ height: '100%', width: '100%', backgroundColor: '#000000' }}
      scrollWheelZoom={false}
      zoomControl={false}
      dragging={false}
      touchZoom={false}
      doubleClickZoom={false}
      boxZoom={false}
      keyboard={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      {positions.map(pos => (
        <Marker key={pos.name} position={pos.coords} icon={customIcon}>
          <Popup className="bg-gray-900 text-cyan-400 border-cyan-400">{pos.name}</Popup>
        </Marker>
      ))}
      <ResizeHandler />
    </MapContainer>
  );
};

export default InteractiveMap;