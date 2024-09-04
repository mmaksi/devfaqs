'use server';

import User from '@/database/user.model';
import { connectToDB } from '../mongoose';
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from './types';
import { revalidatePath } from 'next/cache';
import Question from '@/database/question.model';
import Tag from '@/database/tag.model';
import { FilterQuery } from 'mongoose';

export async function getUserById(params: any) {
  try {
    connectToDB();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDB();
    // const { filter, page, pageSize, searchQuery } = params;
    const users = await User.find({}).sort({ createdAt: -1 });
    return { users };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDB();
    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDB();
    const { clerkId, updateData, path } = params;
    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDB();
    const { clerkId } = params;
    const user = await User.findOneAndDelete({ clerkId });
    if (!user) throw new Error('User not found');
    // Delete user questions
    // eslint-disable-next-line no-unused-vars
    const userQuestionIds = await Question.find({
      author: user._id,
    }).distinct('_id');
    await Question.deleteMany({ author: user._id });
    // TODO delete answers, comments, etc
    const deletedUser = await User.findByIdAndDelete(user._id);
    return deletedUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDB();

    const { userId, questionId, path } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const isQuestionSaved: boolean = user.saved.includes(questionId);

    if (isQuestionSaved) {
      await User.findByIdAndUpdate(
        userId,
        {
          $pull: { saved: questionId },
        },
        { new: true }
      );
    } else {
      // add to saved
      await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: { saved: questionId },
        },
        { new: true }
      );
    }
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    connectToDB();

    const { clerkId, searchQuery, filter, page = 1, pageSize = 20 } = params;

    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, 'i') } }
      : {};

    let sortOptions = {};

    switch (filter) {
      case 'most_viewed':
        sortOptions = { views: -1 };
        break;
      case 'most_voted':
        sortOptions = { upvotes: -1 };
        break;
      case 'most_answered':
        sortOptions = { answers: -1 };
        break;
      case 'most_recent':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      default:
        break;
    }

    const user = await User.findOne({ clerkId }).populate({
      path: 'saved',
      match: query,
      options: {
        sort: sortOptions,
        skip: skipAmount,
        limit: pageSize + 1,
      },
      populate: [
        {
          path: 'tags',
          model: Tag,
          select: '_id name',
        },
        {
          path: 'author',
          model: User,
        },
      ],
    });

    const isNext = user.saved.length > pageSize;

    if (!user) {
      throw new Error('User not found');
    }

    const savedQuestions = user.saved;

    return { questions: savedQuestions, isNext };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
