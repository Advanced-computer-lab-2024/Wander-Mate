import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";

const styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const NationalitySelect = ({value, onChange, error}) => {
  const [nations, setNations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch nations from API
  useEffect(() => {
    const fetchNations = async () => {
      try {
        const response = await axios.get("http://localhost:8000/getNations");
        const nationOptions = response.data.map((nation) => ({
          value: nation._id,
          label: nation.country_name,
        }));

        // Sort nations alphabetically
        setNations(
          nationOptions.sort((a, b) => a.label.localeCompare(b.label))
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching nations:", error);
        setLoading(false);
      }
    };

    fetchNations();
  }, []);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: error ? "red" : provided.borderColor,
      "&:hover": {
        borderColor: error ? "darkred" : provided.borderColor,
      },
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: "14px",
    }),
  };

  return (
    <div>
      <Select
        classNamePrefix="select"
        placeholder="Nationality"
        options={nations}
        isLoading={loading}
        styles={customStyles}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default NationalitySelect;
