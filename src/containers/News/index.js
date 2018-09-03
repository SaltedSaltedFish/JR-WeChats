import './index.less';

import React,{Component} from 'react';
import { Link } from 'react-router-dom';

import Header from '../../components/Header';
import Content from '../../components/Content';
import ListViewComponent from '../../components/ListViewTest';

class News extends Component {
	constructor(props){
		super(props);

		this.state = {

		};

		this.url = 'news/findAll';
	};

	rows = s =>{
		return (
			<div key={s.id} className="bill-list">
				<Link
					to={{
						pathname:'/news_details',
						search:'?' + s.id
					}}
				>
					<p className="title">
						{s.title}
					</p>
					<p className="time">{s.updateTime}</p>
				</Link>
			</div>
		)
	};

	render(){
		return (
			<Content>
				<Header title={`新闻列表`}/>
				<ListViewComponent
					rows={ this.rows }
					url={ this.url }
				/>
			</Content>
		)
	}
};

export default News;