import UserModel from "@/model/User";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextRequest } from "next/server";


export async function DELETE(
  request: NextRequest,
  { params }: { params: { messageid: string } }
) {
  const messageId = params.messageid;
  await dbConnect();
  if (!messageId) {
    return Response.json(
      {
        success: false,
        message: "messageid is required",
      },
      { status: 500 }
    );
  }
  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 404 }
    );
  }

  try {
    const updateResult = await UserModel.findByIdAndUpdate(
      user?._id,
      {
        $pull: {
          messages: {
            _id: messageId,
          },
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updateResult) {
      return Response.json({
        success : false,
        message : "Message not found or already deleted",
      }, {status : 400});
    }

    return Response.json(
        {
            success : true,
            message : "Successfully message deleted",
        } , {status : 200}
    )

  } catch (error) {
    console.error("Error while deleting the message" , error);
    return Response.json(
        {
            success : false,
            message : "Error while deleting message , failed to delete the message"
        } , {status : 500}
    )
  }
}
