import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, MapPin } from 'lucide-react';
import api from '@/services/api';

interface DuplicateGroup {
    primaryIssue: any;
    relatedIssues: any[];
    count: number;
    category: string;
    location: [number, number];
}

export const ImportantIssuesPage = () => {
    const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDuplicates = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/issues/duplicates');
                setDuplicates(response.data);
            } catch (error) {
                console.error("Failed to fetch duplicates", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDuplicates();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading important issues...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/20">
                    <AlertTriangle className="h-8 w-8 text-amber-600" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Important Issues</h2>
                    <p className="text-slate-500 mt-1">Issues reported multiple times by different citizens - requires immediate attention</p>
                </div>
            </div>

            {duplicates.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <AlertTriangle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 text-lg">No duplicate issues found in your area</p>
                        <p className="text-slate-400 text-sm mt-2">This is good news! No recurring problems detected.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {duplicates.map((dup, idx) => (
                        <Card key={idx} className="border-l-4 border-l-amber-500 shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader className="bg-amber-50/50 dark:bg-amber-900/10">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle className="flex items-center gap-3 text-xl">
                                            <span className="text-slate-800 dark:text-slate-100">{dup.category}</span>
                                            <Badge variant="destructive" className="text-base px-3 py-1">
                                                {dup.count} Reports
                                            </Badge>
                                        </CardTitle>
                                        <p className="text-sm text-slate-500 mt-2 flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            Lat: {dup.location[1].toFixed(4)}, Lng: {dup.location[0].toFixed(4)}
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-slate-50 dark:bg-slate-800">
                                                <TableHead className="font-semibold">Issue Title</TableHead>
                                                <TableHead className="font-semibold">Reported By</TableHead>
                                                <TableHead className="font-semibold">Date</TableHead>
                                                <TableHead className="font-semibold">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow className="bg-amber-50/30 dark:bg-amber-900/10">
                                                <TableCell className="font-medium">{dup.primaryIssue.title}</TableCell>
                                                <TableCell>{dup.primaryIssue.userId?.name || 'N/A'}</TableCell>
                                                <TableCell>{new Date(dup.primaryIssue.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Badge variant={dup.primaryIssue.status === 'REPORTED' ? 'destructive' : 'default'}>
                                                        {dup.primaryIssue.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                            {dup.relatedIssues.map((issue: any) => (
                                                <TableRow key={issue._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                    <TableCell className="font-medium">{issue.title}</TableCell>
                                                    <TableCell>{issue.userId?.name || 'N/A'}</TableCell>
                                                    <TableCell>{new Date(issue.createdAt).toLocaleDateString()}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={issue.status === 'REPORTED' ? 'destructive' : 'default'}>
                                                            {issue.status}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <p className="text-sm text-blue-900 dark:text-blue-100">
                                        <strong>Priority:</strong> Multiple citizens have reported this issue in the same area.
                                        Consider addressing this as a high-priority item.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
