'use client'
import axios from "axios"
import Link from "next/link"
import React, { useEffect, useState } from "react"

const VerifyEmailPage = () => {
    const [token, setToken] = useState("")
    const [verified, setVerified] = useState(false)
    const [error, setError] = useState(false)

    const verifyUserEmail = async () => {
        try {
            await axios.post('/api/users/verifyemail', { token })
            setVerified(true)
            setError(false)
        } catch (error:any) {
            setError(true)
            setVerified(false)
            console.log(error.response.data)            
        }
    }

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1]
        setToken(urlToken || "")
        // using the useRouter() hook to extract the query, and the naming the "token" can have problems because of the special symbols present in our token
    }, []);


    useEffect(() => {
        if(token.length > 0) {
            verifyUserEmail()
        }
    }, [token])

    return(
        <div className="flex flex-col items-center justify-center min-h-screen py-2">

            <h1 className="text-4xl">Automatic Email Verification</h1>
            <h2 className="p-2 bg-orange-500 text-black">{token ? `${token}` : "no token"}</h2>

            {verified && (
                <div>
                    <h2 className="text-2xl">Email has been verified, you can now proceed to login</h2>
                    <Link href="/login">
                        Login
                    </Link>
                </div>
            )}

            {error && (
                <div>
                    <h2 className="text-2xl bg-red-500 text-black">Token is bad/expired or does not exist</h2>                    
                </div>
            )}

            <p className="mt-12"><Link href={"/signup"}>Go back to signup</Link></p>
        </div>
    )
}

export default VerifyEmailPage