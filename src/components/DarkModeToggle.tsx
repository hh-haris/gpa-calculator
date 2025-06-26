
import React, { useState, useEffect } from 'react';

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('hs_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('hs_theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('hs_theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-inter text-[#979797] dark:text-gray-400">
        Light
      </span>
      <label htmlFor="darkSwitch" className="relative inline-block w-11 h-6 cursor-pointer">
        <input 
          type="checkbox" 
          id="darkSwitch" 
          className="peer sr-only"
          checked={isDark}
          onChange={toggleTheme}
        />
        <span className="absolute inset-0 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-[#0088CC] dark:bg-neutral-700 dark:peer-checked:bg-[#0088CC] peer-disabled:opacity-50 peer-disabled:pointer-events-none"></span>
        <span className="absolute top-1/2 start-0.5 -translate-y-1/2 size-5 bg-white rounded-full shadow-sm !transition-transform duration-200 ease-in-out peer-checked:translate-x-full dark:bg-neutral-400 dark:peer-checked:bg-white"></span>
      </label>
      <span className="text-sm font-inter text-[#979797] dark:text-gray-400">
        Dark
      </span>
    </div>
  );
};

export default DarkModeToggle;
