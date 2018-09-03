
import './index.less';

import React,{ Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button} from 'antd-mobile';

import Header from '../../components/Header';
import Content from '../../components/Content/';

import Api from '../../api/request';


class InfoCard extends Component {
	constructor(props){
		super(props);
		//console.log(props.location.state);
		let data = props.location.state || {};
		this.state = {
			data
		};
	};

	componentDidMount(){

	};

	componentWillUnmount(){
		this.setState = () => {};
	};

	render(){
		const { data } = this.state;
		if ( !data.user ) {
			return (
				<Content
					style={{
						background:'white'
					}}
				>
					<Header title="名片详情"/>
					<div className="noData hasPadding">请重新进入</div>
				</Content>
			)
		};
		let user = data.user;
		let name = user.vip?user.vip.name.split('-')[0]:false;
		return (
			<Content
				style={{
					background:'white'
				}}
			>
				<Header title="名片详情"/>
				<div className="per-info card">
					<div
						className={'top vip' + ( name?user.vip.type:'0' )}
					>
						<div className="img">
							<div className="img-group">
								<img
									src={user.headimgurl || ''}
								/>
							</div>
						</div>
						<div className="info">
							<p className="title">
									<span
										className="title-name"
									>
										{user.nickname}
									</span>
								{
									name?
										<span className="vip-nameplate">{name}</span>:
										<span className="vip-nameplate">普通用户</span>
								}
							</p>
							<p className="photo">地区：{data.province} {data.city}</p>
							<p className="photo">微信号:{data.wxid}</p>
						</div>
					</div>
				</div>

				<div className="card-content">
					<p className="title">
						{data.introduce}
					</p>
					<div className="img">
						<img src={ httpRequestFile + data.codeUrl} alt=""/>
					</div>
				</div>
			</Content>
		)
	}
};

export default InfoCard;