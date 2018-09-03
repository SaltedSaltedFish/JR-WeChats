import './index.less';

import React,{Component} from 'react';
import { Button } from 'antd-mobile';

import { createForm } from 'rc-form';

import Header from '../../../components/Header';
import Content from '../../../components/Content';


class BdWeChat extends Component {
	constructor(props){
		super(props);
		this.state = {
			name:'13688997765'
		};

	};

	componentWillUnmount(){
		this.setState = () => {};
	};

	submit = () => {
		this.props.form.validateFields((error, value) => {
			console.log(error, value);
			this.props.history.replace('/');
		});
	};

	render(){
		const { getFieldProps } = this.props.form;
		const { name } = this.state;
		return (
			<Content>
				<Header title={`绑定微信号`}/>
				<div className="bd-phone">
					<p className="title">
						您的手机号码  <span className={`Tagging1`}>{name}</span>  通过验证,点击绑定您的微信号
					</p>
					<Button
						className={`submit`}
						onClick={this.submit}
					>
						点击绑定微信号
					</Button>
				</div>
			</Content>
		)
	};
};

BdWeChat = createForm()(BdWeChat);
export default BdWeChat;