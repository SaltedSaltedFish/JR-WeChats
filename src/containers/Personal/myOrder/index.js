import './index.less';

import React,{Component} from 'react';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import ListViewComponent from '../../../components/ListViewTest';

class Personal extends Component {
	constructor(props){
		super(props);
		let data_state = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};

		let DATA = props.reduxData?props.reduxData:null;
		let condition = {
			userId:data_state.id
		};
		this.state = {
			data:null,

			DATA,
			condition
		};

		this.url = 'order/findByCondiction';
		this.method = 'POST';
	};

	rows = (s,v) =>{
		return (
			<div key={s.id} className="bill-list">
				<p className="title">
					{s.description}
				</p>
				<p className="time">{s.updateTime}</p>
				<span className="icon">{s.type == 1?'+':'-'}{s.price}</span>
			</div>
		)
	};

	render(){
		const { DATA,condition } = this.state;
		return (
			<Content>
				<Header title={`我的订单`}/>
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

export default Personal;