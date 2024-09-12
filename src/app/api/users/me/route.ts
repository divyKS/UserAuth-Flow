import { connectDB } from "@/dbConnection/dbConfig";
import User from "@/models/userModel"
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connectDB()

export async function POST(req: NextRequest){
    try {
        const token = req.cookies.get("token")?.value || '';
        const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
        const userId = decodedToken.id;
        const user = await User.findOne({_id: userId}).select("-password");
        return NextResponse.json({
            message: "User found",
            data: user
        })

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 400});
    }
}