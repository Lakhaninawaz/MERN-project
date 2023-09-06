require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {auth, authenticate} = require("../src/middleware/auth");

require("./db/conn");

const Register = require("./models/registers")

const port = process.env.PORT || 8000;

const static_path = path.join(__dirname, "../public")
const template_path = path.join(__dirname, "../templates/views")
const partials_path = path.join(__dirname, "../templates/partials")

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))

app.use(express.static(static_path));
app.set("view engine", "hbs"); 
app.set("views", template_path);
hbs.registerPartials(partials_path)

app.get("*", authenticate);

app.get("/",authenticate, (req, res) => {
    res.render('index');

    // res.render("index");
});

app.get('/secret', authenticate, (req, res) => {
    // Render the secret page
    res.render('secret');
  });

// app.get("/secret", auth ,(req, res) => {
//     // console.log(`This is Cookie: ${req.cookies.jwt}`);
//     res.render("secret");
// });

app.get("/logout",auth, async(req,res)=>{
    try {
        // logout only one device
        // console.log(req.user);

        // req.user.tokens = req.user.tokens.filter((currentElement) =>{
        //     return currentElement.token !== req.token; 
        // })

        // logout all devices
        req.user.tokens = []
        
        res.clearCookie("jwt");

        console.log("logout successfully");

        await req.user.save();
        // res.status(200).render("login");
        res.redirect("login");

    } catch (error) {
        res.status(500).send(error);
    }
})

app.get("/register", (req, res) => {
    res.render("register");
})

app.get("/login", (req, res) => {
    res.render("login");
})

// create a new user in our database
app.post("/register", async (req, res) => {
    try {
        
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        // const email = req.body.email;

        if(password === cpassword){

            const registerDemo = new Register({
                firstname : req.body.firstname,
                lastname : req.body.lastname,
                email : req.body.email,
                phone : req.body.phone,
                age : req.body.age,
                password : password,
                confirmpassword : cpassword
            }) 

            // console.log("the success part" + registerDemo);

            // const token = await registerDemo.generateAuthToken();
            // console.log("The token part", token);

            // cokkie storing
            // res.cookie("jwt", token, {
            //     expires: new Date(Date.now() + 600000),
            //     httpOnly:true
            // });
            // console.log(cookie);

            const registered = await registerDemo.save();
            // console.log("The page part", registered);

            // res.status(200).render("index");
            res.redirect("/");

        }else{
            res.send("Password are not Matching")
        }
        
    } catch (error) {
        errors.email = "that email already exits"
        res.status(400).send(error);
        console.log("the error part app page");
    }
})

// login check

app.post("/login", async(req, res) => {
    try {
        
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({email:email});

        const isMatch = await bcrypt.compare(password, useremail.password);
        
        const token = await useremail.generateAuthToken();
        // console.log("The token part", token);

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 600000),
            httpOnly:true
            // secure:true
        });


        if(isMatch){
            // res.status(200).render("index");
            res.redirect("/");
        } else{
            res.send("invalid password detailes");
        }


    } catch (error) {
        res.status(400).send("invalid login detailes")
    }
})












// hashing implement 


// const securePassword = async (password) => {

//     const passwordHash = await bcrypt.hash(password, 10)
//     console.log(passwordHash);

//     const passwordMatch = await bcrypt.compare("nawaz@123", passwordHash)
//     console.log(passwordMatch);

// }

// securePassword("nawaz@123");









// const jwt = require("jsonwebtoken");


// const createToken = async() =>{
//     const token = await jwt.sign({_id: "6450f0da0e0f9f45f8e7a302"}, "mynameislakhaninawazhellobye", {
//         expiresIn: "2 minutes"
//     });
//     console.log(token);

//     const userVer = await 
.verify(token, "mynameislakhaninawazhellobye");
//     console.log(userVer);
// }


// createToken();





app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})