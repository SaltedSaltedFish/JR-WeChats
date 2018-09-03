import './index.less';

import React,{Component} from 'react';

import Header from '../../../components/Header';
import Content from '../../../components/Content';

/*图片*/
import course01 from '../../../../static/images/course/0101.jpg';
import course02 from '../../../../static/images/course/0102.jpg';
import course03 from '../../../../static/images/course/0103.jpg';
import course04 from '../../../../static/images/course/0104.jpg';
import course05 from '../../../../static/images/course/0105.jpg';
import course06 from '../../../../static/images/course/0106.jpg';
import course07 from '../../../../static/images/course/0107.jpg';
import course08 from '../../../../static/images/course/0108.jpg';
import course21 from '../../../../static/images/course/0201.jpg';
import course22 from '../../../../static/images/course/0202.jpg';
import course23 from '../../../../static/images/course/0203.jpg';
import course3 from '../../../../static/images/course/03.jpg';
import course4 from '../../../../static/images/course/04.jpg';
import course5 from '../../../../static/images/course/05.jpg';
import course6 from '../../../../static/images/course/06.jpg';
import course7 from '../../../../static/images/course/07.jpg';
import course8 from '../../../../static/images/course/08.jpg';

class Course1 extends Component {
	constructor(props){
		super(props);
		console.log(props);
		let courseKey = props.location.search.replace('?','');
		this.state = {
			courseKey
		};
	};

	courseType = (key) => {
		switch (key)
		{
		case '0':
			return
			  <img src={course01.indexOf('dist') == -1?course0.replace('./','./dist/'):course01} alt=""/>
			break;
		case '1':
			return(
				<div className="zzzzt">
					<img src={course01.indexOf('dist') == -1?course01.replace('./','./dist/'):course01} alt=""/>
					<img src={course02.indexOf('dist') == -1?course02.replace('./','./dist/'):course02} alt=""/>
					<img src={course03.indexOf('dist') == -1?course03.replace('./','./dist/'):course03} alt=""/>
					<img src={course04.indexOf('dist') == -1?course4.replace('./','./dist/'):course04} alt=""/>
					<img src={course05.indexOf('dist') == -1?course05.replace('./','./dist/'):course05} alt=""/>
					<img src={course06.indexOf('dist') == -1?course06.replace('./','./dist/'):course06} alt=""/>
					<img src={course07.indexOf('dist') == -1?course07.replace('./','./dist/'):course07} alt=""/>
					<img src={course08.indexOf('dist') == -1?course08.replace('./','./dist/'):course08} alt=""/>
				</div>
			)
			break;
		case '2':
			return(<div>
				<img src={course21.indexOf('dist') == -1?course21.replace('./','./dist/'):course21} alt=""/>
				<img src={course22.indexOf('dist') == -1?course22.replace('./','./dist/'):course22} alt=""/>
				<img src={course23.indexOf('dist') == -1?course23.replace('./','./dist/'):course23} alt=""/>
			</div>)
			break;
		case '3':
			return <img src={course3.indexOf('dist') == -1?course3.replace('./','./dist/'):course3} alt=""/>
			break;
		case '4':
			return <img src={course4.indexOf('dist') == -1?course4.replace('./','./dist/'):course4} alt=""/>
			break;
		case '5':
			return <img src={course5.indexOf('dist') == -1?course5.replace('./','./dist/'):course5} alt=""/>
			break;
		case '6':
			return <img src={course6.indexOf('dist') == -1?course6.replace('./','./dist/'):course6} alt=""/>
			break;
		case '7':
			return <img src={course7.indexOf('dist') == -1?course7.replace('./','./dist/'):course7} alt=""/>
			break;
		case '8':
			return <img src={course8.indexOf('dist') == -1?course8.replace('./','./dist/'):course8} alt=""/>
			break;
		case '9':
			return <img src={course9.indexOf('dist') == -1?course9.replace('./','./dist/'):course9} alt=""/>
			break;
		}
	};

	render(){
		const { courseKey } = this.state;
		//console.log(courseKey);
		return (
			<Content
				style={{
					background:'white'
				}}
			>
				<Header title={`新手教程`}/>
				<div className="course-group">
					{
						this.courseType(courseKey)
					}
				</div>
			</Content>
		)
	}
};

export default Course1;