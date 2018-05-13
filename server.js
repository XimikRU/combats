var express = require("express");

var app = express();

app.use(express.static(__dirname + "/pages"));

app.all("*", function(request, response){

    response.redirect("/login/");
});

app.listen(4444);