import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { IssueStatus } from "@/types";

interface StatusFilterChipsProps {
    selectedStatus: IssueStatus | 'all';
    onSelect: (status: IssueStatus | 'all') => void;
}

const statuses: (IssueStatus | 'all')[] = ['all', 'open', 'in_progress', 'resolved', 'rejected'];

export const StatusFilterChips = ({ selectedStatus, onSelect }: StatusFilterChipsProps) => {
    return (
        <div className="flex gap-2 flex-wrap">
            {statuses.map((status) => (
                <Badge
                    key={status}
                    variant={selectedStatus === status ? "default" : "outline"}
                    className={cn(
                        "cursor-pointer capitalize text-sm py-1 px-3 transition-all",
                        selectedStatus === status
                            ? "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                    onClick={() => onSelect(status)}
                >
                    {status === 'all' ? 'All' : status.replace('_', ' ')}
                </Badge>
            ))}
        </div>
    );
};
