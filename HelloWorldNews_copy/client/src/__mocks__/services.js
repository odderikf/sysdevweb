// @flow


import type {typeArticle, typeComment} from "../services";

export class ArticleService {

    static getArticles(): Promise<typeArticle[]> {
        return new Promise((res,rej) => res(
            [
                {id_article: 1, title: "mocked cat", created: "",
                    content: "mocked ", image: "", category: "mocked_category",
                    important: true, upvotes: 50},
                {id_article: 2, title: "mocked cat 2", created: "",
                    content: "mocked ", image: "", category: "mocked_category",
                    important: true, upvotes: 50},
                {id_article: 3, title: "mocked cat 3", created: "",
                    content: "mocked ", image: "", category: "mocked_category",
                    important: true, upvotes: 50},

            ]
        ));
    }

    static getImportant(): Promise<typeArticle[]> {
        return new Promise((res,rej) => res(
            [
                {id_article: 1, title: "mocked important", created: "",
                    content: "mocked important", image: "", category: "mocked_category",
                important: true, upvotes: 50},
                {id_article: 2, title: "mocked important 2", created: "",
                    content: "mocked important", image: "", category: "mocked_category",
                    important: true, upvotes: 50},
                {id_article: 3, title: "mocked important 3", created: "",
                    content: "mocked important", image: "", category: "mocked_category",
                    important: true, upvotes: 50},

            ]
        ));
    }

    static getImportantArticleCount(): Promise<number> {
        return new Promise( res => res(3));
    }

    static getArticleCount(): Promise<number> {
        return new Promise( res => res(3));
    }

    static getArticle(a: typeArticle): Promise<typeArticle> {
        return new Promise((res, rej) => res(
            {
            id_article: 1,
            title: "Mocked Title",
            created: "",
            content: "Mocked Description",
            image: "",
            category: "js",
            important: true,
            upvotes: 1
            }
            ))
    }

    static getCategories(): Promise<string[]> {
        return new Promise((res, rej) => res(
            ["c++", "js", "java", "mocked_category"]
        ));
    }

    static getComments(a: typeArticle, p: number): Promise<typeComment[]>{
        return new Promise( (res, rej) => {
            res([
                {id_article: a.id_article, id_comment: 1, nick: "mocked_name1", content: "mocked_comment1"},
                {id_article: a.id_article, id_comment: 2, nick: "mocked_name2", content: "mocked_comment2"},
                {id_article: a.id_article, id_comment: 3, nick: "mocked_name3", content: "mocked_comment3"},
                ])
        })
    }

    static getCommentCounts(a: typeArticle): Promise<number>{
        return new Promise( (res, rej) => {
            res(3)
        })
    }

    static postedComment = false;

    static postComment(a: typeArticle, c: typeComment): Promise<Object>{
        this.postedComment = true;
        return new Promise( (res, rej) => {
            res(
                {status: 200}
            );
        })
    }

    static upvotedArticle = false;

    static upvoteArticle(a: typeArticle): Promise<Object>{
        this.upvotedArticle = true;
        return new Promise( res => {
            res( {status: 200 })
        })
    }
}