
import './index.less';

import React,{ Component } from 'react';
import Content from '../../../../components/Content';
import Header from '../../../../components/Header';

export default class EffectDetails extends Component {

	constructor (props) {
		super(props);
		const end = props.location.search.replace('?','');
		//console.log(end);

		this.state = {
			end,
		}
	};

	render(){
		const { end } = this.state;
		return (
			<Content
				style={{
					background:'white'
				}}
			>
				<Header title={`推广效果`}/>
				<div className={`effect`}>
					<p className="title">
						尊敬的用户您好，您昨天的广告推广数据如下
					</p>
					<p className="dec">
						统计时间：2018-03-06
					</p>
					<p className="dec">
						统计数据：昨天有19,876人看到您的广告
					</p>
					<p className="dec">
						其中北京为978人次、上海为678人次、广州
						为378人次
					</p>

					{
						end?
							<p className="dec-">
								任务浏览总人次 9.000次，共花费1.800元 ，结余200元已返回至你的余额,请注意查收！
							</p>:null
					}
				</div>
			</Content>
		)
	}
};