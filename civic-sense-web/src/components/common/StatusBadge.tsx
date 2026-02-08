import { Badge } from "@/components/ui/badge";
import { IssueStatus } from "@/types";

interface StatusBadgeProps {
    status: IssueStatus;
}
import { cn } from "@/lib/utils";

const variantMap: Record<IssueStatus, string> = {
    open: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 border-blue-200",
    in_progress: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 border-yellow-200",
    resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-green-200",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 border-red-200",
};

const labelMap: Record<IssueStatus, string> = {
    open: "Open",
    in_progress: "In Progress",
    resolved: "Resolved",
    rejected: "Rejected",
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
    return (
        <Badge variant="outline" className={cn("capitalize px-2 py-0.5", variantMap[status])}>
            {labelMap[status]}
        </Badge>
    );
};
