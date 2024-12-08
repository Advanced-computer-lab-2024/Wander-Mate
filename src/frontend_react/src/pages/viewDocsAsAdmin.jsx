import React from "react";
import AdminNavBar from "../components/AdminNavBar";
import ViewAllDocuments from "../components/showRegisteredWithDocs";
import TourismGovernerFooter from "../components/tourismGovernerFooter";

export default function AdminDocumentsPage() {
  return (
    <React.Fragment>
      <div className="min-h-screen bg-gray-100">
        <AdminNavBar />
        <main className="container mx-auto px-4 py-8" size="full">
          <h1 className="text-3xl font-bold mb-6">View All Documents</h1>
          <div className="rounded-lg overflow-hidden">
            <ViewAllDocuments />
          </div>
        </main>
      </div>
      <TourismGovernerFooter />
    </React.Fragment>
  );
}
