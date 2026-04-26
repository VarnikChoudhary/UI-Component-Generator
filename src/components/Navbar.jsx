import React from 'react';
import { HiSun, HiMoon } from 'react-icons/hi';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="nav flex items-center justify-between h-[90px] px-6 lg:px-[100px] border-b-[1px] border-zinc-200 dark:border-zinc-900 transition-colors duration-300">
      <div className='logo'>
        <h3 className="text-[25px] font-[700] sp-text">
        GenUI
      </h3>
      </div>
      <div className='icons flex items-center gap-[15px] h-[70px]'>
          <div className='icon' onClick={toggleTheme}>
            {theme === 'dark' ? <HiSun /> : <HiMoon />}
          </div>
      </div>
    </nav>
  );
};

export default Navbar;
