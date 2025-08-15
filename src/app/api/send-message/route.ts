import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {messageSchema} from "@/schemas/messageSchema";
import { Message } from "@/model/User";


export async function POST(request : Request) {
    await dbConnect();
    const {username , content} = await request.json();

    const result = messageSchema.safeParse({content});
    if(!result.success){
        const contentErrors = result.error.format().content?._errors || [];
        return Response.json(
            {
                success : false,
                message : contentErrors.length > 0 ? contentErrors.join(", ") : "Atleast 5 chars of the content is required to send message"
            },
            {
                status : 403,
            }
        )
    }

    try {
        if(!username || !content){
            return Response.json(
                {
                    success : false,
                    message : "content and username for the user to send msg is required"
                },
                {
                    status : 401,
                }
            )
        }

        const user = await UserModel.findOne({username});
        if(!user){
            return Response.json(
                {
                    success : false,
                    message : "User not found",
                },
                {
                    status : 404
                }
            )
        }

        if(!user.isAcceptingMessages){
             return Response.json(
                {
                    success : false,
                    message : "User is not accepting the messsages",
                },
                {
                    status : 403
                }
            )
        }

        const newMessage = {
            content : content,
            createdAt : new Date()
        };

        user.messages.push(newMessage as Message);
        await user.save();
        return Response.json(
            { message: 'Message sent successfully', success: true },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error adding message:', error);
        return Response.json(
            {
                message : "Internal server Error",
                success : false
            },
            {
                status : 500,
            }
        )
    }
}