import { connectDB } from "@/dbConnection/dbConfig";
import User from "@/models/userModel"
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

connectDB()

export async function POST(req: NextRequest){
    try {
        const reqBody = await req.json()
        const { email, password } = reqBody 
        const user = await User.findOne({email})

        if(!user){
            return NextResponse.json({error: "User with given credentials does not exist"}, {status: 400})
        }

        const passMatch = await bcrypt.compare(password.toString(), user.password)

        if(!passMatch){
            return NextResponse.json({error: "Invalid credentials"}, {status: 400})
        }

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }

        const jwtToken = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: '1d'})

        const res = NextResponse.json({
            message: "login success",
            success: true
        })

        res.cookies.set("token", jwtToken, {
            httpOnly: true
        })

        return res

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}