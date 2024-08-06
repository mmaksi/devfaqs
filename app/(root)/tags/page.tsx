import Filter from '@/components/shared/Filter';
import NoResult from '@/components/shared/NoResult';
import LocalSearchbar from '@/components/shared/search/LocalSearchbar';
import { TagFilters } from '@/constants/filters';
import Link from 'next/link';
import { SearchParamsProps } from '@/types';
import type { Metadata } from 'next';
import { getAllTags } from '@/lib/actions/tags.action';

export const metadata: Metadata = {
  title: 'Tags | DevOverFlow',
};

const Page = async ({ searchParams }: SearchParamsProps) => {
  const results = await getAllTags({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });
  return (
    <>
      <h1 className='h1-bold text-dark100_light900'>All Tags</h1>
      <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
        <LocalSearchbar
          route='/tags'
          iconPosition='left'
          imgSrc='/assets/icons/search.svg'
          placeholder='Search by tag name...'
          otherClasses='flex-1'
        />
        <Filter
          filters={TagFilters}
          otherClasses='min-h-[56px] sm:min-w-[170px]'
        />
      </div>

      <section className='mt-12 flex flex-wrap gap-4'>
        {results.tags.length > 0 ? (
          results.tags.map((tag) => (
            <Link href={`tags/${tag._id}`} key={tag._id}>
              <article className='background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]'>
                <div className='background-light800_dark400 w-fit rounded-sm px-5 py-1.5 '>
                  <p className='paragraph-semibold text-dark300_light900'>
                    {tag.name}
                  </p>
                </div>
                <p className='small-medium text-dark400_light500 mt-3.5 '>
                  <span className='body-semibold primary-text-gradient mr-2.5'>
                    {tag.questions.length}
                  </span>{' '}
                  {tag.questions.length > 1
                    ? '+Questions'
                    : 'Question'}
                </p>
              </article>
            </Link>
          ))
        ) : (
          <NoResult
            title='No Tags found.'
            description='It looks like there are no tags found'
            link='/ask-question'
            linkTitle='Ask a question'
          />
        )}
      </section>
    </>
  );
};

export default Page;
