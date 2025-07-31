import React, { useEffect, useState } from 'react';

interface NotificationTransitionProps {
  isAnimating: boolean;
  onAnimationComplete: () => void;
  triggerPosition?: { x: number; y: number };
}

export const NotificationTransition: React.FC<NotificationTransitionProps> = ({ 
  isAnimating, 
  onAnimationComplete,
  triggerPosition 
}) => {
  const [checkboxes, setCheckboxes] = useState<Array<{
    id: number;
    x: number;
    y: number;
    delay: number;
    checked: boolean;
  }>>([]);

  useEffect(() => {
    if (isAnimating && triggerPosition) {
      const newCheckboxes = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: triggerPosition.x - 12, // Center the checkbox on trigger position
        y: triggerPosition.y - 12,
        delay: i * 20,
        checked: false
      }));
      setCheckboxes(newCheckboxes);

      // Start animation
      const timeouts: NodeJS.Timeout[] = [];
      newCheckboxes.forEach((checkbox, index) => {
        const timeout = setTimeout(() => {
          setCheckboxes(prev => 
            prev.map(cb => cb.id === checkbox.id ? { ...cb, checked: true } : cb)
          );
        }, checkbox.delay);
        timeouts.push(timeout);
      });

      // Complete animation after all checkboxes are checked
      const completeTimeout = setTimeout(() => {
        onAnimationComplete();
      }, 600);
      timeouts.push(completeTimeout);

      return () => {
        timeouts.forEach(timeout => clearTimeout(timeout));
      };
    }
  }, [isAnimating, onAnimationComplete, triggerPosition]);

  if (!isAnimating) return null;

  return (
    <div className="fixed inset-0 z-[300] pointer-events-none">
      {checkboxes.map((checkbox) => (
        <div
          key={checkbox.id}
          className="absolute animate-checkbox-fly"
          style={{
            left: `${checkbox.x}px`,
            top: `${checkbox.y}px`,
            animationDelay: `${checkbox.delay}ms`
          }}
        >
          <div className="w-6 h-6 border-2 border-white rounded flex items-center justify-center bg-black/80">
            {checkbox.checked && (
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};