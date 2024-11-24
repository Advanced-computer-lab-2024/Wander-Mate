"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

const ShowWithDocs = () => {
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState({});
  const [selectedUserDocs, setSelectedUserDocs] = useState(null);

  useEffect(() => {
    // Fetch users
    const fetchUsers = async () => {
      try {
        const s = await fetch("http://localhost:8000/getSellers/").then((res) =>
          res.json()
        );
        const sellers = s.sellers;

        const combinedUsers = [
          ...sellers.map((user) => ({ ...user, role: "seller" })),
        ];

        setUsers(combinedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    // Fetch documents
    const fetchDocuments = async () => {
      try {
        const res = await fetch("http://localhost:8000/viewDocuments");
        const data = await res.json();
        if (res.ok) {
          setDocuments(data.documents);
        } else {
          console.error("Error fetching documents:", data.message);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchUsers();
    fetchDocuments();
  }, []);

  const showDocs = (userId) => {
    setSelectedUserDocs(documents[userId] || []);
  };

  const acceptUser = (userId) => {
    console.log("Accept user:", userId);
  };

  const deleteUser = (userId) => {
    console.log("Delete user:", userId);
  };

  return (
    <div>
      {/* User Table */}
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">User</th>
            <th className="border p-2 text-left">Title</th>
            <th className="border p-2 text-left">Email</th>
            <th className="border p-2 text-left">Role</th>
            <th className="border p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="border p-2">
                <div className="flex gap-3 items-center">
                  <Avatar className="rounded-full">
                    <AvatarImage src={item.picture} />
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                  <span>{item.Username}</span>
                </div>
              </td>
              <td className="border p-2">{item.FullName}</td>
              <td className="border p-2">{item.Email}</td>
              <td className="border p-2">
                <Badge variant="soft" className="capitalize">
                  {item.role}
                </Badge>
              </td>
              <td className="border p-2">
                <div className="flex gap-3">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    onClick={() => showDocs(item.id)}
                  >
                    <Icon icon="heroicons:eye" className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    onClick={() => acceptUser(item.id)}
                  >
                    <Icon icon="heroicons:check-circle" className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    onClick={() => deleteUser(item.id)}
                  >
                    <Icon icon="heroicons:trash" className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Documents Display */}
      {selectedUserDocs && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">User Documents</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedUserDocs.map((doc, index) => (
              <Card key={index} className="shadow-lg">
                <CardHeader>
                  <CardTitle>{doc.Title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    <a
                      href={`data:application/pdf;base64,${doc.pdf}`}
                      download={`${doc.Title}.pdf`}
                      className="text-blue-500 hover:underline"
                    >
                      Download PDF
                    </a>
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowWithDocs;
