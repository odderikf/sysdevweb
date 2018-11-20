// @flow

import * as React from "react"
import ReactDOM from "react-dom"
import {Component} from "react-simplified"
import {BrowserRouter, NavLink, Route} from "react-router-dom"

import styles from "./style.css"

import Article from "./components/Article/Article"
import Articles from "./components/Articles/Articles"
import TopNav from "./components/TopNav/TopNav"
import EditArticle, {NewArticle} from "./components/EditArticle/EditArticle";
import type {typeArticle} from "./services";
import {getDateString} from "./components/Widgets/Widgets";
import {ArticleService} from "./services";

class Footer extends Component{
    render(){
        return (
            <footer className={styles.footer}>
                Contact us: odderikf@stud.ntnu.no
            </footer>
        )
    }
}
class Marquee extends Component{
    articles : typeArticle[] = [];
    currentArticle: Object|typeArticle = {title: "", id: "", created: ""};
    offset = 0;
    interval_switch_article: any = null;
    interval_get_articles: any = null;
    loaded = false;

    updateShown(){
        this.currentArticle = this.articles[this.offset];
        this.offset += 1;
        this.offset %= this.articles.length
    }
    mounted(){
        this.interval_switch_article = setInterval(() => {
            ArticleService.getArticles().then(a => {
                if(a.length) {
                    this.articles = a;
                    if (this.interval_switch_article === null){
                        this.interval_switch_article = setInterval(this.updateShown, 4000);
                    }
                    this.loaded = true;
                }
            });
        }, 10000);
        ArticleService.getArticles().then(a => {
            if(a.length) {
                this.articles = a;
                this.interval_switch_article = setInterval(() => {
                    this.currentArticle = this.articles[this.offset];
                    this.offset += 1;
                    this.offset %= this.articles.length
                }, 4000);
                this.loaded = true;
                this.updateShown();
            }
        });

    }

    unmounted(){
        clearInterval(this.interval_switch_article);
    }
    getArticle(){
        if(this.loaded)
            return   (
                <NavLink to={`/article/${this.currentArticle.id_article}`}>
                    <div className={styles.livefeedTitler}>
                        LIVE:
                        <label className={styles.marqtitle}>{this.currentArticle.title}</label>
                        <label className={styles.marqdate}>{getDateString(this.currentArticle.created)}</label>
                    </div>
                </NavLink>
            )
    }

    render(){
        return (
            <div className={styles.marquee}>
                <img className={styles.livefeedicon} src="livefeed.png" alt="live"/>
                <div className={styles.midmarquee}>
                    <div className={styles.innermarquee}>
                        {this.getArticle()}
                    </div>
                </div>
            </div>
        )
    }
}

const root = document.getElementById('root');
if(root){

    ReactDOM.render(
        <BrowserRouter>
            <div className={styles.react_root}>
                <TopNav/>
                <Route exact path="/" component={Marquee}/>
                <Route exact path="/" component={Articles}/>
                <Route path="/page/:page" component={Marquee}/>
                <Route path="/page/:page" component={Articles}/>
                <Route exact path="/category/:category" component={Articles}/>
                <Route path="/category/:category/page/:page" component={Articles}/>
                <Route path="/newArticle" component={NewArticle}/>
                <Route path="/editArticle/:id" component={EditArticle}/>
                <Route exact path="/article/:id/" component={Article}/>
                <Route path="/article/:id/page/:page" component={Article}/>
                <Footer/>
            </div>
        </BrowserRouter>,
        root)
}