import './index.less';

import React,{ Component } from 'react';
import { Link } from 'react-router-dom';

import Content from '../../../components/Content';
import Header from '../../../components/Header';
import ListViewTest from '../../../components/ListViewTest';
import List from '../Advertisement/Already/list';

export default class Receive extends Component {
	constructor(props){
		super(props);
		let dataState = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};

		let condition = {
			userId:dataState.id
		};

		this.state = {
			dataState,
			condition
		};

		this.url = 'integral/findByCondiction';
	};

	componentWillUnmount(){
		this.setState = () => {};
	};

	shouldComponentUpdate(nextProps, nextState){
		var thisProps = this.props || {}, thisState = this.state || {};

		if (Object.keys(thisProps).length !== Object.keys(nextProps).length ||
			Object.keys(thisState).length !== Object.keys(nextState).length) {
			return true;
		}

		for (var key in nextProps) {
			if (!is(thisProps[key], nextProps[key])) {
				return true;
			}
		}

		for (var key in nextState) {
			if (thisState[key] !== nextState[key] || !is(thisState[key], nextState[key])) {
				return true;
			}
		}
		return false;
	};

	rows = s =>{
		return (
			<List button={false}/>
		)
	};

	render(){
		const { condition } = this.state;
		return (
			<Content>
				<Header title={`已领任务`}/>
				<ListViewTest
					rows={ this.rows }
					url={ this.url }
					condition={condition}
				/>
			</Content>
		)
	}
}