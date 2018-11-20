// @flow

import * as React from 'react';
import { shallow } from 'enzyme';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Article from "./Article";
import {ArticleService} from "../../__mocks__/services";

jest.mock("../../services.js", ()=> require("../../__mocks__/services.js"));

configure({ adapter: new Adapter() });


const wrapper = shallow(<Article match={ { params: { id: 1, page: 0 } } } />);

test("loads from services", () => {
    expect(wrapper.instance().article).toEqual(
        {"category": "js", "content": "Mocked Description", "created": "",
            "id_article": 1, "image": "", "important": true,
            "title": "Mocked Title", "upvotes": 1})
});

test("upvoting calls services", () => {
    wrapper.find(`[value="upvote"]`).simulate("click");
    expect(ArticleService.upvotedArticle).toEqual(true);
});