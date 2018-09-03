import './index.less';

import React,{Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActivityIndicator,Modal } from 'antd-mobile';

import Content from '../../components/Content';
import Mask from '../../components/Mask';

/*图片*/
import Qrcode from '../../../static/images/mask/qr-code.png';
/**/
import { UPDATEMASK } from '../../actions/mask';
import * as actions from '../../actions';
import Native from '../../utils/Native';


class InvitationPage extends Component {
	constructor(props){
		super(props);
		let data = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};

		this.state = {
			data,
			load:false,
			imgUrl: localStorage.QR_CODEIMG || '',    //  分享图
			imgBg:null, //  分享背景
			show:false
		};

		this.timer = {};

		this.imgUrl = '';
	};

	componentDidMount(){
		this.updateInfo();
	};

	componentWillReceiveProps(nextProps) {
		//console.log(nextProps);
		if (nextProps.selected == 'redTab') {
			this.updateInfo();
		};
	};

	componentWillUnmount(){
		this.setState({
			load:false
		});
		window.onload = () => {};
		clearTimeout(this.timer);
		this.setState = () => {};
	};

	canvas = (e) => {

		e.stopPropagation();
		let data = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};
		const { actions } = this.props;

		this.setState({
			show:true,
			load:true,
		});

		/*canvas*/
		var canvas = document.getElementById('canvas');
		let canvasWidth = StateWidth -20;
		let canvasHeight = StateHeight -20;
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		var canvas_box = canvas.getContext('2d');
		var img1 = this.refs.img1;
		var img2 = new Image();
		//img2.setAttribute("crossOrigin",'Anonymous');

					/*测试成功的代码 by jy*/
					// img2.src = 'http://qmhf.liudagood.com/resource/qrcode/109.jpg';
					// img2.onload = () => {
					// 	console.log(img2);
					// 	var width = canvasWidth,
					// 		height = canvasHeight,
					// 		qr_width = canvasWidth/3,
					// 		qr_height = canvasWidth/3;
					// 	var qr_top = height - qr_height - (height * .07);
					// 	var qr_left = (width - qr_width)/2;
					// 	canvas_box.drawImage(img1,0,0,828,1230,0,0,width,height);
					// 	canvas_box.drawImage(img2,0,0,430,430,qr_left,qr_top,qr_width,qr_height);
					//
					// 	//console.log(canvas.toDataURL("image/png"));
					//
					// 	this.setState({
					// 		imgUrl:canvas.toDataURL("image/png")
					// 	});
					// 	localStorage.QR_CODEIMG = canvas.toDataURL("image/png") || '';
					// };

		actions.post('weixin/createQrCodeForever',{userId:data.id})
			.then(res => {
				/*
				* @param codeUrl 二维码
				* @param invite 邀请的人数
				* @param money 下线的提成
				* @param integral 会员积分
				* */

				if ( res.errorCode == 0 ) {

					this.setState({
						data:(res.data || {})
					});

					img2.src = httpCode + res.data.codeUrl;
					//img2.src = Qrcode;
					img2.onload = () => {
						let width = canvasWidth,
							height = canvasHeight,
							qr_width = canvasWidth/3,
							qr_height = canvasWidth/3;
						let qr_top = height - qr_height - (height * .07);
						let qr_left = (width - qr_width)/2;
						canvas_box.drawImage(img1,0,0,828,1230,0,0,width,height);
						canvas_box.drawImage(img2,0,0,430,430,qr_left,qr_top,qr_width,qr_height);

						//console.log(canvas.toDataURL("image/png"));

						this.setState({
							imgUrl:canvas.toDataURL("image/png")
						});

						localStorage.QR_CODEIMG = canvas.toDataURL("image/png") || '';
					};

					localStorage.QRCodeUrl = httpCode + res.data.codeUrl;
					localStorage.signInfo = JSON.stringify(res.data);    //  返回user信息
				} else {
					Modal.alert(res.errorMsg);
					this.setState({
						show:false
					});
				};

				this.setState({
					load:false,
				});
			});
	};

	createCode = (e) => {
		e.stopPropagation();
		let data = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};
		const { actions } = this.props;

		this.setState({
			load:true,
		});

		actions.post('weixin/createQrCodeForever',{userId:data.id})
			.then(res => {
				/*
				* @param codeUrl 二维码
				* @param invite 邀请的人数
				* @param money 下线的提成
				* @param integral 会员积分
				* */

				if ( res.errorCode == 0 ) {

					this.setState({
						data:res.data
					});

					let headimgurl = httpCode + res.data.codeUrl;
					localStorage.QRCodeUrl = headimgurl;

					actions.update(UPDATEMASK,{
						headimgurl,
						class:'QR-code'
					});

					localStorage.signInfo = JSON.stringify(res.data);    //  返回user信息
				} else {
					console.log(res.errorMsg);
				};

				this.setState({
					load:false,
				});
			});
	};


	updateInfo  = () => {
		let data = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};
		const { actions } = this.props;

		actions.post('weixin/createQrCodeForever',{userId:data.id})
			.then(res => {
				/*
				* @param codeUrl 二维码
				* @param invite 邀请的人数
				* @param money 下线的提成
				* @param integral 会员积分
				* */

				if ( res.errorCode == 0 ) {

					this.setState({
						data:res.data
					});

					localStorage.QRCodeUrl = httpCode + res.data.codeUrl;   //  二维码地址

					localStorage.signInfo = JSON.stringify(res.data);    //  返回user信息
				} else {
					console.log(res.errorMsg);
				};
			});

	};

	click = (e,url) => {
		e.stopPropagation();

		console.log(url);
		Modal.alert('截屏保存');
		this.setState({show:false});
		return;

		Modal.alert('保存在本地', '', [
			{ text: '取消', onPress: () => console.log('cancel') },
			{
				text: '确定',
				onPress: () => {
					if ( window.plus ) {
						plus.gallery.save(url,function (success){
							//alert(JSON.stringify(success));
							plus.nativeUI.alert('保存成功请在相册查看!');
						},function(error){
							plus.nativeUI.alert(JSON.stringify(error));
						})
					}
				}
			},
		]);

		return false;
	};

	render(){
		let data = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};
		const { imgUrl,imgBg,show } = this.state;
		return (
			<div style={{height:'100%',background:'white',position:'relative',overflow:'auto',paddingTop:'.88rem'}}>
				<div className="common-header">
					<p className="title">邀请好友</p>
					{/*<span className="icon text">邀请记录</span>*/}
				</div>

				<div className="inv-top">
					<div className="top-info">
						<p className="title">邀请人数</p>
						<p className="dec">{data.invite || '0'}<span>人</span></p>
					</div>
					<div className="top-info">
						<p className="title">积分奖励</p>
						<p className="dec">{data.integral || '0'}<span>积分</span></p>
					</div>
					<div className="top-info">
						<p className="title">现金奖励</p>
						<p className="dec">{data.money || '0'}<span>元</span></p>
					</div>
				</div>

				<ActivityIndicator
					toast
					text="Loading..."
					animating={ this.state.load }
				/>

				<div className="inv-bottom">
					<div className="dec">
						<h2>奖励规则</h2>
						<ul>
							<li>邀请好友关注加人公众号奖励10积分</li>
							{/*<li>*/}
								{/*如果您购买了平台的VIP服务，您所邀请的*/}
								{/*好友购买VIP时您将根据您的会员等级获得*/}
								{/*额外的奖励,详细奖励规则如下：*/}
								{/*<p style={{margin:'.25rem 0 .32rem'}}>*/}
									{/*顶级永久VIP-(佣金<span className={`Tagging1`}>40%+13%+7%</span>)*/}
									{/*<br/>*/}
									{/*超级永久VIP-(佣金<span className={`Tagging1`}>25%+10%+5%</span>)*/}
									{/*<br/>*/}
									{/*普通永久VIP-(佣金<span className={`Tagging1`}>20%+8%+3%</span>)*/}
									{/*<br/>*/}
								{/*</p>*/}
							{/*</li>*/}
						</ul>
						{/*<p className={`ps`}>*/}
							{/*注：若您是顶级永久VIP，您的一级下线购买会员时您可得到其购买会员价值40%的奖励，二级下线购买会员时您可得到其购买会员价值13%的奖励，三级下线购买会员时您可得到其购买会员价值7%奖励。*/}
						{/*</p>*/}
					</div>
					{
						imgBg == null ?
							<span
								className={`button gray`}
								//onClick={this.canvas}
							>
								加载中...
							</span>:
							<span
								className={`button `}
								onClick={this.canvas}
							>
								立即邀请好友
							</span>
					}
				</div>

				<div
					className={`inv-mask ` + (show?'':'hidden')}
					onClick={() => this.setState({show:false})}
				>
					<canvas id="canvas"></canvas>

					<img
						src={imgUrl}
				        alt=""
						onClick={ isMicroMessenger?null:e => this.click(e,imgUrl) }
					/>

					<img
						ref={`img1`}
						src={ Qrcode.indexOf('dist') == -1?Qrcode.replace('./','./dist/'):Qrcode }
						alt=""
						onLoad={() => this.setState({
							imgBg:true
						})}
						hidden
					/>
				</div>

			</div>
		)
	}
};

InvitationPage = connect(
	state => ({
		reduxState:state.MaskState
	}),
	dispatch => ({
		actions:bindActionCreators(actions,dispatch)
	})
)(InvitationPage);

export default InvitationPage;