"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ApiInstance } from "@/lib/api";
import { INote, ApiResponse } from "@/types/objects";
import { toast } from "sonner";

interface DeleteNoteDialogProps {
  note: INote;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteNoteDialog({ note, open, onOpenChange }: DeleteNoteDialogProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await ApiInstance.delete(`/notes/${note.id}`);
      return response.data as ApiResponse;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to delete note";
      toast.error(errorMessage);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Note</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{note.title}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}