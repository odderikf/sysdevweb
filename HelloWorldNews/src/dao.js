
const COMMENTS_PAGE_LIMIT = 20;

class dao{
    constructor(pool){
        this.pool=pool
    }

    query(req, res, querystring, callback, filldata=[]){
        this.pool.getConnection( (err, connection) => {
            if(err) {
                console.error("could not connect to database");
                res.json({error: "error in connection"})
            } else {
                connection.query(
                    querystring,
                    filldata,
                    (err, rows) => {
                        connection.release();
                        callback(err,res, rows)
                    }
                )
            }
        } );
    }
}


class article extends dao{

    getArticles(req, res, callback){
        if (req.query.category !== undefined)
            this.query(req,res,"select id_article, title, created, image, category, upvotes from article where category=? " +
                "ORDER BY (UNIX_TIMESTAMP(created)-UNIX_TIMESTAMP(NOW())+100000*log10(upvotes)) DESC",
                callback,
                req.query.category);
        else
            this.query(req,res, "select id_article, title, created, image, category, upvotes, important from article", callback);

    }
    getImportantArticles(req, res, callback){
        return this.query(req, res, "select id_article, title, created, image, category, upvotes from article where important=TRUE", callback);
    }

    postArticles(req, res, callback){
        this.query(req,res,
            "insert into article (title, created, content, image, category, important) VALUES (?,?,?,?,?,?)",
            callback,
            [req.body.title, req.body.created, req.body.content, req.body.image, req.body.category, req.body.important]
        );
    }

    getArticle(req, res, callback){
        this.query(req,res,
            "select id_article, title, created, content, image, category, upvotes, important from article where id_article=?",
            callback,
            req.params.id
        );
    }

    putArticle(req, res, callback){
        this.query(req,res,
            "update article SET title=?, content=?, image=?, category=?, important=? WHERE id_article=?",
            callback,
            [req.body.title, req.body.content, req.body.image, req.body.category, req.body.important, req.params.id]
        );
    }
    deleteArticle(req, res, callback){
        this.query(req,res,
            "DELETE FROM article WHERE article.id_article=?",
            callback,
            [req.params.id]
        );
    }

    getCategories(req, res, callback){
        this.query(req,res,
            "SELECT name FROM article_categories",
            callback
        );
    }

    upvote(req, res, callback){
        this.query(req,res,
            "UPDATE article SET upvotes=upvotes+1 WHERE id_article=?",
            callback,
            [req.params.id]
        );
    }

    getComments(req, res, callback){
        this.query(req,res,
            "SELECT nick, content FROM comment WHERE id_article=? LIMIT 20",
            callback,
            [req.params.id]
        );
    }

    getCommentsPage(req, res, callback){
        this.query(req,res,
            "SELECT nick, content FROM comment WHERE id_article=? LIMIT ?,?",
            callback,
            [req.params.id, parseInt(req.params.id)*COMMENTS_PAGE_LIMIT, (parseInt(req.params.id)+1)*COMMENTS_PAGE_LIMIT ]
        );
    }
    postComments(req, res, callback){
        this.query(req,res,
            "INSERT INTO comment (id_article, nick, content) VALUES (?,?,?)",
            callback,
            [req.params.id, req.body.nick, req.body.content]
        );
    }
}


module.exports.dao = dao;
module.exports.article = article;
module.exports.COMMENTS_PAGE_LIMIT = COMMENTS_PAGE_LIMIT;