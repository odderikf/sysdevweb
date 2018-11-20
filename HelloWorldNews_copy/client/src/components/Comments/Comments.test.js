// @flow

import * as React from 'react';
import { mount } from 'enzyme';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Comments from "./Comments";
import type {typeArticle} from "../../services";
import {ArticleService} from "../../__mocks__/services";
import {BrowserRouter} from "react-router-dom";

jest.mock("../../services.js", ()=> require("../../__mocks__/services.js"));

configure({ adapter: new Adapter() });


let article: typeArticle = {
    id_article: 1,
    title: "Mocked Title",
    created: "",
    content: "Mocked Description",
    image: "",
    category: "js",
    important: true,
    upvotes: 1
};

const wrapper = mount(<BrowserRouter><Comments page={0} article={article}/></BrowserRouter>);

test("Loads comments from services", () => {
    let instance = wrapper.find("Comments").instance();
    expect(instance.comments.length).toEqual(3);
    expect(instance.pageCount).toEqual(1);
    expect(instance.currentPage).toEqual(0);

});

test("submits new comment to services", async done => {
    let instance = wrapper.find("Comments").instance();
    instance.newComment.nick = "test_created";
    instance.newComment.content = "test_created";
    instance.handleSubmit({preventDefault: ()=>{}});
    expect(ArticleService.postedComment).toEqual(true);
    done();
});