import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Calendar } from 'lucide-react';
import Button from '@/components/ui/Button';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-card rounded-lg shadow-sm border border-border p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground">Manage your account settings</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Email</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Member Since</p>
              <p className="text-sm text-muted-foreground">Recently</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <Button variant="outline" onClick={logout} className="text-destructive hover:text-destructive">
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;