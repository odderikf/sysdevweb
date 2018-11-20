// @flow
import type mysql from "mysql";

const COMMENTS_PAGE_LIMIT = 10;
const ARTICLE_PAGE_LIMIT = 10;


type Request = express$Request;
type Response = express$Response;
type Connection = Connection;
type Rows = Object;
type Filldata = string | number | typeof undefined;

export class dao {
    pool: mysql.Pool;

    constructor(pool: mysql.Pool) {
        this.pool = pool
    }

    static def_query_handler(err: Error, res: Response, rows: Rows) {
        if (err) {
            console.log(err);
            res.json({error: "error in querying"});
        } else {
            res.json(rows)
        }
    };

    static def_insert_handler(err: Error, res: Response, rows: Rows) {
        if (err) {
            console.log(err);
            res.status(500);
            res.json({error: "Feil ved insert"});
        } else {
            res.send(rows);
        }
    };

    static def_delete_handler(err: Error, res: Response, rows: Rows) {
        if (err) {
            res.status(500);
            res.json({error: "Feil ved deletion"});
        } else if (rows.affectedRows === 0){
            res.status(404);

            res.json({error: "No element to delete"})
        } else {
            res.send("");
        }
    };

    query(req: Request, res: Response, querystring: string, filldata: Array<Filldata> | Filldata = [], f: Function = dao.def_query_handler) {
        this.pool.getConnection((err, connection: Connection) => {
            if (err) {
                console.error("could not connect to database");
                res.json({error: "error in connection"})
            } else {
                connection.query(
                    querystring,
                    filldata,
                    (err, rows) => {
                        connection.release();
                        f(err, res, rows)
                    }
                )
            }
        });
    }
}


export class article extends dao {

    getArticles(req: Request, res: Response) {
        let page = 0;
        if(req.query.page) page = req.query.page;
        if (req.query.category !== undefined)
            this.query(req, res, "select id_article, title, created, image, category, upvotes from article where category=?\n" +
                "ORDER BY (UNIX_TIMESTAMP(created)-UNIX_TIMESTAMP(NOW())+100000*log10(upvotes)) DESC \n" +
                "LIMIT ?, ?",
                // $FlowFixMe
                [req.query.category, (parseInt(page)) * COMMENTS_PAGE_LIMIT, COMMENTS_PAGE_LIMIT]
            );
        else
            this.query(req, res, "select id_article, title, created, image, category, upvotes, important from article\n"
            +   "ORDER BY (UNIX_TIMESTAMP(created)-UNIX_TIMESTAMP(NOW())+100000*log10(upvotes)) DESC \n" +
                "LIMIT ?, ?",
                [parseInt(page) * COMMENTS_PAGE_LIMIT, COMMENTS_PAGE_LIMIT]
            );

    }

    getImportantArticles(req: Request, res: Response) {
        let page = 0;
        if(req.query.page) page = req.query.page;
        this.query(req, res, "select id_article, title, created, image, category, upvotes from article where important=TRUE \n" +
            " ORDER BY (UNIX_TIMESTAMP(created)-UNIX_TIMESTAMP(NOW())+100000*log10(upvotes)) DESC \n" +
            "LIMIT ?, ?",
            [(parseInt(page)) * COMMENTS_PAGE_LIMIT, COMMENTS_PAGE_LIMIT]);
    }

    postArticles(req: Request, res: Response) {
        this.query(req, res,
            "insert into article (title, created, content, image, category, important) VALUES (?,?,?,?,?,?);\n",
            // $FlowFixMe
            [req.body.title, req.body.created, req.body.content, req.body.image, req.body.category, req.body.important],
            dao.def_insert_handler);
    }

    getArticle(req: Request, res: Response) {
        this.query(req, res,
            "select id_article, title, created, content, image, category, upvotes, important from article where id_article=?",
            req.params.id
        );
    }

    getArticleByVals(req: Request, res: Response){
        this.query(req, res,
            "select id_article, title, created, content, image, category, upvotes, important from article where title=? and created=? and category=?",
            // $FlowFixMe
            [req.query.title, req.query.created, req.query.category]
        );
    }

    putArticle(req: Request, res: Response) {
        this.query(req, res,
            "update article SET title=?, content=?, image=?, category=?, important=? WHERE id_article=?",
            // $FlowFixMe
            [req.body.title, req.body.content, req.body.image, req.body.category, req.body.important, req.params.id],
            dao.def_insert_handler
        );
    }

    deleteArticle(req: Request, res: Response) {
        this.query(req, res,
            "DELETE FROM article WHERE article.id_article=?",
            [req.params.id],
            dao.def_delete_handler
        );
    }

    getCategories(req: Request, res: Response, callback: Function) {
        this.query(req, res,
            "SELECT name FROM article_categories",
            [],
            callback
        );
    }

    upvote(req: Request, res: Response) {
        this.query(req, res,
            "UPDATE article SET upvotes=upvotes+1 WHERE id_article=?",
            [req.params.id]
        );
    }

    getComments(req: Request, res: Response) {
        this.query(req, res,
            "SELECT id_comment, nick, content FROM comment WHERE id_article=? LIMIT ?",
            [req.params.id, COMMENTS_PAGE_LIMIT]
        );
    }

    getCommentsPage(req: Request, res: Response) {
        this.query(req, res,
            "SELECT id_comment, nick, content FROM comment WHERE id_article=? LIMIT ?,?",
            [req.params.id, (parseInt(req.params.page)) * COMMENTS_PAGE_LIMIT, COMMENTS_PAGE_LIMIT]
        );
    }

    getCommentsCount(req: Request, res: Response) {
        this.query(req, res,
            "SELECT (COUNT(id_comment)) as count FROM comment where id_article=?",
            [req.params.id]);
    }

    postComments(req: Request, res: Response) {
        this.query(req, res,
            "INSERT INTO comment (id_article, nick, content) VALUES (?,?,?)",
            // $FlowFixMe
            [req.params.id, req.body.nick, req.body.content]
        )
    }

    getArticleCount(req: Request, res: Response) {
        if(req.query.category)
            this.query(req, res,
                "SELECT COUNT(id_article) as count FROM article WHERE category = ?",
                // $FlowFixMe
                req.query.category
            );
        else
            this.query(req, res,
                "SELECT COUNT(id_article) as count FROM article",
                // $FlowFixMe
                req.query.category
            );
    }

    getImportantArticleCount(req: Request, res: Response) {
        this.query(req, res,
            "SELECT COUNT(id_article) as count FROM article WHERE important = true"
        )
    }
}