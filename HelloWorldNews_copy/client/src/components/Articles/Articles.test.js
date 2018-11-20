// @flow

import * as React from 'react';
import { shallow } from 'enzyme';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Articles from "./Articles";

jest.mock("../../services.js", ()=> require("../../__mocks__/services.js"));

configure({ adapter: new Adapter() });

// $FlowFixMe
const wrapper_important = shallow(<Articles match={{params: {}}}/>);
// $FlowFixMe
const wrapper_category = shallow(<Articles match={{params: {category: "mocked_category"}}}/>);

test("loads articles from service", ()=>{
    expect(wrapper_important.instance().articles.length).toEqual(3);
    expect(wrapper_important.instance().articles[0].title).toEqual("mocked important");

    expect(wrapper_category.instance().articles.length).toEqual(3);
    expect(wrapper_category.instance().articles[0].title).toEqual("mocked cat");
});

