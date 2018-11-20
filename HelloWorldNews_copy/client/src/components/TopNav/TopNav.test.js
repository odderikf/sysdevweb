// @flow

import * as React from 'react';
import { shallow } from 'enzyme';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TopNav from "./TopNav";

jest.mock("../../services.js", ()=> require("../../__mocks__/services.js"));

configure({ adapter: new Adapter() });


const wrapper = shallow(<TopNav/>);

it("loads the categories from the service", () => {
    let c = wrapper.children();
    expect(c.map(e=>e.props().children)).toContain("mocked_category");
} );

it("links to frontpage and newArticle", () => {
    let c = wrapper.children();
    expect(c.at(0).props()).toEqual(
        {"children": "HELLO WORLD NEWS", "exact": true, "id": "sitetitle", "to": "/"}
    );
    expect(c.at(c.length-1).props()).toEqual(
        {"children": "Make news", "to": "/newArticle"}
    );
});
