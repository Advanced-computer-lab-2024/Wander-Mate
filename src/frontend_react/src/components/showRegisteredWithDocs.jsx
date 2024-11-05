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

        const combinedUsers = [
          ...sellers.map((user) => ({ ...user, role: "seller" })),
        ];

        setUsers(combinedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const showDocs = (userId) => {
    console.log("Show docs for user:", userId);
  };

  const acceptUser = (userId) => {
    console.log("Accept user:", userId);
  };

  const deleteUser = (userId) => {
    console.log("Delete user:", userId);
  };

  const styles = {
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "14px",
    },
    th: {
      border: "1px solid #ddd",
      padding: "8px",
      backgroundColor: "#f2f2f2",
      textAlign: "left",
    },
    td: {
      border: "1px solid #ddd",
      padding: "8px",
    },
    rowHover: {
      backgroundColor: "#f5f5f5",
    },
    avatar: {
      width: "30px",
      height: "30px",
    },
  };

  return (
    <Table style={styles.table}>
      <TableHeader>
        <TableRow>
          <TableHead style={styles.th}>User</TableHead>
          <TableHead style={styles.th}>Title</TableHead>
          <TableHead style={styles.th}>Email</TableHead>
          <TableHead style={styles.th}>Role</TableHead>
          <TableHead style={styles.th}>Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {users.map((item) => (
          <TableRow
            key={item.id}
            style={{ ...styles.tr, ...styles.rowHover }}
            className="hover:bg-muted"
          >
            <TableCell
              className="font-medium text-card-foreground/80"
              style={styles.td}
            >
              <div className="flex gap-3 items-center">
                <Avatar className="rounded-full" style={styles.avatar}>
                  <AvatarImage src={item.picture} />
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
                <span className="text-sm text-card-foreground">
                  {item.Username}
                </span>
              </div>
            </TableCell>
            <TableCell style={styles.td}>{item.FullName}</TableCell>
            <TableCell style={styles.td}>{item.Email}</TableCell>
            <TableCell style={styles.td}>
              <Badge variant="soft" className="capitalize">
                {item.role}
              </Badge>
            </TableCell>
            <TableCell style={styles.td} className="flex justify-end">
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
