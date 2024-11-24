import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { Plus, Church, Castle, University, Landmark, Mountain,Snowflake,Trees,LandPlot } from 'lucide-react';

const iconOptions = [
  { value: 'church', label: 'Church', icon: <Church className="h-5 w-5" /> },
  { value: 'castle', label: 'Castle', icon: <Castle className="h-5 w-5" /> },
  { value: 'university', label: 'University', icon: <University className="h-5 w-5" /> },
  { value: 'landmark', label: 'Landmark', icon: <Landmark className="h-5 w-5" /> },
  { value: 'mountain', label: 'Mountain', icon: <Mountain className="h-5 w-5" />},
  { value: 'snowflake', label: 'Snowflake', icon: <Snowflake className="h-5 w-5"/>},
  { value: 'trees', label: 'Trees', icon: <Trees className="h-5 w-5"/>},
  { value: 'landplot', label: 'Landplot', icon: <LandPlot className="h-5 w-5"/>},
];

const HistoricalTagsPage = () => {
  const [tags, setTags] = useState([
    { id: 1, name: 'Religious Sites', icon: <Church className="h-5 w-5" /> },
    { id: 2, name: 'Palaces/Castles', icon: <Castle className="h-5 w-5" /> },
  ]);
  const [newTagName, setNewTagName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(iconOptions[0].value);

  const handleCreateTag = () => {
    if (newTagName.trim() !== '') {
      const newTag = {
        id: tags.length + 1,
        name: newTagName.trim(),
        icon: iconOptions.find(option => option.value === selectedIcon).icon,
      };
      setTags([...tags, newTag]);
      setNewTagName('');
      setSelectedIcon(iconOptions[0].value);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Historical Tags</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {tags.map((tag) => (
          <div key={tag.id} className="flex items-center space-x-2 p-4 bg-white rounded-lg shadow">
            {tag.icon}
            <span>{tag.name}</span>
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
             <SelectItem key={option.value} value={option.value} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
             <div className="flex items-center">
               {option.icon && (
                 <span style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
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
  );
};

export default HistoricalTagsPage;

