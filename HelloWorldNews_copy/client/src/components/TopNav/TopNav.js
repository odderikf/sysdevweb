import {Component} from "react-simplified";
import {NavLink} from "react-router-dom";
import * as React from "react";

import styles from "./style.css";
import {ArticleService} from "../../services";

export default class TopNav extends Component{
    TopNavLink = class extends Component{
        render(){
            return (<NavLink {...this.props} className={styles.NavLink} activeClassName={styles.active}>{this.props.children}</NavLink>)

        }
    };

    categories: string[] = [];
    mounted(){
        ArticleService.getCategories().then(cats => this.categories = cats);
    }
    render(){
        return (
            <div className= {styles.TopNav}>
                <this.TopNavLink id="sitetitle" exact to="/" >HELLO WORLD NEWS</this.TopNavLink>
                {this.categories.map(cat =>
                    <this.TopNavLink to={"/category/"+cat}>{cat}</this.TopNavLink>
                )}
                <this.TopNavLink to="/newArticle">Make news</this.TopNavLink>
            </div>
        )
    }
}