"use client";

import { useQuery } from "@tanstack/react-query";
import { ApiInstance } from "@/lib/api";
import { ApiResponse, INote } from "@/types/objects";
import { NoteCard } from "./note-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export function NoteList() {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: notesData,
    isLoading,
    error,
  } = useQuery<ApiResponse>({
    queryKey: ["notes"],
    queryFn: async () => {
      const response = await ApiInstance.get("/notes");
      return response.data;
    },
  });

  const notes = notesData?.notes || [];

  // Filter notes based on search term
  const filteredNotes = notes.filter((note: INote) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-red-600">Error loading notes</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Your Notes</span>
            <span className="text-sm font-normal text-gray-500">
              ({notes.length} {notes.length === 1 ? "note" : "notes"})
            </span>
          </CardTitle>
          <CardDescription>
            Manage and organize your thoughts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search notes..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Notes */}
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {searchTerm ? "No notes found" : "No notes yet"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm 
                  ? "Try adjusting your search terms" 
                  : "Get started by creating your first note"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredNotes.map((note: INote) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}