import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Maps = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white">
      {/* Header Section */}
      <div className="py-12 px-6 md:px-12">
      <h1 className="text-center text-2xl md:text-4xl lg:text-5xl text-green-500 font-light leading-relaxed tracking-wide">Contact</h1>
      <p className="text-center text-gray-700 mb-8">See The Near by Clinics adn Medical Centers </p>
      </div>
      <div className="w-full max-w-6xl flex items-center justify-between p-6">
      
      </div>

      {/* Full-screen Map Section */}
      <div className="w-full h-[calc(100vh-80px)]">
        <MapContainer
          center={[40.7128, -74.006]} // New York City coordinates
          zoom={12}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <Marker position={[40.73061, -73.935242]}>
            <Popup>Clinic in New York</Popup>
          </Marker>
          <Marker position={[40.712776, -74.005974]}>
            <Popup>Another Clinic</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default Maps;
