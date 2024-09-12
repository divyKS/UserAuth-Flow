import { connectDB } from "@/dbConnection/dbConfig";
import User from "@/models/userModel"
import { NextRequest, NextResponse } from "next/server";

connectDB()

export async function POST(req: NextRequest){
    try {
        const reqBody = await req.json()
        const { token } = reqBody
        console.log(token)

        const user = await User.findOne({verifyToken: token, verifyTokenExpiry: {$gt: Date.now()}})
        // const user = await User.findOne({verifyToken: token})

        if(!user){
            return NextResponse.json({ error: "Invalid/expired token"}, {status: 400})
        }

        user.isVerified = true
        user.verifyToken = undefined
        user.verifyTokenExpiry = undefined // setting undefined removes the field

        await user.save()

        return NextResponse.json({message: "Email verified successfully", success: "true"}, {status: 200})

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}