import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        uniques: true,
        lowercase: true,
        trim: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String,  // from cloudinary url
        required: true,
    },
    coverImage: {
        type: String,  // from cloudinary url
    },
    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, " Password is required "]
    },
    refreshToken: {
        type: String
    }
},
    {
        timestamps: true
    })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    // if password field not modified then we need to skip "re-encryption" of password 
    // otherwise bcrypt change passwords hash everytime when other data is updated 

    this.password = bcrypt.hash(this.password, 10)
    next()
})

// "pre" is hook(middleware) which "modify" data or like that just before the event we give ,
// here, that even is save so bcrypt make data encrypted just before it will "save"  

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)

    // "methods" is used to add user's own method
    // here "isPasswordCorrect" method is use to "compare" passwords for authentication from bcrypt
    // it takes time & computing power so we use "async-await"
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullname
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema)