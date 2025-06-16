"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@resume/ui/card";
import { FileText, Plus, Edit, Trash2, Filter } from "lucide-react";
import { Button } from "@resume/ui/button";
import { SubcategoryDialog } from "../../../components/admin/subcategory-dialog";
import { toast } from "@resume/ui/sonner";
import { Badge } from "@resume/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@resume/ui/select";

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
  order: number;
  roles: string[];
  createdAt: string;
  updatedAt: string;
  category: Category;
}

const categoryTypeLabels: { [key: string]: string } = {
  JOB_FUNCTION: "Job Functions",
  JOB_TYPE: "Job Types", 
  LOCATION: "Locations",
  WORK_AUTHORIZATION: "Work Authorization"
};

export default function SubcategoriesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [filterCategoryId, setFilterCategoryId] = useState<string>("all");

  // Fetch categories and subcategories from API
  const fetchData = async () => {
    try {
      const [categoriesResponse, subcategoriesResponse] = await Promise.all([
        fetch('/api/admin/categories'),
        fetch('/api/admin/subcategories')
      ]);

      if (!categoriesResponse.ok || !subcategoriesResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const [categoriesData, subcategoriesData] = await Promise.all([
        categoriesResponse.json(),
        subcategoriesResponse.json()
      ]);

      setCategories(categoriesData.categories || []);
      setSubcategories(subcategoriesData.subcategories || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateSubcategory = () => {
    setEditingSubcategory(null);
    setIsDialogOpen(true);
  };

  const handleEditSubcategory = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setIsDialogOpen(true);
  };

  const handleDeleteSubcategory = async (subcategoryId: string) => {
    if (!confirm('Are you sure you want to delete this subcategory?')) {
      return;
    }

    setDeleteLoading(subcategoryId);
    try {
      const response = await fetch(`/api/admin/subcategories/${subcategoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete subcategory');
      }

      // Remove the subcategory from the list
      setSubcategories(prev => prev.filter(sub => sub.id !== subcategoryId));
      toast.success('Subcategory deleted successfully');
    } catch (error: any) {
      console.error('Error deleting subcategory:', error);
      toast.error(error.message || 'Failed to delete subcategory');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleSaveSubcategory = async (subcategoryData: {
    name: string;
    description: string;
    categoryId: string;
    isActive: boolean;
    roles: string[];
  }) => {
    try {
      const url = editingSubcategory 
        ? `/api/admin/subcategories/${editingSubcategory.id}`
        : '/api/admin/subcategories';
      const method = editingSubcategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subcategoryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${editingSubcategory ? 'update' : 'create'} subcategory`);
      }

      const data = await response.json();
      
      if (editingSubcategory) {
        // Update the subcategory in the list
        setSubcategories(prev => prev.map(sub => 
          sub.id === editingSubcategory.id ? data.subcategory : sub
        ));
        toast.success('Subcategory updated successfully!');
      } else {
        // Add the new subcategory to the list
        setSubcategories(prev => [...prev, data.subcategory]);
        toast.success('Subcategory created successfully!');
      }
    } catch (error: any) {
      console.error('Error saving subcategory:', error);
      toast.error(error.message || `Failed to ${editingSubcategory ? 'update' : 'create'} subcategory`);
      throw error; // Re-throw to let the dialog handle it
    }
  };

  // Filter subcategories based on selected category
  const filteredSubcategories = filterCategoryId === "all" 
    ? subcategories 
    : subcategories.filter(sub => sub.categoryId === filterCategoryId);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Subcategories</h1>
          <p className="text-muted-foreground">Loading subcategories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subcategories</h1>
          <p className="text-muted-foreground">
            Manage subcategories and their associated roles
          </p>
        </div>
        <Button onClick={handleCreateSubcategory}>
          <Plus className="h-4 w-4 mr-2" />
          Add Subcategory
        </Button>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="category-filter" className="text-sm font-medium">
                Filter by Category:
              </label>
              <Select
                value={filterCategoryId}
                onValueChange={setFilterCategoryId}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {filteredSubcategories.length} of {subcategories.length} subcategories
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Subcategories ({filteredSubcategories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSubcategories.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                {filterCategoryId === "all" 
                  ? "No subcategories created yet. Click \"Add Subcategory\" to get started."
                  : "No subcategories found for the selected category."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubcategories.map((subcategory) => (
                <div key={subcategory.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{subcategory.name}</p>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {subcategory.category.name}
                      </span>
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                        {categoryTypeLabels[subcategory.category.type] || subcategory.category.type}
                      </span>
                    </div>
                    {subcategory.description && (
                      <p className="text-sm text-muted-foreground mb-2">{subcategory.description}</p>
                    )}
                    {subcategory.roles && subcategory.roles.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {subcategory.roles.slice(0, 3).map((role, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {role}
                          </Badge>
                        ))}
                        {subcategory.roles.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{subcategory.roles.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      subcategory.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {subcategory.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditSubcategory(subcategory)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSubcategory(subcategory.id)}
                      disabled={deleteLoading === subcategory.id}
                      className="text-red-600 hover:text-red-700"
                    >
                      {deleteLoading === subcategory.id ? (
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

      <SubcategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveSubcategory}
        editingSubcategory={editingSubcategory}
        categories={categories}
      />
    </div>
  );
} 