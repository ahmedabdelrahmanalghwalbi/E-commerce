const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Name"],
    },
    email: {
        type: String,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/, "Please Enter a valid E-mail"],
        required: [true, "Please Enter Email"],
        unique:[true,"this E-mail is reserved by another user"],
    },
    isAdmin: {
        type: Boolean,
        default:false
    },
    password: {
        type: String,
        minlength: 6,
        required: [true, "Please Enter the Password"],
        select:false
    },
    createdAt: {
        type: Date,
        default:Date.now()
    },
    street: {
        type: String,
        required: [true,"please Enter your street"]
    },
    apartment: {
        type: String,
        required: [true,"please Enter your apartment"]
    },
    city: {
        type: String,
        required: [true,"please Enter your city"]
    },
    zip: {
        type: String,
        required:[true,"please Enter your zip code"]
    },
    country: {
        type: String,
        required:[true,"please Enter your country"]
    },
    phone: {
        type: Number,
        required:[true,"Please Enter your phone Number"]
    },
});

userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.getSignedJwtToken = function () {
    const token = Jwt.sign({
        id: this._id,
        isAdmin:this.isAdmin
    },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.JWT_EXPIE,
        }
    );
    return token;
}

userSchema.methods.matchPasswords = async function (userPassword) {
    const validUserPassword = await bcrypt.compare(userPassword, this.password);
    return validUserPassword;
}

module.exports = mongoose.model("User", userSchema);