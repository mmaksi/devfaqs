import Filter from '@/components/shared/Filter';
import NoResult from '@/components/shared/NoResult';
import QuestionCard from '@/components/cards/QuestionCard';
import LocalSearch from '@/components/shared/search/LocalSearch';

import { QuestionFilters } from '@/constants/filters';

import { SearchParamsProps } from '@/types';

import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { getSavedQuestions } from '@/lib/actions/user.action';

export const metadata: Metadata = {
  title: 'Saved Questions | DevOverFlow',
};

export default async function Home({ searchParams }: SearchParamsProps) {
  const { userId } = auth();

  if (!userId) return null;

  const result = await getSavedQuestions({
    clerkId: userId,
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      <h1 className='h1-bold text-dark100_light900'>Saved Questions</h1>

      <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
        <LocalSearch
          route='/collection'
          iconPosition='left'
          imgSrc='/assets/icons/search.svg'
          placeholder='Search for questions...'
          otherClasses='flex-1'
        />
        <Filter filters={QuestionFilters} otherClasses='min-h-[56px] sm:min-w-[170px]' />
      </div>

      <div className='mt-10 flex w-full flex-col gap-6'>
        {result.questions.length > 0 ? (
          result.questions.map((question: any) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title='There are no saved questions to show.'
            description='Be the first to break the silence, 🚀 Ask a question and kickstart the discussion. Our Query could be the next big thing others learn from. Get invloved! 💡'
            link='/ask-question'
            linkTitle='Ask a Question'
          />
        )}
      </div>
    </>
  );
}
