import './index.less';

import React,{Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { is } from 'immutable';
import { createForm } from 'rc-form';

import { ActivityIndicator,Picker,List,InputItem } from 'antd-mobile';

import * as actions from '../../../actions';

class Special extends Component {
	constructor(props){
		super(props);
		let dataState = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};

		this.state = {
			dataState,
			load:false
		};
	};

	componentWillReceiveProps(nextProps){
		console.log(nextProps)
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

	submit = () => {

		this.setState({
			load:true
		});

		this.props.form.validateFields((error, value) => {
			console.log(value);

			setTimeout(()=>
				this.setState({
					load:false
				},()=> this.props.history.replace('/adv_success'))
			,1000)
		});
	};

	upload = e => {
		const { actions } = this.props;
		this.setState({
			load:true
		});
		actions.post('fileUpload',{fileName:e.target.files[0]})
			.then(res => {
				if (res.errorCode == 0) {
					this.setState({
						codeUrl:res.data.url,
						load:false
					});
				}
			})
	};

	render(){

		let { data,city,province,antd_province,sex } = this.props;
		const { getFieldProps } = this.props.form;

		return (
			<div
				style={{height:'100%',overflow:'hidden'}}
			>
				<ActivityIndicator
					toast
					text="Loading..."
					animating={ this.state.load }
				/>

				<div className="per-info">
					<List>
						<InputItem
							{...getFieldProps('input3')}
							placeholder="请编辑文章标题"
						/>
						<InputItem
							{...getFieldProps('input4')}
							placeholder="请粘贴好易用文章连接"
						/>
					</List>
				</div>

				<div className="per-info">
					<List>
						<Picker data={antd_province} cols={1} {...getFieldProps('district3')} className="forss">
							<List.Item arrow="horizontal">地域</List.Item>
						</Picker>
						<Picker data={sex} cols={1} {...getFieldProps('district2')} className="forss">
							<List.Item arrow="horizontal">性别</List.Item>
						</Picker>
						<Picker data={antd_province} cols={1} {...getFieldProps('district1')} className="forss">
							<List.Item arrow="horizontal">年龄</List.Item>
						</Picker>
					</List>
				</div>

				<div className="per-info">
					<List>
						<Picker data={antd_province} cols={1} {...getFieldProps('district4')} className="forss">
							<List.Item arrow="horizontal">任务总量</List.Item>
						</Picker>
						<Picker data={sex} cols={1} {...getFieldProps('district5')} className="forss">
							<List.Item arrow="horizontal">任务奖励</List.Item>
						</Picker>
						<List.Item extra={`2000.00元`}>任务总价</List.Item>
						<Picker data={antd_province} cols={1} {...getFieldProps('district6')} className="forss">
							<List.Item arrow="horizontal">任务截止时间</List.Item>
						</Picker>
					</List>
				</div>

				<div
					className="release-group"
					style={{overflow:'hidden'}}
				>
						<span
							className="button"
							onClick={this.submit}
							style={{margin:'0 .3rem .2rem',borderRadius:'8px'}}
						>
							发布
						</span>
				</div>

			</div>
		)
	}
};

Special = connect(
	state => ({
		data:state.ReleaseState.data
	}),
	dispatch => ({
		actions:bindActionCreators(actions,dispatch)
	})
)(Special);
Special = createForm()(Special);
export default Special;