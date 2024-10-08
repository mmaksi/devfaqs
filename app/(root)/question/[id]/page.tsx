import Link from 'next/link';
import { SearchParams } from '../../../../lib/actions/types';
import Image from 'next/image';
import { getQuestionById } from '@/lib/actions/question.action';
import Metric from '@/components/shared/Metric';
import { getTimestamp, formatAndDivideNumber } from '@/lib/utils';
import ParseHTML from '@/components/shared/ParseHTML';
import RenderTag from '@/components/shared/RenderTag';
import Answer from '@/components/forms/Answer';
import { auth } from '@clerk/nextjs/server';
import { getUserById } from '@/lib/actions/user.action';
import AllAnswers from '@/components/shared/AllAnswers';
import Votes from '@/components/shared/Votes';

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: SearchParams;
}) {
  const result = await getQuestionById({ questionId: params.id });
  const { userId: clerkId } = auth();

  let mongoUser;

  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId });
  }

  return (
    <>
      <div className='flex-start w-full flex-col'>
        <div className='flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
          <Link
            href={`/profile/${result.author.clerkId}`}
            className='flex items-center justify-start gap-1'
          >
            <Image
              className='rounded-full'
              src={result.author.picture}
              alt='user profile picture'
              width={22}
              height={22}
            />
            <p className='paragraph-semibold text-dark300_light700'>
              {result.author.name}
            </p>
          </Link>
          <div className='flex justify-end max-sm:justify-start'>
            <Votes
              type='Question'
              itemId={result._id.toString()}
              userId={mongoUser._id.toString()}
              upvotes={result.upvotes.length}
              hasupVoted={result.upvotes.includes(mongoUser._id)}
              downvotes={result.downvotes.length}
              hasdownVoted={result.downvotes.includes(mongoUser._id)}
              hasSaved={mongoUser?.saved.includes(result._id)}
            />
          </div>
        </div>

        <h2 className='h2-semibold text-dark200_light900 mt-3.5 w-full text-left'>
          {result.title}
        </h2>

        <div className='mb-8 mt-5 flex w-full flex-wrap gap-4'>
          <Metric
            imgUrl='/assets/icons/clock.svg'
            alt='Clock icon'
            value={` asked ${getTimestamp(result.createdAt)}`}
            title=' Asked'
            textStyles='small-medium text-dark400_light800'
          />
          <Metric
            imgUrl='/assets/icons/message.svg'
            alt='message'
            value={formatAndDivideNumber(result.answers.length)}
            title=' Answers'
            textStyles='small-medium text-dark400_light800'
          />
          <Metric
            imgUrl='/assets/icons/eye.svg'
            alt='eye'
            value={formatAndDivideNumber(result.views)}
            title=' Views'
            textStyles='small-medium text-dark400_light800'
          />
        </div>

        <ParseHTML data={result.content} />

        <div
          className={`${result.content.length > 0 ? 'mt-8' : ''} flex w-full flex-wrap gap-2`}
        >
          {result.tags.map((tag: any) => (
            <RenderTag key={tag.id} _id={tag._id} name={tag.name} showCount={false} />
          ))}
        </div>

        <AllAnswers
          questionId={result._id}
          userId={mongoUser._id.toString()}
          totalAnswers={result.answers.length}
        />

        <Answer
          question={result.content}
          questionId={result._id.toString()}
          authorId={mongoUser._id.toString()}
        />
      </div>
    </>
  );
}
