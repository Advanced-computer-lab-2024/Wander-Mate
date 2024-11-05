"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

const ShowWithDocs = () => {
  const [users, setUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const s = await fetch("http://localhost:8000/getSellers/").then((res) =>
          res.json()
        );
        const sellers = s.sellers;
        // const tourGuides = await fetch("/api/tourguides").then((res) =>
        //   res.json()
        // );
        // const advertisers = await fetch("/api/advertisers").then((res) =>
        //   res.json()
        // );

        const combinedUsers = [
          ...sellers.map((user) => ({ ...user, role: "seller" })),
          //   ...tourGuides.map((user) => ({ ...user, role: "tourguide" })),
          //   ...advertisers.map((user) => ({ ...user, role: "advertiser" })),
        ];

        setUsers(combinedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSelectAll = () => {
    if (selectedRows.length === users.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(users.map((user) => user.id));
    }
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(id)
        ? prevSelectedRows.filter((rowId) => rowId !== id)
        : [...prevSelectedRows, id]
    );
  };

  const showDocs = (userId) => {
    console.log("Show docs for user:", userId);
  };

  const acceptUser = (userId) => {
    console.log("Accept user:", userId);
  };

  const deleteUser = (userId) => {
    console.log("Delete user:", userId);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox
              checked={selectedRows.length === users.length}
              onCheckedChange={handleSelectAll}
            />
          </TableHead>
          <TableHead>User</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {users.map((item) => (
          <TableRow key={item.id} className="hover:bg-muted">
            <TableCell>
              <Checkbox
                checked={selectedRows.includes(item.id)}
                onCheckedChange={() => handleRowSelect(item.id)}
              />
            </TableCell>
            <TableCell className="font-medium text-card-foreground/80">
              <div className="flex gap-3 items-center">
                <Avatar className="rounded-full">
                  <AvatarImage src={item.picture} />
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
                <span className="text-sm text-card-foreground">
                  {item.Username}
                </span>
              </div>
            </TableCell>
            <TableCell>{item.FullName}</TableCell>
            <TableCell>{item.Email}</TableCell>
            <TableCell>
              <Badge variant="soft" className="capitalize">
                {item.role}
              </Badge>
            </TableCell>
            <TableCell className="flex justify-end">
              <div className="flex gap-3">
                <Button
                  size="icon"
                  variant="outline"
                  color="secondary"
                  className="h-7 w-7"
                  onClick={() => showDocs(item.id)}
                >
                  <Icon icon="heroicons:eye" className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  color="secondary"
                  onClick={() => acceptUser(item.id)}
                >
                  <Icon icon="heroicons:check-circle" className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  color="secondary"
                  onClick={() => deleteUser(item.id)}
                >
                  <Icon icon="heroicons:trash" className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ShowWithDocs;
