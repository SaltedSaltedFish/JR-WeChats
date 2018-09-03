
import './index.less';
import React,{ Component } from 'react';

export default class List extends Component {

	constructor (props) {
		super(props);
	};

	render(){
		const { button = true,data,btnText = '查看效果' } = this.props;
		return (
			<div className="already">
				<div className="alr-bottom">
					<p className="title">
						{data.title}
					</p>
					<p className="bonus">
						奖金：{data.taskAward}元1人次阅读量
					</p>
					<p className="dec">
						任务总量：{data.taskCount}人次
						<br/>
						已浏览：{data.taskFinishCount || 0}次
						<br/>
						截止时间：{data.endTime}
					</p>
					<p className="dec">

					</p>
				</div>
				{
					button?
						<div className="action">
							<div className="button">
								{ btnText }
							</div>
						</div>:null
				}
			</div>
		)
	}
};