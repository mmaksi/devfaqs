'use server';

import Question from '@/database/question.model';
import { connectToDB } from '../mongoose';
import Tag from '@/database/tag.model';
import { revalidatePath } from 'next/cache';
import { CreateQuestionParams, GetQuestionByIdParams, GetQuestionsParams } from './types';
import User from '@/database/user.model';

export async function createQuestion(params: CreateQuestionParams) {
  try {
    await connectToDB();
    const { title, content, tags, author, path } = params;

    const question = await Question.create({
      title,
      content,
      author,
    });
    const tagDocuments = [];

    // Create the tags or get them if they already exist
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, 'i') } },
        {
          $setOnInsert: { name: tag },
          $push: { questions: question._id },
        },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    revalidatePath(path);
  } catch (error) {
    console.error(error);
  }
}

// create a getQuestions function to get all the questions from the database using the Question model
export async function getQuestions(params: GetQuestionsParams) {
  try {
    await connectToDB();
    const questions = await Question.find()
      .populate({
        path: 'tags',
        model: Tag,
      })
      .populate({
        path: 'author',
        model: User,
      })
      .sort({ createdAt: -1 });
    return questions;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    connectToDB();
    const { questionId } = params;
    const question = await Question.findById(questionId)
      .populate({ path: 'tags', model: Tag, select: '_id name' })
      .populate({
        path: 'author',
        model: User,
        select: '_id clerkId name picture',
      });
    return question;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
