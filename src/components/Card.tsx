// src/components/Card.tsx
import React, { ReactNode } from 'react';

interface CardProps {
  header: ReactNode;
  children: ReactNode;
  onClick?: () => void;
}

export default function Card({ header, children, onClick }: CardProps) {
  return (
    <div
      className="border rounded shadow-sm overflow-hidden flex flex-col cursor-pointer"
      onClick={onClick}
    >
      <div className="bg-gray-200 px-2 py-1 flex items-baseline justify-between">
        {header}
      </div>
      <div className="p-2 flex-grow">
        {children}
      </div>
    </div>
  );
}
