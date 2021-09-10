const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();


app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb+srv://admin-Karolina:Test123@cluster0.oauoh.mongodb.net/todolistDB', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to Your To Do List!"
});

const item2 = new Item({
  name: "Add a new item."
});

const item3 = new Item({
  name: "Tick the checkbox to delete an item."
});

const defaultItems = [item1, item2, item3];


app.get("/", function(req, res){
  let today = new Date();

  let options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }
  let day = today.toLocaleDateString('en-US', options)

  Item.find({}, function(err, foundItems){

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully savevd default items to DB.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {kindOfDay: day, newListItems: foundItems});
    }
  });
});


app.post('/', function (req, res){
let itemName = req.body.newListItem;

const item = new Item({
  name: itemName
});

item.save();
// it is saved in DB but to show up on the web page res.redirect
res.redirect('/');
});

app.post("/delete", function(req, res){
const checkedItemId = req.body.checkbox;
Item.findByIdAndRemove(checkedItemId, function(err){
  // you have to provide a callback to get result
  if (!err) {
    console.log("Successfully deleted checked item.");
    res.redirect("/");
  }
});

});

app.get('/about', function (req, res){
  res.render('about');
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(){
  console.log("Server started.");
});
