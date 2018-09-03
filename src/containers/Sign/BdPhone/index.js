import './index.less';

import React,{Component} from 'react';
import { Button,Modal,ActivityIndicator } from 'antd-mobile';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { createForm } from 'rc-form';

import Header from '../../../components/Header';
import Content from '../../../components/Content';

import * as actions from '../../../actions';
import * as sign from '../../../actions/signIn';

import Api from '../../../api/request';


class BdPhone extends Component {
	constructor(props){
		super(props);
		let data = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};
		this.state = {
			data,
			load:false,
		};

		this.vercode = 'Unknown';

		this.timer = {};
	};

	componentWillUnmount(){
		clearTimeout(this.timer);
		this.props.actions.update(sign.VERCODE,false);
		this.setState = () => {};
	};

	submit = () => {
		this.props.form.validateFields(['phone'],(error, value) => {
			/*
			* @param headimgurl 用户头像
			* @param nickname 用户昵称
			* */
			if (!error) {
				const { data } = this.state;
				this.setState({
					load:true
				});

				value.id = data.id;
				this.props.actions.postData('user/bindPhone',value,sign.SIGNIN)
					.then(res => {
						//console.log(res);
						if (res.errorCode == 0) {
							let user = res.data || {};
							localStorage.signInfo = JSON.stringify(user);
							Modal.alert('',res.errorMsg,[
								{text:'确定',onPress:()=>
									this.props.history.goBack()
								}
							]);
						} else {
							Modal.alert(res.errorMsg);
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
				},6000)
			} else {
				Modal.alert('','手机号码必填');
			};
		});
	};

	getCode = () => {
		this.props.form.validateFields(['phone'],(error,value) => {
			//console.log(value);
			if (!error) {
				//console.log((/^1[3|4|5|8][0-9]\d{4,8}$/.test(value.phone)));
				if (!(/^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(value.phone))) {
					console.log('手机号码输入错误');
					Modal.alert('手机号码输入错误');
					return;
				};
				
				Api.post('sms/sendCode',value)
					.then(res => {
						console.log(res);
						this.vercode = res.data.random;
					})

				this.props.actions.update(sign.VERCODE,true);
			};
		});
	};

	verCode = e => {
		//console.log(e.target.value);
		let { disabled } = this.props.reduxState;
		let disable = disabled;

		if (e.target.value == this.vercode) {
			disable = false;
		} else {
			disable = true;
		};
		//console.log(disable);
		if (disable != disabled) {
			this.props.actions.update(sign.UPBUTTON,disable);
		}
	};

	render(){
		const { getFieldProps } = this.props.form;
		const { disabled,sedCode } = this.props.reduxState;
		const { data } = this.state;
		return (
			<Content>
				<Header title={`绑定手机号`}/>
				<div className="bd-phone">
					<p className="title">
						您的微信号码 <span className={`Tagging1`}>{data.nickname}</span> 请绑定您的手机号码
					</p>
					<form>
						<div className="form-group verContainer">
							<span className="icon icon-username1"></span>
							<input type="number"
							       placeholder={`请输入手机号码`}
							       {...getFieldProps('phone',{
								       initialValue:'',
								       rules: [{required: true}],
							       })}
							/>

							<div
								className="verCode"
								onClick={this.getCode}
								ref={`code`}
							>
								{
									sedCode?'已发送':'发送验证码'
								}
							</div>
						</div>

						<div className="form-group">
							<span className="icon icon-password1"></span>
							<input type="text"
							       placeholder={`请输入验证码`}
							       {...getFieldProps('verCode',{
								       initialValue:'',
								       onChange:this.verCode,
							       })}
							/>
						</div>

						<Button
							disabled={disabled}
							className={`submit`}
							onClick={this.submit}
						>
							绑定手机号码
						</Button>
					</form>
				</div>

				<ActivityIndicator
					toast
					text="Loading..."
					animating={ this.state.load }
				/>
			</Content>
		)
	};
};

BdPhone = createForm()(BdPhone);

BdPhone = connect (
	state=>({
		reduxState:state.LoginInfo
	}),
	dispatch => ({
		actions:bindActionCreators(actions,dispatch)
	})
)(BdPhone);

export default BdPhone;