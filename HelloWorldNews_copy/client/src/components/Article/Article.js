import {Component} from "react-simplified";
import * as React from "react";

import styles from "./style.css"
import type {typeArticle} from "../../services";
import {ArticleService} from "../../services";
import {Button, getDateString} from "../Widgets/Widgets";
import {NavLink, Redirect} from "react-router-dom";
import Comments from "../Comments/Comments";

export default class Article extends Component<{ match: { params: { id: string, page: string } } }>{
    article: typeArticle = {title: "Not found", image: "", content: "", upvotes: 0, id_article: -1};
    loaded = false;
    deleted = false;
    missing = false;
    page = 0;

    mounted(){
        this.article.id_article = parseInt(this.props.match.params.id);
        if(this.props.match.params.page) this.page = parseInt(this.props.match.params.page);
        ArticleService.getArticle(this.article).then(a => {
            if(a){
                this.article = a;
            } else {
                this.missing = true;
            }
            this.loaded = true;
        });
    }

    onDelete(){
        ArticleService.deleteArticle(this.article).then(r => {
            if(r.status == 200){
                this.deleted = true;
            }
        })
    }

    onUpvote(){
        ArticleService.upvoteArticle(this.article).then(r => {
            ArticleService.getArticle(this.article).then(a => {
                if(a) this.article = a;
            })
        })
    }

    setDefaultImg(e){
        if(this.loaded)
            e.target.src = "/article_images/default_"+this.article.category+".png";
        else
            e.target.src = "/article_images/default_unloaded.png";
    }

    render(){;
        if (this.deleted) return (<Redirect to={"/"}/>);
        else if(this.missing) return (
            <div className={styles.Article}>
                <h1 className={"Article not found"}>{this.article.title}</h1>
            </div>
        );
        else if(this.loaded) return (
            <div className={styles.Article}>
                <h1 className={styles.title}>{this.article.title}</h1>
                <h2 className={styles.category}>{this.article.category}</h2>
                <p className={styles.created}>{getDateString(this.article.created)}</p>
                <img onError={this.setDefaultImg} className={styles.image} src={this.article.image} />
                <p className={styles.bread}>{this.article.content}</p>
                <div className={styles.upvotes}>Upvotes: {this.article.upvotes}</div>
                <div className={styles.buttons}>
                    <NavLink to={"/editArticle/"+this.article.id_article}><Button value={"Edit article"}/></NavLink>
                    <Button.Danger value="Delete article" onClick={this.onDelete}/>
                    <Button value="upvote" onClick={this.onUpvote}/>
                </div>
                <hr/>
                <Comments article={this.article} page={this.page}/>
            </div>
        );
        else return (<div className={styles.Article}/>);
    }
}