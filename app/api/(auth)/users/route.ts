import { NextResponse } from "next/server";
import connect from "../../../../lib/db";
import User from "../../../../lib/models/users";
import { Types } from "mongoose";
const ObjectId = require("mongoose").Types.ObjectId;
export const GET = async () => {
  try {
    await connect();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error in fetching users : " + error.message, {
      status: 500
    });
  }
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    await connect();
    const newUser = new User(body);
    await newUser.save();
    return new NextResponse(
      JSON.stringify({ message: "user is created", user: newUser }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in creating user : " + error.message, {
      status: 500
    });
  }
};

export const PATCH = async (req: Request) => {
  try {
    const body = await req.json();
    const { userId, newUsername } = body;

    await connect();

    if (!userId || !newUsername) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid request: missing userId or newUsername"
        }),
        {
          status: 400
        }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid userId"
        }),
        {
          status: 400
        }
      );
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: { username: newUsername } },
      { new: true }
    );

    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({ message: "user is not found" }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "user is updated", user: updatedUser }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error updating user : " + error.message, {
      status: 500
    });
  }
};

export const DELETE = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid request: userId is not found"
        }),
        {
          status: 400
        }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid userId"
        }),
        {
          status: 500
        }
      );
    }

    await connect();
    const deletedUser = await User.findByIdAndDelete(
      new Types.ObjectId(userId)
    );

    return new NextResponse(
      JSON.stringify({
        message: "user is deleted successfully",
        user: deletedUser
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error deleting user : " + error.message, {
      status: 500
    });
  }
};
