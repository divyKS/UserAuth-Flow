import { connectDB } from "@/dbConnection/dbConfig";
import { NextRequest, NextResponse } from "next/server";

connectDB()

export async function GET(req: NextRequest){
    try {
        const res = NextResponse.json({message: "logout success", success: true})
        
        res.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0)
        })

        return res

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}