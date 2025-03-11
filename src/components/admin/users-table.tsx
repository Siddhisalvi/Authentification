"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await authClient.admin.listUsers({
          query: {
            limit: 10,
          },
        });

        if (response?.data) {
          setUsers(response.data.users as User[]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch users")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleBanUser = async (userId: string) => {
    try {
      await authClient.admin.banUser({
        userId,
        banReason: "Violation of rules",
        banExpiresIn: 60 * 60 * 24 * 7, // Ban for 7 days
      });
  
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, banned: true } : user
        )
      );
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to ban user:", err.stack); // Logs detailed error
      } else {
        console.error("Failed to ban user: Unknown error");
      }
    }
  };
  
  const handleUnbanUser = async (userId: string) => {
    try {
      await authClient.admin.unbanUser({ userId });
  
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, banned: false } : user
        )
      );
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to unban user:", err.stack);
      } else {
        console.error("Failed to unban user: Unknown error");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <span>loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center p-4">
        <span className="text-red-500">Error: {error.message}</span>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Verified</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>{user.emailVerified ? "Yes" : "No"}</TableCell>
            <TableCell>
              {user.banned ? (
                <span className="text-red-500">Banned</span>
              ) : (
                <span className="text-green-500">Active</span>
              )}
            </TableCell>
            <TableCell>
              {new Date(user.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              {user.banned ? (
                <Button
                  onClick={() => handleUnbanUser(user.id)}
                  variant="outline"
                >
                  Unban
                </Button>
              ) : (
                <Button
                  onClick={() => handleBanUser(user.id)}
                  variant="destructive"
                >
                  Ban
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
