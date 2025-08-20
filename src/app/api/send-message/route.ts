import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { messageSchema } from "@/schemas/messageSchema";
import { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, content } = await request.json();

    const result = messageSchema.safeParse({ content });
    if (!result.success) {
      const contentErrors = result.error.format().content?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message:
            contentErrors.length > 0
              ? contentErrors.join(", ")
              : "At least 5 chars of the content is required to send message",
        },
        { status: 403 }
      );
    }

    if (!username || !content) {
      return NextResponse.json(
        {
          success: false,
          message: "Content and username for the user to send msg is required",
        },
        { status: 401 }
      );
    }

    const user = await UserModel.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessages) {
      return NextResponse.json(
        { success: false, message: "User is not accepting the messages" },
        { status: 403 }
      );
    }

    const newMessage = {
      content,
      createdAt: new Date(),
    };

    user.messages.push(newMessage as Message);
    await user.save();

    return NextResponse.json(
      { message: "Message sent successfully", success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding message:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
