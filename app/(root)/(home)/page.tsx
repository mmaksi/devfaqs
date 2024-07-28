'use client';

import Link from 'next/link';

const Home = () => {
  return (
    <div className='flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-center'>
      <h1 className='h1-bold text-dark100_light900'>All Questions</h1>

      <Link
        href='/ask-question'
        className='flex justify-start max-sm:w-full'
      >
        <button className='primary-gradient paragraph-regular rounded-lg px-4 py-3  !text-light-900'>
          Ask a question
        </button>
      </Link>
    </div>
  );
};

export default Home;
