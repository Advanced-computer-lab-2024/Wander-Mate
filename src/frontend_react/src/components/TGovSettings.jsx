"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import AdminPersonalDetails from "./AdminPersonalDetails";
import ChangePassword from "./changePassword";

const TGovSettings = () => {
  const tabs = [
      // {
      //   label: "Personal Details",
      //   value: "personal",
      // },
    {
      label: "Change Password",
      value: "password",
    },
  ];
  return (
    <div className="grid grid-cols-12 gap-6 mt-6">
      {/* <div className="col-span-12 lg:col-span-4 space-y-6">
        <UserMeta />
        <Socials />
        <Skills />
      </div> */}
      <div className="col-span-12 lg:col-span-8 lg:col-start-3">
      <h1 className="text-3xl font-bold mb-6 ml-6">Change Password</h1>
        <Tabs defaultValue="password" className="p-0 px-1">
            <TabsContent value="password" className="mt-0">
            <ChangePassword URL="http://localhost:8000/changePasswordTourismGoverner"/>
          </TabsContent>
          
        </Tabs>
      </div>
    </div>
  );
};

export default TGovSettings;
