'use server';

import Question from '@/database/question.model';
import { connectToDB } from '../mongoose';
import Tag from '@/database/tag.model';
import { revalidatePath } from 'next/cache';

export async function createQuestion(params: any) {
  try {
    await connectToDB();
    const { title, content, tags, author, path } = params;
    // Create a question

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

      await Question.findByIdAndUpdate(question._id, {
        $push: { tags: { $each: tagDocuments } },
      });

      // Create an interaction record for the user's ask_question action

      // Increment author's reputation by +5 for creating a question

      revalidatePath(path);
    }
  } catch (error) {}
}
// N52xcZ40xgKAGPYL
