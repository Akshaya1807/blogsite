const User = require("../models/user");
const shortId = require("shortid");
const expressJwt = require("express-jwt");
const jwt = require("jsonwebtoken")


exports.signup = async (req, res) => {
    // console.log("➡️ Signup request body:", req.body);
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Create new user
        const username = shortId.generate();
        const profile = `${process.env.CLIENT_URL}/profile/${username}`;

        const newUser = new User({ name, email, password, profile, username });
        await newUser.save();

        return res.json({
            message: "Signup successful! Please log in to continue."
        });
    } catch (err) {
        console.error("Signup Error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};



exports.login = (req,res)=>{
    const {email,password} = req.body
    //checking user existence
    User.findOne({email}).exec((err,user)=>{
        if(err || !user){
            return res.status(400).json({
                error: "You forgot to 'SignUp'.Email does not exist"
            });
        }
    // authenticate the user
        if(!user.authenticate(password)){
            return res.status(400).json({
                error: "Email and password does not match"
            });
        }
    // token generation 
        const token = jwt.sign({_id: user._id},process.env.JWT_TOKEN_SECRET,{expiresIn: "365d"})  

        res.cookie("token",token,{expiresIn:"365d"})
        const {_id,username,name,email,role} = user
        return res.json({
            token, 
            user:{_id,username,name,email,role}
        })
    });

};

// signout and require login middlewares for protecting routes

exports.logout = (req,res)=>{
    res.clearCookie("token")
    res.json({
        message: "Successfully logged out"
    });
};


exports.requireLogin = expressJwt({
    secret: process.env.JWT_TOKEN_SECRET,
    algorithms: ['HS256'] 
});


exports.authenticationMiddleware = (req,res,next)=>{
    const authenticateUserId = req.user._id
    User.findById({_id: authenticateUserId}).exec((err,user)=>{
        if (err || !user){
            return res.status(400).json({
                error:"User not found"
            })
        }
        req.profile = user 
        next()
    })
};


exports.adminAuthenticationMiddleware = (req,res,next)=>{
    const authenticateAdminUserId = req.user._id
    User.findById({_id: authenticateAdminUserId}).exec((err,user)=>{
        if (err || !user){
            return res.status(400).json({
                error:"User not found"
            })
        }
        if (user.role !== 1){
             return res.status(400).json({
                error:"Access Denied!. Only authorized for admins"
            });
        }
        req.profile = user 
        next()
    })
};