// CastGrid.tsx
import React from 'react'

interface Cast {
  id: string
  photo_url?: string | null
  display_name?: string | null
}

interface CastGridProps {
  casts: Cast[]
}

const CastGrid: React.FC<CastGridProps> = ({ casts }) => {
  return (
    <div className="p-4 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4 pb-16 -mt-2">
      {casts.map((cast) => (
        <div key={cast.id} className="flex flex-col items-center">
          <div className="w-full aspect-square overflow-hidden rounded-full bg-gray-200 shadow">
            {cast.photo_url ? (
              <img
                src={cast.photo_url}
                alt={cast.display_name || 'cast'}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                No Image
              </div>
            )}
          </div>
          <span className="mt-1 text-xs text-center text-gray-700 truncate w-full">
            {cast.display_name || '名前なし'}
          </span>
        </div>
      ))}
    </div>
  )
}

export default CastGrid
