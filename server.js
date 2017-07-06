var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var mysql = require("mysql");

var app = express();
var port = 3000;
var deleted = [];


// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(__dirname + "/public"));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));

app.set("view engine", "handlebars");


var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "burgers"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);

});

app.get("/", function(req, res) {
  connection.query("SELECT * FROM new_burger;", function(err, data) {
    if (err) {
      throw err;
    }
  
  /*
  connection.query("SELECT * FROM deleted;", function(err2, deletedData) {
    if (err2) {
      throw err;
    }
  */
  
    res.render("index", { burger: data, deleted: deleted });

    });
  });
//});

app.post("/", function(req, res) {
  connection.query("INSERT INTO new_burger (burger) VALUES (?)", [req.body.burger], function(err, result) {
    if (err) {
      throw err;
    }
    res.redirect("/");
  });
});


app.delete("/:id", function(req, res) {
  connection.query("DELETE FROM new_burger WHERE id = ?", [req.params.id], function(err, result) {
    if (err) {
      throw err;
    }
  /*  
  connection.query("INSERT INTO deleted (del_movie) VALUES (?)", [req.body.movie], function(err2, result2) {
    if (err) {
      throw err;
    }
  */
  deleted.push( {burger: req.body.burger} );
  console.log(deleted);
    res.redirect("/");  
    });
  });
//});



app.listen(port);
