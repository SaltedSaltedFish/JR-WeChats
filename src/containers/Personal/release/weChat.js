import './index.less';

import React,{Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { is } from 'immutable';
import { createForm } from 'rc-form';

import { Picker,TextareaItem,Modal,ActivityIndicator } from 'antd-mobile';

import pickerData from '../../../utils/pickerData';

import * as actions from '../../../actions';

/*使用其他的标签作为时间的children*/
const DatePickerChildren = props => {
	//console.log(props);
	return (
		<div
			onClick={props.onClick}
			style={{
				position:'relative'
			}}
		>
			<input type="text" {...props.getFieldProps(props.name, {
				initialValue: props.initialValue,
				rules: [{ required: true}]
			})}
			       disabled
			       style={props.style || {}}
			/>
			<span className="icon icon-inv"></span>
		</div>
	)
};

class WeChat extends Component {
	constructor(props){
		super(props);
		//console.log(props);
		let dataState = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};

		this.state = {
			dataState,
			sValue: [''],
			codeUrl:'',
			provinceValue:'',
			cityValue:'',
			load:false
		};
	};

	componentWillReceiveProps(nextProps){
		this.update(nextProps);
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
		this.update(this.props);
	};

	update = (nextProps) => {
		//console.log(nextProps);
		if ( nextProps.wechatGroup) {
			const userInfo = nextProps.wechatGroup;
			this.refs.title.value = userInfo.title;
			this.refs.introduce.state.value = userInfo.introduce;
			this.refs.classifyId.value = userInfo.classify.id;
			this.refs.province.value = userInfo.province;

			this.setState({
				provinceValue:userInfo.province,
				codeUrl:userInfo.codeUrl,
			});
		};
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

				actions.post('wechatGroup/insert',value)
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
		const {codeUrl, provinceValue } = this.state;

		return (
			<div
				style={{height:'100%'}}
				className={`release`}
			>
				<div className="release-fill">
					<div className="release-group">
						<p className="title">
							微信群名称
						</p>
						<input
							type="text"
							ref={`title`}
							data-name="微信群名称"
						/>
					</div>

					<div className="release-group">
						<p className="title">
							群微信二维码
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
							群二维码有有效时间，注意更新
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
							微信群描述
						</p>
						<TextareaItem
							placeholder=""
							ref={`introduce`}
							data-name="微信群描述"
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

WeChat = connect(
	state => ({
		data:state.ReleaseState.data
	}),
	dispatch => ({
		actions:bindActionCreators(actions,dispatch)
	})
)(WeChat);
WeChat = createForm()(WeChat);
export default WeChat;