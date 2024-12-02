"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { cn } from "../lib/utils";
import { UploadCloud, Search, LayoutGrid, List } from 'lucide-react';
import SingleFileCard from "./single-file-card";
import ViewPDFComp from "./viewPDFComponent";
import { Label } from "../components/ui/label";
import { useToast } from "./ui/use-toast";

const ViewPDFModel = () => {
  const [fileView, setFileView] = useState("grid");
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [GuideID, setGuideID] = useState(null);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        const username = sessionStorage.getItem('username');
        if (!username) {
          console.error('No username found in session storage.');
          return;
        }
        const response = await fetch(`http://localhost:8000/getID/${username}`);
        if (!response.ok) {throw new Error("Failed to fetch Tour Guide ID");}
        const { userID } = await response.json();
        setGuideID(userID);
        const reply = await fetch(`http://localhost:8000/getTourGuideDocuments/${userID}`);
        const data = await reply.json();
        if (reply.ok) {
          setDocuments(data.documents);
        } else {
          setError("No documents found");
        }
      } catch (error) {
        setErrorMessage("Failed to fetch documents");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchDocuments();
  }, []);

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      toast({
        title: "Error",
        description: "No files selected",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('ownerId', GuideID);
    formData.append('ID', files[0]);
    if (files[1]) {
      formData.append('docs', files[1]);
    }

    try {
      const response = await fetch('http://localhost:8000/uploadTourGuideDocuments', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload documents');
      }

      const result = await response.json();
      toast({
        title: "Success",
        description: result.message,
      });

      // Refresh the documents list
      const refreshResponse = await fetch(`http://localhost:8000/getTourGuideDocuments/${GuideID}`);
      const refreshData = await refreshResponse.json();
      if (refreshResponse.ok) {
        setDocuments(refreshData.documents);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const filteredDocuments = documents.filter((item) =>
    item.Title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="mt-6">
      <CardHeader className="mb-0 border-none p-6">
        <div className="flex flex-wrap justify-between gap-4">
          <div className="flex-1">
            <div className="text-lg font-medium text-default-900 whitespace-nowrap">
              Project Files
            </div>
            <div className="text-xs lg:text-sm font-medium text-default-600 whitespace-nowrap">
              Total {filteredDocuments.length} files
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button
              size="icon"
              variant="outline"
              className={cn("hover:bg-transparent  ", {
                "hover:border-primary hover:text-primary": fileView === "grid",
                "hover:border-muted-foreground hover:text-muted-foreground":
                  fileView !== "grid",
              })}
              onClick={() => setFileView("grid")}
            >
              <LayoutGrid className="h-5 w-5" />
            </Button>

            <Button
              size="icon"
              variant="outline"
              className={cn("hover:bg-transparent  ", {
                "hover:border-primary hover:text-primary": fileView === "list",
                "hover:border-muted-foreground hover:text-muted-foreground":
                  fileView !== "list",
              })}
              onClick={() => setFileView("list")}
            >
              <List className="h-5 w-5" />
            </Button>

            <div className="relative">
              <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 ltr:left-2 rtl:right-2 text-default-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search File"
                className="ltr:pl-7 rtl:pr-8"
              />
            </div>

            <Label htmlFor="fileUpload">
              {/* <Button asChild disabled={isUploading}>
                <span className="cursor-pointer flex items-center gap-1">
                  <UploadCloud className="h-4 w-4" />
                  {isUploading ? 'Uploading...' : 'Upload File'}
                </span>
              </Button> */}
              <Input 
                type="file" 
                className="hidden" 
                id="fileUpload" 
                onChange={handleFileUpload}
                multiple
                accept=".pdf"
              />
            </Label>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {fileView === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredDocuments.map((item) => (
              <SingleFileCard item={item} key={item._id} />
            ))}
          </div>
        )}
        {fileView === "list" && <ViewPDFComp files={filteredDocuments} />}
      </CardContent>
    </Card>
  );
};

export default ViewPDFModel;

