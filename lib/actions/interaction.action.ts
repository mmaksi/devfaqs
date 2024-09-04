'use server';

import Question from '@/database/question.model';
import Interaction from '@/database/interaction.model';

import { connectToDB } from '../mongoose';

import { ViewQuestionParams } from './types';

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    await connectToDB();

    const { questionId, userId } = params;

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: 'view',
        question: questionId,
      });

      if (existingInteraction) return;

      // update view count
      await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

      // create interaction
      await Interaction.create({
        user: userId,
        action: 'view',
        question: questionId,
      });
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
