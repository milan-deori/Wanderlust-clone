if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}
//console.log(process.env);


const express= require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const multer  = require('multer')

//express route access
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const userRouter=require("./routes/user.js");


//express engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public/css")));
app.use(express.static(path.join(__dirname,"public/js")));
//app.use(express.static('public/css'));









//mongo connection

const dbUrl=process.env.ATLASTDB_UR;
const mainUrl='mongodb://127.0.0.1:27017/wanderlust';

async function main() {
    await mongoose.connect(mainUrl);
  }
main()
.then(()=>{
    console.log("Conected..");
}).catch(err => console.log(err));




//user active dates
const store=MongoStore.create({
    mongoUrl:'mongodb+srv://milandeori803:Onb15AlajnaCVpYV@cluster0.seb2r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    crypto:{
        secret:"SuperSecretCode",
    },
    touchAfter:24*3600,
    
});
store.on("error", ()=>{
    console.log("Error in mongo store", err)
})
  

//user login sesson
const sessionOption={
      store:store,
    secret:"SuperSecretCode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*25*60*60*1000,
        maxAge:7*25*60*60*1000,
        http:true,
    }
};






app.use(session(sessionOption));
app.use(flash());

//authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());








app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();

});



//access route files
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",userRouter);


/*app.get("/testListing",async(req,res)=>{
    let sampleListing=new Listing({

        title:"My New Villa",
        description:"By the Beach",
        price:1200,
        location:"Calangute",
        country:"India"
    });

   await sampleListing.save();
   console.log("Sample Was Saved");
   res.send("Successful testing");

});
*/

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found!.."))
});

app.use((err,req,res,next)=>{
    let {status=500, message="Somthing went to wrong"}=err;
   // res.status(status).send(message);
    res.status(status).render("error.ejs",{message})
});


app.listen(3000,()=>{
    console.log("Server is listening to poat 3000 ");

});