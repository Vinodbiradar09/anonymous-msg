import UserModel from "@/model/User";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  // Extract messageid from URL path, assuming URL path ends with /delete-message/[messageid]
  const urlParts = request.nextUrl.pathname.split('/');
  const messageid = urlParts[urlParts.length - 1];

  await dbConnect();

  if (!messageid) {
    return NextResponse.json(
      { success: false, message: "messageid is required" },
      { status: 400 }
    );
  }

  const session = await getServerSession(authOptions);
  const user = session?.user as User & { _id?: string };

  if (!session || !user || !user._id) {
    return NextResponse.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    );
  }

  try {
    const updateResult = await UserModel.findByIdAndUpdate(
      user._id,
      { $pull: { messages: { _id: messageid } } },
      { new: true, runValidators: true }
    );

    if (!updateResult) {
      return NextResponse.json(
        { success: false, message: "Message not found or already deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Successfully deleted message" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while deleting the message", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error while deleting message, failed to delete the message",
      },
      { status: 500 }
    );
  }
}
