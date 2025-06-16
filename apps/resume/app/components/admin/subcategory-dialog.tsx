"use client";

import { useState, useEffect } from "react";
import { Button } from "@resume/ui/button";
import { Input } from "@resume/ui/input";
import { Textarea } from "@resume/ui/textarea";
import { Label } from "@resume/ui/label";
import { Badge } from "@resume/ui/badge";
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
import { X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  type: string;
}

interface Subcategory {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  isActive: boolean;
  roles: string[];
  category?: Category;
}

interface SubcategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (subcategoryData: {
    name: string;
    description: string;
    categoryId: string;
    isActive: boolean;
    roles: string[];
  }) => void;
  editingSubcategory?: Subcategory | null;
  categories: Category[];
}

const categoryTypeLabels: { [key: string]: string } = {
  JOB_FUNCTION: "Job Functions",
  JOB_TYPE: "Job Types", 
  LOCATION: "Locations",
  WORK_AUTHORIZATION: "Work Authorization"
};

export function SubcategoryDialog({ 
  open, 
  onOpenChange, 
  onSave, 
  editingSubcategory,
  categories 
}: SubcategoryDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    isActive: true,
    roles: [] as string[],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newRole, setNewRole] = useState("");

  // Update form data when editing subcategory changes
  useEffect(() => {
    if (editingSubcategory) {
      setFormData({
        name: editingSubcategory.name,
        description: editingSubcategory.description || "",
        categoryId: editingSubcategory.categoryId,
        isActive: editingSubcategory.isActive,
        roles: editingSubcategory.roles || [],
      });
    } else {
      setFormData({
        name: "",
        description: "",
        categoryId: categories.length > 0 ? categories[0]?.id || "" : "",
        isActive: true,
        roles: [],
      });
    }
  }, [editingSubcategory, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.categoryId) {
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

  const handleAddRole = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newRole.trim()) {
      e.preventDefault();
      if (!formData.roles.includes(newRole.trim())) {
        setFormData(prev => ({
          ...prev,
          roles: [...prev.roles, newRole.trim()]
        }));
      }
      setNewRole("");
    }
  };

  const handleRemoveRole = (roleToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.filter(role => role !== roleToRemove)
    }));
  };

  const selectedCategory = categories.find(cat => cat.id === formData.categoryId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingSubcategory ? "Edit Subcategory" : "Create New Subcategory"}
          </DialogTitle>
          <DialogDescription>
            {editingSubcategory 
              ? "Update the subcategory details below."
              : "Fill in the details to create a new subcategory."
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="categoryId">Parent Category</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select parent category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <span>{category.name}</span>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {categoryTypeLabels[category.type] || category.type}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCategory && (
              <p className="text-sm text-muted-foreground">
                Category Type: {categoryTypeLabels[selectedCategory.type] || selectedCategory.type}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Subcategory Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter subcategory name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter subcategory description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="roles">Roles (Optional)</Label>
            <Input
              id="roles"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              onKeyDown={handleAddRole}
              placeholder="Type a role and press Enter to add"
            />
            {formData.roles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.roles.map((role, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-2 py-1"
                  >
                    {role}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveRole(role)}
                    />
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Roles are specific job titles or positions within this subcategory
            </p>
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
                ? (editingSubcategory ? "Updating..." : "Creating...") 
                : (editingSubcategory ? "Update Subcategory" : "Create Subcategory")
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 