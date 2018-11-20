// @flow

export type typeArticle = {
    id_article: number;
    title: string;
    created: string;
    content: string;
    image: string;
    category: string;
    important: boolean;
    upvotes: number;
}

export type typeComment = {
    id_comment: number;
    id_article: number;
    nick: string;
    content: string;
}

export class ArticleService {

    static getImportant(page: string|number = 0): Promise<typeArticle[]> {
        return fetch(`/api/articles/important?page=${page}`).then(v => v.json());
    };

    static getArticles(category: ?string, page: string|number = 0): Promise<typeArticle[]>{
        let p: Promise<Response>;
        if(category) p = fetch(`/api/articles?category=${category}&page=${page}`);
        else p = fetch(`api/articles?page=${page}`);
        return p.then(v => v.json())
    }

    static postArticle(a: typeArticle): Promise<Response>{
        if(a.created === undefined){
            a.created = new Date().toISOString().slice(0, 19).replace('T', ' ');
        }
        return fetch('/api/articles', {
            method: "POST",
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify(a)
        })
    }

    static getArticle(a: typeArticle): Promise<typeArticle> {
        return fetch(`/api/articles/${a.id_article}`).then(v => v.json()).then(v => v[0]);
    }

    static putArticle(a: typeArticle): Promise<void> {
        return fetch(`/api/articles/${a.id_article}`, {
            method: "PUT",
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify(a)
        }).then(r=>{});
    }

    static deleteArticle(a: typeArticle): Promise<Response> {
        return fetch(`/api/articles/${a.id_article}`, {
            method: "DELETE",
            body: JSON.stringify({id_article: a.id_article})
        });
    }

    static upvoteArticle(a: typeArticle): Promise<void> {
        return fetch(`/api/articles/${a.id_article}/upvote`, {
            method: "PUT",
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify({id_article: a.id_article})
        }).then(r=>{});
    }

    static getComments(a: typeArticle, page: ?number|string): Promise<typeComment[]>{
        if(!page) page = "";
        return fetch(`/api/articles/${a.id_article}/comments/${page}`)
            .then(v => v.json());
    }

    static getCommentCounts(a: typeArticle): Promise<number> {
        return fetch(`/api/articles/${a.id_article}/commentcount`)
            .then( r => r.json())
            .then( json => json[0].count);
    }

    static getArticleCount(category: string): Promise<number> {
        return fetch(`/api/articlecount?category=${category}`)
            .then( r => r.json() )
            .then( json => json[0].count );
    }

    static getImportantArticleCount(): Promise<number> {
        return fetch(`/api/importantarticlecount`)
            .then( r => r.json() )
            .then( json => json[0].count )
    }

    static postComment(a: typeArticle, c: typeComment): Promise<Response> {
        return fetch('/api/articles/'+a.id_article+'/comments', {
            method: 'POST',
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify(c)
        });
    }

    static getCategories(): Promise<?string[]> {
        return fetch('/api/article_categories').then(r=>r.json()).then(r => {
            if(r) return r.map(e => e.name)
        });
    }

    static getArticleByVals(a: typeArticle): Promise<typeArticle> {
        return fetch(`/api/articleByVals?title=${a.title}&created=${a.created}&category=${a.category}`)
        .then(v => v.json()).then(v => v[0]);
    }


}
