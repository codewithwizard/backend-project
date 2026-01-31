import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";

dotenv.config();

connectDB()
.then(() => {

    app.on("ERROR",(error) => {
        console.log("Error: ",error);
        throw error
    })

    app.listen(process.env.PORT || 4000, () => {
        console.log(`Server is running at ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MongoDB connection failed , ERROR: ",err);
})