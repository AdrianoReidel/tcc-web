import React from 'react';
import Image from 'next/image';
import { navigationOptions, NavigationOption } from '@/data/navigationOptions';

interface NavigationButtonsProps {
  selected: string;
  onSelect: (option: string) => void;
  options?: NavigationOption[];
}

const orangeFilter = 'invert(36%) sepia(97%) saturate(5076%) hue-rotate(12deg) brightness(96%) contrast(104%)';

const NavigationButtons: React.FC<NavigationButtonsProps> = React.memo(({ selected, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mt-14">
      {navigationOptions.map((option: NavigationOption) => {
        const isSelected = selected === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={`flex items-center gap-3 bg-white/10 px-5 py-3 rounded-[999px] border transition-colors ${
              isSelected ? 'border-white' : 'border-transparent'
            }`}
          >
            {option.icon && (
              <Image
                src={option.icon}
                alt={option.label}
                width={20}
                height={20}
                style={{
                  filter: isSelected ? orangeFilter : 'none',
                }}
              />
            )}
            <span className="text-sm text-white">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
});

NavigationButtons.displayName = 'NavigationButtons';

export default NavigationButtons;
