import { connectDB } from "@/dbConnection/dbConfig";
import User from "@/models/userModel"
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import sendEmail from "@/helpers/mailer";

connectDB()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json() 
        const { email, username, password } = reqBody

        const duplicateUserExists = await User.findOne({email})
        if(duplicateUserExists){
            return NextResponse.json({ error: "This email has already been registered" }, { status: 400 })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password+"", salt);

        // interacting with model hence no await etc. needed
        const newUser = new User({
            username, 
            email, 
            password: hashedPass
        })

        const savedUser = await newUser.save()
        
        // now send verification email
        await sendEmail({email, emailType: "VERIFY", userId: savedUser._id})

        return NextResponse.json({
            message: "User has been registered successfully",
            success: true,
            savedUser
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}