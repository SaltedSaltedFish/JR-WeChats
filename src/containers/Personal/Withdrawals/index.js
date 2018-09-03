import './index.less';

import React,{Component} from 'react';
import { Modal,ActivityIndicator} from 'antd-mobile';

import Header from '../../../components/Header';
import Content from '../../../components/Content';

import Api from '../../../api/request';

class Withdrawals extends Component {
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

	pay =(all) => {
		let totalFee,money;
		const { data } = this.state;
		money = data.money || 0;

		totalFee = all?all:this.refs.money.value;
		totalFee = Number(totalFee);

		console.log(totalFee);

		if ( totalFee == 0 ) {
			Modal.alert('请输入提现金额');
			return;
		};

		if ( money < totalFee) {
			Modal.alert('余额不足');
			return;
		};

		if ( data.phone == '' || data.phone == null || data.phone == undefined ) {
			this.props.history.push('/bdPhone');
			return;
		};

		this.setState({
			load:true
		});
		
		Api.post('weixinpay/entPay',{userId:data.id,money:totalFee})
			.then(res => {

				if (res.errorCode == 0) {
					Modal.alert('','提现成功');
					let data = res.data;

					this.setState({
						data
					});

					localStorage.signInfo = JSON.stringify(res.data);
				} else {
					Modal.alert('',res.errorMsg);
				};

				this.setState({
					load:false
				});
			})

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

		const { data } = this.state;
		return (
			<Content className={`drawals`}>
				<Header title={`提现`}/>
				<div className="recharge-group">

					<div className="money-group">
						<p className='title'>提现金额</p>
						<div className='drawals-group'>
							<span>￥</span>
							<input
								type="number"
								ref='money'
							/>
						</div>
						<p className={`surplus`}>
							账户余额:{ data.money || 0}元
							<span onClick={ () => this.pay( data.money || 0 )}>全部提现</span>
						</p>
					</div>


					<div className="payment">
						<span className="icon icon-weChat"></span>
						<span className="icon icon-select"></span>
						提现到微信钱包
					</div>

					<span
						className="button"
						onClick={() => this.pay(false)}
					>
						立即提现
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

export default Withdrawals;