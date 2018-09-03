import './index.less';

import React,{Component} from 'react';
import { Modal } from 'antd-mobile';

import Header from '../../components/Header';
import Content from '../../components/Content';

import Api from '../../api/request';

class NewsDetails extends Component {
	constructor(props){
		super(props);

		let id = props.location.search.replace('?','');
		this.state = {
			id,
			news:{}
		};

		this.url = 'news/findById';
	};

	componentDidMount(){
		const { id } = this.state;
		Api.get(this.url,{id})
			.then(res => {
				if (res.errorCode == 0) {
					this.setState({
						news:res.data
					});
				} else {
					Modal.alert(res.errorMasg);
				};
			})
	};

	componentWillUnmount(){
		this.setState = () => {};
	};

	render(){
		const { news } = this.state;
		return (
			<Content
				style={{
					background:'white'
				}}
			>
				<Header title='新闻详情'/>
				<div className="new-details">
					<p className="title">{news.title || ''}</p>
					<p className="info">
						{news.content || ''}
					</p>
				</div>
			</Content>
		)
	}
};

export default NewsDetails;