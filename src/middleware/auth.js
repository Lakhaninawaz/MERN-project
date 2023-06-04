const jwt = require("jsonwebtoken");
const Register = require("../models/registers");

const auth = async (req, res, next) =>{
    try {

        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        // console.log(verifyUser);

        const user = await Register.findOne({_id:verifyUser._id});
        // console.log(user.firstname);

        req.token = token;
        req.user = user;
        next();
        
    } catch (error) {
        res.status(401).send(error);
    }
}

// Authenticate user requests
const authenticate = async (req, res, next) => {
  // Get token from header or cookie
  const token = req.headers['authorization'] || req.cookies['jwt'];
  // console.log(token);
  
  if(token){
  const decodedToken = await jwt.verify(token, process.env.SECRET_KEY);
  // console.log(decodedToken);
    if (!decodedToken) {
      console.log('Unauthorized');
      res.status(401).send('Unauthorized');
    } else {
      let user = await Register.findById(decodedToken._id);
      // console.log(user);
      res.locals.user = user;
      // console.log(req.locals.user);
      next();
    }
  } else {
    res.locals.user = null;
    // console.log(res.locals.user);
    next();
  }
  
};

module.exports = {auth, authenticate};