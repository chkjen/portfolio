require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function (req, res){
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){

   let firstName = req.body.fName;
   let lastName = req.body.lName;
   let email = req.body.email;
   let message = req.body.message;
   
   let data = {
       members: [
           {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }
       ]
   };

let jsonData = JSON.stringify(data);

let options = {
    url: "https://us4.api.mailchimp.com/3.0/lists/bdadab403a",
    method: "POST",
    headers: {
        "Authorization": process.env.AUTHORIZATION_KEY
    },
    body: jsonData
};

request(options, function(error, response, body){
    if(error) {       
        res.sendFile(__dirname + "/failure.html");     
    } else {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
                res.sendFile(__dirname + "/failure.html");
        }
        
    }
});
});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server started successfully.");
    
});


