import './index.less';

import React,{Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { is } from 'immutable';
import { createForm } from 'rc-form';

import { ActivityIndicator,Picker,List,InputItem,DatePicker,Modal } from 'antd-mobile';

import Content from '../../../components/Content';
import Header from '../../../components/Header';

import * as actions from '../../../actions';
import TimeConversion from '../../../utils/TimeConversion';

class Ordinary extends Component {
	constructor(props){
		super(props);
		console.log(props);

		let dpData = JSON.parse(props.location.search.replace('?',''));
		let dpValue = new Date(dpData.updateTime || Date.now());
		let dataState = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};

		console.log(dpValue,dpData);

		this.state = {
			dataState,
			dpValue,
			dpData,
			load:false,
		};

		this.url = 'advert/update';

		this.count = 100;
		this.award = 0.1;

		this.timer = {};
	};

	componentWillUnmount(){
		this.setState = () => {};
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

		this.props.form.validateFields((error, value) => {

			if ( !error ) {

				if ( value.link.indexOf('?') != -1) {
					value.link = value.link.substring(0,value.link.indexOf('?'))
				};

				const { actions } = this.props;
				const { dataState,dpData } = this.state;
				value.id = dpData.id;
				value.endTime = TimeConversion.time(value.endTime);

				console.log(value);

				actions.post(this.url,value)
					.then(res => {
						console.log(res);
						if (res.errorCode == 0) {
							Modal.alert('修改成功','',[{text:'确定',onPress:() => {
								this.props.history.goBack();
							}}]);
						} else {
							Modal.alert(res.errorMsg);
						};
					});

			} else {
				console.log(error);

				if ( error.link && error.link.errors[0].message.indexOf('url') != -1) {
					Modal.alert('请检查链接地址');
				} else {
					Modal.alert('所有内容都必填');
				};

			};

		});

	};

	price = (type,value) => {
		// this.props.form.validateFields(['taskCount','taskAward'],(error,value) => {
		// 	console.log(error,value);
		// })
		this[type] = value;
	};

	render(){

		const { getFieldProps } = this.props.form;
		const { dpData } = this.state;

		return (
			<Content>

				<Header title={'文章编辑'}/>

				<div
					style={{height:'100%',overflow:'hidden'}}
				>
					<ActivityIndicator
						toast
						text="Loading..."
						animating={ this.state.load }
					/>

					<div className="per-info">
						<List>
							<InputItem
								{...getFieldProps('title',{
									initialValue:dpData.title,
									rules: [{required: true}],
								})}
								placeholder="请编辑文章标题"
							/>
							<InputItem
								{...getFieldProps('link',{
									initialValue:dpData.link,
									rules: [{required: true,type:'url'}],
								})}
								placeholder="请粘贴文章链接"
							/>
						</List>
					</div>

					<div className="per-info">
						<List>
							<DatePicker
								mode="datetime"
								title="选择截止日期"
								extra=""
								{...getFieldProps('endTime',{
									initialValue:this.state.dpValue,
									rules: [{required: true}],
								})}
							>
								<List.Item arrow="horizontal">任务截止时间</List.Item>
							</DatePicker>
						</List>
					</div>

					<div
						className="release-group"
						style={{overflow:'hidden'}}
					>
						<span
							className="button"
							onClick={this.submit}
							style={{margin:'0 .3rem .2rem',borderRadius:'8px'}}
						>
							发布
						</span>
					</div>

				</div>
			</Content>
		)
	}
};

Ordinary = connect(
	state => ({
		data:state.ReleaseState.data
	}),
	dispatch => ({
		actions:bindActionCreators(actions,dispatch)
	})
)(Ordinary);
Ordinary = createForm()(Ordinary);
export default Ordinary;