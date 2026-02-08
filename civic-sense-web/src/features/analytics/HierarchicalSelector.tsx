import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';

export const HierarchicalSelector = () => {
    const [state, setState] = useState("");
    const [city, setCity] = useState("");

    return (
        <div className="flex flex-col sm:flex-row gap-4 items-end bg-white dark:bg-slate-900     p-4 rounded-lg bg-card text-card-foreground shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col gap-2 w-full sm:w-[200px]">
                <Label>State</Label>
                <Select value={state} onValueChange={setState}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ca">California</SelectItem>
                        <SelectItem value="ny">New York</SelectItem>
                        <SelectItem value="tx">Texas</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-[200px]">
                <Label>City</Label>
                <Select value={city} onValueChange={setCity} disabled={!state}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="la">Los Angeles</SelectItem>
                        <SelectItem value="sf">San Francisco</SelectItem>
                        <SelectItem value="ny">New York City</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-[200px]">
                <Label>Area / Ward</Label>
                <Select disabled={!city}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Area" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="downtown">Downtown</SelectItem>
                        <SelectItem value="uptown">Uptown</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};
