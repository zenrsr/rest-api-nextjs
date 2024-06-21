import { Types } from "mongoose";
import { NextResponse } from "next/server";
import connect from "../../../../../lib/db";
import User from "../../../../../lib/models/users";
import category from "../../../../../lib/models/category";
import blog from "../../../../../lib/models/blogs";

export const GET = async (req: Request, context: { params: any }) => {
  const blogId = context.params.blog;
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    if (
      !userId ||
      !categoryId ||
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(categoryId)
    ) {
      return new NextResponse("Invalid userId or categoryId", {
        status: 400
      });
    }

    if (!blogId) {
      return new NextResponse("Invalid blogId", {
        status: 400
      });
    }

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse("User not found", {
        status: 404
      });
    }

    const userCategory = await category.findById(categoryId);

    if (!userCategory) {
      return new NextResponse("Category not found", {
        status: 404
      });
    }

    const presentBlog = await blog.findOne({
      _id: blogId,
      userId: userId,
      categoryId: categoryId
    });

    if (!presentBlog) {
      return new NextResponse("Blog not found", {
        status: 404
      });
    }

    return new NextResponse(
      "blog has been successfully fetched" + JSON.stringify({ presentBlog }),
      {
        status: 200
      }
    );
  } catch (error: any) {
    return new NextResponse("error updating blog" + error.message, {
      status: 500
    });
  }
};

export const PATCH = async (req: Request, context: { params: any }) => {
  const blogId = context.params.blog;
  const { title, description } = await req.json();
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!blogId) {
      return new NextResponse("Invalid blogId", {
        status: 400
      });
    }

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse("Invalid userId", {
        status: 400
      });
    }

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse("User not found", {
        status: 404
      });
    }

    const fetchedBlog = await blog.findOne({
      _id: blogId,
      userId: userId
    });

    if (!fetchedBlog) {
      return new NextResponse("Blog not found", {
        status: 404
      });
    }

    const updatedBlog = await blog.findByIdAndUpdate(
      blogId,
      {
        title,
        description
      },
      {
        new: true
      }
    );

    return new NextResponse(
      "blog has been successfully updated : \n" +
        JSON.stringify({ updatedBlog }),
      {
        status: 200
      }
    );
  } catch (error: any) {
    return new NextResponse("error updating blog" + error.message, {
      status: 500
    });
  }
};

export const DELETE = async (req: Request, context: { params: any }) => {
  const blogId = context.params.blog;
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!blogId) {
      return new NextResponse("Invalid blogId", {
        status: 400
      });
    }
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse("Invalid userId", {
        status: 400
      });
    }

    await connect();
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse("User not found", {
        status: 404
      });
    }

    const deletedBlog = await blog.findByIdAndDelete(blogId);

    if (!deletedBlog) {
      return new NextResponse("Blog not found", {
        status: 404
      });
    }

    return new NextResponse(
      "blog has been successfully deleted: \n" +
        JSON.stringify({ deletedBlog }),
      {
        status: 200
      }
    );
  } catch (error: any) {
    return new NextResponse("error deleting blog" + error.message, {
      status: 500
    });
  }
};
