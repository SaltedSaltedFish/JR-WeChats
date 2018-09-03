import './index.less';

import React,{Component} from 'react';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { is } from 'immutable';
import { createForm } from 'rc-form';

import * as actions from '../../../../actions';

import ListViewComponent from '../../../../components/ListViewTest';
import List from './list';

class AlreadyHave extends Component {
	constructor(props){
		super(props);
		let dataState = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};

		let condition = {
			userId:dataState.id
			//userId:110
		};

		this.state = {
			dataState,
			condition
		};

		this.url = 'advert/findByCondiction';
	};

	componentWillReceiveProps(nextProps){
		console.log(nextProps);
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

	componentDidMount(){

	};

	rows = data =>{
		return (
			<Link to={{
				pathname:'/adv_edit',
				search:'?' + JSON.stringify(data)
			}}>
				<List data={data} btnText={`编辑`}/>
			</Link>
		)
	};

	// rows = data =>{
	// 	return (
	// 		<List data={data} btnText={`编辑`}/>
	// 	)
	// };


	render(){
		const { condition } = this.state;
		return (
			<div
				style={{height:'100%',overflow:'hidden'}}
			>
				<ListViewComponent
					rows={ this.rows }
					url={ this.url }
					condition={condition}
				/>
			</div>
		)
	}
};

AlreadyHave = connect(
	state => ({
		data:state.ReleaseState.data
	}),
	dispatch => ({
		actions:bindActionCreators(actions,dispatch)
	})
)(AlreadyHave);
AlreadyHave = createForm()(AlreadyHave);
export default AlreadyHave;