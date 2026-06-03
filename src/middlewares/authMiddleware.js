const jwt = require("jsonwebtoken");    //import jwt library for generating, verifying and decoding token
const User = require("../models/User");

//frontend sends the request for token as in the format of Beaer abcok1455...
//so req.headers.authorization.split(" ")[1]; gives only token
//decode checks token is valid , not modified and secret key matches or not

const protect = async (req , res, next) => {      //create middleware function which is in between re and res
    try{
        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id);
             if (!user) {
                    return res.status(404).json({
                        message: "User not found"
                    });
                }

            req.user = user;    // store user data in request

            next();
      
        }else {
            return res.status(401).json({
                message : "Token Failed"
            });
        }
    }catch(error){
        return res.status(401).json({
            message : "Token Failed"
        });   
    }
};

//Role based authorization
const authorizeRole = (...roles) => {           //function which collects alll the roles using rest operator
    return async (req, res, next) => {
        try{
        // const User = require("../models/User");

        // const user = await User.findById(req.user.id);  //get the current logged in user from database

        // if(!user){
        //     return res.status(404).json({           //user validation
        //         message : "User Not found"
        //     })
        // }

        if(!roles.includes(req.user.role)){             //authorization logic validation
            return res.status(403).json({
                message : "Access Denied"
            })
        }

            // req.currentUser = user;                 //stores user data inside req object

            next();
        }
        catch(error){
            return res.status(500).json({          //handle internal server error
                message : error.message
            })
        }
    }
    }
module.exports = { 
    protect,
    authorizeRole
};