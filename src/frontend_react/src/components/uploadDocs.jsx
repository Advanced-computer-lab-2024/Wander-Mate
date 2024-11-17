"use client";
import { Fragment, useState } from "react";
import { Icon } from "@iconify/react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { Upload } from "lucide-react";
import { Toaster, toast as reToast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FileUploaderMultiple = ({ ownerId, httpRequest, nextPage }) => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length + files.length > 2) {
        reToast.error("You can only upload two files: ID and docs.");
        return;
      }
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles].slice(0, 2));
    },
  });

  const renderFilePreview = (file) => {
    if (file.type.startsWith("image")) {
      return (
        <img
          width={48}
          height={48}
          alt={file.name}
          src={URL.createObjectURL(file)}
          className="rounded border p-0.5"
        />
      );
    } else {
      return <Icon icon="tabler:file-description" />;
    }
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  const handleUploadFiles = async () => {
    if (files.length < 2) {
      reToast.error("Please upload both ID and docs files.");
      return;
    }

    const formData = new FormData();
    formData.append("ID", files[0]); // First file as ID
    formData.append("docs", files[1]); // Second file as docs
    formData.append("ownerId", ownerId); // Add ownerId to the form data

    const toastId = reToast.loading("Uploading files...");
    try {
      await axios.post(httpRequest, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      reToast.success("Files uploaded successfully!", { id: toastId });
      setTimeout(() => {
        navigate(nextPage);
      }, 1000);
    } catch (error) {
      console.error("Error uploading files:", error);
      reToast.error("Error uploading files.", { id: toastId });
    }
  };

  return (
    <Fragment>
      <Toaster />
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <div className="w-full text-center border-dashed border rounded-md py-[52px] flex items-center flex-col">
          <div className="h-12 w-12 inline-flex rounded-md bg-muted items-center justify-center mb-3">
            <Upload className="h-6 w-6 text-default-500" />
          </div>
          <h4 className="text-2xl font-medium mb-1 text-card-foreground/80">
            Drop files here or click to upload.
          </h4>
          <div className="text-xs text-muted-foreground">
            Upload two files: the first as "ID" and the second as "docs."
          </div>
        </div>
      </div>
      {files.length > 0 && (
        <div className="space-y-4 mt-4">
          {files.map((file, index) => (
            <div
              key={file.name}
              className="flex justify-between items-center border px-3.5 py-3 rounded-md"
            >
              <div className="flex items-center space-x-3">
                <div className="file-preview">{renderFilePreview(file)}</div>
                <div>
                  <div className="text-sm text-card-foreground">
                    {index === 0 ? "ID: " : "Docs: "} {file.name}
                  </div>
                  <div className="text-xs font-light text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              </div>
              <Button
                size="icon"
                color="destructive"
                variant="outline"
                className="border-none rounded-full"
                onClick={() => handleRemoveFile(index)}
              >
                <Icon icon="tabler:x" className="h-5 w-5" />
              </Button>
            </div>
          ))}
          <div className="flex justify-end space-x-2">
            <Button color="destructive" onClick={() => setFiles([])}>
              Remove All
            </Button>
            <Button onClick={handleUploadFiles}>Upload Files</Button>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default FileUploaderMultiple;
