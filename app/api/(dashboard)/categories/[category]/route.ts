import { NextResponse } from "next/server";
import connect from "../../../../../lib/db";
import { Types } from "mongoose";
import User from "../../../../../lib/models/users";
import category from "../../../../../lib/models/category";

export const PATCH = async (req: Request, context: { params: any }) => {
  const categoryId = context.params.category;
  try {
    const body = await req.json();
    const { title } = body;

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid request: userId is not found"
        }),
        {
          status: 400
        }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid request: categoryId is not found"
        }),
        {
          status: 400
        }
      );
    }

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid request: user is not found in database"
        }),
        {
          status: 400
        }
      );
    }

    const category_id = await category.findOne({
      _id: categoryId,
      userId: userId
    });

    if (!category_id) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid request: category is not found in database"
        }),
        {
          status: 400
        }
      );
    }

    const updatedCategory = await category.findByIdAndUpdate(
      categoryId,
      { title },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({
        message: "category is updated successfully",
        category: updatedCategory
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in updating categories : " + error.message, {
      status: 500
    });
  }
};

export const DELETE = async (req: Request, context: { params: any }) => {
  const categoryId = context.params.category;
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid request: userId is not found"
        }),
        {
          status: 400
        }
      );
    }
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid request: categoryId is not found"
        }),
        {
          status: 400
        }
      );
    }
    await connect();
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid request: user is not found in database"
        }),
        {
          status: 400
        }
      );
    }

    const category_id = await category.findOne({
      _id: categoryId,
      userId: userId
    });

    if (!category_id) {
      return new NextResponse(
        JSON.stringify({
          message:
            "Invalid request: category is not found or does not belong to user"
        }),
        {
          status: 400
        }
      );
    }

    const deletedCategory = await category.findByIdAndDelete(categoryId);

    return new NextResponse(
      JSON.stringify({
        message: "category is deleted successfully",
        category: deletedCategory
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in deleting categories : " + error.message, {
      status: 500
    });
  }
};
