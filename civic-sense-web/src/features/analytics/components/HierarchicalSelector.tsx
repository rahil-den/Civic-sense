import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";

export const HierarchicalSelector = () => {
    // Mock Data
    const states = ["State A", "State B"];
    const cities = ["City X", "City Y", "City Z"];
    const areas = ["Area 1", "Area 2", "Area 3"];
    return (
        <div className="flex gap-4 items-center">
            <Select defaultValue={states[0]}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                    {states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
            </Select>

            <span className="text-slate-400">/</span>

            <Select defaultValue={cities[0]}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                    {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
            </Select>

            <span className="text-slate-400">/</span>

            <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Areas" />
                </SelectTrigger>
                <SelectContent>
                    {areas.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
    );
};
