// @flow

import * as React from 'react';
import { mount } from 'enzyme';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import EditArticle from "./EditArticle";

jest.mock("../../services.js", ()=> require("../../__mocks__/services.js"));

configure({ adapter: new Adapter() });

const wrapper = mount(<EditArticle match={{params: {id: 1}}}/>);

it("loads an article from the service", () => {
    expect(wrapper.instance().loaded).toBeTruthy();
    expect(wrapper.instance().article.title).toBe("Mocked Title");
} );

it("loads the categories from the service", () => {
    expect(wrapper.instance().loaded).toBeTruthy();
    expect(wrapper.instance().categories).toContain("mocked_category");
} );

it("fills its fields", () => {
    expect(wrapper.instance().loaded).toBeTruthy();
    let c = wrapper.render().text();
    expect(c).toContain("mocked_category");
    console.log(c);
});
