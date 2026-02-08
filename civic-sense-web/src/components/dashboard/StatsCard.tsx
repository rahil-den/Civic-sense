import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    description?: string;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    icon: any; // Relaxed type to accept Recharts components or Lucide icons
    className?: string;
}

export const StatsCard = ({ title, value, description, trend, trendValue, icon: Icon, className }: StatsCardProps) => {
    return (
        <Card className={cn("overflow-hidden", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {(description || trend) && (
                    <div className="flex items-center text-xs text-muted-foreground mt-1 gap-1">
                        {trend && trendValue && (
                            <span className={cn(
                                "font-medium",
                                trend === 'up' ? "text-green-500" :
                                    trend === 'down' ? "text-red-500" : "text-gray-500"
                            )}>
                                {trendValue}
                            </span>
                        )}
                        <span>{description}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
