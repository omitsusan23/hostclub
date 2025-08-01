import React from 'react';

interface BasicInfoSectionProps {
  formData: {
    name: string;
    lineName: string;
    attribute: string;
    age: string;
    birthYear: string;
    birthDate: string;
    currentResidence: string;
    birthplace: string;
    bloodType: string;
    occupation: string;
    contactTime: string;
    favoriteDrink: string;
    favoriteCigarette: string;
    bottleName: string;
    favoriteHelp: string;
    hobby: string;
    specialty: string;
    holiday: string;
    favoriteBrand: string;
    marriage: string;
    children: string;
    partner: string;
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

      {/* 年齢 */}
      <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
        <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 whitespace-nowrap">年齢</label>
        <input
          type="text"
          value={formData.age}
          onChange={(e) => onChange('age', e.target.value)}
          className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888]"
          placeholder="タップで入力"
        />
      </div>

      {/* 誕生日(年) */}
      <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
        <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 whitespace-nowrap">誕生日(年)</label>
        <input
          type="text"
          value={formData.birthYear}
          onChange={(e) => onChange('birthYear', e.target.value)}
          className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888]"
          placeholder="タップで入力"
        />
      </div>

      {/* 誕生日(月日) */}
      <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
        <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 whitespace-nowrap">誕生日(月日)</label>
        <input
          type="text"
          value={formData.birthDate}
          onChange={(e) => onChange('birthDate', e.target.value)}
          className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888]"
          placeholder="タップで入力"
        />
      </div>

      {/* 現在の居住地 */}
      <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
        <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 whitespace-nowrap">現在の居住地</label>
        <input
          type="text"
          value={formData.currentResidence}
          onChange={(e) => onChange('currentResidence', e.target.value)}
          className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888]"
          placeholder="タップで入力"
        />
      </div>

      {/* 出身地 */}
      <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
        <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 whitespace-nowrap">出身地</label>
        <input
          type="text"
          value={formData.birthplace}
          onChange={(e) => onChange('birthplace', e.target.value)}
          className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888]"
          placeholder="タップで入力"
        />
      </div>

      {/* 血液型 */}
      <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
        <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 whitespace-nowrap">血液型</label>
        <input
          type="text"
          value={formData.bloodType}
          onChange={(e) => onChange('bloodType', e.target.value)}
          className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888]"
          placeholder="タップで入力"
        />
      </div>

      {/* 職業 */}
      <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
        <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 whitespace-nowrap">職業</label>
        <input
          type="text"
          value={formData.occupation}
          onChange={(e) => onChange('occupation', e.target.value)}
          className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888]"
          placeholder="タップで入力"
        />
      </div>

      {/* 連絡可能な時間帯 */}
      <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
        <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 min-w-0 shrink-0 w-[120px]">連絡可能な時間帯</label>
        <input
          type="text"
          value={formData.contactTime}
          onChange={(e) => onChange('contactTime', e.target.value)}
          className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888] min-w-0"
          placeholder="タップで入力"
        />
      </div>

      {/* 好きなお酒 */}
      <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
        <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 whitespace-nowrap">好きなお酒</label>
        <input
          type="text"
          value={formData.favoriteDrink}
          onChange={(e) => onChange('favoriteDrink', e.target.value)}
          className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888]"
          placeholder="タップで入力"
        />
      </div>

      {/* 好きなタバコ */}
      <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
        <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 whitespace-nowrap">好きなタバコ</label>
        <input
          type="text"
          value={formData.favoriteCigarette}
          onChange={(e) => onChange('favoriteCigarette', e.target.value)}
          className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888]"
          placeholder="タップで入力"
        />
      </div>

      {/* ボトルネーム */}
      <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
        <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 whitespace-nowrap">ボトルネーム</label>
        <input
          type="text"
          value={formData.bottleName}
          onChange={(e) => onChange('bottleName', e.target.value)}
          className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888]"
          placeholder="タップで入力"
        />
      </div>

      {/* 好きなヘルプ */}
      <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
        <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 whitespace-nowrap">好きなヘルプ</label>
        <input
          type="text"
          value={formData.favoriteHelp}
          onChange={(e) => onChange('favoriteHelp', e.target.value)}
          className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888]"
          placeholder="タップで入力"
        />
      </div>

      {/* 趣味 */}
      <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
        <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 whitespace-nowrap">趣味</label>
        <input
          type="text"
          value={formData.hobby}
          onChange={(e) => onChange('hobby', e.target.value)}
          className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888]"
          placeholder="タップで入力"
        />
      </div>

      {/* 特技 */}
      <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
        <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 whitespace-nowrap">特技</label>
        <input
          type="text"
          value={formData.specialty}
          onChange={(e) => onChange('specialty', e.target.value)}
          className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888]"
          placeholder="タップで入力"
        />
      </div>

      {/* 休日 */}
      <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
        <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 whitespace-nowrap">休日</label>
        <input
          type="text"
          value={formData.holiday}
          onChange={(e) => onChange('holiday', e.target.value)}
          className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888]"
          placeholder="タップで入力"
        />
      </div>

      {/* 好きなブランド */}
      <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
        <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 min-w-0 shrink-0 w-[100px]">好きなブランド</label>
        <input
          type="text"
          value={formData.favoriteBrand}
          onChange={(e) => onChange('favoriteBrand', e.target.value)}
          className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888] min-w-0"
          placeholder="タップで入力"
        />
      </div>

      {/* 結婚 */}
      <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
        <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 whitespace-nowrap">結婚</label>
        <input
          type="text"
          value={formData.marriage}
          onChange={(e) => onChange('marriage', e.target.value)}
          className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888]"
          placeholder="タップで入力"
        />
      </div>

      {/* 子供 */}
      <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
        <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 whitespace-nowrap">子供</label>
        <input
          type="text"
          value={formData.children}
          onChange={(e) => onChange('children', e.target.value)}
          className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888]"
          placeholder="タップで入力"
        />
      </div>

      {/* 恋人 */}
      <div className="flex items-center self-stretch h-[44px] bg-[#464646] rounded border border-[#d7d7d7]">
        <label className="text-[#d7d7d7] text-[15px] pl-3 pr-2 whitespace-nowrap">恋人</label>
        <input
          type="text"
          value={formData.partner}
          onChange={(e) => onChange('partner', e.target.value)}
          className="flex-1 bg-transparent text-[#d7d7d7] text-[15px] outline-none pr-3 text-right placeholder-[#888]"
          placeholder="タップで入力"
        />
      </div>
    </>
  );
};

export default BasicInfoSection;