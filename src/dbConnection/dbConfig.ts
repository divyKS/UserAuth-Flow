import mongoose from "mongoose";

export async function connectDB() {
    try {
        mongoose.connect(process.env.MONGO_URI!)
        // sometimes there can be errors after the connection, for that we have event listeners
        const connection = mongoose.connection
        
        connection.on('connected', () => {
            console.log("DB connected successfully")
        })

        connection.on("error", (error) => {
            console.log("Connection to DB failed, is DB up and running?")
            console.log(error)
            process.exit()
        })


    } catch (error) {
        console.log("Could not connect to DB")
        console.log(error)
    }
}