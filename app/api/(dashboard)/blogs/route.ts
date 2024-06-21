import { Types } from "mongoose";
import { NextResponse } from "next/server";
import connect from "../../../../lib/db";
import User from "../../../../lib/models/users";
import category from "../../../../lib/models/category";
import blog from "../../../../lib/models/blogs";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    const searchKeywords = searchParams.get("keywords") as string;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (
      !userId ||
      !Types.ObjectId.isValid(userId) ||
      !categoryId ||
      !Types.ObjectId.isValid(categoryId)
    ) {
      return new NextResponse("missing/Invalid userId or categoryId", {
        status: 400
      });
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse("Invalid user", {
        status: 404
      });
    }

    const userCategory = await category.findById(categoryId);

    if (!userCategory) {
      return new NextResponse("Invalid category", {
        status: 404
      });
    }

    const filter: any = {
      userId: new Types.ObjectId(userId),
      categoryId: new Types.ObjectId(categoryId)
    };

    if (searchKeywords) {
      filter.$or = [
        {
          title: { $regex: searchKeywords, $options: "i" }
        },
        { description: { $regex: searchKeywords, $options: "i" } }
      ];
    }

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (startDate) {
      filter.createdAt = {
        $gte: new Date(startDate)
      };
    } else if (endDate) {
      filter.createdAt = {
        $lte: new Date(endDate)
      };
    }

    const skip = (page - 1) * limit;

    const blogs = await blog
      .find(filter)
      .sort({ createdAt: "asc" })
      .skip(skip)
      .limit(limit);

    return new NextResponse(JSON.stringify({ blogs }), {
      status: 200
    });
  } catch (error) {
    return new NextResponse("could not retrieve blogs", {
      status: 500
    });
  }
};

export const POST = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    if (
      !userId ||
      !Types.ObjectId.isValid(userId) ||
      !categoryId ||
      !Types.ObjectId.isValid(categoryId)
    ) {
      return new NextResponse("missing/Invalid userId or categoryId", {
        status: 400
      });
    }

    await connect();
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse("Invalid user", {
        status: 404
      });
    }

    const userCategory = await category.findById(categoryId);
    if (!userCategory) {
      return new NextResponse("Invalid category", {
        status: 404
      });
    }

    const body = await req.json();
    const { title, description } = body;

    if (!title || !description) {
      return new NextResponse("missing title or description", {
        status: 400
      });
    }

    const newBlog = new blog({
      title,
      description,
      userId: new Types.ObjectId(userId),
      categoryId: new Types.ObjectId(categoryId)
    });

    await newBlog.save();

    return new NextResponse(JSON.stringify(newBlog), {
      status: 201
    });
  } catch (error: any) {
    return new NextResponse(error.message, {
      status: 500
    });
  }
};
