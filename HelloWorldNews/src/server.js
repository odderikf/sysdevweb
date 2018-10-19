// @flow

import express from 'express'
import mysql from 'mysql'
import bodyParser from 'body-parser'

let app = express();
let pool = mysql.createPool({
    connectionLimit: 3,
    host: "localhost",
    user: "browser",
    password: "",
    database: "HelloWorldNews",
    debug: false
});

let daos = require("./dao.js");
let articledao = new daos.article(pool);

app.use(express.static("public/"));

function def_query_handler(err, res, rows){
    if (err){
        console.log(err);
        res.json( {error: "error in querying"} );
    } else {
        res.json(rows)
    }
}

function def_insert_handler(err, res, rows){
    if (err) {
        console.log(err);
        res.status(500);
        res.json({error: "Feil ved insert"});
    } else {
        console.log("insert ok");
        res.send("");
    }
}

function def_delete_handler(err, res, rows){
    if (err) {
        console.log(err);
        res.status(500);
        res.json({error: "Feil ved deletion"});
    } else {
        console.log("delete ok");
        res.send("");
    }
}

app.use(bodyParser.json()); // for å tolke

app.get('/articles/important', (req, res) => articledao.getImportantArticles(req,res, def_query_handler));

app.get('/articles', (req, res) => articledao.getArticles(req, res, def_query_handler));

app.post('/articles', (req, res)=> articledao.postArticles(req,res,def_insert_handler));

app.get('/articles/:id', (req, res) => articledao.getArticle(req,res,def_query_handler));

app.put('/articles/:id', (req, res) => articledao.putArticle(req,res,def_insert_handler));

app.delete('/articles/:id', (req, res) => articledao.delete(req, res, def_delete_handler));

app.get("/article_categories", (req, res) =>  articledao.getCategories(req,res,def_query_handler));

app.put("/articles/:id/upvote", (req,res) => articledao.upvote(req, res, def_query_handler));

app.get("/articles/:id/comments", (req,res) => articledao.getComments(req, res, def_query_handler));

app.get("/articles/:id/comments/:page", (req,res) => articledao.getCommentsPage(req,res,def_query_handler));

app.post("/articles/:id/comments", (req,res) => articledao.postComments(req, res, def_insert_handler));

let server = app.listen(8080);