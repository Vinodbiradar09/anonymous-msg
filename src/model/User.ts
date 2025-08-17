import mongoose,{Schema , model , Document} from "mongoose";

export interface Message extends Document{
     _id: string;
    content : string,
    createdAt : Date,
};

const MessageSchema : Schema<Message> = new Schema({
    content : {
        type : String,
        required :true ,
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now
    }
})

export interface User extends Document{
    username : string,
    email : string,
    password : string,
    verifyCode : string,
    verifyCodeExpiry : Date,
    isVerified : boolean,
    isAcceptingMessages : boolean,
    messages : Message[],
}

const userSchema : Schema<User> = new Schema({
    username : {
        type : String,
        required : [true , "Username is required"],
        trim : true,
        unique : true,
    },
    email : {
        type : String,
        required : [true , "Email is required"],
        unique : true,
        match : [ /^[^\s@]+@[^\s@]+\.[^\s@]+$/, "please use the valid email address"],
    },
    password : {
        type : String,
        required : [true , "Password is required"],
    },
    verifyCode : {
        type : String,
        required : [true , "Verify code is required"],
    },
    verifyCodeExpiry : {
        type : Date,
        required : [true , "Verify code expiry is required"],
    },
    isVerified : {
        type : Boolean,
        default : false,
    },
    isAcceptingMessages : {
        type : Boolean,
        default : true,
    },
    messages : [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || model<User>("User" , userSchema);
export default UserModel;

// a common next.js + mongoose issues we need to handle this
// in plain node.js + express your server starts once and stay running , so we can safely define your mongoose models and schema at top-level
// in next.js especially in development mode 
// everytime you run next dev or refresh page , it may reload the server or even create multiple instances becoz of edge runtime and serverless execution , this means a same model definition can run multiple times , if you create a same model again and again mongoose will throw error 

// how mongoose.models works
// mongoose keeps an in-memory-cache for all the registered models inside mongoose.models , it is basically an object 
// {
//     User : Model<User>,
//     Message: Model<Message>,
// }

// if mongoose.models.User exists it returns that model not means create new one
