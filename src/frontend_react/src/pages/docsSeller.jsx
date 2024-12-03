import React from 'react';
import NavigationMenuBarAd from '../components/navBarAdvertiser';
import HeaderAD from '../components/headerAD';
import ViewPDFModelSeller from '../components/viewPDFModelSeller'; // Import ViewPDFModel

const SellerDocs = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationMenuBarAd />
      <main className="flex-grow relative">
        {/* Adjust width of HeaderTG wrapper */}
        <div className="absolute top-[-30px] left-[0.5%] w-[99%]">
          <HeaderAD />
        </div>

        {/* Add the ViewPDFModel component here */}
        <div className="absolute top-[275px] left-[0.5%] w-[99%]"> {/* Add margin to ensure content is below the header */}
          <ViewPDFModelSeller /> {/* Add ViewPDFModel to render it */}
        </div>
      </main>
    </div>
  );
};

export default SellerDocs;
