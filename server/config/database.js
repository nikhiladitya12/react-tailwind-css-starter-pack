const mongoose=require ("mongoose");
require("dotenv").config();


const dbConnect =()=>{
mongoose.connect(process.env.DATABASE_URL,{
   useNewUrlParser:true,
   useUnifiedTopology:true, 
}).then(()=>{
console.log("Database connection is successful");
}).catch((err)=>{
console.log("Database connection is unsuccessful => ",err)
})
}

module.exports=dbConnect;