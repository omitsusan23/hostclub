// src/components/FooterButton.tsx
import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  to: string;
  icon: string;
  label: string;
};

export const FooterButton: React.FC<Props> = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex flex-col items-center justify-center text-xs text-gray-700 hover:text-pink-600"
  >
    <img src={icon} alt="" className="w-6 h-6 mb-2" />
    <span>{label}</span>
  </Link>
);
