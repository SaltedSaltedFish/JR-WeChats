import './index.less';

import React,{Component} from 'react';
import { is } from 'immutable';
import { createForm } from 'rc-form';
import { List, Stepper,Modal,ActivityIndicator } from 'antd-mobile';

import Api from '../../../api/request'

class Integral extends Component {
	constructor(props){
		super(props);
		let data = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};
		let price = 500;
		let hour = 6;   //  增加的时间基数
		let topType = [
			{title:'个人微信',active:true,value:1},
			{title:'微信群名片',active:false,value:2},
			{title:'公众号名片',active:false,value:3},
		];
		this.state = {
			data,
			time:[
				{
					title:'置顶6小时',
					money:'500积分',
					price:500,
					hour:6,
					active:true
				},{
					title:'置顶12小时',
					money:'800积分',
					price:800,
					hour:12,
					active:false
				},{
					title:'置顶24小时',
					money:'1200积分',
					price:1200,
					hour:24,
					active:false
				}
			],
			defaultValue:1,
			price,
			hour,
			priceType:500,

			load:false,

			topType,
			activeValue:{value:1,body:'个人微信'}   //  默认置顶
		};
	};

	componentWillUnmount(){
		this.setState = () => {};
	};

	active = (e,obj,index) => {
		e.preventDefault();
		if (obj.active) {
			return;
		}
		let { time,defaultValue,body,hour } = this.state;
		let price = 500;
		let priceType = 500;
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

		let price = priceType * defaultValue;
		this.setState({
			price,
			defaultValue
		});
	};

	pay = () => {

		const { data,price,defaultValue,body,hour,activeValue,priceType } = this.state;
		//console.log(body+'-'+activeValue.body);

		if (!data.integral || data.integral < price ) {
			Modal.alert('','积分不足');
			return;
		};

		this.setState({
			load:true
		});

		let moreTime = defaultValue * hour;

		let id = data.id;

		/*2018-1-27修改逻辑
		* @param userId {integer} 用户id
		* @param type {integer} 服务类型
		* @param stickType {integer} 置顶类型 1:个人 2:微信 3:公众号
		* @param stickHour {integer} 置顶小时
		* @pram stickCount {double} 置顶积分
		* */

		Api.post('weixinpay/payStickSuccess',{
			userId:id,
			type:2,
			stickType:activeValue.value,
			stickHour:moreTime,
			stickCount:price,
		})
			.then(res => {
				//console.log(res);

				this.setState({
					load:false
				});

				if (res.errorCode == 0) {
					Modal.alert('','置顶成功',[
						{ text: '确定' ,onPress:()=>
							//this.props.history.goBack()
							console.log('暂不处理')
						}
					]);
				} else {
					Modal.alert('',res.errorMsg || '请稍后再试');
				};
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
		const { getFieldProps } = this.props.form;
		const { time,defaultValue,price,topType } = this.state;
		// return (
		// 	<div className='noData hasPadding'>
		// 		正在开发中
		// 	</div>
		// );
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
								<p> {s.title} </p>
							</div>
						)
					}
				</div>

				<div className="top-lv">
					<ul>
						{
							time.map((s,v)=>
								<li
									key={s.title}
									className={s.active?'active':''}
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
								step={1}
								onChange = { this.fare}
								defaultValue={ defaultValue }
							/>}
						>
							竞价排名
						</List.Item>
					</List>
				</div>

				<div className="pay-money" style={{
					marginBottom:'.4rem'
				}}>
					需支付：<span className={`Tagging1`}>{price}</span>积分
				</div>

				<span className="button" onClick={this.pay}>立即置顶</span>

				<div className="pay-dec" style={{
					marginTop:'.4rem'
				}}>
					置顶说明：<br/>
					1.选择积分竞价排名的用户根据其出价从高到
					底依次排名，其展示位置在超级置顶之后。
					<br/>
					2.未选择竞价排名的积分置顶用户在竞价排名
					用户之后
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

Integral = createForm()(Integral);
export default Integral;