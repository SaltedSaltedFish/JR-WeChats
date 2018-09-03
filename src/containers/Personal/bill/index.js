import './index.less';

import React,{Component} from 'react';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import ListViewComponent from '../../../components/ListViewTest';

class Personal extends Component {
	constructor(props){
		super(props);
		let DATA = props.reduxData?props.reduxData:null;
		this.state = {
			data:null,

			DATA,
		};

		this.url = '';
		this.method = 'POST';
	};

	rows = (s,v) =>{
		return (
			<div className="bill-list">
				<p className="title">
					完成家家乐朋友圈转发
				</p>
				<p className="time">2017-01-04 14:54:09</p>
				<span className="icon">+1000</span>
			</div>
		)
	};

	render(){
		const { DATA } = this.state;
		return (
			<Content>
				<Header title={`我的账单`}/>
				<ListViewComponent
					data={DATA}
					rows={ this.rows }
					url={ this.url }
				/>
			</Content>
		)
	}
};

export default Personal;