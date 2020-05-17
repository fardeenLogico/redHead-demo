var express = require('express');
var app = express();
var mongodb = require('mongodb')
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
// var MongoClient = require('mongoose');
// var url = "mongodb://localhost:27017/bbei8cecgjhgsb3"
// var url = "mongodb://localhost/bbei8cecgjhgsb3"
var url = "mongodb://ucjbgiiwo4iruvbvwt47:YbuirFN3rHhCfR5OrCJ2@bbei8cecgjhgsb3-mongodb.services.clever-cloud.com:27017/bbei8cecgjhgsb3"

var os = require('os')
var NodePort = 8080
var fs = require('fs');

let allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "*");
    next();
}
app.use(express.json({
    type: ['application/json', 'text/plain']
}))
var urlencodedParser = bodyParser.urlencoded({ extended: false })
// app.use(allowCrossDomain)

app.post('/add', urlencodedParser, function (req, res) {
    // res.header('Access-Control-Allow-Origin', "*");
    var response = req.body
    if (response) {
        // BranchArr.push(response)
        console.log(response)
        MongoClient.connect(url, function (err, db) {
            if (err) console.log(err.message);
            var dbo = db.db("bbei8cecgjhgsb3")
            dbo.collection("user").insertOne(response, function (err, ress) {
                if (err) console.log(err.message);
                console.log("1 document inserted");
                res.send({ message: 'document inserted succesfully' })
                db.close();
            });
        });
    }
});

app.get('/read', function (req, res) {
    // res.header('Access-Control-Allow-Origin', "*");
    MongoClient.connect(url, function (err, db) {
        if (err) console.log(err, 'db');
        var dbo = db.db("bbei8cecgjhgsb3");
        dbo.collection("user").find({}).toArray(function (err, result) {
            if (err) console.log(err, 'gffd');
            // console.log(result);
            let userArr = result
            res.send(userArr)
            db.close();
            res.end()
        });
    });
    // }

});
app.post('/update', (req, res) => {
    var response = req.body.newObj
    if (res) {
        // var index = req.query.index
        var obj = response
        // console.log(JSON.stringify(response), index)
        var oldObj = req.body.oldObj
        var newobj = { $set: obj }
        MongoClient.connect(url, function (err, db) {
            if (err) console.log(err);
            var dbo = db.db("bbei8cecgjhgsb3");
            dbo.collection("user").updateOne(oldObj, newobj, function (err, ress) {
                if (err) console.log(err);
                console.log("1 document updated");
                res.send("updated succesfully")
                db.close();
            });
        });
        res.end()
    }
})
app.post('/delete', (req, res) => {
    if (res) {
        if (req.body.email) {
            // arr.splice(req.query.index, 1)
            MongoClient.connect(url, function (err, db) {
                if (err) console.log(err);
                var dbo = db.db("bbei8cecgjhgsb3");
                var obj = { email: req.body.email }
                dbo.collection("user").deleteOne(obj, function (err, obj) {
                    if (err) console.log(err);
                    res.send('delete user suucessfully')
                    db.close();
                });
            });
            res.end()
        }
    }
})

var server = app.listen(NodePort, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})