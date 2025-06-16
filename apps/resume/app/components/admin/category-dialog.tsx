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

interface Category {
  id: string;
  name: string;
  description: string;
  type: string;
  isActive: boolean;
}

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (categoryData: {
    name: string;
    description: string;
    type: string;
    isActive: boolean;
  }) => void;
  editingCategory?: Category | null;
}

const categoryTypes = [
  { value: "JOB_FUNCTION", label: "Job Functions" },
  { value: "JOB_TYPE", label: "Job Types" },
  { value: "LOCATION", label: "Locations" },
  { value: "WORK_AUTHORIZATION", label: "Work Authorization" },
];

export function CategoryDialog({ open, onOpenChange, onSave, editingCategory }: CategoryDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "JOB_FUNCTION",
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when editing category changes
  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name,
        description: editingCategory.description || "",
        type: editingCategory.type,
        isActive: editingCategory.isActive,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        type: "JOB_FUNCTION",
        isActive: true,
      });
    }
  }, [editingCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error("Please enter a category name");
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingCategory ? "Edit Category" : "Create New Category"}
          </DialogTitle>
          <DialogDescription>
            {editingCategory 
              ? "Update the category details below."
              : "Fill in the details to create a new resume category."
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Category Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category type" />
              </SelectTrigger>
              <SelectContent>
                {categoryTypes.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter category description"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="w-4 h-4"
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting 
                ? (editingCategory ? "Updating..." : "Creating...") 
                : (editingCategory ? "Update Category" : "Create Category")
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 