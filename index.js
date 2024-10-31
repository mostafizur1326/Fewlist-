require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

let old_path;

//Parsers
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.get('/', (req, res) => {
  fs.readdir('./files', (err, files) => {
    if (err) {
      console.error("Directory read error:", err);
      res.render('error', { message: "Cannot read files." });
    } else {
      res.render('index', { files: files });
    }
  });
});

app.post('/create', (req, res) => {
  if (req.body.title === '') {
    res.render('error', { message: "Title cannot be empty." });
  } else {
    fs.writeFile(`./files/${req.body.title}`, req.body.description, (err) => {
      if (err) {
        console.error("File creation error:", err);
        res.render('error', { message: "Failed to create file." });
      } else {
        res.redirect('/');
      }
    });
  }
});

app.get('/show/:readfile', (req, res) => {
  fs.readFile(`./files/${req.params.readfile}`, 'utf-8', (err, data) => {
    if (err) {
      console.error("File read error:", err);
      res.render('error', { message: "Cannot read file." });
    } else {
      res.render('show', { data: data, title: req.params.readfile });
    }
  });
});

app.get('/update/:updatefile', (req, res) => {
  fs.readFile(`./files/${req.params.updatefile}`, 'utf-8', (err, data) => {
    if (err) {
      console.error("File read error:", err);
      res.render('error', { message: "Cannot read file for updating." });
    } else {
      res.render('update', { data: data, title: req.params.updatefile });
      old_path = `./files/${req.params.updatefile}`;
    }
  });
});

app.post('/update', (req, res) => {
  fs.rename(old_path, `./files/${req.body.update_title}`, (err) => {
    if (err) {
      console.error("File rename error:", err);
      res.render('error', { message: "Failed to rename file." });
    } else {
      fs.writeFile(`./files/${req.body.update_title}`, req.body.update_description, (err) => {
        if (err) {
          console.error("File update error:", err);
          res.render('error', { message: "Failed to update file." });
        } else {
          res.redirect('/');
        }
      });
    }
  });
});

app.get('/delete/:deletefile', (req, res) => {
  fs.unlink(`./files/${req.params.deletefile}`, (err) => {
    if (err) {
      console.error("File delete error:", err);
      res.render('error', { message: "Cannot delete file." });
    } else {
      res.redirect('/');
    }
  });
});

//Server
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});