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
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

const TourismGovTable = () => {
  const [collapsedRows, setCollapsedRows] = useState([]);
  const [tourismGovs, setTourismGovs] = useState([]); // Store tourism governor data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchTourismGovs = async () => {
      try {
        const response = await axios.get("http://localhost:8000/gettourismgov");
        console.log(response.data); // Check response data structure
        setTourismGovs(response.data); // Store tourism governor data
        setLoading(false);
      } catch (err) {
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchTourismGovs();
  }, []);

  const toggleRow = (id) => {
    if (collapsedRows.includes(id)) {
      setCollapsedRows(collapsedRows.filter((rowId) => rowId !== id));
    } else {
      setCollapsedRows([...collapsedRows, id]);
    }
  };

  const deleteTourismGov = async (tourismGov) => {
    
      const deletetourismgov =  axios.delete("http://localhost:8000/deleteaccount", {
        data: { Username: tourismGov.Username,
          userID: tourismGov._id,
         },
      });
      toast.promise(
        deletetourismgov,
        {
          loading: "Deleting seller...",
          success: "Seller account deleted successfully!",
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
        const response = await deletetourismgov;
      if (response.status === 200) {
        // Remove the tourist from the state if the deletion is successful
        setTourismGovs(tourismGovs.filter(tourismGov1 => tourismGov1.Username !== tourismGov.Username));
        //alert("tourismGov account deleted successfully!");
      }
    } catch (err) {
      setError("An error occurred while deleting the account");
      //alert("Error deleting account");
    }
  };


  const columns = [
    {
      key: "user",
      label: "Tourism Governor",
    },
    {
      key: "createdAt",
      label: "Created At",
    },
    {
      key: "updatedAt",
      label: "Updated At",
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
    // If you have an image or avatar system, modify accordingly
    return null;
  };

  return (
    <>
    <Toaster/>
    <Table>
      <TableHeader className="text-left">
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key}>{column.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {tourismGovs.map((tourismGov) => (
          <Fragment key={tourismGov._id}>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-4">
                  <div className="flex gap-3 items-center">
                    <Avatar className="rounded-full">
                      <AvatarImage src={getImageSrc(tourismGov.picture)} />
                      <AvatarFallback>{tourismGov.Username[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-sm block text-card-foreground">
                        {tourismGov.Username}
                      </span>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{new Date(tourismGov.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(tourismGov.updatedAt).toLocaleDateString()}</TableCell>
              <TableCell className="flex items-center justify-start px-4 py-6">
                <Button
                  size="icon"
                  variant="outline"
                  color="destructive"
                  className="h-7 w-7 border-none p-0" onClick={()=> deleteTourismGov(tourismGov)} 
                >
                  <Icon icon="heroicons:trash" className="h-5 w-5" />
                </Button>
              </TableCell>
            </TableRow>
          </Fragment>
        ))}
      </TableBody>
    </Table>
    </>
  );
};

export default TourismGovTable;
