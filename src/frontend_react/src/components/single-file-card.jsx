"use client";

import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { Icon } from "@iconify/react";


import pdfi from "../public/images/files/pdf.png";
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // Adjust the locale as needed
  };
  const handleDownload = (documentData) => {
    if (typeof document === "undefined") {
      console.error(
        "Document object is not available. Ensure this runs in a browser context."
      );
      return;
    }

    if (!documentData || !documentData.Title || !documentData.pdf) {
      console.error("Invalid document data:", documentData);
      return;
    }

    try {
      // Create an anchor element
      const link = document.createElement("a");

      // Create the data URI for the PDF file
      link.href = `data:application/pdf;base64,${documentData.pdf}`;
      link.download = `${documentData.Title}.pdf`; // Set the file name to be downloaded

      // Append link to body, trigger click, then remove link
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error during file download:", error);
    }
  };
const SingleFileCard = ({ item }) => {
  return (
    <div className="relative min-h-[164px] shadow-sm dark:border rounded">
      {item.fileUrl && (
        <img
          alt={`${item.fileName} background`}
          src={item.fileUrl}
          layout="fill"
          objectFit="cover"
          className={cn(
            "absolute top-0 left-0 h-full w-full object-cover dark:border-none rounded",
            {
              hidden: !item.fileUrl,
            }
          )}
        />
      )}
      <div className="p-6">
        <div
          className={cn("bg-card p-2.5 h-14 w-14 rounded mx-auto block", {
            hidden: item.fileType === "png",
          })}
        >
          {item.fileType !== "png" && (
            <img
              alt={`${item.fileName} icon`}
              src={ pdfi }
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div
          className={cn("text-center mt-3", {
            "text-left mt-2.5 bottom-4 absolute left-4 z-20":
              item.fileType === "png",
          })}
        >
          <p
            className={cn("text-base font-medium text-default-800 dark:text-primary-foreground truncate", {
              "text-default-50": item.fileType === "png",
            })}
          >
            {item.Title}
          </p>
          <p
            className={cn("text-sm font-normal text-default-600 dark:text-primary-foreground", {
              "text-default-50": item.fileType === "png",
            })}
          >
            <span>{formatDate(item.createdAt)}</span>
          </p>
        </div>

        <div className="absolute top-3 right-3 flex gap-1.5">
          {/* Download Button */}
          <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    onClick={() => handleDownload(item)}
                  >
                    <Icon icon="heroicons:arrow-down-tray" className="h-4 w-4" />
                  </Button>
        </div>
      </div>
    </div>
  );
};

export default SingleFileCard;

