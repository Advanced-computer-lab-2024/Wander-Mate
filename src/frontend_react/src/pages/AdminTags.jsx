import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Plus,
  Church,
  Castle,
  University,
  Landmark,
  Mountain,
  Snowflake,
  Trees,
  LandPlot,
  Pencil,
  X,
} from "lucide-react";
import AdminNavBar from "../components/AdminNavBar";
import TourismGovernerFooter from "../components/tourismGovernerFooter";

const iconOptions = [
  { value: "church", label: "Church", icon: <Church className="h-5 w-5" /> },
  { value: "castle", label: "Castle", icon: <Castle className="h-5 w-5" /> },
  {
    value: "university",
    label: "University",
    icon: <University className="h-5 w-5" />,
  },
  {
    value: "landmark",
    label: "Landmark",
    icon: <Landmark className="h-5 w-5" />,
  },
  {
    value: "mountain",
    label: "Mountain",
    icon: <Mountain className="h-5 w-5" />,
  },
  {
    value: "snowflake",
    label: "Snowflake",
    icon: <Snowflake className="h-5 w-5" />,
  },
  { value: "trees", label: "Trees", icon: <Trees className="h-5 w-5" /> },
  {
    value: "landplot",
    label: "Landplot",
    icon: <LandPlot className="h-5 w-5" />,
  },
];

const API_URL = "http://localhost:8000";
const username = sessionStorage.getItem("username");

const AdminTags = () => {
  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(iconOptions[0].value);
  const [editingTag, setEditingTag] = useState(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await axios.get(`${API_URL}/readPreferenceTags`);
      setTags(
        response.data.map((tag) => ({
          ...tag,
          icon: iconOptions.find((option) => option.value === tag.icon)
            ?.icon || <Landmark className="h-5 w-5" />, // Default icon if not found
        }))
      );
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleCreateTag = async () => {
    if (newTagName.trim() !== "") {
      try {
        const response = await axios.post(`${API_URL}/createPreferenceTags`, {
          Name: newTagName.trim(),
          icon: selectedIcon, // Send icon value to backend
        });
        setTags([
          ...tags,
          {
            ...response.data,
            icon: iconOptions.find((option) => option.value === selectedIcon)
              ?.icon,
          },
        ]);
        setNewTagName("");
        setSelectedIcon(iconOptions[0].value); // Reset to default icon
      } catch (error) {
        console.error("Error creating tag:", error);
      }
    }
  };

  const handleUpdateTag = async (id, newName) => {
    try {
      const response = await axios.patch(
        `${API_URL}/updatePreferenceTagById/${id}`,
        {
          newName: newName,
        }
      );
      setTags(
        tags.map((tag) =>
          tag._id === id ? { ...response.data, icon: tag.icon } : tag
        )
      );
      setEditingTag(null);
    } catch (error) {
      console.error("Error updating tag:", error);
    }
  };

  const handleDeleteTag = async (id) => {
    try {
      await axios.delete(`${API_URL}/deletePreferenceTagsById/${id}`);
      setTags(tags.filter((tag) => tag._id !== id));
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };

  return (
    <>
      <AdminNavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Perference Tags</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {tags.map((tag) => (
            <div
              key={tag._id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
            >
              <div className="flex items-center space-x-2">
                {tag.icon}
                {editingTag === tag._id ? (
                  <Input
                    type="text"
                    value={tag.Name}
                    onChange={(e) =>
                      setTags(
                        tags.map((t) =>
                          t._id === tag._id ? { ...t, Name: e.target.value } : t
                        )
                      )
                    }
                    onBlur={() => {
                      console.log(tag);
                      handleUpdateTag(tag._id, tag.Name);
                    }}
                    className="w-full"
                  />
                ) : (
                  <span>{tag.Name}</span>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingTag(tag._id)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteTag(tag._id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Enter new tag name"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className="flex-grow"
          />
          <Select value={selectedIcon} onValueChange={setSelectedIcon}>
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="Select an icon" />
            </SelectTrigger>
            <SelectContent>
              {iconOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div className="flex items-center">
                    {option.icon && (
                      <span
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {option.icon}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleCreateTag}>
            <Plus className="h-5 w-5 mr-2" />
            Create New Tag
          </Button>
        </div>
      </div>
      <TourismGovernerFooter />
    </>
  );
};

export default AdminTags;
