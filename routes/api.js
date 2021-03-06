
'use strict';

const {MongoClient} = require('mongodb');
const ObjectId = require('mongodb').ObjectID;

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      let query = req.query;
      let DB = process.env.DB;
      let client = new MongoClient(DB, {useNewUrlParser: true, useUnifiedTopology: true});
      let dbName = 'db2'; 
 
client.connect((err)=>{
//  console.log('Connection made');
let db = client.db(dbName);
let collection = db.collection(project); 
//   console.log(query)
if(query._id){ query._id= new ObjectId(query._id)};

   if(query.open=='false'){
     query.open = Boolean(false)  
     }else if(query.open=='true'){
       query.open = Boolean(true)
     }


  if(query.updated_on){query.updated_on= new Date(query.updated_on)};   
  if(query.created_on){query.created_on= new Date(query.created_on)};

 // console.log(query)

  collection.aggregate(
    [ { $match : query } ]
).toArray((err, doc)=>{ 
 //console.log(query)
  res.json(doc)
})

}) 
  })
    
    .post(function (req, res){
      let project = req.params.project;
      let DB = process.env.DB;
      let client = new MongoClient(DB, {useNewUrlParser: true, useUnifiedTopology: true});
      let dbName = 'db2';
 
      client.connect((err)=>{
let db = client.db(dbName);
let collection = db.collection(project);

   let data = {
    issue_title: req.body.issue_title,
    issue_text: req.body.issue_text,
   created_on: new Date(),
   updated_on: new Date(),
   created_by: req.body.created_by,
   assigned_to: req.body.assigned_to||'',
   open: true,
   status_text: req.body.status_text||''
   };   
if(!data.issue_title||!data.issue_text||!data.created_by){
  res.json({ error: 'required field(s) missing' })
}else{
collection.insertOne(data, (err, doc)=>{
  res.json(data)
})
}
      })
      
      
    })
    
    
    .put(function (req, res){
      var project = req.params.project; 
let reqb = req.body;
let _id = req.body._id;
 let data = {
   _id: new ObjectId(_id),
    issue_title: req.body.issue_title,
    issue_text: req.body.issue_text,
   created_by: req.body.created_by,
   assigned_to: req.body.assigned_to,
   status_text: req.body.status_text,
   open: req.body.open 
   };   

 //  console.log(data)
for(var x in data){
  if(!data[x]){
    delete data[x]
 }
}///end of for 
let keys = Object.keys(data);
let vals = Object.values(data);
//console.log(data)
//console.log(vals.length);
if(!_id){
res.json({ error: 'missing _id'})
}else if(_id && vals.length<2){ 
//  console.log('no update field(s) sent', '_id', _id) 
res.json({ error: 'no update field(s) sent', '_id': _id }) 
}else{
   data.updated_on = new Date();

 if(data.open=='false'){
     data.open = Boolean(false)  
     }else{
      data.open = Boolean(true)
     }
//console.log(data) 

  let DB = process.env.DB;
  let client = new MongoClient(DB, {
useNewUrlParser: true, useUnifiedTopology: true   
  });
client.connect((err)=>{
 // console.log("connection made")
  let dbName = 'db2';
let db = client.db(dbName);
let collection = db.collection(project);

collection.findOneAndUpdate({_id: new ObjectId(_id)},{$set:data}, {upsert: false, returnNewDocument: true}, (err, doc)=>{
  if(data.open)
  //console.log(doc.value)
  if(err){
   //  console.log('no update field(s) sent _id'+ doc.value[0]._id) 
  res.json({ error: 'could not update', '_id': _id }) 
  }

  (doc.value)?res.json({result: 'successfully updated', '_id': _id }):   
res.json({ error: 'could not update', '_id': _id })  
  
})

}) 
}
//else{ res.json({ error: 'could not update', '_id': _id })}

    })//end of put

    
     .delete(function (req, res){
      let project = req.params.project;
      const id = new ObjectId(req.body._id);
      const _id = req.body._id;
      const reqb = req.body
      //console.log(typeof id + "----"+ typeof req.body._id);
 if(!_id){ //if(!reqb){ //if(!_id){
res.json({ error: 'missing _id' })
 }else{
     let DB = process.env.DB;
     let client = new MongoClient(DB, {useNewUrlParser: true, useUnifiedTopology: true});
     try{
       client.connect((err)=>{
   // console.log("connection made");
    let dbName = 'db2';
    let db = client.db(dbName);
    let collection = db.collection(project);
   
 // collection.findOne({_id: id}
 collection.findOneAndDelete({_id: id}
,(err, doc)=>{  
  //console.log(doc.value)
 if(err) return;
  (doc.value)?res.json({result: 'successfully deleted', '_id': id }):res.json({ error: 'could not delete', '_id': id })
//   console.log({error: 'could not delete', '_id': id} )
//   res.json({ error: 'could not  
})
   
     })
     }catch(e){
  console.log('Unable to connect')
     }//connect ends
     } //else ends
    });

    
};

