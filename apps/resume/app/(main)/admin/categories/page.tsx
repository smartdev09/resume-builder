"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@resume/ui/card";
import { FileText, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@resume/ui/button";
import { CategoryDialog } from "../../../components/admin/category-dialog";
import { toast } from "@resume/ui/sonner";
import { supabase } from "node_modules/@resume/db/supabaseClient";
import {v4 as uuidv4} from "uuid"
import {getCategoryCount,
  getCategories, 
  checkCategoryExists,
  getMaxOrder,
  checkConflicts,
  insertCategory,
updateCategory} from '@resume/db/categories'

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
     
const categories=await getCategories()
//@ts-ignore
      setCategories(categories || []);
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
  if (
    !confirm(
      "Are you sure you want to delete this category? This will also delete all its subcategories."
    )
  ) {
    return;
  }

  setDeleteLoading(categoryId);
  try {
    // Delete category (subcategories are deleted automatically via cascade)
    // const { error, count } = await supabase
    //   .from("categories")
    //   .delete({ count: "exact" }) // returns deleted row count
    //   .eq("id", categoryId);

    // if (error) throw error;
const count=getCategoryCount(categoryId)
    // Remove from state
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));

    toast.success(
      `Category deleted successfully${
        count ? ` (${count} category deleted, subcategories removed automatically)` : ""
      }`
    );
  } catch (error: any) {
    console.error("Error deleting category:", error);
    toast.error(error.message || "Failed to delete category");
  } finally {
    setDeleteLoading(null);
  }
};


const handleSaveCategory = async (categoryData: {
  name: string;
  description?: string;
  type?: string;
  isActive?: boolean;
}) => {
  try {
    // ✅ Default type if not provided
    const dataToSave = {
      ...categoryData,
      type: categoryData.type || "JOB_FUNCTION",
    };

    // ---- CREATE (if not editing) ----
    if (!editingCategory) {
      // 1. Check if category already exists for this type
      const exists=await checkCategoryExists(dataToSave.type,dataToSave.name)
      
      if (exists) {
        toast.error("Category name already exists for this type");
        return;
      }

      // 2. Get max order for this type
    
const maxOrderRow =await getMaxOrder(dataToSave.type)

      const nextOrder = (maxOrderRow?.order || 0) + 1;

      // 3. Insert new category
      const newCategory= await insertCategory(uuidv4(),dataToSave,nextOrder)
      
      setCategories((prev) => [...prev, newCategory]);
      toast.success("Category created successfully!");
      return;
    }

    // ---- UPDATE (if editing) ----
    else {
      // 1. Check if category exists
      const exists= checkCategoryExists('',editingCategory.id)
     
      if (!exists) {
        toast.error("Category not found");
        return;
      }

      // 2. Check for conflicts (same type + name, excluding current id)
      
     
      if (await checkConflicts(dataToSave,editingCategory.id)) {
        toast.error("Category name already exists for this type");
        return;
      }

      // 3. Update category
      const updatedCategory=await updateCategory(dataToSave,editingCategory.id)

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id ? updatedCategory : cat
        )
      );
      toast.success("Category updated successfully!");
    }
  } catch (error: any) {
    console.error("Error saving category:", error);
    toast.error(error.message || "Failed to save category");
    throw error;
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