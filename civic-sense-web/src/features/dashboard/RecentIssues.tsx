import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Issue } from "@/types";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDistanceToNow } from "date-fns";

interface RecentIssuesProps {
    issues: Issue[];
}

export const RecentIssues = ({ issues }: RecentIssuesProps) => {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Time Reported</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {issues.map((issue) => (
                        <TableRow key={issue.id}>
                            <TableCell className="font-medium">{issue.id.slice(0, 8)}</TableCell>
                            <TableCell className="capitalize">{issue.category}</TableCell>
                            <TableCell>
                                <StatusBadge status={issue.status} />
                            </TableCell>
                            <TableCell className="text-right">
                                {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
