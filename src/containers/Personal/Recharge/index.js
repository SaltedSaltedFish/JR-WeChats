import './index.less';

import React,{Component} from 'react';
import { Modal,ActivityIndicator} from 'antd-mobile';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../../actions';

import Header from '../../../components/Header';
import Content from '../../../components/Content';

class Recharge extends Component {
	constructor(props){
		super(props);
		let data = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};

		this.state = {
			data,
			load:false,
		};

		this.timer = {};
	};

	componentWillUnmount(){
		this.setState({
			load:false
		});

		clearTimeout(this.timer);

		this.setState = () => {};
	};

	pay = () => {

		let body = '充值',totalFee;

		totalFee = this.refs.money.value;
		totalFee = Number(totalFee);

		if ( totalFee == 0 ) {
			Modal.alert('请输入充值金额');
			return;
		};

		this.setState({
			load:true
		});

		console.log(totalFee);

		const { data } = this.state;
		const { actions } = this.props;

		let data_ = {
			body,
			totalFee,
			tradeType:'JSAPI',
			openid:data.openid
		};

		actions.post('weixinpay/createOrder',data_)
			.then(response => {
				if (response.errorCode == 0) {
					WeixinJSBridge.invoke(
						'getBrandWCPayRequest', response.data,
						function(res){
							if(res.err_msg == "get_brand_wcpay_request:ok" ) {
								let userId = data.id;

								actions.post('weixinpay/inMoney',{userId,money:totalFee})
									.then(res => {
										if (res.errorCode == 0) {
											Modal.alert('充值成功');
											localStorage.signInfo = JSON.stringify(res.data);
										} else {
											Modal.alert('',res.errorMsg)
										};
									})
							};

							if(res.err_msg == "get_brand_wcpay_request:cancel" ) {

							};

							if(res.err_msg == "get_brand_wcpay_request:fail" ) {
								Modal.alert('','支付失败');
							};
						}
					);
				} else {
					Modal.alert('',response.errorMsg);
				};

				this.setState({
					load:false
				});
			});

		this.timer = setTimeout(()=>{
			if (this.state.load) {
				this.setState({
					load:false
				});
				Modal.alert('','服务器响应超时');
			};
		},10000)
	};

	render(){
		return (
			<Content>
				<Header title={`充值`}/>
				<div className="recharge-group">
					<div className="payment">
						<span className="icon icon-weChat"></span>
						<span className="icon icon-select"></span>
						微信支付
					</div>

					<div className="money-group">
						<span>金额</span>
						<input
							type="number"
							ref='money'
							placeholder='请输入充值金额'
						/>
					</div>

					<span
						className="button"
						onClick={this.pay}
					>
						立即充值
					</span>
				</div>

				<ActivityIndicator
					toast
					text="Loading..."
					animating={ this.state.load }
				/>

			</Content>
		)
	}
};

Recharge = connect(
	state => ({
		reduxState:state.PurVipStore
	}),
	dispatch => ({
		actions:bindActionCreators(actions,dispatch)
	})
)(Recharge);

export default Recharge;