import './index.less';

import React,{Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { is } from 'immutable';
import { createForm } from 'rc-form';

import { TextareaItem,Modal,ActivityIndicator } from 'antd-mobile';

import * as actions from '../../../actions';

class Personal extends Component {
	constructor(props){
		super(props);
		let dataState = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};

		this.state = {
			dataState,
			sValue: [''],
			codeUrl:'',
			provinceValue:'',
			cityValue:'',
			load:false,
			update:false,
		};
	};

	componentWillReceiveProps(nextProps){
		//console.log(nextProps);
		if ( nextProps.userInfo) {
			const userInfo = nextProps.userInfo;
			this.refs.wxid.value = userInfo.wxid;
			this.refs.introduce.state.value = userInfo.introduce;
			this.refs.classifyId.value = userInfo.classify.id;
			this.refs.province.value = userInfo.province;

			this.setState({
				provinceValue:userInfo.province,
				codeUrl:userInfo.codeUrl,
			});
		};
	};

	shouldComponentUpdate(nextProps, nextState){
		var thisProps = this.props || {}, thisState = this.state || {};

		if (Object.keys(thisProps).length !== Object.keys(nextProps).length ||
			Object.keys(thisState).length !== Object.keys(nextState).length) {
			return true;
		}

		for (var key in nextProps) {
			if (!is(thisProps[key], nextProps[key])) {
				return true;
			}
		}

		for (var key in nextState) {
			if (thisState[key] !== nextState[key] || !is(thisState[key], nextState[key])) {
				return true;
			}
		}
		return false;
	};

	componentDidMount(){

	};

	submit = () => {
		const { dataState,codeUrl } = this.state;

		if ( codeUrl == '' ) {
			Modal.alert('','请上传二维码');
			return;
		};

		let value = {};

		for ( let i = 0; i < Object.keys(this.refs).length; i++ ) {
			let key = Object.keys(this.refs)[i];
			let element = this.refs[Object.keys(this.refs)[i]];

			if ( key == 'introduce' ) {
				element = element.textareaRef;
			};

			if ( !element.value || element.value == ' ' ||element.value == undefined) {
				Modal.alert('',element.dataset.name + '必填');
				return;
			};

			value[key] = element.value;
		};

		Modal.alert('','确定发布？',[
			{ text: '取消' },
			{ text: '确定', onPress: () => {

				const { actions } = this.props;
				value.userId = dataState.id;
				value.codeUrl = codeUrl;
				value.nickname = dataState.nickname;

				console.log(value);

				if ( value.userId == undefined ) {
					Modal.alert('','无法获取到用户信息，请刷新首页');
					return;
				};

				actions.post('wechat/insert',value)
					.then(res => {
						//console.log(res);
						if (res.errorCode == 0) {
							Modal.alert('','提交成功',[
								{text:'确定',onPress:()=>
									this.props.history.goBack()
								}
							]);
						} else {
							Modal.alert('','失败');
						};

					})
			}},
		]);
	};

	upload = e => {
		const { actions } = this.props;
        this.setState({
			load:true
		});
		actions.post('fileUpload',{fileName:e.target.files[0]})
			.then(res => {
				if (res.errorCode == 0) {
					this.setState({
						codeUrl:res.data.url,
						load:false
					});
				}
			})
	};

	render(){

		let { data,city,province } = this.props;
		//let wxid = this.props.wxid;
		const { dataState,sValue,codeUrl, provinceValue } = this.state;

		return (
			<div
				style={{height:'100%'}}
				className={`release`}
			>
				<div className="per-info">
					<div className="top">
						<div className="img">
							<img src={dataState.headimgurl} alt=""/>
						</div>
						<div className="info">
							<p className="title">{dataState.nickname}</p>
							<p className="photo">头像和昵称将会同步您的微信<br/>微信号必须唯一</p>
						</div>
					</div>
				</div>

				<div className="release-fill">
					<div className="release-group">
						<p className="title">
							我的微信号
						</p>
						<input
							type="text"
							ref={`wxid`}
							data-name="微信号"
						/>
					</div>

					<div className="release-group">
						<p className="title">
							我的二维码
						</p>
						<label>
							<div className="add-photo">
								{
									codeUrl != ''?<img src={httpRequestFile + codeUrl} alt=""/>:null
								}
								<ActivityIndicator
									toast
									text="Loading..."
									animating={ this.state.load }
								/>
							</div>
							<input type="file" hidden onChange={ this.upload}/>
						</label>
						<p className="dec">
							获取方法：打开微信主界面，选择“我”，点击顶部昵称，再选择“我的二维码”，点击右上角的菜单，选择保存图片。
						</p>
					</div>

					<div
						className="release-group"
					>
						<p className="title">
							选择所属类型<small>(如无效请刷新页面)</small>
						</p>

						<select
							className={`input`}
							ref={'classifyId'}
							data-name="类型"
						>
							{
								data.map(s =>
									<option key={s.id} value={s.id}>{s.name}</option>
								)
							}
						</select>

					</div>

					<div className="release-group">
						<p className="title">
							选择所在城市
						</p>
						<select
							className={`input`}
							ref={'province'}
							data-name="省份"
							onChange={e => this.setState({provinceValue:e.target.value})}
							style={{
								marginBottom:'.2rem'
							}}
							defaultValue=" "
						>
							<option disabled value=" "></option>
							{
								province.map(s =>
									<option key={s} value={s}>{s}</option>
								)
							}
						</select>

						<select
							className={'input'}
							data-name="城市"
							ref={`city`}
						>
							{
								provinceValue?
									city[provinceValue]?city[provinceValue].map(s =>
										<option key={s} value={s}>{s}</option>
									):null
									:null
							}
						</select>
					</div>

					<div className="release-group">
						<p className="title">
							个人描述
						</p>
						<TextareaItem
							placeholder=""
							ref={`introduce`}
							data-name="个人描述"
							className={`textarea`}
							defaultValue={``}
							rows={5}
						/>
					</div>

					<div className="release-group" style={{overflow:'hidden'}}>
						<span
							className="button"
							onClick={this.submit}
						>
							保存并发送
						</span>
					</div>

				</div>
			</div>
		)
	}
};

Personal = connect(
	state => ({
		data:state.ReleaseState.data
	}),
	dispatch => ({
		actions:bindActionCreators(actions,dispatch)
	})
)(Personal);
Personal = createForm()(Personal);
export default Personal;