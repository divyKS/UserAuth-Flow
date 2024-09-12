//TODO: use of enum here for VERIFY & PASS_RESET in emailType?

import nodemailer from "nodemailer"
import { Address } from "nodemailer/lib/mailer";
import bcrypt from "bcryptjs"
import User from "@/models/userModel";
import { FilterQuery } from "mongoose";

interface emailProps {
    email: any,
    emailType: any,
    userId: any
}
// interface emailProps {
//     email: string | Address | undefined, 
//     emailType: string,
//     userId: string
// }

const sendEmail = async ( { email, emailType, userId }: emailProps) => {

    // using the hashed value of the userId as the token for the verification and password reset, can use uuid instead
    const hashedToken = await bcrypt.hash(userId.toString(), 10)

    // $set to ensure only specified fields are updated in the document
    if(emailType === "VERIFY"){
        await User.findOneAndUpdate(userId, {
            $set: {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 1000*60*60
            }
        })
    } else if(emailType === "PASS_RESET"){
        await User.findOneAndUpdate(userId, {
            $set: {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 1000*60*60
            }
        })
    }

    const verifyHTML = `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to verify your email or copy and paste the link below into your browser.<br></p>`

    const resetHTML = `<p>Click <a href="${process.env.DOMAIN}/forgetpass?token=${hashedToken}">here</a> to reset your password or copy and paste the link below into your browser.<br></p>`

    try {

        var transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "7d224fa2395974", // these should be in env not there!!
              pass: "6531a3a428198e"
            }
        });          
          
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: "divy@next.music", // sender address
            to: email, // list of receivers
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password", // Subject line
            html: emailType === "VERIFY" ? verifyHTML : resetHTML
        });
        
        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
        
    } catch (error: any) {
        console.log(error.message)
    }
}

export default sendEmail