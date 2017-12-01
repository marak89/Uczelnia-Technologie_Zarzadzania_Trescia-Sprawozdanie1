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

var pracownicy = [];
var tmp = null;

var html_HEAD = `
<!doctype html>
<html>
<head>
<link rel="icon" type="image/x-icon" href="https://m89.eu/favicon.ico" />
<title>Technologie Zarządzania Treścią - Sprawozdanie 1</title>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb" crossorigin="anonymous">
</head>
<body>
<div class="container-fluid">
<h2>Witaj w systemie zarządzania firmą.</h2>
    <p>Wybierz interesujący cię dział.</p>
<a class="btn btn-primary" href="/">Home</a>
    <a class="btn btn-primary" href="/pracownicy">Pracownicy</a>
    <a class="btn btn-primary" href="/dzialy">Dzialy</a>
<br />
`;

var html_FOOT = `
</div>
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js" integrity="sha384-vFJXuSJphROIrBnz7yo7oB41mKfc8JzQZiCq4NCceLEaO4IHwicKwpJf9c9IpFgh" crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min.js" integrity="sha384-alpBpkh1PFOepccYVYDB4do5UnbKysX5WZXm3XxPqe5iKTfUKjNkCk9SaVuEZflJ" crossorigin="anonymous"></script>
</body>
</html>
`;

app.get('/', function (req, res) {
    var pageContent = `
Firma XYZ zajmuje się ...
`;


    var html_content = '';
    html_content += html_HEAD;
    html_content += pageContent;
    html_content += html_FOOT;

    res.send(html_content);
});

app.post('/', function (req, res) {
    res.send('Hello POST')
})

app.get('/pracownicy', function (req, res) {
    var pracownicy = [];
    var dane = "";
    var pipeline = redis.pipeline();
    var tmp = 1;
    redis.keys('pracownik:*', function (err, keys) {
        for (var i = 0; i < keys.length; i++) {
            pipeline.get(keys[i]);
            pracownicy[keys[i]] = [];
        }

        pipeline.exec(function (err, result) {
            var cnt = 0;
            for (prop in pracownicy) {
                pracownicy[prop] = result[cnt][1];
                cnt++;
            }

            var tablicaPracownicy = [];
            for (prop in pracownicy) {
                tmp = prop.split(':');
                if (!Array.isArray(tablicaPracownicy[tmp[1]])) {
                    tablicaPracownicy[tmp[1]] = [];
                    tablicaPracownicy[tmp[1]]['id'] = tmp[1];
                }
                tablicaPracownicy[tmp[1]][tmp[2]] = pracownicy[prop];
            }

            var pageContent = '<h3>Lista pracowników</h3>';
            pageContent += `<table class="table table-hover table-bordered ">
<thead>
<tr>
<th>id</th>
<th>Imię</th>
<th>Nazwisko</th>
<th>Adres</th>
<th>Miejscowość</th>
</tr>
            <tbody>
`;
            for (var i = 1; i < tablicaPracownicy.length; i++) {
                pageContent += `<tr>
<td>${tablicaPracownicy[i]['id']}</td>
<td>${tablicaPracownicy[i]['imie']}</td>
<td>${tablicaPracownicy[i]['nazwisko']}</td>
<td>${tablicaPracownicy[i]['adres']}</td>
<td>${tablicaPracownicy[i]['miejscowosc']}</td>
`;
            }

            pageContent += '</tbody></table>';
            var html_content = '';
            html_content += html_HEAD;
            html_content += pageContent;
            html_content += html_FOOT;
            res.send(html_content);
        });
    });
});


app.get('/napis', function (req, res) {
    redis.get('pracownik:1:imie', function (err, result) {
        res.send(result);
    });
});


app.listen(3000);

