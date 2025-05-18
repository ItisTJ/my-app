import { useRouter } from 'next/router';
import React, { FormEvent, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBox = () => {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (keyword.length > 0) {
      router.push(`/search/${keyword.trim()}`);
    }
  };

  return (
    <form onSubmit={submitHandler} className="relative w-46 max-w-sm">
      <input
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search Products..."
        className="w-full pl-10 pr-4 py-2 rounded-full text-black h-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-600"
      />
      <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
        <FaSearch />
      </button>
    </form>
  );
};

export default SearchBox;
