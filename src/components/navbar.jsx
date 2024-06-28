import React, { useState, useEffect } from 'react';

function Navbar() {
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark' || false);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className="flex md:flex-col justify-between bg-gray-300 dark:bg-gray-800 text-gray-800 dark:text-white md:h-screen w-full md:w-16 fixed md:left-0 md:top-0 top-0 left-0 z-10">
            <div className="flex items-center justify-center md:h-16 h-12 w-16 bg-purple-600">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4H3V3a2 2 0 012-2h4v2H5zm4 18H5a2 2 0 01-2-2v-4h2v4h4v2zM19 3v2h-4V3h4a2 2 0 012 2v4h-2V5h-4V3h4zm-4 18v-2h4v-4h2v4a2 2 0 01-2 2h-4z" />
                </svg>
            </div>

            <div className="flex items-center justify-center md:h-16 h-12 w-16">
                <label className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input
                            type="checkbox"
                            className="sr-only"
                            checked={isDarkMode}
                            onChange={toggleDarkMode}
                        />
                        <div className="block bg-gray-800 dark:bg-gray-300 w-14 h-8 rounded-full" />
                        <div className={`dot absolute top-1 w-6 h-6 rounded-full transition-transform duration-300 ${isDarkMode ? 'bg-gray-800 translate-x-6' : 'bg-gray-100 translate-x-1'}`} />
                    </div>
                </label>
            </div>
        </div>
    );
}

export default Navbar;
