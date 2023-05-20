const mongosse = require("mongoose");

mongosse.connect("mongodb://127.0.0.1/"+process.env.DB_HOST, {
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() => {
    console.log(`connection Successful`);
}).catch((e)  => {
    console.log(e);
})
