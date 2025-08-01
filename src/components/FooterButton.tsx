// src/components/FooterButton.tsx
import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  to: string;
  icon: string;
  label: string;
  disabled?: boolean;
};

export const FooterButton: React.FC<Props> = ({ to, icon, label, disabled }) => {
  if (disabled) {
    return (
      <div className="flex flex-col items-center justify-center text-[10px] text-gray-700 opacity-50 cursor-not-allowed">
        <img src={icon} alt="" className="w-8 h-8 mb-2" />
        <span>{label}</span>
      </div>
    );
  }
  
  return (
    <Link
      to={to}
      className="flex flex-col items-center justify-center text-[10px] text-gray-700 hover:text-pink-600"
    >
      <img src={icon} alt="" className="w-8 h-8 mb-2" />
      <span>{label}</span>
    </Link>
  );
};
