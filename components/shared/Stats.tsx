import Image from 'next/image';

import { BadgeCounts } from '@/types';

import { formatNumber } from '@/lib/utils';

interface Props {
  totalQuestions: number;
  totalAnswers: number;
  badgeCounts: BadgeCounts;
  reputation: number;
}

interface StatsCardProps {
  imgUrl: string;
  value: number;
  title: string;
}

const StatsCard = ({ imgUrl, value, title }: StatsCardProps) => {
  return (
    <div className='light-border background-light900_dark300 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200  '>
      <Image src={imgUrl} alt={title} width={40} height={50} />
      <div>
        <p className='paragraph-semibold text-dark200_light900'>{value}</p>
        <p className='body-medium text-dark400_light700'>{title}</p>
      </div>
    </div>
  );
};

const Stats = ({ totalQuestions, totalAnswers, badgeCounts, reputation }: Props) => {
  return (
    <div className='mt-10'>
      <h4 className='h3-semibold text-dark200_light900'>Stats - {reputation} </h4>
      <div className='mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4 xl:grid-cols-4'>
        <div className='light-border background-light900_dark300 flex items-center justify-center gap-5 rounded-md border px-4 py-6 text-sm shadow-light-300 dark:shadow-dark-200 max-lg:flex-col max-sm:flex-row lg:flex-row'>
          <div className='flex items-center gap-[6px]'>
            <p className='paragraph-semibold text-dark200_light900'>
              {formatNumber(totalQuestions)}
            </p>
            <p className='body-medium text-dark400_light700'>Ques</p>
          </div>
          <div className='flex items-center gap-[6px]'>
            <p className='paragraph-semibold text-dark200_light900'>
              {formatNumber(totalAnswers)}
            </p>
            <p className='body-medium text-dark400_light700'>Ans</p>
          </div>
        </div>

        {/* <StatsCard
          imgUrl='/assets/icons/gold-medal.svg'
          value={badgeCounts.GOLD}
          title='Gold Badges'
        />
        <StatsCard
          imgUrl='/assets/icons/silver-medal.svg'
          value={badgeCounts.SILVER}
          title='Silver Badges'
        />
        <StatsCard
          imgUrl='/assets/icons/bronze-medal.svg'
          value={badgeCounts.BRONZE}
          title='Bronze Badges'
        /> */}
      </div>
    </div>
  );
};

export default Stats;
