
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Layers, Map as MapIcon, Sliders } from "lucide-react";

import api from "@/services/api";
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';

export const Heatmaps = () => {
    const [cities, setCities] = useState<any[]>([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [heatmapData, setHeatmapData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const res = await api.get('/locations/cities');
                setCities(res.data);
                if (res.data.length > 0) setSelectedCity(res.data[0]._id);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCities();
    }, []);

    useEffect(() => {
        if (!selectedCity) return;
        const fetchHeatmap = async () => {
            setIsLoading(true);
            try {
                const res = await api.get(`/analytics/heatmap?cityId=${selectedCity}`);
                setHeatmapData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHeatmap();
    }, [selectedCity]);

    const mapCenter: [number, number] = heatmapData.length > 0
        ? [heatmapData[0].lat, heatmapData[0].lng]
        : [19.0760, 72.8777];

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-6 animate-in fade-in duration-500">
            {/* Sidebar Controls */}
            <Card className="w-72 h-full flex flex-col shrink-0">
                <div className="p-4 border-b">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Sliders className="h-5 w-5 text-primary" />
                        Heatmap Controls
                    </h3>
                </div>

                <div className="p-4 space-y-6 flex-1 overflow-y-auto">
                    <div>
                        <h4 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">Data Filters</h4>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label className="text-xs">City</Label>
                                <Select value={selectedCity} onValueChange={setSelectedCity}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select City" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cities.map(city => (
                                            <SelectItem key={city._id} value={city._id}>{city.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                        {isLoading ? 'Updating...' : 'Live data active'}
                    </div>
                </div>
            </Card>

            {/* Main Heatmap Area */}
            <Card className="flex-1 h-full overflow-hidden relative border-0 shadow-none ring-1 ring-slate-200">
                <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={true} className="h-full w-full">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {heatmapData.map((point, idx) => (
                        <CircleMarker
                            key={idx}
                            center={[point.lat, point.lng]}
                            radius={20}
                            pathOptions={{ fillColor: 'red', color: 'transparent', fillOpacity: 0.4 }}
                        >
                            <Popup>Density: {point.count} issues</Popup>
                        </CircleMarker>
                    ))}
                </MapContainer>

                {/* Center Overlay Label */}
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur px-6 py-2 rounded-full shadow-lg border border-slate-100 text-center z-[1000] pointer-events-none">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <Layers className="h-4 w-4 text-primary" /> Issue Density Map
                    </h3>
                </div>

                {/* Bottom Stats */}
                <div className="absolute bottom-6 left-6 flex gap-4 z-[1000]">
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border text-center font-bold">
                        {heatmapData.length} Hotspots
                    </div>
                </div>
            </Card>
        </div>
    );
};
