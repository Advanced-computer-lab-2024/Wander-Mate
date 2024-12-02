import React from 'react';

const MeetComp = ({ user }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
      <img
        src={user.picture}
        alt={user.name}
        className="w-24 h-24 rounded-full object-cover mb-4"
      />
      <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
      <p className="text-sm text-gray-500">{user.email}</p>
    </div>
  );
};

export default MeetComp;
