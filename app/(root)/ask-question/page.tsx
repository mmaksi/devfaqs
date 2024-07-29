import { Questions } from '@/components/forms/Questions';
import { redirect } from 'next/navigation';
import React from 'react';

const Page = async () => {
  // const { userId } = auth();

  const userId = '123456789';
  if (!userId) redirect('/sign-in');

  // const mongoUser = await getUserById({ userId });

  return (
    <div>
      <h1 className='h1-bold text-dark100_light900'>
        Ask a question
      </h1>
      <div className='mt-9'>
        <Questions />
      </div>
    </div>
  );
};

export default Page;
