import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { ModalNavigation } from './ModalNavigation';

interface StaffTransitionProps {
  isAnimating: boolean;
  onAnimationComplete: () => void;
  triggerPosition?: { x: number; y: number };
}

export const StaffTransition: React.FC<StaffTransitionProps> = ({ 
  isAnimating, 
  onAnimationComplete,
  triggerPosition = { x: window.innerWidth / 2, y: window.innerHeight - 200 }
}) => {
  const [phase, setPhase] = useState<'checkbox' | 'label-move' | 'content' | 'complete'>('checkbox');
  const [showCheckmark, setShowCheckmark] = useState(false);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAnimating) {
      setPhase('checkbox');
      setShowCheckmark(false);
      return;
    }

    // Start animation sequence
    const sequence = async () => {
      // Phase 1: Show checkbox animation
      await new Promise(resolve => setTimeout(resolve, 50));
      setShowCheckmark(true);
      
      // Phase 2: Move label to top
      await new Promise(resolve => setTimeout(resolve, 300));
      setPhase('label-move');
      
      // Phase 3: Show content
      await new Promise(resolve => setTimeout(resolve, 400));
      setPhase('content');
      
      // Phase 4: Complete
      await new Promise(resolve => setTimeout(resolve, 100));
      setPhase('complete');
      onAnimationComplete();
    };

    sequence();
  }, [isAnimating, onAnimationComplete]);

  if (!isAnimating) return null;

  // Calculate label position based on phase
  const getLabelStyle = () => {
    if (phase === 'checkbox') {
      return {
        position: 'fixed' as const,
        left: '50%',
        top: `${triggerPosition.y}px`,
        transform: 'translateX(-50%)',
        transition: 'none'
      };
    } else if (phase === 'label-move' || phase === 'content' || phase === 'complete') {
      return {
        position: 'fixed' as const,
        left: '50%',
        top: `calc(env(safe-area-inset-top) + 0px)`,
        transform: 'translateX(-50%)',
        transition: 'top 400ms cubic-bezier(0.4, 0, 0.2, 1)'
      };
    }
  };

  return (
    <div className="fixed inset-0 z-[40]">
      {/* Black overlay */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Animated label */}
      <div 
        ref={labelRef}
        className="z-20"
        style={getLabelStyle()}
      >
        <div className="flex items-center text-white">
          <div className="w-6 h-6 border-2 border-white rounded flex items-center justify-center mr-3">
            {showCheckmark && (
              <svg 
                className="w-4 h-4 text-white animate-scale-in" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <span className="text-xl font-bold">スタッフ追加</span>
        </div>
      </div>
      
      {/* Navigation bar with slide-in animation */}
      {(phase === 'content' || phase === 'complete') && (
        <div 
          className="fixed top-[calc(env(safe-area-inset-top)+100px)] left-0 right-0 z-10 animate-slide-down"
        >
          <ModalNavigation onBack={() => {}} onComplete={() => {}} />
        </div>
      )}
      
      {/* Form content with slide-in animation */}
      {(phase === 'content' || phase === 'complete') && (
        <div className="absolute top-[calc(env(safe-area-inset-top)+180px)] bottom-0 left-0 right-0 bg-black overflow-y-auto">
          <div className="flex flex-col w-[361px] items-start gap-4 mx-auto mt-8 mb-8">
            {/* Empty content area */}
          </div>
        </div>
      )}
    </div>
  );
};