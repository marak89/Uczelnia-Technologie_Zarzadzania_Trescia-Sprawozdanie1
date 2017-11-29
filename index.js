var express = require('express');
var app = express();

var Redis = require('ioredis');
var redis = new Redis({
    port: 6379, // Redis port
    host: 'm89.eu', // Redis host
    family: 4, // 4 (IPv4) or 6 (IPv6)
    password: 'c005ec7b2d76a81430db3057472fd83bafc0d7f9ec0103a22a42d0a3eec3b81d',
    db: 3
});

app.get('/', function (req, res) {
    res.send('Hello World');
});

app.get('/', function (req, res) {
    res.send('Hello GET')
})

app.post('/', function (req, res) {
    res.send('Hello POST')
})

app.put('/', function (req, res) {
    res.send('Hello PUT')
})

app.delete('/', function (req, res) {
    res.send('Hello DELETE')
})

app.get('/date', function (req, res) {
    var dat = new Date();

    var curDate = dat.getDate() + "-" + dat.getMonth() + "-" + dat.getFullYear() + " ";
    curDate += dat.getHours() + ":" + dat.getMinutes();
    res.send('Hello current date:' + curDate);
});

app.get('/osoba', function (req, res) {
    redis.get('stud1', function (err, result) {
        res.send(result);
    });
});




app.get('/napis', function (req, res) {
    redis.get('pracownik:1:imie', function (err, result) {
        res.send(result);
    });
});


app.listen(3000);

