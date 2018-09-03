//  任务详情页面
import './index.less';

import React,{ Component } from 'react';
import { Modal,ActionSheet,Toast,ActivityIndicator } from 'antd-mobile';

import Header from '../../components/Header';
import Content from '../../components/Content/';

import Api from '../../api/request';

class AdvDetails extends Component {
	constructor(props) {
		super(props);
		let data = props.location.state || {};
		let info = localStorage.signInfo ? JSON.parse(localStorage.signInfo) : {};
		this.state = {
			data,
			info,
			load:true
		};

		this.dataList = [
			{url: 'cTTayShKtEIdQVEMuiWt', title: '朋友圈'},
			{url: 'umnHwvEgSyQtXlZjNJTt', title: '微信好友'},
		].map(obj => ({
			icon: <img src={`https://gw.alipayobjects.com/zos/rmsportal/${obj.url}.png`} alt={obj.title}
			           style={{width: 36}}/>,
			title: obj.title,
		}));

		if ( navigator.userAgent.toLowerCase().indexOf('iphone') !== -1){
			this.href = location.href.split('#')[0];
		} else {
			this.href = location.href;
		};

		this.imgUrl = httpRequestAddress + 'dist/jr.png';
		//this.href = location.origin + location.pathname + '#/adv_details';

		this.timer = null;
	};

	componentWillMount(){
		this.auth();
	};

	auth = () => {

		const { info,data } = this.state;
		//console.log(info);
		let param = {
			link:data.link,
			advertId:data.id,
			userId:info.id
		};

		//Modal.alert(this.href);

		/*微信js授权*/
		Api.post('weixin/createJsapiSignature',{url:this.href})
			.then(res => {
				console.log(res);
				if (res.errorCode == 0) {
					wx.config({
						//debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						...res.data,
						jsApiList: [
							'onMenuShareTimeline',
							'onMenuShareAppMessage'
						] // 必填，需要使用的JS接口列表
					});
				} else {
					//this.auth();
				};
			});

		wx.ready( () => {
			//alert('微信认证成功');

			this.setState({
				load:false
			});

			let link =
				location.origin + location.pathname + `#/adv_statistics?${data.link}&${data.id}&${info.id}`;

			wx.checkJsApi({
				jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
				success: function(res) {
					console.log(res);
					//alert(JSON.stringify(res));
					// 以键值对的形式返回，可用的api值true，不可用为false
					// 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
				}
			});

			//  朋友圈
			wx.onMenuShareTimeline({
				title: data.title, // 分享标题
				imgUrl: this.imgUrl,
				link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				success: function (info) {
					console.log('调用成功',info);
					Modal.alert('分享成功');
				},
				cancel: function () {
					console.log('取消分享');
				},
				fail:function (info) {
					console.log('调用失败');
					alert(JSON.stringify(info))
				},
				complete:function (info) {
					console.log(info);
					//alert(JSON.stringify(info));
				}
			});

			//alert('分享给朋友');
			wx.onMenuShareAppMessage({
				title: data.title, // 分享标题
				imgUrl: this.imgUrl,
				desc: '快来帮我抢红包', // 分享描述
				link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				success: function (info) {
					console.log('调用成功',info);
					Modal.alert('分享成功');
				},
				cancel: function () {
					//console.log('取消分享');
				},
				fail:function (info) {
					//console.log('调用失败',info);
					alert(JSON.stringify(info))
				},
				complete:function (info) {
					//console.log(info);
					//alert(JSON.stringify(info));
				}
			});
		});

		wx.error( (res) => {
			//this.auth();
			Modal.alert(JSON.stringify(res));
			console.log(res);
		});

		this.timer = setTimeout(()=>{
			if (this.state.load) {
				this.setState({
					load:false
				});
				Modal.alert('','服务器响应超时');
			};
		},5000)
	};

	componentDidMount(){

	};

	componentWillUnmount(){
		clearTimeout(this.timer);
		this.setState = () => {};
	};

	// showShareActionSheet = (data) => {
	//
	// 	const { info } = this.state;
	// 	console.log(info);
	// 	let param = {
	// 		link:data.link,
	// 		advertId:data.id,
	// 		userId:info.id
	// 	};
	//
	// 	ActionSheet.showShareActionSheetWithOptions({
	// 			options: this.dataList,
	// 			// title: 'title',
	// 			message: '分享',
	// 		},
	// 		(buttonIndex) => {
	// 			console.log(this.href);
	// 			let link =
	// 				location.origin + location.pathname + `#/adv_statistics?${data.link}&${data.id}&${info.id}`;
	// 			link = encodeURIComponent(link);
	// 			if ( buttonIndex == 0 ) {   //朋友圈
	// 				//alert('分享到朋友圈');
	// 				wx.onMenuShareTimeline({
	// 					title: data.title, // 分享标题
	// 					link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
	// 					success: function (info) {
	// 						console.log('调用成功',info);
	// 					},
	// 					cancel: function () {
	// 						console.log('取消分享');
	// 					},
	// 					fail:function (info) {
	// 						console.log('调用失败');
	// 						alert(JSON.stringify(info))
	// 					},
	// 					complete:function (info) {
	// 						console.log(info);
	// 						alert(JSON.stringify(info));
	// 					}
	// 				});
	//
	// 			} else if( buttonIndex == 1 ) { //  朋友
	//
	// 				//alert('分享给朋友');
	// 				wx.onMenuShareAppMessage({
	// 					title: data.title, // 分享标题
	// 					desc: '快来帮我抢红包', // 分享描述
	// 					link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
	// 					success: function (info) {
	// 						console.log('调用成功',info);
	// 					},
	// 					cancel: function () {
	// 						console.log('取消分享');
	// 					},
	// 					fail:function (info) {
	// 						console.log('调用失败',info);
	// 						alert(JSON.stringify(info))
	// 					},
	// 					complete:function (info) {
	// 						console.log(info);
	// 						alert(JSON.stringify(info));
	// 					}
	// 				});
	// 			};
	// 		});
	// };

	render(){
		const { data,load } = this.state;
		if ( !data.user ) {
			return (
				<Content
					style={{
						background:'white'
					}}
				>
					<Header title="任务详情"/>
					<div className="noData hasPadding">请重新进入</div>
				</Content>
			)
		};

		return (
			<Content
				style={{
					background:'white'
				}}
			>
				<Header title="任务详情"/>

				<div className="card-content">
					<p className="title">
						{data.title}
					</p>
				</div>

				<p style={{
					color:'#fd3635',
					padding:'.2rem .3rem',
					textAlign:'center'
				}}>
					点击微信右上角分享给朋友或者发送到朋友圈
				</p>

				{/*<div className={`sta-wrapper`}>*/}
					{/*<iframe className={`statistics`} src={data.link} frameborder="0"></iframe>*/}
				{/*</div>*/}

				<ActivityIndicator
					toast
					text="Loading..."
					animating={ load }
				/>
			</Content>
		)
	}
};

export default AdvDetails;