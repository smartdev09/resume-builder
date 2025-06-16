"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@resume/ui/card";
import { FileText, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@resume/ui/button";
import { AddFieldDialog } from "../../../components/admin/add-field-dialog";
import { toast } from "@resume/ui/sonner";

interface Field {
  id: string;
  name: string;
  label: string;
  fieldType: string;
  step: string;
  placeholder: string;
  required: boolean;
  order: number;
  options: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const stepLabels: { [key: string]: string } = {
  JOB_PREFERENCES: "Job Preferences",
  MARKET_SNAPSHOT: "Market Snapshot",
  RESUME_UPLOAD: "Resume Upload"
};

export default function FieldsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Fetch fields from API
  const fetchFields = async () => {
    try {
      const response = await fetch('/api/admin/fields');
      if (!response.ok) {
        throw new Error('Failed to fetch fields');
      }
      const data = await response.json();
      setFields(data.fields || []);
    } catch (error) {
      console.error('Error fetching fields:', error);
      toast.error('Failed to load fields');
    } finally {
      setLoading(false);
    }
  };

  // Load fields on mount
  useEffect(() => {
    fetchFields();
  }, []);

  const handleCreateField = () => {
    setEditingField(null);
    setIsDialogOpen(true);
  };

  const handleEditField = (field: Field) => {
    setEditingField(field);
    setIsDialogOpen(true);
  };

  const handleDeleteField = async (fieldId: string) => {
    if (!confirm('Are you sure you want to delete this field?')) {
      return;
    }

    setDeleteLoading(fieldId);
    try {
      const response = await fetch(`/api/admin/fields/${fieldId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete field');
      }

      // Remove the field from the list
      setFields(prev => prev.filter(field => field.id !== fieldId));
      toast.success('Field deleted successfully');
    } catch (error: any) {
      console.error('Error deleting field:', error);
      toast.error(error.message || 'Failed to delete field');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleSaveField = async (fieldData: {
    name: string;
    label: string;
    fieldType: string;
    step: string;
    placeholder: string;
    required: boolean;
  }) => {
    try {
      const url = editingField 
        ? `/api/admin/fields/${editingField.id}`
        : '/api/admin/fields';
      const method = editingField ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fieldData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${editingField ? 'update' : 'create'} field`);
      }

      const data = await response.json();
      
      if (editingField) {
        // Update the field in the list
        setFields(prev => prev.map(field => 
          field.id === editingField.id ? data.field : field
        ));
        toast.success('Field updated successfully!');
      } else {
        // Add the new field to the list
        setFields(prev => [...prev, data.field]);
        toast.success('Field created successfully!');
      }
    } catch (error: any) {
      console.error('Error saving field:', error);
      toast.error(error.message || `Failed to ${editingField ? 'update' : 'create'} field`);
      throw error; // Re-throw to let the dialog handle it
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Onboarding Fields</h1>
          <p className="text-muted-foreground">Loading fields...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Onboarding Fields</h1>
          <p className="text-muted-foreground">
            Manage form fields for user onboarding
          </p>
        </div>
        <Button onClick={handleCreateField}>
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Form Fields ({fields.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {fields.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">No fields created yet. Click "Add Field" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{field.label}</p>
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                        {stepLabels[field.step] || field.step}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {field.name} • {field.fieldType}
                    </p>
                    {field.placeholder && (
                      <p className="text-xs text-muted-foreground">
                        Placeholder: {field.placeholder}
                      </p>
                    )}
                    {field.options && field.options.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Options: {field.options.join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      field.required 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {field.required ? 'Required' : 'Optional'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      field.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {field.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditField(field)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteField(field.id)}
                      disabled={deleteLoading === field.id}
                      className="text-red-600 hover:text-red-700"
                    >
                      {deleteLoading === field.id ? (
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

      <AddFieldDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveField}
        editingField={editingField}
      />
    </div>
  );
} 