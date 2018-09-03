import './index.less';

import React,{Component} from 'react';
import { List ,WhiteSpace} from 'antd-mobile';

import Header from '../../../components/Header';
import Content from '../../../components/Content';

import { list } from '../../../data/course';
import PicCourse from "../../../../static/images/course/my_xinshou_pic01.png"
const Item = List.Item;

class Course extends Component {
	constructor(props){
		super(props);

		this.state = {

		};
	};

	render(){
		return (
			<Content>
				<Header title={`新手教程`}/>
				<div style={{backgroundColor:"#FFF",paddingLeft:".3rem",paddingBottom:".3rem"}}>
					<p className="title1">“加人”常见问题解答</p>
					<img src={PicCourse.indexOf('dist') == -1?PicCourse.replace('./','./dist/'):PicCourse} style={{height:"3.2rem",width:"6.9rem"}} alt=""/>
				</div>
				<WhiteSpace />
				<WhiteSpace />
				<List>

					{
						list.map( s =>
							<Item
								key={s.key}
								arrow='horizontal'
								onClick={() => this.props.history.push('/course_details?' + s.key)}
								extra={''}
							>
								{s.title}
							</Item>
						)
					}
				</List>
				{/*<div className="course-group">*/}
					{/*{*/}
						{/*list.map( s =>*/}
							{/*<div*/}
								{/*key={s.key}*/}
								{/*className="bill-list"*/}
								{/*style={{*/}
									{/*minHeight:'auto'*/}
								{/*}}*/}
								{/*onClick={() => this.props.history.push('/course_details?' + s.key)}*/}
							{/*>*/}
								{/*<p className="title">*/}
									{/*{s.title}*/}
								{/*</p>*/}
							{/*</div>*/}
						{/*)*/}
					{/*}*/}
				{/*</div>*/}
			</Content>
		)
	}
};

export default Course;