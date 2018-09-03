import './index.less';

import React,{Component} from 'react';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import ListViewComponent from '../../../components/ListViewTest';

class RedReward extends Component {
	constructor(props){
		super(props);
		let DATA = props.reduxData?props.reduxData:null;
		let data_state = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};
		let condition = {
			userId:data_state.id
		};

		this.state = {
			data:null,

			DATA,
			condition,
		};

		this.url = 'integral/findByCondiction';
	};

	componentWillUnmount(){
		this.setState = () => {};
	};

	rows = (s,v) =>{
		return (
			<div key={s.id} className="bill-list">
				<p className="title">
					{s.description}
				</p>
				<p className="time">{s.createTime}</p>
				<span className="icon">{s.type == 1?'+':'-'}{s.count}</span>
			</div>
		)
	};

	render(){

		const { DATA,condition } = this.state;

		return (
			<Content>
				<Header title={`红包奖金`}/>
				<ListViewComponent
					data={DATA}
					rows={ this.rows }
					url={ this.url }
					condition={condition}
				/>
			</Content>
		)
	}
};

export default RedReward;