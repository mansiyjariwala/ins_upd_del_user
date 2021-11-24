require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json());
const port = 5000;
const mongoose = require("mongoose");

const userModel= require("./models/user");



mongoose
  .connect(process.env.MONGOURL)
  .then(() => console.log("mongo db connected"));

app.get("/", (req, res) => res.send("Hello Fullstack!"));
app.get("/list",async(req,res)=>{

    const userList=await userModel.find({},{username:true});

    if(userList.length==0)
    {
        return res.json({data:"no users in fullstack"});
    }

    return res.json({data:userList});
});
//register user
app.post("/registration",(req,res)=>
{
    const{newUser}=req.body;
    userModel.create(newUser);
    return res.json({data:"registered successfully"});
});

//login user
app.post("/login",async (req,res)=>
{
    const uname=req.body.username;
    const pass=req.body.password;

    const user=await userModel.findOne({username: uname,password:pass});

    if(user)
    {
        return res.json({data:"login successfull"});
    }
    return res.json({data:"wrong crendentials"});
});

//update user

app.put("/user/changepassword/:uname",async(req,res)=>
{
    const uname=req.params.uname;
    const pass=req.body.password;
    const updatedUser = await userModel.findOneAndUpdate(
        {username : uname },
        {password:pass},
        {new:true}
    );
    return res.json({data:"password updated sucessfully"});
});

//delete user
app.delete("/user/deleteuser/:uname",async(req,res)=>
{
    const uname=req.params.uname;
    const deletedUser =await userModel.findOneAndDelete({username:uname});
    return res.json({data:"user deleted successfully"});
});


app.listen(port, () => console.log(`server running on port 5000`));
