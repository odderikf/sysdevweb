import * as React from 'react';
import { Component } from 'react-simplified';

import styles from "./style.css"
import {NavLink} from "react-router-dom";

export function getDateString(date: string){
    let d: Date = new Date(date);
    return `${d.getFullYear()}/${d.getMonth()}/${d.getDay()} `
        + `${d.getHours() > 9 ? d.getHours() : '0'+d.getHours()}:`
        + `${(d.getMinutes() > 9) ? d.getMinutes() : '0'+d.getMinutes()}`
}

export class ListGroup extends Component {
    render() {
        return (
            <ul className="list-group">
                {this.props.children}
            </ul>
        );
    }

    static Item = class extends Component {
        render() {
            return (
                <li className="list-group-item" {...this.props}>
                    {this.props.children}
                </li>
            );
        }
    };
}

export class Form extends Component{
    render() {
        return (
            <form {...this.props}>{this.props.children}</form>
        );
    }

    static Input = class extends Component {
        render() {
            return (
                <input className="form-control" {...this.props}>{this.props.children}</input>
            )
        }
    };

    static Label = class extends Component {
        render() {
            return (
                <label {...this.props}>{this.props.children}</label>
            )
        }
    };

    static Entry = class extends Component {
        render() {
            return (
                <div className="form-group bg-light" {...this.props}>
                    {this.props.children}
                </div>
            )
        }
    };

    static Submitter = class extends Component {
        static defaultProps = {
            children : "Submit"
        };

        render() {
            return (
                <button type="submit" className="btn btn-primary" {...this.props}>{this.props.children}</button>
            )
        }
    };
}

export class Button extends Component {
    render() {
        return (
            <input type="button" className="btn btn-primary" {...this.props} />
        )
    }
    static Danger = class extends Component{
        render() {
            return (
                <input type="button" className="btn btn-danger" {...this.props} />
            )
        }
    }
}

export class PageButtons extends Component<{pageCount: number, url: string, onUpdate: any}> {
    currentPage = 0;

    updatePage(e){
        this.currentPage = e.target.value;
        this.props.onUpdate(this.currentPage);
    }

    render(){
        return (
            <div className={styles.pageButtons}>
                {[...Array(this.props.pageCount)].map((e, i) =>
                    <NavLink to={`${this.props.url}/page/${i}`}>
                        <Button value={i} onClick={this.updatePage}/>
                    </NavLink>
                )}
            </div>
        )
    }

}