import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection : ConnectionObject = {}

const dbConnect = async():Promise<void>=>{
    if(connection.isConnected){
        console.log("Already connected to the database")
    }

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || "" , {});
        connection.isConnected = conn.connections[0].readyState;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("Database connection failed" ,error);
        process.exit(1);
    }
}

export default dbConnect;











// as we know the next.js is a edge runtime framework , which runs on the on demand request , in normal express or node.js when you create a database connection then it runs continously , but in next.js it is different becoz here the service runs on the on demand request if any hot reloading or page refresh takes place you may loose your connection beocz of it or may , that's in every cases you check that if the db connection is there or not if there then use the existing connection not means connect the db
