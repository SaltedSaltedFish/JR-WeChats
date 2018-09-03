import './index.less';

import React,{Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal,Button,ActivityIndicator,ActionSheet } from 'antd-mobile';

import * as actions from '../../actions';
import WeChatTools from '../../utils/weChat_tools';

import Content from '../../components/Content';

import { list } from '../../data/pur-vip';

class PurVip extends Component {
	constructor(props){
		super(props);

		const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);

		let wrapProps;
		if (isIPhone) {
			wrapProps = {
				onTouchStart: e => e.preventDefault(),
			};
		};

		let data = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};
		this.state = {
			data,
			load:false,
			wrapProps
		};

		this.url = 'vip/findAll';
		this.condition = {
			currentPage:'1'
		};

		this.timer = {};

	};

	componentDidMount(){
		//this.props.actions.getData(this.url,this.condition,GETPURVIP);
	};

	componentWillUnmount(){
		this.setState({
			load:false
		});
		clearTimeout(this.timer);
		this.setState = () => {};
	};


	payType = (obj) => {
		const { wrapProps } = this.state;
		let data = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};
		const { actions } = this.props;
		let money = 0;
		//console.log(data,obj);

		if ( !data.money || (data.money < obj.totalFee) ) {
			this.pay(obj);
			return;
		};

		money = data.money - obj.totalFee;
		const BUTTONS = ['微信支付', '余额支付','取消'];
		ActionSheet.showActionSheetWithOptions({
				options: BUTTONS,
				cancelButtonIndex: BUTTONS.length - 1,
				title: '选择支付方式',
				'data-seed': 'logId',
				wrapProps,
			},
			(buttonIndex) => {
				console.log(buttonIndex);
				if ( buttonIndex == 0) {
					// Modal.alert('微信支付');
					this.pay(obj);
				} else if ( buttonIndex == 1 ) {

					this.setState({
						load:true
					});

					actions.post('user/update',{id:data.id,money})
						.then(res => {
							if (res.errorCode == 0) {
								Modal.alert('够买成功');
								localStorage.signInfo = JSON.stringify(res.data);
							} else {
								Modal.alert(res.errorMsg);
							};

							this.setState({
								load:false
							});
						})

					actions.post('weixinpay/payVipSuccess',{userId:data.id,vipId:obj.vipId})
						.then(res => {
							if (res.errorCode == 0) {
								//Modal.alert('','购买成功');
							};
						})
				}
			});
	};

	pay = (obj) => {

		//console.log(this.state.data.id);
		console.log(obj);
		this.setState({
			load:true
		});

		let data = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};
		const { actions } = this.props;
		let tradeType = 'JSAPI',openid = data.openid;

		if ( !isMicroMessenger ) {
			tradeType = 'APP';
			openid = '';
		};

		let data_ = {
			body:obj.body,  //描述
			totalFee:obj.totalFee,  //  金额
			tradeType,
			openid,
		};

		//测试金额
		//data_.totalFee = 1;
		isMicroMessenger?
			WeChatTools.pay(data_,this,() => {
			let userId = data.id;

			actions.post('weixinpay/payVipSuccess',{userId,vipId:obj.vipId})
				.then(res => {
					if (res.errorCode == 0) {
						actions.get('user/findById',{id:this.state.data.id})
							.then(res => {
								//console.log(res);
								if (res.errorCode == 0) {
									let data = res.data || {};
									localStorage.signInfo = JSON.stringify(data);  //  返回user信息
								};
							});
						Modal.alert('','购买成功');
					};
				})
		}):null;

		isApp?WeChatTools.pay_app('wxpay',data_,()=>{
				this.setState({
					load:false,
				})
			}):null;

		this.timer = setTimeout(()=>{
			if (this.state.load) {
				this.setState({
					load:false
				});
				Modal.alert('','服务器响应超时');
			};
		},10000);

		return;

		actions.post('weixinpay/createOrder',data_)
			.then(response => {
				//alert(JSON.stringify(response));
				if (response.errorCode == 0) {
					WeixinJSBridge.invoke(
						'getBrandWCPayRequest', response.data,
						function(res){
							//alert(JSON.stringify(res));
							if(res.err_msg == "get_brand_wcpay_request:ok" ) {
								//Modal.alert('','ok,开始更新用户信息');
								//location.href = "http://zuidaquan.liudagood.com/JR-WeChat/pay_success.html";


								// actions.post('user/update',{id,vipId:obj.vipId})
								// 	.then(res1 => {
								// 		if (res1.errorCode == 0) {
								// 			actions.post('order/insert',{userId:id,price:obj.totalFee,description:obj.body,state:2})
								// 				.then(res2=>{
								// 					if (res2.errorCode == 0) {
								// 						Modal.alert('','购买成功');
								// 					}
								// 				})
								// 		}
								// 	})
							};

							if(res.err_msg == "get_brand_wcpay_request:cancel" ) {
								//Modal.alert('','用户取消支付');
								//alert('用户取消支付');
							};

							if(res.err_msg == "get_brand_wcpay_request:fail" ) {
								//alert("支付失败");
								Modal.alert('','支付失败');
							};
						}
					);
				} else {
					Modal.alert('','操作失败，请稍后再试');
				};
			})
	};

	render(){

		const { data } = this.state;

		return (
			<div style={{height:'100%',background:'white',overflow:'auto',paddingTop:'.88rem'}}>
				<div className="common-header">
					<p className="title">购买会员</p>
				</div>
				{
					list.map(s=>
						<div key={s.type} className={`pur-vip vip${s.type}`}>
							<div className="img-box">
								<div className="img"></div>
							</div>
							<div className="info">
								<p className="title">
									{s.name}
								</p>
								<p className="money Tagging1">
									{s.price}
								</p>
								<p className="dec">
									{s.description}
								</p>

								{
									isApp?
										<Button
											//disabled={ data.vip == s.vipId }
											className="button gray"
											//onClick={e => this.payType(s)}
										>
											立即购买
										</Button>:
										<Button
											//disabled={ data.vip == s.vipId }
											className="button"
											onClick={e => this.payType(s)}
										>
											立即购买
										</Button>
								}

							</div>
						</div>
					)
				}

				<ActivityIndicator
					toast
					text="Loading..."
					animating={ this.state.load }
				/>
			</div>
		)
	}
};

PurVip = connect(
	state => ({
		reduxState:state.PurVipStore
	}),
	
	dispatch => ({
		actions:bindActionCreators(actions,dispatch)
	})
)(PurVip);
export default PurVip;