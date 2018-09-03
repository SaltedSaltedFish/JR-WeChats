import './index.less';

import React,{Component} from 'react';
import { connect } from 'react-redux';
import { Grid } from 'antd-mobile';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import Api from "../../api/request"
import { list } from '../../data/personal';
import {Modal } from 'antd-mobile';
class Personal extends Component {
	constructor(props){
		super(props);

		let data = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};

		this.state = {
			data,
		};

		this.listArray = [
			'地区：厦门市',
			'人气'
		];
	};

	componentDidMount(){
		this.updateInfo();
	};

	componentWillReceiveProps(nextProps) {
		//console.log(nextProps);
		if (nextProps.selected == 'yellowTab') {
			this.updateInfo();
		};
	};

	componentWillUnmount(){
		this.setState = () => {};
	};

	updateInfo = () => {
		//console.log(this.state.data);
		Api.get('user/findById',{id:this.state.data.id})
			.then(res => {
				//console.log(res);
				if (res.errorCode == 0) {
					let data = res.data || {};
					localStorage.signInfo = JSON.stringify(data);  //  返回user信息
					this.setState({ data });
				} else {
					//Modal.alert('用户不存在');
				};
			});
	};

	jump = (obj,index) => {
		if(obj.text=="签到"){
			Api.post("user/signIn",{id:this.state.data.id}).then(res=>{
				if(res.errorMsg=="ok"){
					this.updateInfo();
					Modal.alert('',"签到成功");
				}else{
					Modal.alert('',res.errorMsg);
				}

			})
		}else{
			this.props.history.push(obj.path);
		}
	};

	render(){
		//const { data } = this.state;
		const data = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};
		let name = data.vip?data.vip.name.split('-')[0]:false;
		//console.log(data);
		return (
			<div
				style={{
					height:'100%',
				}}
				className={`personal`}
			>
				<div className="common-header">
					<p className="title">个人中心</p>
				</div>
				<div className="per-info">
					<div
						className={'top vip' + ( name?data.vip.type:'0' )}
					>
						<Link
							to={{
								pathname:'/per_details'
							}}
						>
							<div className="img">
								<div className="img-group">
									<img
										src={data.headimgurl || ''}
									/>
								</div>
							</div>
							<div className="info">
								<p className="title">
									<span
										className="title-name"
									>
										{data.nickname}
									</span>
									{
										name?
											<span className="vip-nameplate">{name}</span>:
											<span className="vip-nameplate">普通用户</span>
									}
								</p>
								<p className="photo">手机号：{data.phone}</p>
								<p className="photo">ID:{data.id}</p>
							</div>
						</Link>
					</div>

					<div className="bottom">
						<ul>
							<li>地区：{data.city}</li>
							<li>积分：{data.integral}</li>
							<li>余额：{data.money}</li>
						</ul>
					</div>
				</div>
				<div className="per-list">
					<Grid data={ list } columnNum={3} onClick={this.jump}/>
				</div>
			</div>
		)
	}
};

Personal = connect(
	state => ({
		data:state.LoginInfo.data
	})
)(Personal);
Personal = withRouter(Personal);
export default Personal;