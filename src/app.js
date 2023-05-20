require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");

require("./db/conn");

const Register = require("./models/registers")

const port = process.env.PORT || 8000;

const static_path = path.join(__dirname, "../public")
const template_path = path.join(__dirname, "../templates/views")
const partials_path = path.join(__dirname, "../templates/partials")

app.use(express.json());
app.use(express.urlencoded({extended:false}))

app.use(express.static(static_path));
app.set("view engine", "hbs"); 
app.set("views", template_path);
hbs.registerPartials(partials_path)

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/register", (req, res) => {
    res.render("register")
})

app.get("/login", (req, res) => {
    res.render("login")
})

// create a new user in our database
app.post("/register", async (req, res) => {
    try {
        
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        const email = req.body.email;

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

            console.log("the success part" + registerDemo);

            const token = await registerDemo.generateAuthToken();
            console.log("The token part", token);

            const registered = await registerDemo.save();
            console.log("The page part", registered);

            res.status(201).render("index");

        }else{
            res.send("Password are not Matching")
        }
        
    } catch (error) {
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
        console.log("The token part", token);

        if(isMatch){
            res.status(201).render("index");
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

//     const userVer = await jwt.verify(token, "mynameislakhaninawazhellobye");
//     console.log(userVer);
// }


// createToken();





app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})