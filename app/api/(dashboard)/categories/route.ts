import { NextResponse } from "next/server";
import connect from "../../../../lib/db";
import User from "../../../../lib/models/users";
import { Types } from "mongoose";
import category from "../../../../lib/models/category";

export const GET = async (req: Request) => {
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

    await connect();
    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid request: user is not found"
        }),
        {
          status: 400
        }
      );
    }

    const categories = await category.find({ userId: userId });
    // const categories = await category.find({
    //   userId: new Types.ObjectId(userId)
    // });

    return new NextResponse(JSON.stringify(categories), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error in fetching categories : " + error.message, {
      status: 500
    });
  }
};

export const POST = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const { title } = await req.json();

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

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid request: user is not found"
        }),
        {
          status: 400
        }
      );
    }

    const newCategory = new category({
      title,
      userId: userId
    });

    // const newCategory = new category({
    //   title,
    //   userId: new Types.ObjectId(userId)
    // });

    await newCategory.save();

    return new NextResponse(
      JSON.stringify({
        message: "category is created successfully",
        newCategory: newCategory
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in creating user : " + error.message, {
      status: 500
    });
  }
};
