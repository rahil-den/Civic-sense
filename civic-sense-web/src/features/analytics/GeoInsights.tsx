
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HierarchicalSelector } from './HierarchicalSelector';
import L from 'leaflet';

// Fix leaflet marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const mockLocations = [
    { id: 1, lat: 40.7128, lng: -74.0060, intensity: 0.8, category: 'roads' },
    { id: 2, lat: 40.7200, lng: -74.0100, intensity: 0.5, category: 'waste' },
    { id: 3, lat: 40.7300, lng: -74.0200, intensity: 0.9, category: 'water' },
    { id: 4, lat: 40.7400, lng: -74.0300, intensity: 0.3, category: 'roads' },
    { id: 5, lat: 40.7500, lng: -74.0400, intensity: 0.6, category: 'electricity' },
];

export const GeoInsights = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Geo-Spatial Intelligence</h2>
                <p className="text-slate-500 mt-2">Geographic distribution of civic issues and heatmaps.</p>
            </div>

            <HierarchicalSelector />

            <Card>
                <CardHeader>
                    <CardTitle>Issue Heatmap</CardTitle>
                </CardHeader>
                <CardContent className="p-0 h-[600px] relative z-0">
                    <MapContainer center={[40.7300, -74.0200]} zoom={13} scrollWheelZoom={false} className="h-full w-full rounded-b-lg">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {mockLocations.map(loc => (
                            <Circle
                                key={loc.id}
                                center={[loc.lat, loc.lng]}
                                pathOptions={{
                                    fillColor: loc.intensity > 0.7 ? 'red' : loc.intensity > 0.4 ? 'orange' : 'green',
                                    color: 'transparent',
                                    fillOpacity: 0.6
                                }}
                                radius={300}
                            >
                                <Popup>
                                    Category: {loc.category} <br /> Intensity: {loc.intensity}
                                </Popup>
                            </Circle>
                        ))}
                        {mockLocations.map(loc => (
                            <Marker key={`m-${loc.id}`} position={[loc.lat, loc.lng]}>
                                <Popup>
                                    Issue #{loc.id} <br /> {loc.category}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </CardContent>
            </Card>
        </div>
    );
};
