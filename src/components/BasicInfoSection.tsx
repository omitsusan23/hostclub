import React from 'react';

interface BasicInfoSectionProps {
  formData: {
    name: string;
    lineName: string;
    attribute: string;
  };
  onChange: (field: string, value: string) => void;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ formData, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="タップで入力"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          className="w-full px-4 py-3 bg-[#1a1a1a] text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label className="block text-gray-400 text-sm mt-1 ml-1">名前</label>
      </div>

      <div>
        <input
          type="text"
          placeholder="タップで入力"
          value={formData.lineName}
          onChange={(e) => onChange('lineName', e.target.value)}
          className="w-full px-4 py-3 bg-[#1a1a1a] text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label className="block text-gray-400 text-sm mt-1 ml-1">LINE名</label>
      </div>

      <div>
        <input
          type="text"
          placeholder="タップで入力"
          value={formData.attribute}
          onChange={(e) => onChange('attribute', e.target.value)}
          className="w-full px-4 py-3 bg-[#1a1a1a] text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label className="block text-gray-400 text-sm mt-1 ml-1">属性</label>
      </div>
    </div>
  );
};

export default BasicInfoSection;