"use client";

import { useState, useEffect } from "react";
import { Button } from "@resume/ui/button";
import { Input } from "@resume/ui/input";
import { Textarea } from "@resume/ui/textarea";
import { Label } from "@resume/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@resume/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@resume/ui/select";
import { toast } from "@resume/ui/sonner";

interface Field {
  id: string;
  name: string;
  label: string;
  fieldType: string;
  step: string;
  placeholder: string;
  required: boolean;
}

interface AddFieldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (fieldData: {
    name: string;
    label: string;
    fieldType: string;
    step: string;
    placeholder: string;
    required: boolean;
  }) => void;
  editingField?: Field | null;
}

export function AddFieldDialog({ open, onOpenChange, onSave, editingField }: AddFieldDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    label: "",
    fieldType: "TEXT",
    step: "JOB_PREFERENCES",
    placeholder: "",
    required: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when editing field changes
  useEffect(() => {
    if (editingField) {
      setFormData({
        name: editingField.name,
        label: editingField.label,
        fieldType: editingField.fieldType,
        step: editingField.step,
        placeholder: editingField.placeholder || "",
        required: editingField.required,
      });
    } else {
      setFormData({
        name: "",
        label: "",
        fieldType: "TEXT",
        step: "JOB_PREFERENCES",
        placeholder: "",
        required: false,
      });
    }
  }, [editingField]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.label) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      // Error is already handled by parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingField ? "Edit Field" : "Add New Field"}
          </DialogTitle>
          <DialogDescription>
            {editingField 
              ? "Update the field details below."
              : "Create a new form field for the onboarding process."
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="step">Onboarding Step</Label>
            <Select 
              value={formData.step} 
              onValueChange={(value) => setFormData({...formData, step: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="JOB_PREFERENCES">Job Preferences</SelectItem>
                <SelectItem value="MARKET_SNAPSHOT">Market Snapshot</SelectItem>
                <SelectItem value="RESUME_UPLOAD">Resume Upload</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fieldType">Field Type</Label>
            <Select 
              value={formData.fieldType} 
              onValueChange={(value) => setFormData({...formData, fieldType: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TEXT">Text Input</SelectItem>
                <SelectItem value="EMAIL">Email</SelectItem>
                <SelectItem value="NUMBER">Number</SelectItem>
                <SelectItem value="SELECT">Select Dropdown</SelectItem>
                <SelectItem value="MULTISELECT">Multi-Select</SelectItem>
                <SelectItem value="CHECKBOX">Checkbox</SelectItem>
                <SelectItem value="RADIO">Radio Buttons</SelectItem>
                <SelectItem value="TEXTAREA">Textarea</SelectItem>
                <SelectItem value="FILE">File Upload</SelectItem>
                <SelectItem value="DATE">Date Picker</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Field Name</Label>
              <Input
                id="name"
                placeholder="e.g., jobTitle"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="label">Display Label</Label>
              <Input
                id="label"
                placeholder="e.g., Job Title"
                value={formData.label}
                onChange={(e) => setFormData({...formData, label: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="placeholder">Placeholder Text</Label>
            <Input
              id="placeholder"
              placeholder="Enter placeholder text"
              value={formData.placeholder}
              onChange={(e) => setFormData({...formData, placeholder: e.target.value})}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="required"
              checked={formData.required}
              onChange={(e) => setFormData({...formData, required: e.target.checked})}
              className="w-4 h-4"
            />
            <Label htmlFor="required">Required Field</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting 
                ? (editingField ? "Updating..." : "Creating...") 
                : (editingField ? "Update Field" : "Create Field")
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 