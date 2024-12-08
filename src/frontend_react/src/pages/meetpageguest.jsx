// pages/UserPage.jsx
import React, { useState, useEffect } from "react";
import GuestNavigationMenuBar from "../components/Guestnavbar";
import UserCard from "../components/meetComp";
import pic1 from "../public/images/files/tony.jpg";
import pic2 from "../public/images/files/khelo.jpg";
import pic3 from "../public/images/files/andrew.jpg";
import pic4 from "../public/images/files/ramez.jpg";
import pic5 from "../public/images/files/mario.jpg";
import pic6 from "../public/images/files/donny.jpg";
import pic7 from "../public/images/files/peter.jpg";
import pic8 from "../public/images/files/youssefm.jpg";
import pic9 from "../public/images/files/Nadeem.jpg";
import pic10 from "../public/images/files/youssefashraf.jpg";
import GuestFooter from "../components/GuestFooter";

const MeetPageguest = () => {
  // Predefined user data
  const [likedItemsCount, setLikedItemsCount] = useState(0);
  const users = [
    {
      id: 1,
      name: "Antony Ayman",
      email: "antony.alfy@student.guc.edu.eg",
      picture: pic1,
    },
    {
      id: 2,
      name: "Youssef Khalil",
      email: "youssef.khalil@student.guc.edu.eg",
      picture: pic2,
    },
    {
      id: 3,
      name: "Andrew Wael",
      email: "andrew.mikhael@student.guc.edu.eg",
      picture: pic3,
    },
    {
      id: 4,
      name: "Mario Fady",
      email: "mario.abdelmesseih@student.guc.edu.eg",
      picture: pic5,
    },
    {
      id: 5,
      name: "Ramez Ehab",
      email: "ramez.saleh@student.guc.edu.eg",
      picture: pic4,
    },
    {
      id: 6,
      name: "John Nagi",
      email: "john.alarja@student.guc.edu.eg",
      picture: pic6,
    },
    {
      id: 7,
      name: "Peter Ragy",
      email: "peter.saad@student.guc.edu.eg",
      picture: pic7,
    },
    {
      id: 8,
      name: "Youssef Medhat",
      email: "youssef.sedkey@student.guc.edu.eg",
      picture: pic8,
    },
    {
      id: 9,
      name: "Nadeem Mohamed",
      email: "nadeem.soliman@student.guc.edu.eg",
      picture: pic9,
    },
    {
      id: 10,
      name: "Youssef Ashraf",
      email: "youssef.abdelmalak@student.guc.edu.eg",
      picture: pic10,
    },
  ];

  return (
    <>
      <GuestNavigationMenuBar likedItemsCount={likedItemsCount} />
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Meet The Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </div>
      <GuestFooter />
    </>
  );
};

export default MeetPageguest;
