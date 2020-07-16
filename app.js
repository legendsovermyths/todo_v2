//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const mongoose=require("mongoose")
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];
var items=[];
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true})
const itemsSchema={
  task:String
}
const Item=mongoose.model("item",itemsSchema)
const item1=new Item(
  {
    task:"Buy Food"
  }
)
const item2=new Item(
  {
    task:"Cook Food"
  }
)
const item3=new Item(
  {
    task:"Eat Food"
  }
)
const defaultItems=[item1,item2,item3]
const listSchema={
  listCategory:String,
  listItem:[itemsSchema]
}
const List=mongoose.model("List",listSchema)

app.get("/", function(req, res) {

  Item.find({},function(err,item){
    if(item.length===[]){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("Success!")
        }
      })
    }
    if(err){
      console.log(err);
    }
    else{
        res.render("list", {listTitle: "Today", newListItems: item});
    }
  })


});

app.post("/", function(req, res){

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    var newItem=new Item({
      task:item
    })
    newItem.save()
    res.redirect("/");
  }
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});
app.post("/delete",function(req,res){
  Item.findByIdAndRemove(req.body.checkbox,function(err){
    if(err){
      console.log(err);
    }
  })
  res.redirect("/")
})
app.get("/:category",function(req,res){
  const listItemCategory=req.params.category
  List.findOne({listCategory:listItemCategory},function(err,foundList){
    if(!err){
      if(!foundList){
        const list=new List({
          listCategory:listItemCategory,
          listItem:defaultItems
        })
        list.save()

        res.redirect("/"+listItemCategory)
      }
      else{
        res.render("list", {listTitle: foundList.listCategory, newListItems: foundList.listItem});
        console.log(foundList.listItem);
      }
    }
  })
}
)
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
