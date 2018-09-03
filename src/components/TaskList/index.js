
import './index.less';

import React,{ Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button} from 'antd-mobile';

import { UPDATEMASK } from '../../actions/mask';
import * as actions from '../../actions';

import stick from '../../utils/stick';

class TaskList extends Component {
	constructor(props){
		super(props);

		this.state = {
			update:false,
		};

		this.isStick = stick.isStick(props.data.stickTime).isSticks;
		this.timer = {};
	};

	componentWillReceiveProps(props){
		clearInterval(this.timer);
		this.isStick = stick.isStick(props.data.stickTime).isSticks;
		if (this.isStick && this.refs.time) {
			this.timer = setInterval(()=>{
				let isStick = stick.isStick(this.props.data.stickTime);
				this.refs.time.innerHTML = '';
				this.refs.time.innerHTML = '置顶中剩' + isStick.stickTime;
			},1000);
		}
	};

	componentDidMount(){
		// 循环计时
		if (this.isStick) {
			this.timer = setInterval(()=>{
				let isStick = stick.isStick(this.props.data.stickTime);
				this.refs.time.innerHTML = '';
				this.refs.time.innerHTML = '置顶中剩' + isStick.stickTime;
			},1000);
		}
	};

	componentWillUnmount(){
		clearInterval(this.timer);
		this.setState = () => {};
	};

	imgUrl = (data) => {

		let headimgurl = '';

		if ( data.user.headimgurl == "" ||  !data.user.headimgurl ) {

		} else if ( data.user.headimgurl.indexOf('http') == -1 ) {
			headimgurl = httpRequestFile + data.user.headimgurl;
		} else {
			headimgurl = data.user.headimgurl;
		};

		return headimgurl;
	};

	render(){
		const { data,actions,buttonText } = this.props;
		let name = data.user.vip?data.user.vip.name.split('-')[0]:false;
		/*
		* @param data.stickTime { Date } 用于对比本地时间，
		* */
		let isStick = stick.isStick(data.stickTime);
		let headimgurl = this.imgUrl(data);
		//console.log(isStick);
		return (
			<div className={`taskContainer vip`+ (name?data.user.vip.type:'') }>
				<Link
					to={{
						pathname:'/info_card',
						state:data
					}}
				>
					<div className="img">
						<img src={headimgurl} alt=""/>
					</div>
					<div className="list">
						<p className="title">
							<span className="name">{data.user.nickname}</span>
							{/*<span className="address">{data.province}</span>*/}
							<span className="address">{data.city}</span>
							<span className="num">{data.user.sex =='1'?'男':'女'}</span>
						</p>
						<p className="dec">
							{data.introduce}
						</p>
						<button
							className={`button`}
							onClick={(e) => {
								e.preventDefault();
								actions.update(UPDATEMASK,{
									headimgurl: httpRequestFile + data.codeUrl
								})
							}}
						>
							{buttonText}
						</button>
					</div>
					<p className="label stick" style={(name || isStick.isSticks)?{height:'.42rem'}:null}>
						{
							name?<span className="task-label task-vip">{ name }</span>:null
						}

						{
							isStick.isSticks?
								<span
									className="task-label task-top1"
									ref='time'
								>
								置顶中剩
							</span>:null
						}
					</p>
				</Link>
			</div>
		)
	}
};

TaskList = connect(
	state => ({
		reduxState:state.MaskState
	}),
	dispatch => ({
		actions:bindActionCreators(actions,dispatch)
	})
)(TaskList);
export default TaskList;