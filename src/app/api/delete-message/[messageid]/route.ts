import UserModel from "@/model/User";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextRequest } from "next/server";

export async function DELETE(
  request: NextRequest,
  context: { params: Record<string, string> }  
) {
  const messageid = context.params.messageid;
  await dbConnect();

  if (!messageid) {
    return Response.json(
      { success: false, message: "messageid is required" },
      { status: 400 }
    );
  }

  const session = await getServerSession(authOptions);
  const user = session?.user as User & { _id?: string };

  if (!session || !user || !user._id) {
    return Response.json(
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
      return Response.json(
        { success: false, message: "Message not found or already deleted" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Successfully deleted message" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while deleting the message", error);
    return Response.json(
      {
        success: false,
        message:
          "Error while deleting message, failed to delete the message",
      },
      { status: 500 }
    );
  }
}
