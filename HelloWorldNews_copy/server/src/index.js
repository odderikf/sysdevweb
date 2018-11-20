// @flow

import express from 'express';
import * as bodyParser from 'body-parser';
import * as mysql from 'mysql';
import path from "path";

import * as dao from './dao.js';
import config from '../config'

import type {Server} from 'http'
type Application = express$Application

export let app: Application = express();

export function create_app(pool: ?mysql.Pool) {
    if (pool === undefined)
        pool = mysql.createPool(config.mysql_props);
    let articleDao = new dao.article(pool);
    let client_public = path.join(__dirname,'..','..', config.client_props.public);

    app.use(bodyParser.json()); // for å tolke

    app.get('/api/articles/important', (req, res) => {
        articleDao.getImportantArticles(req, res);
    });

    app.get('/api/articles', (req, res) => {
        articleDao.getArticles(req, res);
    });

    app.post('/api/articles', (req, res) => {
        articleDao.postArticles(req, res);
    });

    app.get('/api/articles/:id', (req, res) => {
        articleDao.getArticle(req, res);
    });

    app.put('/api/articles/:id', (req, res) => {
        articleDao.putArticle(req, res);
    });

    app.delete('/api/articles/:id', (req, res) => {
        articleDao.deleteArticle(req, res);

    });

    app.get('/api/article_categories', (req, res) => {
        articleDao.getCategories(req, res);
    });

    app.put('/api/articles/:id/upvote', (req, res) => {
        articleDao.upvote(req, res);
    });

    app.get('/api/articles/:id/comments', (req, res) => {
        articleDao.getComments(req, res)
    });

    app.get('/api/articles/:id/comments/:page', (req, res) => {
        articleDao.getCommentsPage(req, res)
    });

    app.get('/api/articles/:id/commentcount', (req, res) => {
        articleDao.getCommentsCount(req,res)
    });

    app.get('/api/articlecount', (req, res) => {
        articleDao.getArticleCount(req,res)
    });


    app.get('/api/importantarticlecount', (req, res) => {
        articleDao.getImportantArticleCount(req,res)
    });

    app.post('/api/articles/:id/comments', (req, res) => {
        articleDao.postComments(req, res)
    });

    app.get('/api/articleByVals', (req, res) => {
        articleDao.getArticleByVals(req, res);
    });
    app.get('/article_images/*', (req, res, next) => {
        res.sendFile(path.join(client_public, req.url), {}, (err)=>{
            if(err) next();
        });
    });

    app.get('*', (req, res, next) => {
        let options = {
        };
        let file = "index.html";
        if(req.url.includes('.')){
            file = req.url.split('/').pop();
        }
        res.sendFile(path.join(client_public, file), options, (err)=>{
            if(err) next();
        });
    });

    return app;
}

if (require.main === module) {
    let port = config.api_props.port;
    process.argv.forEach((e, i) => {
        switch (e) {
            case "-p":
                port = parseInt(process.argv[i + 1]);
                break;
            default:
                break;
        }
    });
    let pool = mysql.createPool(config.mysql_props);
    let app: Application = create_app(pool);
    // eslint-disable-next-line
    let index: Server = app.listen(port);
}

