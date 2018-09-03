import './index.less';

import React,{Component} from 'react';
import { ActivityIndicator,Modal } from 'antd-mobile';

import Content from '../Content';
import Header from '../Header';

import Api from '../../api/request';
import { GetQueryString } from '../../utils/small_tools';

class AdvStatistics extends Component {
	constructor(props){
		super(props);
		// let text = window.location.hash;
		// let link = GetQueryString('link',text);
		// let advertId = GetQueryString('advertId',text);
		// let userId = GetQueryString('userId',text);

		let text = window.location.hash.replace('#/adv_statistics?','');

		text.indexOf('&zdq=') == -1?text = text.split('&'):text = text.split('&zdq=');

		//text = window.location.hash.replace('#/adv_statistics?','').split('&zdq=');
		let data = text.length == 0?null:text;
		//console.log(data);
		this.state = {
			data,
			load:true,
		};

		this.timer = null;
	};

	componentDidMount(){
		const { data } = this.state;
		Api.put('taskBrowse/insertByBrowse',{
			taskId:data[1],
			userId:data[2],
			//finishCount:1,
		})
			.then(res => {
				window.location.href = data[0];
			})
	};

	componentWillUnmount(){
		clearTimeout(this.timer);
		this.setState = () => {};
	};

	render(){
		const { data } = this.state;
		return (
			<Content style={{padding:0}}>
				{
					data?
						<div className={`sta-wrapper`}>
							<ActivityIndicator
								toast
								text="Loading..."
								animating={ this.state.load }
							/>
						</div>
						:<div className={`noData hasPadding`}>数据出错请联系客服</div>
				}
			</Content>
		)
	};
};

export default AdvStatistics;