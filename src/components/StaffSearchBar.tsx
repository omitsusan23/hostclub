import React, { useState } from 'react';

interface StaffSearchBarProps {
  onSearchChange?: (query: string) => void;
}

const StaffSearchBar: React.FC<StaffSearchBarProps> = ({ onSearchChange }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search submission if needed
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="w-full h-[31px] bg-[#d7d7d7] rounded-lg overflow-hidden flex items-center"
        role="search"
      >
        <div className="inline-flex items-center gap-2.5 relative top-1 left-2">
          <label htmlFor="search-input" className="sr-only">
            検索
          </label>
          <div className="relative w-[22px] h-[22px]">
            <svg 
              className="absolute w-[21px] h-[21px] top-0 left-0" 
              fill="none" 
              stroke="#525154" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" 
              />
            </svg>
          </div>

          <div className="relative w-fit [font-family:'Inter-Bold',Helvetica] font-bold text-[#525154] text-[15px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
            検索
          </div>
        </div>
        <input
          id="search-input"
          type="search"
          value={searchQuery}
          onChange={handleSearchChange}
          className="flex-1 h-full ml-2 mr-2 bg-transparent text-[#525154] text-[15px] outline-none [font-family:'Inter-Regular',Helvetica]"
          placeholder=""
          aria-label="Search input"
        />
      </form>
    </div>
  );
};

export default StaffSearchBar;