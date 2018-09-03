import './index.less';

import React,{Component} from 'react';
import { is } from 'immutable';

import ListViewComponent from '../../components/ListViewTest';
import TaskList from '../../components/TaskList';

class Personal extends Component {
	constructor(props){
		super(props);
		let DATA = props.reduxData?props.reduxData:null;
		this.state = {
			data:null,

			DATA,
		};

		this.url = 'wechatPublic/findByCondiction';
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

	rows = (s,v) =>{
		return (
			<TaskList key={v} data={s} buttonText='关注'/>
		)
	};

	render(){
		const { DATA } = this.state;
		let condition = {...this.props};
		return (
			<div
				style={{height:'100%'}}
			>
				<ListViewComponent
					update = {true}
					data={DATA}
					rows={ this.rows }
					url={ this.url }
					condition={ condition }
				/>
			</div>
		)
	}
};

export default Personal;