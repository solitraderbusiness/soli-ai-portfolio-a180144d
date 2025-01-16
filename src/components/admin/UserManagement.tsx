import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type UserProfile = {
  id: string;
  email: string;
  role: 'user' | 'analyst' | 'admin';
};

export const UserManagement = () => {
  const { data: profiles, refetch } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) {
        toast.error("Failed to fetch user profiles");
        throw error;
      }
      return data as UserProfile[];
    },
  });

  const handleRoleChange = async (userId: string, newRole: 'user' | 'analyst' | 'admin') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success("Role updated successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to update role");
      console.error('Error updating role:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {profiles?.map((profile) => (
            <div key={profile.id} className="flex items-center justify-between p-4 border rounded">
              <div>
                <p className="font-medium">{profile.email}</p>
                <p className="text-sm text-gray-500">ID: {profile.id}</p>
              </div>
              <Select
                defaultValue={profile.role}
                onValueChange={(value: 'user' | 'analyst' | 'admin') => 
                  handleRoleChange(profile.id, value)
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="analyst">Analyst</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};