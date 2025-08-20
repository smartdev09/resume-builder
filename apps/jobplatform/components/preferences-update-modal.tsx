"use client";

import { useState } from "react";
import { Button } from "@resume/ui/button";
import { Input } from "@resume/ui/input";
import { Checkbox } from "@resume/ui/checkbox";
import { X, Save } from "lucide-react";
import { JobFunctionSelect } from "./job-function-select";
import { UserPreferencesService } from "../services/user-preferences-service";
import { toast } from "@resume/ui/sonner";

interface PreferencesUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPreferences: {
    jobFunction: string;
    jobType: string;
    location: string;
    openToRemote: boolean;
    needsSponsorship: boolean;
  };
  userEmail: string;
  onPreferencesUpdated: (newPreferences: any) => void;
}

export function PreferencesUpdateModal({ 
  isOpen, 
  onClose, 
  currentPreferences, 
  userEmail,
  onPreferencesUpdated 
}: PreferencesUpdateModalProps) {
  const [preferences, setPreferences] = useState(currentPreferences);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await UserPreferencesService.savePreferences({
        ...preferences,
        userEmail
      });
      
      onPreferencesUpdated(preferences);
      toast.success("Preferences updated successfully!");
      onClose();
    } catch (error) {
      console.error("Failed to update preferences:", error);
      toast.error("Failed to update preferences");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 w-full max-w-md mx-4 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-card-foreground">Update Job Preferences</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Job Function
            </label>
            <JobFunctionSelect
              value={preferences.jobFunction}
              onChange={(value) => setPreferences(prev => ({ ...prev, jobFunction: value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Job Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["Full-time", "Part-time", "Contract", "Internship"].map((type) => (
                <div key={type} className="flex items-center">
                  <div className="flex items-center h-10 px-3 border border-border rounded-md bg-muted">
                    <Checkbox
                      id={`job-type-${type}`}
                      checked={preferences.jobType === type}
                      onCheckedChange={() => {
                        setPreferences(prev => ({ ...prev, jobType: type }));
                      }}
                      className="mr-2"
                    />
                    <label htmlFor={`job-type-${type}`} className="text-sm text-muted-foreground">
                      {type}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Location
            </label>
            <Input
              value={preferences.location}
              onChange={(e) => setPreferences(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g., San Francisco, CA"
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="remote-update"
              checked={preferences.openToRemote}
              onCheckedChange={(checked) =>
                setPreferences(prev => ({ ...prev, openToRemote: checked as boolean }))
              }
            />
            <label htmlFor="remote-update" className="text-sm font-medium text-card-foreground">
              Open to Remote Work
            </label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="sponsorship-update"
              checked={preferences.needsSponsorship}
              onCheckedChange={(checked) =>
                setPreferences(prev => ({ ...prev, needsSponsorship: checked as boolean }))
              }
            />
            <label htmlFor="sponsorship-update" className="text-sm font-medium text-card-foreground">
              Needs H1B Sponsorship
            </label>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} className="flex-1">
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 