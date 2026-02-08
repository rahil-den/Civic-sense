import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const PlatformSettings = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Platform Configuration</h2>
                <p className="text-slate-500 mt-2">Manage global system parameters and thresholds.</p>
            </div>

            <Tabs defaultValue="categories" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                    <TabsTrigger value="cities">Cities</TabsTrigger>
                    <TabsTrigger value="system">System</TabsTrigger>
                </TabsList>

                <TabsContent value="categories" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Issue Categories</CardTitle>
                            <CardDescription>
                                Manage the types of issues citizens can report.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <span className="font-medium">Road Maintenance</span>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <span className="font-medium">Waste Management</span>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <span className="font-medium">Street Lighting</span>
                                <Switch defaultChecked />
                            </div>
                            <Button variant="outline" className="w-full">Add New Category</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="cities" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Cities</CardTitle>
                            <CardDescription>
                                Enable or disable access for specific regions.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <p className="font-medium">Metropolis</p>
                                    <p className="text-xs text-slate-500">ID: MET-001</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <p className="font-medium">Gotham</p>
                                    <p className="text-xs text-slate-500">ID: GTH-002</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="system" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thresholds & Limits</CardTitle>
                            <CardDescription>
                                automated alerts and system limits.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="sla">SLA Warning Threshold (Hours)</Label>
                                <Input id="sla" type="number" defaultValue="24" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="rate">Max Reports per User/Day</Label>
                                <Input id="rate" type="number" defaultValue="10" />
                            </div>
                            <Button>Save System Settings</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};
