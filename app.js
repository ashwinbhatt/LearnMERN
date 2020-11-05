const express = require("express")
const app = express()
const mongoose = require('mongoose')
const PORT = process.env.PORT || 10000;
const {MONGOURI} = require('./keys')


mongoose.connect(MONGOURI ,{useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.on('connected', ()=> {
    console.log("MongoDB connected");
})

mongoose.connection.on('error', (err)=>{
    console.log("MongoDB failed to connect", err)
})


require('./models/user')
require('./models/post')
mongoose.model("User")


function middleWareFunction(req, res, next){
    console.log("Middle-ware Entered")
    next()
}


app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))

app.get("/",middleWareFunction ,(req, res)=>{
    res.send("Hello fellow user")
});



app.listen(PORT, () => {
    console.log("Server is runnnig on port",PORT)
});
