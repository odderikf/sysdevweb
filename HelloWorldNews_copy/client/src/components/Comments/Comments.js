import {Component} from "react-simplified";
import * as React from "react";

import styles from "./style.css"
import type {typeArticle, typeComment} from "../../services";
import {ArticleService} from "../../services";
import {Form, PageButtons} from "../Widgets/Widgets";

export default class Comments extends Component<{article: typeArticle, page: number}>{
    comments: typeComment[] = [];
    newComment: typeComment = {nick: "", content: ""};
    pageCount: number = 0;
    currentPage: number = 0;
    feedback_available = false;
    feedback = "";

    mounted(){
        if(this.props.page) this.currentPage = this.props.page;
        ArticleService.getComments(this.props.article, this.currentPage).then( coms => {
            if(coms) this.comments = coms;
        });
        ArticleService.getCommentCounts(this.props.article).then( c => {
            if(c) this.pageCount = Math.ceil(c/10);
        });
    }

    handleSubmit(e){
        e.preventDefault();
        ArticleService.postComment(this.props.article, this.newComment).then( r => {
            if(r.status == 200)
                ArticleService.getComments(this.props.article, this.currentPage).then(coms => {
                    if (coms) this.comments = coms;
                    this.feedback_available = true;
                    this.feedback = "Comment added";
                    this.newComment = {nick: "", content: ""};
                    ArticleService.getCommentCounts(this.props.article).then( coms => {
                        if(c) this.pageCount = Math.ceil(c/10);
                    });
                })
            }
        )
    }

    handlePageChange(page){
        ArticleService.getComments(this.props.article, page).then( coms => {
            if(coms) this.comments = coms;
        });
    }

    render(){
        return (
            <div className={styles.comments}>
                <label className={styles.feedbacklabel} style={{display: this.feedback_available}}>{this.feedback}</label>
                <Form onSubmit={this.handleSubmit}>
                    <p>Add a comment</p>
                    <Form.Label>Nick:
                        <Form.Input required type="text" value={this.newComment.nick}
                                    onChange={e => this.newComment.nick = e.target.value}/>
                    </Form.Label>
                    <Form.Label>Comment:
                        <Form.Input required type="text" value={this.newComment.content}
                                    onChange={e => this.newComment.content = e.target.value}/>
                    </Form.Label>
                    <Form.Submitter/>
                </Form>
                <PageButtons pageCount={this.pageCount} url={`/article/${this.props.article.id_article}`}
                    onUpdate={this.handlePageChange} />

                <div className={styles.commentlist}>
                    {this.comments.map( com => (
                        <div className={styles.comment}>
                            <label className={styles.nick}>{com.nick}</label>
                            <p className={styles.content}>{com.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}
