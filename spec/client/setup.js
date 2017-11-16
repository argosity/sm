import { configure, shallow, mount } from 'enzyme';
import matchers from 'hippo/testing/matchers';
import { fetch } from 'hippo/testing/mocks/fetch';
import React from 'react';
import 'hippo/testing';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

global.expect.extend(matchers);

global.shallow = shallow;
global.mount   = mount;
global.fetch   = fetch;
global.React   = React;

// eslint-disable-next-line import/no-dynamic-require
global.fixture = file => require(`../fixtures/sm/${file}.yml`); // eslint-disable-line global-require

// jsdom fix https://github.com/tmpvar/jsdom/issues/1695
window.HTMLElement.prototype.scrollIntoView = function() {};
