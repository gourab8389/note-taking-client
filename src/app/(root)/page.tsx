"use client";

import { NoteForm } from "./_components/note-form";
import { NoteList } from "./_components/note-list";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/shared/auth-guard";

export default function HomePage() {
  const { user, logout, isHydrated } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  // Don't render until hydrated
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  📝 Note Taking App
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <User className="h-8 w-8 p-2 bg-gray-100 rounded-full" />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Note Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <NoteForm />
              </div>
            </div>

            {/* Notes List */}
            <div className="lg:col-span-2">
              <NoteList />
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}