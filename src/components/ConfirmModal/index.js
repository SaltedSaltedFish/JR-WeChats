import './index.less';

import React,{Component} from 'react';

class ConfirmModal extends Component {
	constructor(props){
		super(props);
	};

	submit = () => {

		this.props.fn();
	};

	render(){
		return (
			<div className={`confirm-modal`}>
				<div className="mask"
					 onClick={this.props.fn}
				>

				</div>
				<div className="content">
					<p className="title">
						任务订单确认
						<span
							className="icon icon-close"
							onClick={this.props.fn}
						></span>
					</p>
					<div className="dec">
						<p>支付奖金总额：<span className={`Tagging1`}>100,000</span>金币</p>
						<p>平台服务费：<span className={`Tagging1`}>100,000</span>金币</p>
						<p>支付总额：<span className={`Tagging1`}>100,000</span>金币</p>
					</div>
					<div
						className="form-button"
						onClick={this.submit}
					>
						确认
					</div>
				</div>
			</div>
		)
	};
};

export default ConfirmModal;