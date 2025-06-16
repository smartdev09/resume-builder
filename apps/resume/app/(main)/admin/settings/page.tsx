import { Card, CardContent, CardHeader, CardTitle } from "@resume/ui/card";
import { Settings, Database, Shield, Globe } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage system settings and configurations
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database Status</span>
                <span className="text-sm font-medium text-green-600">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto Backup</span>
                <span className="text-sm font-medium">Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Last Backup</span>
                <span className="text-sm font-medium">2 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Two-Factor Auth</span>
                <span className="text-sm font-medium text-green-600">Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Session Timeout</span>
                <span className="text-sm font-medium">24 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Password Policy</span>
                <span className="text-sm font-medium">Strong</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              System Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">API Rate Limit</span>
                <span className="text-sm font-medium">1000/hour</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">File Upload Limit</span>
                <span className="text-sm font-medium">10 MB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Maintenance Mode</span>
                <span className="text-sm font-medium text-red-600">Disabled</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Application Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Default Theme</span>
                <span className="text-sm font-medium">System</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Notifications</span>
                <span className="text-sm font-medium text-green-600">Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Debug Mode</span>
                <span className="text-sm font-medium text-red-600">Disabled</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 