
import './index.less';

import React,{ Component } from 'react';
import { ActivityIndicator } from 'antd-mobile';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { PROMPT } from '../../actions/mask';
import * as actions from '../../actions';

import Stick from '../../utils/stick';
import TimeConversion from '../../utils/TimeConversion';


class List0 extends Component {
	constructor(props){
		super(props);

		this.state = {
			update:false,

			toast:false
		};
	};

	componentWillUnmount(){
		this.setState = () => {};
	};

	receive = () => {
		// const { actions } = this.props;
		// actions.update(PROMPT,{
		// 	loading:true
		// });
		// setTimeout(()=>{
		// 	actions.update(PROMPT,{
		// 		receive:true,
		// 		text:'截止',
		// 		class:'list0-container'
		// 	})
		// },1000)
		//this.props.history.push('/adv_details');
	};

	render(){

		const { data,actions,buttonText } = this.props;
		const { toast } = this.state;
		let eff = (data.endTime.indexOf(' ') != -1);
		let disabled = eff?!Stick.isStick(data.endTime).isSticks:true;

		//let disabled = eff?TimeConversion.getTime(TimeConversion.date()) > TimeConversion.getTime(data.endTime):true;

		return (
			<div className={`list0 taskContainer vip3`+ (name?data.user.vip.type:'') }>
				{
					disabled?
						<div className="list">
							<p className="title">
								{data.title}
							</p>
							<p className="num">
								奖金：{data.taskAward}元1人次阅读量
							</p>
							<p className="dec">
								任务总量：{data.taskCount}人次
								<br/>
								已完成：{data.taskFinishCount || 0}人次
							</p>
							{
								eff?
									<p className="dec" style={{margin:0}}>
										截止时间：{data.endTime}
									</p>:null
							}
							<button
								className={`button disabled`}
								//onClick={this.receive}
							>
								截止
							</button>
						</div>:
						<Link
							to={{
								pathname:'/adv_details',
								state:data
							}}
						>
							<div className="list">
								<p className="title">
									{data.title}
								</p>
								<p className="num">
									奖金：{data.taskAward}元1人次阅读量
								</p>
								<p className="dec">
									任务总量：{data.taskCount}人次
									<br/>
									已完成：{data.taskFinishCount || 0}人次
								</p>
								{
									eff?
										<p className="dec" style={{margin:0}}>
											截止时间：{data.endTime}
										</p>:null
								}
								<button
									className={`button`}
									//onClick={this.receive}
								>
									{buttonText}
								</button>
							</div>

						</Link>
				}
			</div>
		)
	}
};

List0 = connect(
	state => ({
		reduxState:state.MaskState
	}),
	dispatch => ({
		actions:bindActionCreators(actions,dispatch)
	})
)(List0);
export default List0;