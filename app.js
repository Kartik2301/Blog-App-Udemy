var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
app.use(methodOverride("_method"));


mongoose.connect("mongodb://localhost:27017/blog_app", {useNewUrlParser : true});
app.use(bodyParser.urlencoded({extened:true}));
app.use(express.static('public'))

app.get("/",function(req, res) {
    res.redirect("/blogs");
});

var blogSchema = new mongoose.Schema({
    title: String,
    image:String,
    body:String,
    created: {type:Date, default: Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

/*Blog.create({
    title: "Eddard Stark",
    image: "https://vignette.wikia.nocookie.net/gameofthrones/images/8/8f/Lord_Eddard_Stark_infobox.jpg/revision/latest/scale-to-width-down/310?cb=20190427041634",
    body: "Eddard/Ned Stark was the Lord of Winterfell from 283AC to 298AC"
},function(err,added){
    if(err){
        console.log(err);
    }else{
        console.log(added);
    }
});*/

app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }else{
               res.render("index.ejs",{blogs:blogs}) ;
        }
    });
});

app.get("/blogs/new",function(req, res) {
    res.render("new.ejs");
});

app.post("/blogs",function(req,res){
    Blog.create(req.body.blog,function(err,newlyCreated){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id",function(req, res) {
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            console.log(err);
        }
        else{
            res.render("show.ejs",{blog:foundBlog});
        }
    });
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit.ejs", {blog: foundBlog});
        }
    });
})


// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if(err){
          res.redirect("/blogs");
      }  else {
          res.redirect("/blogs/" + req.params.id);
      }
   });
});

//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
   Blog.findByIdAndDelete(req.params.id,function(err,toDelete){
       if(err){
           console.log(err);
       }else{
           res.redirect("/blogs");
       }
   }) 
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server has started");
});