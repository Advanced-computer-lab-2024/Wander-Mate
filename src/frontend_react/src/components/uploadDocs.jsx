"use client";
import { Fragment, useState } from "react";
import { Icon } from "@iconify/react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { Upload } from "lucide-react";
import { Toaster, toast as reToast } from "react-hot-toast";
import axios from "axios";

const FileUploaderMultiple = ({ ownerId, httpRequest }) => {
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
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

  const handleRemoveFile = (file) => {
    const updatedFiles = files.filter((i) => i.name !== file.name);
    setFiles([...updatedFiles]);
  };

  const fileList = files.map((file) => (
    <div
      key={file.name}
      className="flex justify-between border px-3.5 py-3 my-6 rounded-md"
    >
      <div className="flex space-x-3 items-center">
        <div className="file-preview">{renderFilePreview(file)}</div>
        <div>
          <div className="text-sm text-card-foreground">{file.name}</div>
          <div className="text-xs font-light text-muted-foreground">
            {Math.round(file.size / 100) / 10 > 1000 ? (
              <>{(Math.round(file.size / 100) / 10000).toFixed(1)}</>
            ) : (
              <>{(Math.round(file.size / 100) / 10).toFixed(1)}</>
            )}
            {" kb"}
          </div>
        </div>
      </div>
      <Button
        size="icon"
        color="destructive"
        variant="outline"
        className="border-none rounded-full"
        onClick={() => handleRemoveFile(file)}
      >
        <Icon icon="tabler:x" className="h-5 w-5" />
      </Button>
    </div>
  ));

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  const handleUploadFiles = async () => {
    const idFile = files.find((file) => file.name.toLowerCase().includes("id"));
    const docsFile = files.find((file) =>
      file.name.toLowerCase().includes("docs")
    );

    if (!idFile || !docsFile) {
      reToast.error("Please upload both ID and Taxation Registry documents.");
      return;
    }

    const formData = new FormData();
    formData.append("ID", idFile); // Append ID file
    formData.append("docs", docsFile); // Append docs file
    formData.append("ownerId", ownerId); // Add ownerId to the form data

    const toastId = reToast.loading("Uploading files...");
    try {
      const response = await axios.post(httpRequest, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      reToast.success("Files uploaded successfully!", { id: toastId });
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
            (This is just a demo drop zone. Selected files are not actually
            uploaded.)
          </div>
        </div>
      </div>
      {files.length ? (
        <Fragment>
          <div>{fileList}</div>
          <div className="flex justify-end space-x-2">
            <Button color="destructive" onClick={handleRemoveAllFiles}>
              Remove All
            </Button>
            <Button onClick={handleUploadFiles}>Upload Files</Button>
          </div>
        </Fragment>
      ) : null}
    </Fragment>
  );
};

export default FileUploaderMultiple;
