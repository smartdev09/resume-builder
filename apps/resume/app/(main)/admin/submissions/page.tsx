"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@resume/ui/card";
import { Database, Download } from "lucide-react";
import { Button } from "@resume/ui/button";
import { toast } from "@resume/ui/sonner";

export default function SubmissionsPage() {
  const handleExportData = () => {
    toast.success("Export functionality will be implemented soon!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Submissions</h1>
          <p className="text-muted-foreground">
            View and manage form submissions
          </p>
        </div>
        <Button onClick={handleExportData}>
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Form Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Submission management coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 