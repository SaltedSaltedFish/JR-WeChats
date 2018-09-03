
/*微信端使用的小工具*/

import { GetQueryString,clone } from '../utils/small_tools';
import { Modal } from 'antd-mobile';
import Api from '../api/request';

class WeChantTools {

	constructor(){

	};

	//  微信网页授权
	auth(url1,url2,signInfo){
		/*
		* @param url1 微信对接
		* @param url2 api接口
		* @param signInfo 用户本地信息
		* */
		//var url1 = authorizedAddress;
		//var url2 = "weixin/auth";
		let url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd72758deacac38cd&redirect_uri=" + encodeURIComponent(url1, "utf-8") + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";

		let code = GetQueryString("code",window.location.search);

		//let signInfo = JSON.parse(localStorage.signInfo||'{}');

		/*测试中，每次都授权*/
		if( signInfo.openid == "" || signInfo.openid == null || signInfo.openid == undefined ) {
			if ( code == ""|| code == null || code == undefined ){
				localStorage.jr_VERSION = jr_VERSION;
				window.location.href = url;
			} else {
				Api.post(url2,{code})
					.then(res => {
						if (res.errorCode == 0) {

							let accessTokenInfo = res.data.accessTokenInfo;
							let user = res.data.user;
							localStorage.accessToken = accessTokenInfo.accessToken;
							localStorage.signInfo = JSON.stringify(user);
							localStorage.QRCodeUrl = httpCode + user.codeUrl;

							if (user.phone == '' || user.phone == null || user.phone == undefined ) {
								//this.props.history.replace('/bdPhone');
							};

						} else {
							//Modal.alert('','授权失败,请刷新页面');
						};

						// this.setState({
						// 	load:false,
						// });
					})
			};

		} else if (signInfo.user && (signInfo.user.phone == '' || signInfo.user.phone == null || signInfo.user.phone == undefined )) {
			//this.props.history.replace('/bdPhone');
		};
	};

	//  app登录授权
	auth_app(type){
		let authObj;
		if ( window.plus ) {
			plus.oauth.getServices( function (obj) {

				//Modal.alert(JSON.stringify(obj));

				obj.map( s => {
					if ( s.id == type ) {
						authObj = s;
					};
				});

				//this.auth_obj = clone(authObj);

				//Modal.alert(JSON.stringify(authObj));

				if (!authObj.authResult) {

					authObj.login(function(e) {

						Modal.alert("登录认证成功！");

						authObj.getUserInfo(function (info) {
							Modal.alert(JSON.stringify(info));
						})

					}, function( e ) {
						Modal.alert("登录认证失败！");
					});

				} else {
					Modal.alert("已经登录认证！");
				}

			}, function (error) {

				Modal.alert(JSON.stringify(error));
			});
		};
	};

	authOut(type){
		let authObj;

		if ( window.plus ) {
			plus.oauth.getServices( function (obj) {

				//Modal.alert(JSON.stringify(obj));

				obj.map( s => {
					if ( s.id == type ) {
						authObj = s;
					};
				});

				authObj.logout(function (res){
					Modal.alert('注销成功');
					Modal.alert(JSON.stringify(res));
				},function (res) {
					Modal.alert(JSON.stringify(res));
				})

			}, function (error) {
				Modal.alert(JSON.stringify(error));
			});
		};
	};

	//  微信内置方法支付
	pay(data,_this,fn){
		Api.post('weixinpay/createOrder',data)
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
								fn();
							};

							if(res.err_msg == "get_brand_wcpay_request:cancel" ) {

							};

							if(res.err_msg == "get_brand_wcpay_request:fail" ) {
								Modal.alert('','支付失败');
							};
						}
					);
				} else {
					Modal.alert('','操作失败，请稍后再试');
				};

				_this.setState({
					load:false
				});
			});
	};

	//  app支付
	pay_app(type,data,fn){
		let channel;

		Api.post('weixinpay/createOrder',data)
			.then(response => {
				//alert(JSON.stringify(response));
				if (response.errorCode == 0) {

					plus.payment.getChannels(function(obj){

						obj.map( s => {
							if ( s.id == type ) {
								channel = s;
							};
						});

						Modal.alert(JSON.stringify(channel));

						plus.payment.request(channel,response,function (success){
							fn();
							alert('成功');
							alert(JSON.stringify(success))
						},function(error){
							fn();
							alert(JSON.stringify(error))
						});



					},function(e){
						alert("获取支付通道失败："+e.message);
					});
				} else {
					fn();
					Modal.alert('','操作失败，请稍后再试');
				};

			});

		if ( window.plus ) {
			Api.post('weixinpay/createOrder',data)
				.then(response => {
					//alert(JSON.stringify(response));
					if (response.errorCode == 0) {

						plus.payment.getChannels(function(obj){

							obj.map( s => {
								if ( s.id == type ) {
									channel = s;
								};
							});

							Modal.alert(JSON.stringify(channel));

							plus.payment.request(channel,response,function (success){
								fn();
								alert('成功');
								alert(JSON.stringify(success))
							},function(error){
								fn();
								alert(JSON.stringify(error))
							});



						},function(e){
							alert("获取支付通道失败："+e.message);
						});
					} else {
						Modal.alert('','操作失败，请稍后再试');
					};

				});
		};
	};
};

let WeChantTools_ = new WeChantTools();

export default WeChantTools_;