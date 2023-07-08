const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+'/date.js');
const  mongoose = require('mongoose');
const _ =  require('lodash');




const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");



//connecting mongodb
mongoose.connect(
  "mongodb+srv://mahaveerkashetti203:vVbtiFaHDCE8ULF3@cluster0.zfzojmf.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedtopology: true }
);


//Schema
const itemSchema = new mongoose.Schema({
  name:String
})

//collection
const Item = mongoose.model('Item',itemSchema);

//default items
item1 = new Item({
  name:"Pen"
})

item2 = new Item({
  name:"Pencil"
})

item3 = new Item({
  name:"Book"
})

const defaultitems =[item1,item2,item3];

//dyanamic route schema
const DyanamicSchema = new mongoose.Schema({
  name:String,
  items:[itemSchema]

})


const List = mongoose.model('List',DyanamicSchema);

//this showing items in itemlist for main route
app.get("/", async(req, res) => {


Item.find()
.then((Items)=>{

if(Items.length==0){

   Item.insertMany(defaultitems)
  res.redirect('/')

}else{
  
 
  res.render('list',{listtitle:'Today',newitems:Items,webpage:'main'})
 
}

}).catch((err)=>console.log(err))

 
});


//this add item  to todolist main route
app.post('/', async (req, res) => {
  const item1 = req.body.newitem;
  const listname = req.body.list;

  const newitem = new Item({
    name: req.body.newitem
  });

  if (listname == 'Today') {
    await newitem.save();
    res.redirect('/');
  } else {
    const requiredlist = await List.findOne({ name: listname });
    if (requiredlist && requiredlist.items) {
      requiredlist.items.push(newitem);
    } 
    await requiredlist.save();
    res.redirect(`/${listname}`);
  }
});





  //deleting item from todolist
  app.post('/delete', async (req, res) => {
    const listname = req.body.deleteList;
 
    const itemId = req.body.di;

    if (listname == "Today") {
        // Assuming the item ID is passed as 'di' in the request body
        const removedItem = await Item.findByIdAndRemove(itemId);

        if (removedItem) {
            console.log('Item deleted successfully:', removedItem.name);
        } else {
            console.log('Item not found');
        }
        res.redirect('/');
    } else {
      

      const deletelist = await List.findOne({ name: listname });

      deletelist.items = deletelist.items.filter((item) => item._id != itemId);
      
      await deletelist.save();
      res.redirect(`/${listname}`);
      
    }
});





         







    





  // new schme



app.get('/:customlistname',async(req,res)=>{
  
const customlistname =  _.capitalize(req.params.customlistname);

 const litem = await List.findOne({name:`${customlistname}`})
 
  if(!litem){
    const list = new List({
      name:customlistname,
      items:defaultitems
    
    }) 
  
    list.save().then(item=>console.log(item)) 
    res.redirect('/'+customlistname)
    

  }else{

    res.render('list',{listtitle:litem.name,newitems:litem.items,webpage:'secondary'})
 
  }






})

app.listen(3000,()=>{
  console.log("Server is running on port 3000");
})