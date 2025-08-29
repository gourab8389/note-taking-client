"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiInstance } from "@/lib/api";
import { NoteFormData, ApiResponse, INote } from "@/types/objects";
import { toast } from "sonner";
import { Plus, Edit3 } from "lucide-react";

const noteSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  content: z.string().min(1, "Content is required"),
});

interface NoteFormProps {
  editingNote?: INote;
  onEditComplete?: () => void;
}

export function NoteForm({ editingNote, onEditComplete }: NoteFormProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(!!editingNote);

  const form = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: editingNote?.title || "",
      content: editingNote?.content || "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: NoteFormData) => {
      const response = await ApiInstance.post("/notes", data);
      return response.data as ApiResponse;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to create note";
      toast.error(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: NoteFormData) => {
      const response = await ApiInstance.put(`/notes/${editingNote?.id}`, data);
      return response.data as ApiResponse;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      form.reset();
      setIsEditing(false);
      onEditComplete?.();
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to update note";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: NoteFormData) => {
    if (isEditing && editingNote) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleCancel = () => {
    if (isEditing) {
      setIsEditing(false);
      form.reset();
      onEditComplete?.();
    } else {
      form.reset();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <Edit3 className="h-5 w-5" />
              <span>Edit Note</span>
            </>
          ) : (
            <>
              <Plus className="h-5 w-5" />
              <span>Create New Note</span>
            </>
          )}
        </CardTitle>
        <CardDescription>
          {isEditing ? "Update your note" : "Add a new note to your collection"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter note title..."
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write your note here..."
              className="min-h-[200px] resize-none"
              {...form.register("content")}
            />
            {form.formState.errors.content && (
              <p className="text-sm text-red-600">{form.formState.errors.content.message}</p>
            )}
          </div>

          <div className="flex space-x-2">
            <Button
              type="submit"
              className="flex-1"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? (isEditing ? "Updating..." : "Creating...")
                : (isEditing ? "Update Note" : "Create Note")}
            </Button>
            
            {(isEditing || form.formState.isDirty) && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </form>
    </Card>
  );
}