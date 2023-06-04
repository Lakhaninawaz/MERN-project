const mongosse = require("mongoose");

mongosse.connect(process.env.DB_URI, {
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() => {
    console.log(`connection Successful`);
}).catch((e)  => {
    console.log(e);
})
