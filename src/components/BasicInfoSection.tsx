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
      <div className="bg-gray-800 rounded-lg border border-gray-700 px-4 py-3">
        <label className="text-gray-400 text-sm block mb-1">名前</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="タップで入力"
          className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none"
        />
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 px-4 py-3">
        <label className="text-gray-400 text-sm block mb-1">入店予定時間</label>
        <input
          type="text"
          value={formData.lineName}
          onChange={(e) => onChange('lineName', e.target.value)}
          placeholder="タップで入力"
          className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none"
        />
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 px-4 py-3">
        <label className="text-gray-400 text-sm block mb-1">ブラン</label>
        <input
          type="text"
          value={formData.attribute}
          onChange={(e) => onChange('attribute', e.target.value)}
          placeholder="タップで入力"
          className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none"
        />
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 px-4 py-3">
        <label className="text-gray-400 text-sm block mb-1">予算/単価</label>
        <input
          type="text"
          placeholder="タップで入力"
          className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none"
        />
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 px-4 py-3">
        <label className="text-gray-400 text-sm block mb-1">希望卓</label>
        <input
          type="text"
          placeholder="タップで入力"
          className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none"
        />
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 px-4 py-3">
        <label className="text-gray-400 text-sm block mb-1">希望ヘルプ</label>
        <input
          type="text"
          placeholder="タップで入力"
          className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none"
        />
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 px-4 py-3">
        <label className="text-gray-400 text-sm block mb-1">飾り・キープ</label>
        <textarea
          placeholder="タップで入力"
          className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none"
          rows={3}
        />
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 px-4 py-3">
        <label className="text-gray-400 text-sm block mb-1">備考</label>
        <textarea
          placeholder="タップで入力"
          className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none"
          rows={3}
        />
      </div>
    </div>
  );
};

export default BasicInfoSection;