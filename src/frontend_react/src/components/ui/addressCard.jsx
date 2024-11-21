import React from 'react';
import { MapPin } from 'lucide-react';

const AddressCard = ({ name, street, city, state, zipCode, country }) => {
  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex items-center gap-2 border-b border-gray-200">
        <MapPin className="h-6 w-6 text-blue-500" />
        <h3 className="text-lg leading-6 font-medium text-gray-900">{name}</h3>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <address className="not-italic">
          <p className="text-sm text-gray-500 mb-1">{street}</p>
          <p className="text-sm text-gray-500 mb-1">{city}, {state} {zipCode}</p>
          <p className="text-sm text-gray-500">{country}</p>
        </address>
      </div>
    </div>
  );
};

// Example usage
const App = () => {
  return (
    <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
      <AddressCard
        name="John Doe"
        street="123 Main St"
        city="Anytown"
        state="CA"
        zipCode="12345"
        country="USA"
      />
    </div>
  );
};

export default App;

