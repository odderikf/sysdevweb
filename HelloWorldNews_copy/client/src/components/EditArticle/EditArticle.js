import {Component} from "react-simplified";
import * as React from "react";

import styles from "./style.css"
import type {typeArticle} from "../../services";
import {ArticleService} from "../../services";
import {Form} from "../Widgets/Widgets";
import {Redirect} from "react-router-dom";

type ArticleForm = Component& { submitted: boolean, missing: boolean, loaded: boolean, header_title: string,
                                handleSubmit: Event=>void, article: typeArticle,
                                 categories: string[]};

function articleForm(context: ArticleForm){
    if(context.submitted) return <Redirect to={"/article/"+context.article.id_article}/>;
    else if(context.missing) return <h1>404 Article not found</h1>;
    else if(context.loaded) return (
        <div className={styles.EditArticle}>
            <h1 className={styles.header}>{context.header_title}</h1>
            <Form onSubmit={context.handleSubmit} className={styles.form}>
                <label>Title:
                    <Form.Input maxLength="40" required type="text" value={context.article.title} onChange={e => context.article.title = e.target.value}/>
                </label>
                <br/>
                <Form.Label>Image:
                    <Form.Input maxLength="120" type="text" value={context.article.image} onChange={e => context.article.image = e.target.value}/>
                </Form.Label>
                <br/>
                <Form.Label className={styles.radiogroup}>Pick category:
                    <br/>
                    {context.categories.map(cat => (
                        <label>
                            <input type="radio" required value={cat} checked={context.article.category === cat}
                                   onChange={e => context.article.category = cat} className={styles.radio} />
                            {cat.toString()}
                            <br/>
                        </label>
                    ))}
                </Form.Label>
                <br/>
                <Form.Label>Important:
                    <input type="checkbox" className={styles.checkbox}
                           checked={context.article.important}
                           onChange={e => context.article.important = e.target.checked} />
                </Form.Label>
                <Form.Label>Main text:
                    <br/>
                    <textarea maxLength="1500" required className={styles.bread} value={context.article.content} onChange={e => context.article.content=e.target.value}/>
                </Form.Label>
                <br/>
                <Form.Submitter/>
            </Form>
        </div>
    );
    else return (
            <div className={styles.EditArticle}/>
        );
}

export default class EditArticle extends Component<ArticleForm&{match: { params: { id: string } }}>{
    header_title = "Edit article";
    loaded = false;
    missing = false;
    submitted = false;

    categories: string[] = [];
    article: typeArticle = {title: "Not found", image: "", content: "", upvotes: 0, id_article: -1};

    mounted(){

        this.article.id_article = parseInt(this.props.match.params.id);
        ArticleService.getArticle(this.article).then(a => {
            if(a){
                this.article = a;
            } else {
                this.missing = true;
            }
            this.loaded = true;
        });
        ArticleService.getCategories().then(cats => {
            this.categories = cats;
        })
    }

    handleSubmit(e){
        e.preventDefault();
        ArticleService.putArticle(this.article).then( () => {
            this.submitted = true;
        });
    }

    render(){
        return articleForm(this);
    }
}

export class NewArticle extends Component<ArticleForm> {
    header_title = "New article";
    loaded = true;
    missing = false;
    submitted = false;

    categories: string[] = [];
    article: typeArticle = {title: "", image: "", content: "", upvotes: 0, id_article: -1, important: false};

    mounted() {
        ArticleService.getCategories().then(cats => {
            this.categories = cats;
        })
    }

    handleSubmit(e){
        e.preventDefault();
        ArticleService.postArticle(this.article).then( res => {
            if (res.status == 200){
                ArticleService.getArticleByVals(this.article).then( a => {
                    this.article = a;
                    this.submitted = true;
                })
            } else {
                console.log("something went wrong");
            }
        });
    }

    render(){
        return articleForm(this);
    }
}