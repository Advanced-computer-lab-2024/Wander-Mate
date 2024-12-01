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


const SellerTable = () => {
  const [collapsedRows, setCollapsedRows] = useState([]);
  const [sellers, setSellers] = useState([]); // Store sellers here
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/getsellers");
        console.log(response.data); // Check response data structure
        setSellers(response.data.sellers); // Store sellers data
        setLoading(false);
      } catch (err) {
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  const toggleRow = (id) => {
    if (collapsedRows.includes(id)) {
      setCollapsedRows(collapsedRows.filter((rowId) => rowId !== id));
    } else {
      setCollapsedRows([...collapsedRows, id]);
    }
  };

  const deleteSeller = async (seller) => {
    
      const deleteseller =  axios.delete("http://localhost:8000/deleteaccount", {
        data: { Username: seller.Username,
          userID: seller._id,
         },
      });
      toast.promise(
        deleteseller,
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
        const response = await deleteseller;
      if (response.status === 200) {
        // Remove the tourist from the state if the deletion is successful
        setSellers(sellers.filter(seller1 => seller1.Username !== seller.Username));
        //toast.success("Seller account deleted successfully!");
      }
    } catch (err) {
      setError("An error occurred while deleting the account");
      //toast.error("Error deleting account. Please try again.");
    }
  };


  const columns = [
    {
      key: "user",
      label: "Seller",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "email",
      label: "Email",
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
        {sellers.map((seller) => (
          <Fragment key={seller._id}>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => toggleRow(seller._id)}
                    size="icon"
                    variant="outline"
                    color="secondary"
                    className="h-7 w-7 border-none rounded-full"
                  >
                    <Icon
                      icon="heroicons:chevron-down"
                      className={cn("h-5 w-5 transition-all duration-300", {
                        "rotate-180": collapsedRows.includes(seller._id),
                      })}
                    />
                  </Button>
                  <div className="flex gap-3 items-center">
                    <Avatar className="rounded-full">
                      <AvatarImage src={getImageSrc(seller.picture)} />
                      <AvatarFallback>{seller.Username[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-sm block text-card-foreground">
                        {seller.Username}
                      </span>
                      <span className="text-xs mt-1 block font-normal">
                        {seller.Email}
                      </span>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{seller.status}</TableCell>
              <TableCell>
                <a href={`mailto:${seller.Email}`} target="_blank" rel="noopener noreferrer">
                  {seller.Email}
                </a>
              </TableCell>
              <TableCell className="flex items-center justify-start px-4 py-6">
                <Button
                  size="icon"
                  variant="outline"
                  color="destructive"
                  className="h-7 w-7 border-none p-0" onClick={()=> deleteSeller(seller)}
                >
                  <Icon icon="heroicons:trash" className="h-5 w-5" />
                </Button>
              </TableCell>
            </TableRow>
            {collapsedRows.includes(seller._id) && (
              <TableRow>
                <TableCell colSpan={4}>
                  <div className="pl-12 flex flex-col items-start">
                    <p>Created At: {new Date(seller.createdAt).toLocaleDateString()}</p>
                    <p>Updated At: {new Date(seller.updatedAt).toLocaleDateString()}</p>
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

export default SellerTable;
