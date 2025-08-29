"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { INote } from "@/types/objects";
import { Edit, Trash2, Calendar } from "lucide-react";
import { NoteForm } from "./note-form";
import { DeleteNoteDialog } from "./delete-note-dialog";

interface NoteCardProps {
  note: INote;
}

export function NoteCard({ note }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  if (isEditing) {
    return (
      <div className="col-span-full">
        <NoteForm
          editingNote={note}
          onEditComplete={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg leading-tight">{note.title}</CardTitle>
        </CardHeader>
        
        <CardContent className="pb-3">
          <p className="text-gray-600 text-sm leading-relaxed">
            {truncateContent(note.content)}
          </p>
        </CardContent>

        <CardFooter className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formatDate(note.updatedAt)}</span>
          </div>
          
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowDeleteDialog(true)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <DeleteNoteDialog
        note={note}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  );
}