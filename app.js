const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

mongoose.connect("mongodb+srv://admin-arjavP:test123@cluster0.l98cp.mongodb.net/todolistDB",{useNewUrlParser: true, useUnifiedTopology: true})
var items=[];
var workItems=[];

const todoSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item",todoSchema);

const item1 = new Item({
  name:"Welcome to your To-Do List!"
})

const item2 = new Item({
  name:"Hit + button to add new item"
})

const item3 = new Item({
  name:"<-- Hit checkbox to delete"
})

var defaultItems = [item1 , item2 , item3]




app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));


app.get("/",function(req,res){
  var today = new Date();
  var options ={
    weekday: "long",
    day: "numeric",
    month: "long"
  }
  var day = today.toLocaleDateString("en-US",options)
  Item.find({},function(err,results){
    if(results.length===0){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log("err")
        }else{
          console.log("Succesfully added items to database")
        }
      })
    }
    res.render("list",{kindOfday: day,items: results});
  });

});

app.get("/:customListName",function(req,res){
  console.log(req.params.customListName)
});

app.post("/",function(req,res){
  const newItem = req.body.newItem;
  const iitem = new Item({
    name: newItem
  });
  iitem.save();
  res.redirect("/");
  // if(req.body.list==="Work"){
  //   workItems.push(newItem)
  //   res.redirect("/work");
  // }else{
  //   items.push(newItem)
  //   res.redirect("/");
  // }


})

app.post("/delete",function(req,res){
  const checkedItem= req.body.checkbox;

  Item.findByIdAndRemove(checkedItem,function(err){
    if(!err){
      console.log("Succesfully deleted item")
      res.redirect("/");
    }
  })

})

app.listen(process.env.PORT || 3000,function(){
  console.log("Server is running on port 3000");
});
