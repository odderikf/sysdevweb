// @flow

import * as React from 'react';
import { shallow } from 'enzyme';
import {Button, PageButtons} from "./Widgets";

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe("PageButtons", ()=>{
    const mock_callback = jest.fn(page => {});
    const wrapper_5_root = shallow(<PageButtons pageCount={5} url={''} onUpdate={mock_callback}/>);
    const wrapper_15_articles = shallow(<PageButtons pageCount={15} url={'/articles/15'} onUpdate={mock_callback}/>);
    const wrapper_0_root = shallow(<PageButtons pageCount={0} url={''} onUpdate={mock_callback}/>);

    it("has the right amount of children", () => {
        expect(wrapper_5_root.children().length).toEqual(5);
        expect(wrapper_15_articles.children().length).toEqual(15);
        expect(wrapper_0_root.children().length).toEqual(0);
    });

    it("points to the right pages", () => {
        let links = wrapper_5_root.find("NavLink");
        expect(links.length).toEqual(5);
        let link_tos: string[] = links.map((nav, i) =>
            nav.props().to
        );

        link_tos.forEach((e,i) => expect(e).toEqual('/page/'+i));

        links = wrapper_15_articles.find("NavLink");
        expect(links.length).toEqual(15);
        link_tos = links.map((nav, i) =>
            nav.props().to
        );

        link_tos.forEach((e,i) => expect(e).toEqual('/articles/15/page/'+i));

    });

    it("calls the callback", () => {
        let buttons = wrapper_5_root.find("Button");
        let button_to_3 = buttons.at(3);
        button_to_3.simulate("click", {target: {value: button_to_3.props().value}});
        expect(mock_callback.mock.calls[0][0]).toEqual(3);
    });

});