import './index.less';
import React,{ Component } from 'react';
import { Modal } from 'antd-mobile';

import Api from '../../api/request';

class Invitation extends Component {
	constructor(props){
		super(props);
		let info = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};
		let id = info.id;
		this.state = {
			id,
			info,
			show:true,
		};
	};

	componentWillUnmount(){
		this.setState = () => {};
	};

	submit =  () => {
		let parentId = this.refs.input.value;
		//console.log(parentId);
		const { id } = this.state;
		if ( parentId == '' ) {
			Modal.alert('请输入上线ID');
			return;
		} else if ( parentId.length < 3 ) {
			Modal.alert('请输入正确的上线ID');
			return;
		};

		Api.post('user/update',{
			id,
			parentId
		})
			.then(res => {
				console.log(res);
				if ( res.errorCode == 0) {
					this.setState({
						info:res.data
					});

					let user = res.data;
					localStorage.signInfo = JSON.stringify(user);
					Modal.alert('成功');

				} else {
					Modal.alert(res.errorMsg);
				}
			})
	};

	render(){
		const { info,show } = this.state;

		if ( info.parentId ) {
			return null;
		};

		if ( !show ) {
			return null;
		};

		return (
			<div className="invContainer">
				<div className="mask" onClick={() => this.setState({show:false})} ></div>
				<div className={`invitation`}>
					<p className={`title`}>欢迎您，来到加人平台</p>
					<form>
						<div className="form-group">
							<input
								type="text"
								placeholder={`请输入上线ID`}
								ref={`input`}
							/>
						</div>
						<span
							className={`button`}
							onClick={ this.submit }
						>
							确定提交
						</span>
					</form>
				</div>
			</div>
		)
	};
}

export default Invitation;