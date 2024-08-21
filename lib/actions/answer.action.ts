'use server';

import { revalidatePath } from 'next/cache';
import { connectToDB } from '../mongoose';
import { CreateAnswerParams, GetAnswersParams } from './types';
import Question from '@/database/question.model';
import Answer from '@/database/answer.model';

export async function createAnswer(params: CreateAnswerParams) {
  try {
    await connectToDB();
    const { content, author, question, path } = params;
    const newAnswer = await Answer.create({ content, author, question });

    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    // TODO: add interaction
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    connectToDB();
    const { questionId } = params;

    const answers = await Answer.find({ question: questionId })
      .populate('author', '_id clerkId name picture')
      .sort({ createdAt: -1 });

    return answers;
  } catch (error) {}
}
