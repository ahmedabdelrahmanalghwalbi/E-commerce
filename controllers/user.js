const User = require("../models/user");


//regiteration
exports.registerController = async (req, res, next) => {
    try {
        //ensure that user has been register before or not.
        let doseUserExist = await User.findOne({ "email": req.email });
        if (doseUserExist) return res.status(400).json({
            status: "fail",
            message:"this email has been registered"
        });
        //register the user after the validation
        const newUser = await User.create(req.body);
        const token = newUser.getSignedJwtToken();
        res.status(200).json({
            status: "user register successfully",
            token:token
        });
    } catch (error) {
        res.status(400).json({
            status:"fail",
            message:`user register failed ${error}`
        });
        console.error(error);
        next(error);
    }
}

//loging in
exports.loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).send("Please provide email and passowrd");
        }
        //ensure that user's email is valid or not.
        //I used select becouse i but select false in password model
        //and i need to get it to compare with the user password
        const validUser = await User.findOne({ "email": email}).select('+password');
        if (!validUser) return res.status(400).send(`Invalid email or password`);
        //ensure that user's password is valid or not.
        let validUserPassword=await validUser.matchPasswords(password);
        if (!validUserPassword) return res.status(400).send("Invalid email or password");
        const token = validUser.getSignedJwtToken();
        res.status(200).json({
            status: "user login successfully",
            token:token
        });
            
    } catch (error) {
        next(error);
    } 
}

//get the current user
exports.getMeController = async (req, res, next) => {
    try {
        const currentUser = await User.findById(req.user.id);
        res.status(200).json({
            status: "Success with getting the current user",
            user: currentUser,
        })
    } catch (ex) {
        res.status(400).send("error with getting the current user");
        console.error(ex);
        next();
    }
}

//find user by id
exports.findUserById = async(req,res,next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            res.status(500).json({
                status: "fail",
                message:"fail to get the user by id"
            })
        }
        res.status(200).json({
            status: "success",
            data:user
        })
    } catch (ex) {
        res.status(500).json({
            status: "fail",
            message:`fail to get the user by id`
        })
    }
}

//update user info
exports.updateUserInfo = async (req, res, next) => {
    try {
        const fields = {
            name: req.body.name,
            email: req.body.email
        };
        const updatedUser = await User.findByIdAndUpdate(req.user.userId, fields, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: "update user information successfully",
            data:updatedUser
        })

    } catch (ex) {
        res.status(400).send("error with updateing the user information");
        console.error(ex);
        next();
    }
}

//get users counts
exports.userCountsController =async (req, res, next) => {
    try {
        const userCounts = await User.countDocuments((count) => count);
        if (!userCounts) {
            res.status(500).json({
                status: "fail",
                message:"failed to get the users count"
            })
        }
        res.status(200).json({
            status: "success",
            data:userCounts
        })
    } catch (ex) {
        res.status(500).json({
            status: "fail",
            message:`failed with getting the user count ${ex}`
        })
    }
}

//delete user
exports.deleteUserController =async (req, res, next) => {
    try {
        await User.findByIdAndRemove(req.params.userId);
        res.status(200).json({
            status: "success",
            message:"user deleted successfully"
        })
    } catch (ex) {
        res.status(500).json({
            status: "fail",
            message:`failed to delete this user`
        })
    }
}