import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface LocationMapProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialLocation?: { lat: number; lng: number };
}

const LocationMap: React.FC<LocationMapProps> = ({ onLocationSelect, initialLocation }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || { lat: 6.5244, lng: 3.3792 }); // Lagos default
  const [address, setAddress] = useState('');
  const [mapInitialized, setMapInitialized] = useState(false);

  // Initialize map (using simple interactive map)
  useEffect(() => {
    if (mapContainerRef.current && !mapInitialized) {
      setMapInitialized(true);
    }
  }, [mapInitialized]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    // Simulate geocoding (in real app, use Mapbox/Google Geocoding API)
    // For demo, we'll use some preset locations
    const presetLocations: Record<string, { lat: number; lng: number; address: string }> = {
      'ikeja': { lat: 6.6018, lng: 3.3515, address: 'Ikeja Industrial Estate, Ikeja, Lagos' },
      'victoria island': { lat: 6.4281, lng: 3.4219, address: 'Victoria Island, Lagos' },
      'abeokuta': { lat: 7.1475, lng: 3.3619, address: 'Abeokuta, Ogun State' },
      'lagos island': { lat: 6.4550, lng: 3.4244, address: 'Lagos Island, Lagos' },
      'yaba': { lat: 6.5074, lng: 3.3721, address: 'Yaba, Lagos' },
    };

    const searchLower = searchQuery.toLowerCase();
    let found = false;

    for (const [key, loc] of Object.entries(presetLocations)) {
      if (searchLower.includes(key)) {
        setSelectedLocation({ lat: loc.lat, lng: loc.lng });
        setAddress(loc.address);
        found = true;
        break;
      }
    }

    if (!found) {
      // Default to Lagos with the search query as address
      setSelectedLocation({ lat: 6.5244, lng: 3.3792 });
      setAddress(searchQuery);
    }
  };

  const handleConfirmLocation = () => {
    onLocationSelect({
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      address: address || searchQuery
    });
  };

  // Simulate map click
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert click position to rough coordinates (simplified)
    const lat = 6.5244 + (rect.height / 2 - y) / 100;
    const lng = 3.3792 + (x - rect.width / 2) / 100;
    
    setSelectedLocation({ lat, lng });
    setAddress(`Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search for organization location (e.g., Ikeja, Victoria Island)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} type="button">Search</Button>
      </div>

      <div 
        ref={mapContainerRef}
        onClick={handleMapClick}
        className="relative w-full h-[400px] bg-gradient-to-br from-green-100 to-blue-100 rounded-lg border-2 border-border cursor-crosshair overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(120, 200, 120, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(100, 150, 200, 0.3) 0%, transparent 50%)',
        }}
      >
        {/* Grid overlay to simulate map */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 grid-rows-8 h-full">
            {[...Array(64)].map((_, i) => (
              <div key={i} className="border border-gray-400"></div>
            ))}
          </div>
        </div>

        {/* Location marker */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-full"
          style={{
            left: '50%',
            top: '50%',
          }}
        >
          <MapPin className="w-10 h-10 text-red-500 drop-shadow-lg" fill="red" />
        </div>

        {/* Map info overlay */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
          <p className="text-sm font-medium">📍 Selected Location</p>
          <p className="text-xs text-muted-foreground">
            Lat: {selectedLocation.lat.toFixed(4)}, Lng: {selectedLocation.lng.toFixed(4)}
          </p>
        </div>

        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
          <p className="text-xs text-muted-foreground mb-1">Address:</p>
          <p className="text-sm font-medium">{address || 'Click on map or search to select location'}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Click on the map or search to select organization location
        </p>
        <Button 
          onClick={handleConfirmLocation}
          disabled={!address}
          type="button"
        >
          Confirm Location
        </Button>
      </div>
    </div>
  );
};

export default LocationMap;
