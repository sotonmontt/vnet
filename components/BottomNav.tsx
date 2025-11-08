
import React from 'react';
import type { Screen } from '../types';
import { HomeIcon, SettingsIcon } from '../constants';

interface BottomNavProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon: Icon, isActive, onClick }) => {
  const activeClasses = 'text-cyan-400';
  const inactiveClasses = 'text-gray-400 hover:text-white';
  
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
    >
      <Icon className="h-6 w-6 mb-1" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};


const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, onNavigate }) => {
  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700 shadow-lg">
      <div className="container mx-auto max-w-lg flex justify-around">
        <NavItem 
          label="Home" 
          icon={HomeIcon} 
          isActive={activeScreen === 'home'} 
          onClick={() => onNavigate('home')} 
        />
        <NavItem 
          label="Settings" 
          icon={SettingsIcon} 
          isActive={activeScreen === 'settings'} 
          onClick={() => onNavigate('settings')} 
        />
      </div>
    </nav>
  );
};

export default BottomNav;
