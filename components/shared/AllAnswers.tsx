import React from 'react';
import Filter from './Filter';
import { AnswerFilters } from '@/constants/filters';
import { getAnswers } from '@/lib/actions/answer.action';
import Link from 'next/link';
import Image from 'next/image';
import { getTimestamp } from '@/lib/utils';
import ParseHTML from './ParseHTML';
import Votes from './Votes';

interface Props {
  questionId: string;
  userId: string;
  totalAnswers: string;
  page?: number;
  filter?: number;
}

const AllAnswers = async ({ questionId, userId, totalAnswers, page, filter }: Props) => {
  const answers = await getAnswers({
    questionId,
  });

  return (
    <div className='mt-11 w-full'>
      <div className='flex items-center justify-between'>
        <h3 className='primary-text-gradient'>{totalAnswers} Answers</h3>
        <Filter filters={AnswerFilters} />
      </div>

      <div>
        {answers &&
          answers.map((answer) => (
            <article key={answer._id} className='pb-2 pt-8'>
              <div className='mb-2 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
                <Link
                  href={`/profile/${answer.author.clerkId}`}
                  className='flex flex-1 items-start gap-1 sm:items-center'
                >
                  <Image
                    src={answer.author.picture}
                    width={18}
                    height={18}
                    alt='profile'
                    className='rounded-full object-cover max-sm:mt-0.5'
                  />
                  <div className='flex flex-col gap-1 sm:flex-row sm:items-center'>
                    <p className='body-semibold text-dark300_light700'>
                      {answer.author.name}
                    </p>
                    <p className='small-regular text-light400_light500 ml-0.5 mt-0.5 line-clamp-1'>
                      • answered {getTimestamp(answer.createdAt)}
                    </p>
                  </div>
                </Link>
                <div className='flex justify-end'>
                  <Votes />
                </div>
              </div>
              <ParseHTML data={answer.content} />
            </article>
          ))}
      </div>
    </div>
  );
};

export default AllAnswers;
