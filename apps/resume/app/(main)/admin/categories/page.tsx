"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@resume/ui/card";
import { FileText, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@resume/ui/button";
import { CategoryDialog } from "../../../components/admin/category-dialog";
import { toast } from "@resume/ui/sonner";

interface Category {
  id: string;
  name: string;
  description: string;
  type: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  subcategories?: any[];
}

const categoryTypeLabels: { [key: string]: string } = {
  JOB_FUNCTION: "Job Functions",
  JOB_TYPE: "Job Types", 
  LOCATION: "Locations",
  WORK_AUTHORIZATION: "Work Authorization"
};

export default function CategoriesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This will also delete all its subcategories.')) {
      return;
    }

    setDeleteLoading(categoryId);
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete category');
      }

      const data = await response.json();
      
      // Remove the category from the list
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      toast.success(`Category deleted successfully${data.deletedSubcategories ? ` (${data.deletedSubcategories} subcategories removed)` : ''}`);
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast.error(error.message || 'Failed to delete category');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleSaveCategory = async (categoryData: {
    name: string;
    description: string;
    type: string;
    isActive: boolean;
  }) => {
    try {
      const url = editingCategory 
        ? `/api/admin/categories/${editingCategory.id}`
        : '/api/admin/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${editingCategory ? 'update' : 'create'} category`);
      }

      const data = await response.json();
      
      if (editingCategory) {
        // Update the category in the list
        setCategories(prev => prev.map(cat => 
          cat.id === editingCategory.id ? data.category : cat
        ));
        toast.success('Category updated successfully!');
      } else {
        // Add the new category to the list
        setCategories(prev => [...prev, data.category]);
        toast.success('Category created successfully!');
      }
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast.error(error.message || `Failed to ${editingCategory ? 'update' : 'create'} category`);
      throw error; // Re-throw to let the dialog handle it
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">
            Manage resume categories and templates
          </p>
        </div>
        <Button onClick={handleCreateCategory}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resume Categories ({categories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">No categories created yet. Click "Add Category" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{category.name}</p>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {categoryTypeLabels[category.type] || category.type}
                      </span>
                    </div>
                    {category.description && (
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    )}
                    {category.subcategories && category.subcategories.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {category.subcategories.length} subcategories
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      category.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                      disabled={deleteLoading === category.id}
                      className="text-red-600 hover:text-red-700"
                    >
                      {deleteLoading === category.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveCategory}
        editingCategory={editingCategory}
      />
    </div>
  );
} 