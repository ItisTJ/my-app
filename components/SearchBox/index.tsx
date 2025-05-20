import { useRouter } from 'next/router';
import React, { FormEvent, useState, useRef, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBox = () => {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle clicks outside the search box to collapse on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search submission
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (keyword.trim().length > 0) {
      router.push(`/search/${encodeURIComponent(keyword.trim())}`);
      setKeyword('');
      setIsExpanded(false);
    }
  };

  // Toggle search on mobile
  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
    // Focus the input when expanding
    if (!isExpanded) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  // Clear search input
  const clearSearch = () => {
    setKeyword('');
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className="relative">
      {/* Mobile Search Icon */}
      <button
        type="button"
        onClick={toggleSearch}
        className="md:hidden flex items-center w-10 h-10 text-white focus:outline-none"
        aria-label="Toggle search"
      >
        <FaSearch className="h-5 w-5" />
      </button>

      {/* Desktop Search Bar (always visible) and Mobile Search Bar (conditionally visible) */}
      <div 
        className={`${
          isExpanded ? 'flex' : 'hidden md:flex'
        } absolute md:relative top-12 md:top-0 right-0 w-full md:w-auto z-10`}
      >
        <form 
          onSubmit={submitHandler} 
          className="w-full md:w-56 lg:w-64"
        >
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              name="q"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search Products..."
              className="w-full pl-10 pr-8 py-2 rounded-full text-sm text-black h-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-600 shadow-md md:shadow-none"
              aria-label="Search products"
            />
            
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <FaSearch className="h-4 w-4" />
            </span>
            
            {/* Clear button - show only when text exists */}
            {keyword && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          <button type="submit" className="sr-only">Search</button>
        </form>
      </div>
    </div>
  );
};

export default SearchBox;