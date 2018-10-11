var bodyParser = require('body-parser');
const express = require('express')
const app = express()
const port = 3000

const Article_DB = [];
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

app.post('/article/add', (req, res) => {
  req.body.data.id = Article_DB.length + 1;
  Article_DB.push(req.body.data);
  res.send('ok');
})

app.post('/article/update', (req, res) => {
  const id = parseInt(req.body.data.id) - 1;
  Article_DB[id] = req.body.data;
  res.send('ok');
})


app.get('/article', (req, res) => {
  res.send(Article_DB);
})

app.get('/article/get', (req, res) => {
  const id = parseInt(req.query.id) - 1;
  res.send(Article_DB[id]);
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))