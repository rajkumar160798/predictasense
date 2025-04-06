import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SidebarOption {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

interface Props {
  options: SidebarOption[];
  selectedOption: string;
  onOptionSelect: (id: string) => void;
}

export const CollapsibleSidebar: React.FC<Props> = ({
  options,
  selectedOption,
  onOptionSelect,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleOptionClick = (id: string) => {
    if (id === "suggestedActions") {
      navigate("/suggested-actions");
      return;
    }
    if (id === "rootCause") {
      navigate("/root-cause");
      return;
    }
    onOptionSelect(id);
  };

  return (
    <div
      className={`bg-white shadow-lg transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className={`font-semibold ${isCollapsed ? 'hidden' : 'block'}`}>
          Navigation
        </h2>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-64px)]">
        {options.map((option) => (
          <div
            key={option.id}
            onClick={() => handleOptionClick(option.id)}
            className={`p-4 cursor-pointer hover:bg-purple-50 transition-colors ${
              selectedOption === option.id ? 'bg-purple-100' : ''
            }`}
          >
            <div className="flex items-center">
              <span className="text-xl">{option.icon}</span>
              {!isCollapsed && (
                <div className="ml-3">
                  <h3 className="font-medium text-sm">{option.title}</h3>
                  <p className="text-xs text-gray-500">{option.desc}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollapsibleSidebar; 