/**
 * @author [Muhammad Daffa Ilhami]
 * @email [mdaffailhami@gmail.com]
 * @create date 2021-03-04 | 20:24:29
 * @modify date 2021-03-05 | 16:07:15
 * @desc [description]
 */

// const translate = require("translate");
const express = require("express");
const randomWordsInEnglish = require("random-words");
const randomWordsInIndonesian = require("./my_node_modules/random-words-indonesian");

const app = express();

app.get("/file", (req, res) => {
  res.sendFile(__dirname + "/" + req.query.path);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/pages/index/index.html");
});

app.get("/word", (req, res) => {
  const wordAmount = Number(req.query.amount);

  if (req.query.language.toUpperCase() == "ENGLISH") {
    res.json({ language: "English", words: randomWordsInEnglish(wordAmount) });
  } else {
    res.json({ language: "Indonesian", words: randomWordsInIndonesian(wordAmount) });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server is running on port", port));
