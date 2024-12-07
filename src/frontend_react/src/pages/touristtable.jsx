import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { cn } from "../lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

import { Icon } from "@iconify/react";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import AdminNavBar from "../components/AdminNavBar";
const TouristTable = () => {
  const [collapsedRows, setCollapsedRows] = useState([]);
  const [tourists, setTourists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTourists = async () => {
      try {
        const response = await axios.get("http://localhost:8000/gettourists");
        setTourists(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchTourists();
  }, []);

  const toggleRow = (id) => {
    if (collapsedRows.includes(id)) {
      setCollapsedRows(collapsedRows.filter((rowId) => rowId !== id));
    } else {
      setCollapsedRows([...collapsedRows, id]);
    }
  };

  const deleteTourist = async (tourist) => {
    
      const deletetourist =  axios.delete("http://localhost:8000/deleteaccount", {
        data: { Username: tourist.Username,
          userID: tourist._id,
         },
      });
      toast.promise(
        deletetourist,
        {
          loading: "Deleting Tourist...",
          success: "Tourist account deleted successfully!",
          error: "Error deleting the account.",
        },
        {
          // Optional settings for the toast (you can customize these)
          success: {
            duration: 4000, // The toast will disappear after 4 seconds
            icon: "✅",
          },
          error: {
            duration: 4000,
            icon: "❌",
          },
        }
      );
      try {
        const response = await deletetourist;
      if (response.status === 200) {
        // Remove the tourist from the state if the deletion is successful
        setTourists(tourists.filter(tourist1 => tourist1.Username !== tourist.Username));
        //alert("Tourist account deleted successfully!");
      }
    } catch (err) {
      setError("An error occurred while deleting the account");
      //alert("Error deleting account");
    }
  };

  const columns = [
    {
      key: "user",
      label: "User",
    },
    {
      key: "role",
      label: "Role",
    },
    {
      key: "wallet",
      label: "Wallet",
    },
    {
      key: "action",
      label: "Action",
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const getImageSrc = (picture) => {
    if (picture && picture.data && picture.contentType) {
      const base64String =
        typeof picture.data === "string"
          ? picture.data
          : btoa(String.fromCharCode.apply(null, new Uint8Array(picture.data)));
      return `data:${picture.contentType};base64,${base64String}`;
    }
    return null;
  };

  return (
    <>
    <AdminNavBar/>
    <Toaster/>
    <br></br>
    <h1 className="text-3xl font-bold mb-6 ml-6">All Tourists</h1>
    <Table>
      <TableHeader className="text-left">
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key}>{column.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {tourists.map((tourist) => (
          <Fragment key={tourist._id}>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => toggleRow(tourist._id)}
                    size="icon"
                    variant="outline"
                    color="secondary"
                    className="h-7 w-7 border-none rounded-full"
                  >
                    <Icon
                      icon="heroicons:chevron-down"
                      className={cn("h-5 w-5 transition-all duration-300", {
                        "rotate-180": collapsedRows.includes(tourist._id),
                      })}
                    />
                  </Button>
                  <div className="flex gap-3 items-center">
                    <Avatar className="rounded-full">
                      <AvatarImage src={getImageSrc(tourist.picture)} />
                      <AvatarFallback>{tourist.FullName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-sm block text-card-foreground">
                        {tourist.FullName}
                      </span>
                      <span className="text-xs mt-1 block font-normal">
                        {tourist.Email}
                      </span>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{tourist.Role}</TableCell>
              <TableCell>${tourist.Wallet}</TableCell>
              <TableCell className="flex items-center justify-start px-4 py-6">
                <Button
                  size="icon"
                  variant="outline"
                  color="destructive"
                  className="h-7 w-7 border-none"
                  onClick={() => deleteTourist(tourist)} // Call deleteTourist with the username
                >
                  <Icon icon="heroicons:trash" className="h-5 w-5" />
                </Button>
              </TableCell>
            </TableRow>
            {collapsedRows.includes(tourist._id) && (
              <TableRow>
                <TableCell colSpan={4}>
                  <div className="pl-12 flex flex-col items-start">
                    <p>Username: {tourist.Username}</p>
                    <p>Phone: {tourist.MobileNumber}</p>
                    <p>Badge: {tourist.Badge}</p>
                    <p>Nationality: {tourist.Nationality}</p>
                    <p>Date of Birth: {new Date(tourist.DOB).toLocaleDateString()}</p>
                    <p>Points: {tourist.Points}</p>
                    <p>Created At: {new Date(tourist.createdAt).toLocaleDateString()}</p>
                    <p>Updated At: {new Date(tourist.updatedAt).toLocaleDateString()}</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </Fragment>
        ))}
      </TableBody>
    </Table>
    </>
  );
};

export default TouristTable;
