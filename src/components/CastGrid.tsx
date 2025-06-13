// CastGrid.tsx
import React from 'react'

interface Cast {
  id: string
  photo_url?: string | null
}

interface CastGridProps {
  casts: Cast[]
}

const CastGrid: React.FC<CastGridProps> = ({ casts }) => {
  return (
    <div className="p-4 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4 pb-16">
      {casts.map((cast) => (
        <div
          key={cast.id}
          className="w-full aspect-square overflow-hidden rounded-full bg-gray-200 shadow"
        >
          {cast.photo_url ? (
            <img
              src={cast.photo_url}
              alt="cast"
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              No Image
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default CastGrid
