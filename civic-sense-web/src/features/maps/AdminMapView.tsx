
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Layers, Map as MapIcon } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

import api from "@/services/api";
import { useEffect, useState } from "react";

export const AdminMapView = () => {
    const [locations, setLocations] = useState<any[]>([]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await api.get('/issues');
                const data = response.data.filter((item: any) => item.location?.coordinates).map((item: any) => ({
                    id: item._id,
                    lat: item.location.coordinates[1],
                    lng: item.location.coordinates[0],
                    status: item.status === 'SOLVED' ? 'Resolved' : item.status === 'REPORTED' ? 'Reported' : 'In Progress',
                    category: item.categoryId?.name || 'Other'
                }));
                setLocations(data);
            } catch (error) {
                console.error("Failed to fetch locations", error);
            }
        };
        fetchLocations();
    }, []);

    const mapCenter: [number, number] = locations.length > 0
        ? [locations[0].lat, locations[0].lng]
        : [19.0760, 72.8777]; // Default to Mumbai or first issue

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-6 animate-in fade-in duration-500">
            {/* Sidebar Filters */}
            <Card className="w-64 h-full flex flex-col shrink-0">
                <div className="p-4 border-b">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <MapIcon className="h-5 w-5 text-primary" />
                        Map View
                    </h3>
                </div>

                <div className="p-4 space-y-6 flex-1 overflow-y-auto">
                    <div>
                        <h4 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                            <Layers className="h-4 w-4" /> Issue Layers
                        </h4>
                        <div className="space-y-3">
                            {['Potholes', 'Garbage', 'Streetlights', 'Road Damage'].map((layer) => (
                                <div className="flex items-center space-x-2" key={layer}>
                                    <Checkbox id={layer} defaultChecked />
                                    <Label htmlFor={layer} className="text-sm font-normal cursor-pointer">{layer}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">Overlays</h4>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="heatmap" />
                                <Label htmlFor="heatmap" className="text-sm font-normal cursor-pointer">Heatmap</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="zones" />
                                <Label htmlFor="zones" className="text-sm font-normal cursor-pointer">High Issue Zones</Label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-slate-50 border-t mt-auto">
                    <div className="flex items-center gap-2 text-green-600 text-xs font-medium">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Real-time updates active
                    </div>
                </div>
            </Card>

            {/* Main Map Area */}
            <Card className="flex-1 h-full overflow-hidden relative border-0 shadow-none ring-1 ring-slate-200">
                <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={true} className="h-full w-full">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {locations.map(loc => (
                        <Marker key={loc.id} position={[loc.lat, loc.lng]}>
                            <Popup>
                                <div className="p-1">
                                    <span className="font-bold text-sm block mb-1">{loc.category}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${loc.status === 'Reported' ? 'bg-amber-100 text-amber-700' :
                                        loc.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                        {loc.status}
                                    </span>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Map Controls Overlay (Example) */}
                <div className="absolute bottom-6 right-6 z-[1000] bg-white p-2 rounded-lg shadow-lg border border-slate-100">
                    <div className="text-xs font-semibold text-slate-500 mb-2 px-1">Status Legend</div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Reported</div>
                        <div className="flex items-center gap-2 text-xs"><span className="w-2 h-2 rounded-full bg-blue-500"></span> In Progress</div>
                        <div className="flex items-center gap-2 text-xs"><span className="w-2 h-2 rounded-full bg-green-500"></span> Resolved</div>
                    </div>
                </div>
            </Card>
        </div>
    );
};
