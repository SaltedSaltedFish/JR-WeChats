import './index.less';

import React,{Component} from 'react';
import { is } from 'immutable';
import { createForm } from 'rc-form';
import { List, Stepper,ActivityIndicator,Modal,ActionSheet } from 'antd-mobile';

import Api from '../../../api/request';
import TimeConversion from '../../../utils/TimeConversion';

class Personal extends Component {
	constructor(props){
		super(props);
		let time = [
				{
					title:'置顶6小时',
					money:'￥15',
					price:15,
					hour:6,
					active:true
				},{
					title:'置顶12小时',
					money:'￥25',
					price:25,
					hour:12,
					active:false
				},{
					title:'置顶24小时',
					money:'￥40',
					price:40,
					hour:24,
					active:false
				},{
					title:'置顶3天',
					money:'￥100',
					price:100,
					hour:72,
					active:false
				},{
					title:'置顶7天',
					money:'￥200',
					price:200,
					hour:168,
					active:false
				},{
					title:'置顶30天',
					money:'￥600',
					price:600,
					hour:720,
					active:false
				}
			];
		let price = time[0].price;	//	价格
		let body = time[0].title; // 购买描述
		let hour = time[0].hour;   //  增加的时间基数
		
		let data = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};
		let topType = [
			{title:'个人微信',active:true,value:1},
			{title:'微信群名片',active:false,value:2},
			{title:'公众号名片',active:false,value:3},
		];
		/**/
		const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);

		let wrapProps;
		if (isIPhone) {
			wrapProps = {
				onTouchStart: e => e.preventDefault(),
			};
		};
		/*end*/
		this.state = {
			time,
			defaultValue:1,
			price,
			priceType:price,
			data,
			body,
			hour,
			load:false,
			topType,        //  置顶数据
			activeValue:{value:1,body:'个人微信'},   //  默认置顶,

			wrapProps
		};
	};

	componentWillUnmount(){
		this.setState = () => {};
	};

	componentDidMount(){

	};

	active = (e,obj,index) => {
		e.preventDefault();
		if (obj.active) {
			return;
		}
		let { time,defaultValue,body,hour } = this.state;
		let price = 15;
		let priceType = 15;
		time.map((s,v) =>{
			if ( v == index ) {
				s.active = true;
				price = s.price;
				priceType = s.price;
				body = s.title;
				hour = s.hour;
			} else {
				s.active = false;
			}
		});
		price = price * defaultValue;
		this.setState({
			time,
			price,
			priceType,
			body, //购买描述
			hour,
		});
	};

	typeChange = (e,obj) => {
		e.preventDefault();
		if (obj.active) {
			return;
		};
		let { topType,activeValue } = this.state;
		topType.map(s => {
			if ( s.value == obj.value ) {
				s.active = true;
				activeValue = {value:s.value,body:obj.title}
			} else {
				s.active = false;
			}
		});
		this.setState({
			topType,
			activeValue
		});
	};

	fare = (defaultValue) => {
		let { priceType } = this.state;

		if (!defaultValue) {
			defaultValue = 1;
		};

		let price = priceType  * defaultValue;
		this.setState({
			price,
			defaultValue
		});
	};

	payType = () => {
		const { wrapProps,price,defaultValue,hour,activeValue } = this.state;
		let data = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};
		let money = 0;
		console.log(data,price);

		if ( !data.money || (data.money < price) ) {
			this.pay();
			return;
		};

		money = data.money - price;

		const BUTTONS = ['微信支付', '余额支付','取消'];
		ActionSheet.showActionSheetWithOptions({
				options: BUTTONS,
				cancelButtonIndex: BUTTONS.length - 1,
				title: '选择支付方式',
				'data-seed': 'logId',
				wrapProps,
			},
			(buttonIndex) => {
				//console.log(buttonIndex);
				if ( buttonIndex == 0) {
					this.pay();
				} else if ( buttonIndex == 1 ) {
					let moreTime = defaultValue * hour;
					Api.post('user/update',{id:data.id,money})
						.then(res => {
							if (res.errorCode == 0) {
								localStorage.signInfo = JSON.stringify(res.data);
							} else {
								Modal.alert(res.errorMsg);
							}
						})

					Api.post('weixinpay/payStickSuccess',{
						userId:data.id,
						type:1,
						stickType:activeValue.value,
						stickHour:moreTime,
						stickPrice:price
					})
						.then(res => {
							//console.log(res);
							if (res.errorCode == 0) {
								Modal.alert('置顶成功');
							} else {
								Modal.alert(res.errorMsg);
							};
						});
				};
			});
	};

	pay = () => {
		this.setState({
			load:true
		});

		const { price,defaultValue,body,hour,activeValue } = this.state;

		let data = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};
		let data_ = {
			body,
			totalFee:price,
			tradeType:'JSAPI',
			openid:data.openid
		};
		let moreTime = defaultValue * hour;

		Api.post('weixinpay/createOrder',data_)
			.then(res => {
				if (res.errorCode == 0) {
					WeixinJSBridge.invoke(
						'getBrandWCPayRequest', res.data,
						function(res){
							if(res.err_msg == "get_brand_wcpay_request:ok" ) {

								let id = data.id;
								/*置顶类型处理*/

								// let url = 'wechat/update';
								// let url1 = 'wechat/findByCondiction';
								//
								// if ( activeValue.value == 2) {
								// 	url = 'wechatGroup/update';
								// 	url1 = 'wechatGroup/findByCondiction';
								// } else if (activeValue.value == 3) {
								// 	url = 'wechatPublic/update';
								// 	url1 = 'wechatPublic/findByCondiction';
								// };

								/*end*/

								/*循环修改置顶时间*/
								// let number = 1;
								//
								// Api.post(url1,{userId:id,currentPage:1})
								// 	.then( list => {
								// 		if (list.errorCode == 0 && list.data && list.data.length > 0) {
								// 			number = list.data.length;
								//
								// 			const toOrder = () => {
								// 				if ((number--) == 0) {
								// 					//  更新订单状态
								// 					Api.post('order/insert',{
								// 						userId:id,
								// 						price,
								// 						description:activeValue.body +'-'+body,
								// 						state:2
								// 					})
								// 						.then(res=>{
								// 							if (res.errorCode == 0) {
								//
								// 							};
								// 							Modal.alert('','购买成功',[
								// 								{ text: '确定' ,onPress:()=>
								// 									//this.props.history.goBack()
								// 									console.log('暂不处理')
								// 								}
								// 							]);
								// 						})
								// 					/*end*/
								// 				};
								// 			};
								//
								// 			list.data.map((obj,index) =>
								// 				Api.post(url,{id:obj.id,stickTime:moreTime})
								// 					.then( zd => toOrder())
								// 			)
								// 		} else {
								// 			Modal.alert('','请先发布信息！');
								// 		};
								// 	})
								/*end*/

								/*2018-1-27修改逻辑
								* @param userId {integer} 用户id
								* @param type {integer} 服务类型
								* @param stickType {integer} 置顶类型 1:个人 2:微信 3:公众号
								* @param stickHour {integer} 置顶小时
								* @pram stickPrice {double} 置顶价格
								* */
								Api.post('weixinpay/payStickSuccess',{
									userId:id,
									type:1,
									stickType:activeValue.value,
									stickHour:moreTime,
									stickPrice:price
								})
									.then(res => {
										//console.log(res);
										if (res.errorCode == 0) {

										} else {

										};
									});

								Modal.alert('','置顶成功',[
									{ text: '确定' ,onPress:()=>
										//this.props.history.goBack()
										console.log('暂不处理')
									}
								]);
							};

							if(res.err_msg == "get_brand_wcpay_request:cancel" ) {
								//alert('用户取消支付');
							};

							if(res.err_msg == "get_brand_wcpay_request:fail" ) {
								//alert("支付失败");
								Modal.alert('','支付失败');
							};
						}
					);
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
		const { getFieldProps } = this.props.form;
		const { time,defaultValue,price,topType } = this.state;
		//console.log(time);

		return (
			<div
				style={{height:'100%',padding:'0 .3rem 0',overflow:'auto'}}
				className={`top-service`}
			>

				<div className="top-type">
					<p className="title" style={{color:'#666'}}>选择置顶名片</p>
					{
						topType.map(s=>
							<div key={s.value}
							     className={`type-group` + (s.active?' active':'')}
							     onClick={e => this.typeChange(e,s)}
							>
								<span className="dot"></span>
								<p>{s.title}</p>
							</div>
						)
					}
				</div>

				<div className="top-lv">
					<ul>
						{
							time.map((s,v)=>
								<li
									key={s.title} className={s.active?'active':''}
									onClick={(e) => this.active(e,s,v)}
								>
									<p className="title">{s.title}</p>
									<p className="money">{s.money}</p>
								</li>
							)
						}
					</ul>
				</div>

				<div className="top-ranking">
					<List>
						<List.Item extra={
							<Stepper
								style={{ width: '100%', minWidth: '100px' }}
								showNumber
								min={1}
								onChange = { this.fare}
								defaultValue={defaultValue}
							/>}
						>
							竞价排名
						</List.Item>
					</List>
				</div>

				<div className="pay-money">
					需支付：<span className={`Tagging1`}>{ price }</span>元
				</div>

				<div className="payment">
					<span className="icon icon-weChat"></span>
					<span className="icon icon-select"></span>
					微信支付
				</div>

				{
					isApp?
						<span
							className="button gray"
						>
							立即置顶
						</span>:
						<span
							className="button"
							onClick={this.payType}
						>
							立即置顶
						</span>
				}

				<div className={`agr`}>
					<span className="icon icon-select"></span>
					充值代表同意<span>《增值服务协定》</span>
				</div>

				<div className="pay-dec">
					置顶说明：<br/>
					1.选择竞价排名的用户根据其出价从高到底依
					次排名，其展示位置在最顶端。
					<br/>
					2.未选择竞价排名的置顶用户在竞价排名用户
					之后
				</div>

				<ActivityIndicator
					toast
					text="Loading..."
					animating={ this.state.load }
				/>
			</div>
		)
	}
};

Personal = createForm()(Personal);
export default Personal;