

import express from "express";

import bodyParser from "body-parser";
import mongoose from "mongoose";
import 'dotenv/config';

const aboutContent = "This website was created by vinoth M" ;
const contactContent = "You can Contact me on this mail ID vinothsmartworker@gmail.com";

const app = express();
var nontit;

var port =process.env.PORT || 3000;
let result;


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(`mongodb+srv://${process.env.my_id}:${process.env.my_pass}@evil-cracker.gn4bjhq.mongodb.net/blogdb`);

const blogschema = new mongoose.Schema({
  title:{
    type:String,
    required:true,
  },
  post:{
    type:String,
    required:true,
  },

});

const blogcollect = mongoose.model("POST",blogschema);



async function add(bl){
 await blogcollect.insertMany([bl]);

}


app.get("/",async(req,res)=>{


  result = await blogcollect.find();

 




  if(result.length==0){
const b2=new blogcollect({
  title:"Day 1",
  post:"Today is an Wonderfull day"
});
add(b2);
res.redirect("/")
 }
  else{
     res.render("home.ejs",{
    content2:result,
  });
  }
 

});



app.get("/about",(req,res)=>{
  res.render("about.ejs",{
   content1:aboutContent,
  });
});



app.get("/contact",(req,res)=>{
  res.render("contact.ejs",{
     content1:contactContent,
  });
});

app.get("/compose",(req,res)=>{
  res.render("compose.ejs")

});


app.post("/compose",async(req,res)=>{
  
 
  const b1=new blogcollect({
    title:req.body.composetitle,
    post:req.body.composepost,
  });
  await add(b1);




 res.redirect("/");





});



 app.get("/post/:title",async(req,res)=>{
  var tit= req.params.title;
 
  const data = await blogcollect.findOne({title:tit}); 
 nontit= await data.title;


  res.render("post.ejs",{
    data:data,
  });


 
 });


 app.get("/edit/:tt",async(req,res)=>{

  var t=req.params.tt;
  
    const val= await blogcollect.findOne({title:t});
  
   

  res.render("edit.ejs",{
    val:val
  })

 });


app.post("/editsubmit",async(req,res)=>{



const ti=req.body.edittitle;
const la=req.body.editpost;
await blogcollect.findOneAndUpdate({title:nontit},{post:la});
await blogcollect.findOneAndUpdate({title:nontit},{title:ti});
res.redirect(`/post/${ti}`);
});

app.get("/delete/:title",async(req,res)=>{
const deletet=req.params.title;
await blogcollect.findOneAndDelete({title:deletet});
res.redirect("/")


});



app.listen(port, function() {
  console.log("Server started on port 3000  http://localhost:3000/");
});
