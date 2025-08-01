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
    <>
      {/* 名前 */}
      <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
        <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 whitespace-nowrap">名前</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888]"
          placeholder="タップで入力"
        />
      </div>

      {/* LINE名 */}
      <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
        <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 whitespace-nowrap">LINE名</label>
        <input
          type="text"
          value={formData.lineName}
          onChange={(e) => onChange('lineName', e.target.value)}
          className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888]"
          placeholder="タップで入力"
        />
      </div>

      {/* 属性 */}
      <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
        <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 whitespace-nowrap">属性</label>
        <input
          type="text"
          value={formData.attribute}
          onChange={(e) => onChange('attribute', e.target.value)}
          className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888]"
          placeholder="タップで入力"
        />
      </div>
    </>
  );
};

export default BasicInfoSection;