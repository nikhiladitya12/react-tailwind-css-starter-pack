// const User=require("../models/User");
// const mailSender=require("../utils/mailSender");
// const bcrypt=require("bcrypt");

// //resetPasswordToken
// exports.resetPasswordToken =async (req,res)=>{
// try{
// //fetch email from req body
// const email =req.body.email
// //check user for this email,  email validation
// const user = await User.findOne({email:email});
// if(!user){
// return res.status(403).json({
//     success:false,
//     message:"Your email is not registered with us"
// });

// }
// //generate token 
// const token = crypto.randomUUID();

// //update user by adding token and expiration time
// const updatedDetails= await User.findOneAndUpdate(
//                                  {email:email}, 
//                                  {
//                                  token:token,
//                                  resetPasswordExpires:Date.now() + 5*60*1000,
//                                  },
//                                  {new:true});

// //create url
// const url =`http://localhost:3000/update-password/${token}`;

// //send mail containing the url

// await mailSender(email,"Password Reset Link",`Password reset link: ${url}`)

// //return response
// return res.status(200).json({
//     success:true,
//     message:"Password reset link sent successfully, please check the email and change password "
// })

// }
// catch(err){
// console.log(err);
// return res.status(500).json({
//     success:false,
//     message:"Something went wrong while reset password"
// })

// }


// }



// //resetpassword


// exports.resetPassword=async(req,res)=>{
// try{

// //fetch data


// const{password,confirmPassword,token}=req.body;
// //validation
// if(password !== confirmPassword){
// return res.json({

// success:false,
// message:"Password  don't match",
// })
// }

// //get user details from db using token
// const userDetails= await User.findOne({token:token});
// //if no entry - invalid token
// if(!userDetails){

// res.json({
//     success:false,
//     message:"Token invalid"
// })

// }
// // if token time expire check
// if(userDetails.resetPasswordExpires < Date.now()){
// return res.json({
//     success:false,
//     message:"Token  is expired,please re-generate your token"
// })
// }

// //hash password 
// const hashedPassword= await bcrypt.hash(password,10);
// //update password in db
//  await User.findOneAndUpdate(
//     {token:token},
//     {password:hashedPassword},
//     {new:true},
//     );

// //response return
//  return res.status(200).json({
//     success:true,
//     message:"Password Reset successfully",
// })


// }
// catch(err){
// console.log(err);
//    return res.status(500).json({
//         success:false,
//         message:"Something went wrong while reset password",
//     })

// }
// }
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

exports.resetPasswordToken = async (req, res) => {
	try {
		const email = req.body.email;
		const user = await User.findOne({ email: email });
		if (!user) {
			return res.json({
				success: false,
				message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
			});
		}
		const token = crypto.randomBytes(20).toString("hex");

		const updatedDetails = await User.findOneAndUpdate(
			{ email: email },
			{
				token: token,
				resetPasswordExpires: Date.now() + 3600000,
			},
			{ new: true }
		);
		console.log("DETAILS", updatedDetails);

		const url = `http://localhost:3000/update-password/${token}`;

		await mailSender(
			email,
			"Password Reset",
			`Your Link for email verification is ${url}. Please click this url to reset your password.`
		);

		res.json({
			success: true,
			message:
				"Email Sent Successfully, Please Check Your Email to Continue Further",
		});
	} catch (error) {
		return res.json({
			error: error.message,
			success: false,
			message: `Some Error in Sending the Reset Message`,
		});
	}
};

exports.resetPassword = async (req, res) => {
	try {
		const { password, confirmPassword, token } = req.body;

		if (confirmPassword !== password) {
			return res.json({
				success: false,
				message: "Password and Confirm Password Does not Match",
			});
		}
		const userDetails = await User.findOne({ token: token });
		if (!userDetails) {
			return res.json({
				success: false,
				message: "Token is Invalid",
			});
		}
		if (!(userDetails.resetPasswordExpires > Date.now())) {
			return res.status(403).json({
				success: false,
				message: `Token is Expired, Please Regenerate Your Token`,
			});
		}
		const encryptedPassword = await bcrypt.hash(password, 10);
		await User.findOneAndUpdate(
			{ token: token },
			{ password: encryptedPassword },
			{ new: true }
		);
		res.json({
			success: true,
			message: `Password Reset Successful`,
		});
	} catch (error) {
		return res.json({
			error: error.message,
			success: false,
			message: `Some Error in Updating the Password`,
		});
	}
};