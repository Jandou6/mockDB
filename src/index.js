var bodyParser = require('body-parser');
const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const port = 3000
const DB_PATH = path.resolve(__dirname, './data_backup.json');

let Article_DB = [];
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
  saveData(() => {res.send('ok');})
})

app.post('/article/update', (req, res) => {
  const id = parseInt(req.body.data.id) - 1;
  Article_DB[id] = req.body.data;
  saveData(() => {res.send('ok');})
})


app.get('/article', (req, res) => {
  res.send(Article_DB);
})

app.get('/article/get', (req, res) => {
  const id = parseInt(req.query.id) - 1;
  res.send(Article_DB[id]);
})


function saveData(cb = () => {}) {
  const json_data = JSON.stringify(Article_DB);
  fs.writeFile(DB_PATH, json_data, cb);
}

function resetDate() {
  try {
    const json_data = require(DB_PATH);
    Article_DB = json_data;
  } catch (e) {
    console.log('备份文件找不到，初始化数据');
    Article_DB = [];
  }
}

function backup_timer () {
  const TIME = 1000 * 60 * 60 * 0.5; // 0.5h;
  setInterval(() => {
    const BACKUP_PATH = path.resolve(__dirname, `../back_up/article_backup_${+new Date()}.json`);
    const json_data = JSON.stringify(Article_DB);
    fs.writeFile(BACKUP_PATH, json_data, () => {});
  }, TIME);
}


app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
  resetDate();
  backup_timer();
})