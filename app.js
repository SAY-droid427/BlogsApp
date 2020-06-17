const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const app=express();

const connect=mongoose.connect("mongodb://localhost:27017/honDB",{useNewUrlParser:true,useUnifiedTopology:true});

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


const postSchema=new mongoose.Schema({
    title:String,
    content:String
});

const Post=mongoose.model("Post",postSchema);

const homeTitle="Welcome to the BlogApp! Write your heart out! Wish you a pleasant experience.";
const composeTitle="Compose your posts here and hit the Publish button to publish them.";

app.get("/",(req,res)=>{
  Post.find({},function(err,post)
  {
     res.render("home",{homeTitle:homeTitle,posts:post});
  })
})


app.get("/compose",(req,res)=>{
    res.render("compose",{composeTitle:composeTitle});
})

app.post("/compose",function(req,res){
  const post=new Post({
      title:req.body.postTitle,
      content: req.body.postBody
  });
  post.save(function(err){
      if(!err)
      {
          res.redirect("/");
      }
  });
});



app.get("/post/:postId",(req,res)=>{
  const requestedPostId=req.params.postId;
  Post.findOne({_id:requestedPostId},(err,post)=>{
    res.render("post",{
      title:post.title,
      body:post.content
    });
  })
})

app.get("/remove/:removeId",(req,res)=>{
  const id=req.params.removeId;
  Post.findByIdAndRemove(id,function(err){
    if(!err)
    console.log("Successfully removed");
    res.redirect("/")
  })
})


app.listen(3000,()=>console.log("Server running successfully at port 3000"));
