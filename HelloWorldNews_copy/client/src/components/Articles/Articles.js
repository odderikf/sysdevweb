// @flow
import {Component} from "react-simplified";
import * as React from "react";
import styles from "./style.css"
import {ArticleService} from "../../services";
import type {typeArticle} from "../../services"
import {NavLink} from "react-router-dom";
import {getDateString, PageButtons} from "../Widgets/Widgets";

class ArticleElement extends Component<{article: typeArticle }>{

    setDefaultImg(e){
        e.target.src = "/article_images/default_"+this.props.article.category+".png";
    }

    render(){
        return (
            <li className={styles.article_element + " list-group-item"}>
                <div className={styles.flexrow1}>
                    <NavLink to={"/article/"+this.props.article.id_article} className={styles.article_title}>{this.props.article.title}</NavLink>
                    <NavLink to={"/article/"+this.props.article.id_article} className={styles.article_img}>
                        <img onError={this.setDefaultImg} src={this.props.article.image}/>
                    </NavLink>
                </div>
                <div className={styles.flexrow2}>
                    <p className={styles.article_category}>{this.props.article.category}</p>
                    <p className={styles.article_date}>{getDateString(this.props.article.created)}</p>
                    <p className={styles.article_upvotes}>{"upvotes: "+this.props.article.upvotes}</p>
                </div>
            </li>
        )
    }
}

export default class Articles extends Component<{ match: { params: { category: ?string, page: ?string|number } } }>{
    articles: Array<typeArticle> = [];
    loaded: boolean = false;
    pageCount: number = 0;

    mounted(){
        if (this.props.match.params.category) {
            let page = 0;
            if( this.props.match.params.page) page = this.props.match.params.page;

            ArticleService.getArticles(this.props.match.params.category, page)
                .then(l => {
                    if(l) {
                        this.articles = l;
                    }
                    this.loaded = true;
                });
            //$FlowFixMe
            ArticleService.getArticleCount(this.props.match.params.category)
                .then(c => {
                    if(c) this.pageCount = Math.ceil(c/10);
                    else c = 0;
                });

        } else {
            let page = 0;
            if(this.props.match.params.page) page = this.props.match.params.page;
            ArticleService.getImportant(page).then(l => {
                if(l) {
                    this.articles = l;
                }
                this.loaded = true;

            });
            ArticleService.getImportantArticleCount()
                .then(c => {
                    if(c) this.pageCount =  Math.ceil(c/10);
                    else c = 0;
                })
        }
    }

    handlePageChange(page: string){

    }

    render(){
        let url: string;
        if(this.props.match.params.category) url = `/category/${this.props.match.params.category}`;
        else url = '';
        if(this.articles.length)
            return (
                <>
                <PageButtons pageCount={this.pageCount} url={url} onUpdate={this.handlePageChange}/>
                <div className={styles.article_list + "list-group"}>
                    {(this.loaded && this.articles.length ?
                            this.articles.map( art =>
                        (this.articles.length ? <ArticleElement article={art}/>
                            :
                        <p className={styles.empty_list_notice}>No articles found</p>)
                    ) : <div/>)}
                </div>
                </>
            );
        else return (
            <p>No articles found</p>
        )
    }
}