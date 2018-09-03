import './index.less';
import React,{ Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { InputItem,Button,ActivityIndicator,Modal } from 'antd-mobile';

import { createForm } from 'rc-form';

import Content from '../../../components/Content';

import * as actions from '../../../actions';
import * as sign from '../../../actions/signIn';

import WeChantTools from '../../../utils/weChat_tools';

import icon from '../../../../static/images/login/icon.png';

class Login extends Component {
	constructor(props){
		super(props);
		this.state = {
			waitTime:60, //  单位秒

			animating:false
		};

		this.vercode = '191';

		this.timer = {};
	};

	componentDidMount(){

	};

	componentWillUnmount(){
		clearTimeout(this.timer);
		this.props.actions.update(sign.VERCODE,false);
		this.setState = () => {};
	};

	submit = () => {
		this.props.form.validateFields(['phone'],(error, value) => {
			//console.log(error, value);

			/*
			* @param headimgurl 用户头像
			* @param nickname 用户昵称
			* */

			//sessionStorage.LOGIN = true;

			if (!error) {

				this.setState({
					animating:true
				});

				this.props.actions.postData('login/phone',value,sign.SIGNIN)
					.then(res => {
						if ( res.errorCode == 0) {
							localStorage.jr_VERSION = jr_VERSION;
							let accessTokenInfo = res.data.accessTokenInfo;
							let user = res.data.user;
							localStorage.accessToken = accessTokenInfo.accessToken;
							localStorage.signInfo = JSON.stringify(user);
							localStorage.QRCodeUrl = httpCode + user.codeUrl;
							//  openid 用来判断是否绑定了微信
							// openid?this.props.history.replace('/'):this.props.history.replace('/bdWeChat')
							this.props.history.replace('/');
						} else {
							Modal.alert(res.errorMsg);
						};

					});
			};
		});
	};

	getCode = () => {
		this.props.form.validateFields(['phone'],(error,value) => {
			//console.log(value);
			if (!error) {
				//console.log((/^1[3|4|5|8][0-9]\d{4,8}$/.test(value.phone)));
				if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(value.phone))) {
					Modal.alert('手机号码输入错误');
					return;
				};

				this.setState({
					animating:true
				});

				this.props.actions.post('sms/sendCode',value)
					.then(res => {

						if ( res.errorCode == 0) {
							this.vercode = res.data.random;
							this.props.actions.update(sign.VERCODE,true);
						} else {
							Modal.alert(res.errorMsg);
						};

						this.setState({
							animating:false
						});
					})

				//
				// this.timer = setInterval(()=>{
				// 	this.props.actions.update(sign.WAITTIME);
				// },500);

				//clearInterval(this.timer);
			} else {
				Modal.alert('请填写手机号码!');
			}
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
		};
	};

	render(){
		const { getFieldProps } = this.props.form;
		const { disabled,sedCode } = this.props.reduxState;
		return (
			<Content
				style={{padding:'0'}}
				className={`login`}
			>
				<ActivityIndicator
					toast
					text="Loading..."
					animating={ this.state.animating }
				/>

				<div className="login-input">

					<div className="logo">
						<img src={icon.indexOf('dist') == -1?icon.replace('./','./dist/'):icon} alt=""/>
					</div>

					<form>
						<div className="logInput-group">
							<span className="icon icon-username"></span>

							<input type="number"
							   {...getFieldProps('phone',{
									initialValue:'',
									rules: [{required: true}],
							   })}
							/>
						</div>

						<div className="logInput-group verContainer">
							<span className="icon icon-password"></span>

							<input type="text"
							   {...getFieldProps('verCode',{
								   initialValue:'',
								   onChange:this.verCode,
							   })}
							/>

							{
								!sedCode?
									<div
										className="verCode"
										onClick={this.getCode}
										ref={`code`}
									>
										发送验证码
									</div>:
									<div
										className="verCode"
										ref={`code`}
									>
										已发送
									</div>
							}
						</div>

						<Button
							disabled={disabled}
							className={`submit`}
							onClick={this.submit}
							style={{
								border:'none',
								outline:'none'
							}}
						>
							登录
						</Button>
					</form>

					{/*<div className="wechat" onClick={ ()=> WeChantTools.auth_app('weixin') }>*/}
						{/*<p className="title">微信直接登录</p>*/}
						{/*<img*/}
							{/*src={require('../../../../static/images/login/login-icon-wechat.svg')}*/}
							{/*alt=""*/}
						{/*/>*/}
					{/*</div>*/}

					{/*<div className="wechat" onClick={ ()=> WeChantTools.authOut('weixin') }>*/}
						{/*<p className="title">注销</p>*/}
						{/*<img*/}
							{/*src={require('../../../../static/images/login/login-icon-wechat.svg')}*/}
							{/*alt=""*/}
						{/*/>*/}
					{/*</div>*/}
				</div>
			</Content>
		)
	};
};

Login = createForm()(Login);
Login = connect (
	state=>({
		reduxState:state.LoginInfo
	}),
	dispatch => ({
		actions:bindActionCreators(actions,dispatch)
	})
)(Login);
export default Login;