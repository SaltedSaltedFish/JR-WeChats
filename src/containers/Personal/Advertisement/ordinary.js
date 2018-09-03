import './index.less';

import React,{Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { is } from 'immutable';
import { createForm } from 'rc-form';

import { ActivityIndicator,Picker,List,InputItem,DatePicker,Modal } from 'antd-mobile';

import * as actions from '../../../actions';
import TimeConversion from '../../../utils/TimeConversion';

import WeChatTools from '../../../utils/weChat_tools';

class Ordinary extends Component {
	constructor(props){
		super(props);
		let dpValue = new Date(Date.now());
		let dataState = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};
		console.log(dpValue);
		this.state = {
			dataState,
			dpValue,
			load:false,
		};

		this.url = 'advert/insert';

		this.count = 100;
		this.award = 0.1;

		this.timer = {};
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

		this.props.form.validateFields((error, value) => {

			if ( !error ) {

				value.taskMoney = Number((this.count * this.award).toFixed(1));

				if ( Number(value.taskCount) < 100 ) {
					Modal.alert('任务总量最低为100');
					return;
				};

				if ( !value.taskMoney && value.taskMoney < 10) {
					Modal.alert('金额有误，请稍后重试');
					return;
				};

				if ( value.link.indexOf('?') != -1) {
					value.link = value.link.substring(0,value.link.indexOf('?'))
				};

				const { actions } = this.props;
				const { dataState } = this.state;
				value.userId = dataState.id;
				value.taskFinishCount = '0';
				value.endTime = TimeConversion.time(value.endTime);

				console.log(value);

				this.pay(value,()=>{

					this.setState({
						load:false
					});

					actions.post(this.url,value)
						.then(res => {
							console.log(res);
							if (res.errorCode == 0) {
								this.props.history.replace('/adv_success');
							} else {
								Modal.alert(res.errorMsg);
							};
						});
				});
			} else {
				console.log(error);

				if ( error.link && error.link.errors[0].message.indexOf('url') != -1) {
					Modal.alert('请检查链接地址');
				} else {
					Modal.alert('所有内容都必填');
				};

			};

		});

	};

	pay = (obj,fn) => {

		this.setState({
			load:true
		});

		let data = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};
		const { actions } = this.props;
		let tradeType = isMicroMessenger?'JSAPI':'APP';
		let data_ = {
			body:obj.title,  //描述
			totalFee:obj.taskMoney,  //  金额
			tradeType,
			openid:data.openid
		};

		isMicroMessenger?WeChatTools.pay(data_,this,fn):null;
		isApp?WeChatTools.pay_app('wxpay',data_,()=>{
				this.setState({
					load:false,
				})
			}):null;

		// actions.post('weixinpay/createOrder',data_)
		// 	.then(response => {
		// 		//alert(JSON.stringify(response));
		// 		if (response.errorCode == 0) {
		// 			WeixinJSBridge.invoke(
		// 				'getBrandWCPayRequest', response.data,
		// 				function(res){
		// 					//alert(JSON.stringify(res));
		// 					if(res.err_msg == "get_brand_wcpay_request:ok" ) {
		// 						//Modal.alert('','ok,开始更新用户信息');
		// 						//location.href = "http://zuidaquan.liudagood.com/JR-WeChat/pay_success.html";
		// 						fn();
		// 					};
		//
		// 					if(res.err_msg == "get_brand_wcpay_request:cancel" ) {
		//
		// 					};
		//
		// 					if(res.err_msg == "get_brand_wcpay_request:fail" ) {
		// 						Modal.alert('','支付失败');
		// 					};
		// 				}
		// 			);
		// 		} else {
		// 			Modal.alert('','操作失败，请稍后再试');
		// 		};
		// 	});

		this.timer = setTimeout(()=>{
			if (this.state.load) {
				this.setState({
					load:false
				});
				Modal.alert('','服务器响应超时');
			};
		},10000)
	};

	price = (type,value) => {
		// this.props.form.validateFields(['taskCount','taskAward'],(error,value) => {
		// 	console.log(error,value);
		// })
		this[type] = value;
	};

	render(){

		//let { data,city,province,antd_province,sex } = this.props;
		const { getFieldProps } = this.props.form;

		//console.log(this.count,this.award,this.count * this.award);

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
							{...getFieldProps('title',{
								rules: [{required: true}],
							})}
							placeholder="请编辑文章标题"
						/>
						<InputItem
							{...getFieldProps('link',{
								rules: [{required: true,type:'url'}],
							})}
							placeholder="请粘贴文章链接"
						/>
					</List>
				</div>

				{/*<div className="per-info">*/}
					{/*<List>*/}
						{/*<Picker data={antd_province} cols={1} {...getFieldProps('district3')} className="forss">*/}
							{/*<List.Item arrow="horizontal">地域</List.Item>*/}
						{/*</Picker>*/}
						{/*<Picker data={sex} cols={1} {...getFieldProps('district2')} className="forss">*/}
							{/*<List.Item arrow="horizontal">性别</List.Item>*/}
						{/*</Picker>*/}
						{/*<Picker data={antd_province} cols={1} {...getFieldProps('district1')} className="forss">*/}
							{/*<List.Item arrow="horizontal">年龄</List.Item>*/}
						{/*</Picker>*/}
					{/*</List>*/}
				{/*</div>*/}

				<div className="per-info">
					<List>
						<InputItem
							type="money"
							moneyKeyboardAlign="right"
							min={1000}
							onChange={ (e) => this.price('count',e) }
							{...getFieldProps('taskCount',{
								initialValue:this.count,
								onChange:(value) => {
									this.count = value;
								},
								rules: [{required: true}],
							})}
						>
							任务总量
						</InputItem>

						<List.Item
							extra={ `0.1元` } {...getFieldProps('taskAward',{
							initialValue:0.1,
							rules: [{required: true}],
						})}>
							任务奖励
						</List.Item>

						{/*<InputItem*/}
							{/*type="money"*/}
							{/*moneyKeyboardAlign="right"*/}
							{/*onChange={ (e) => this.price('award',e) }*/}
							{/*{...getFieldProps('taskAward',{*/}
								{/*initialValue:this.award,*/}
								{/*onChange:(value) => {*/}
									{/*this.award = value;*/}
								{/*},*/}
								{/*rules: [{required: true}],*/}
							{/*})}*/}
						{/*>*/}
							{/*任务奖励*/}
						{/*</InputItem>*/}

						<List.Item
							extra={ `${(this.count * this.award).toFixed(1)}元` } {...getFieldProps('taskMoney',{
							initialValue:(this.count * this.award).toFixed(1),
							rules: [{required: true}],
						})}>
							任务总价
						</List.Item>

						<DatePicker
							mode="datetime"
							title="选择截止日期"
							extra=""
							{...getFieldProps('endTime',{
								initialValue:this.state.dpValue,
								rules: [{required: true}],
							})}
						>
							<List.Item arrow="horizontal">任务截止时间</List.Item>
						</DatePicker>
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

Ordinary = connect(
	state => ({
		data:state.ReleaseState.data
	}),
	dispatch => ({
		actions:bindActionCreators(actions,dispatch)
	})
)(Ordinary);
Ordinary = createForm()(Ordinary);
export default Ordinary;