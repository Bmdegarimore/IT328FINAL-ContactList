var express = require('express');
var router = express.Router();

/* GET contacts page */
router.get('/', function(req,res){
var db = req.db;
var collection = db.get('contact');
collection.find({}, {}, function(e, docs){
res.render('contactlist', {"contactlist":docs});
});
});

/* GET newcontact */
router.get('/newcontact', function(req, res, next) {
  res.render('newcontact', { title: 'New Contact' });
});


/* POST for New Contact form*/
router.post('/add', function(req,res){
 
 
 //Validation
 req.assert('fname', 'First Name is Required Bro').notEmpty();
 req.assert('lname','Last Name is Required Bro').notEmpty();
 req.assert('email', 'Email Is super invalid man.').isEmail();
 
 var date = req.body.date;
//Check to see if date is empty
if(!date){
  var today = new Date();
  var d = today.getDate();
  var m = today.getMonth()+1;
  var y = today.getFullYear();

  if(d<10) {
      d='0'+d
  } 

  if(m<10) {
      m='0'+m
  } 

  date = m+'/'+d+'/'+y;
  

 } else {
   req.assert('date', date).isDate({format: 'dd-mm-yyyy'});
 }
//No errors, pass variables and write to DB
 var errors = req.validationErrors();
 if(!errors){
 var db = req.db;
 
 // GET values from form
 var fName = req.body.fname;
 var lName = req.body.lname;
 var company = req.body.company;
 var title = req.body.title;
 var email = req.body.email;
 var met = req.body.met;
 var date = req.body.date;
 var comments = req.body.comments;

 var collection = db.get('contact');
 
 //Submit to DB
 collection.insert({
 "name" : {"fname": fName, "lname" : lName},
 "company": company,
 "title": title,
 "email": email,
 "met": met,
 "date": date,
 "comments": comments
  }, function (err,doc){
       if(err){
         //if failed return error message
         res.send("Bro something wen't wrong!")
       }
       else {
         res.location("/");
         res.redirect("/");
       }
      });
 } else {
  //Display errors
  res.render('newcontact', 
    { title: 'New Contact',
      message: 'Something went wrong',
      errors :errors,
      fname: req.body.fname
    });
 }
 
 
});


/* GET edit contact */
router.get('/edit/:ID', function(req, res){
  var db = req.db;
  var collection = db.get('contact');
  collection.findOne({_id: req.params.ID}, function(err, contact){
    res.render('editcontact', {"contact":contact});
  });
});

/* POST request for edit contact*/
router.post('/editcontact/:ID', function(req,res){
  var db= req.db;
  var collection = db.get('contact');
  if(req.body.button == "no"){
    res.location("/");
    res.redirect("/");
  } else {
// GET values for form
 var fName = req.body.fname;
 var lName = req.body.lname;
 var company = req.body.company;
 var title = req.body.title;
 var email = req.body.email;
 var met = req.body.met;
 var date = req.body.date;
 var comments = req.body.comments;

 collection.update(
  {_id: req.params.ID},
  {
   "name" : {"fname": fName, "lname" : lName},
   "company": company,
   "title": title,
   "email": email,
   "met": met,
   "date": date,
   "comments": comments
 },function(err){
   if(err){
     res.send(err);
   } else {
     res.location("/");
     res.redirect("/");
   }
 });
}
  
});


/* GET DELETE Contact */
router.get('/delete/:ID', function(req, res){
var db = req.db;
var collection = db.get('contact');
collection.findOne({_id: req.params.ID}, function(err, contact){
res.render('deletecontact', {"contact":contact});
});
});

/* POST for delete request */
router.post('/deletecontact/:ID', function(req,res){
  var db= req.db;
  var collection = db.get('contact');
  if(req.body.button == "no"){
    res.location("/");
    res.redirect("/");
  } else {
  collection.remove(
  {_id: req.params.ID},
  {
    justOne: true  
  },function(err){
    if(err){
      res.send(err);
    } else {
      res.location("/");
      res.redirect("/");
    }
  });
}
});

module.exports = router;
