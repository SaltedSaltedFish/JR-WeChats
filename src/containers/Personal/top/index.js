import './index.less';
import React,{Component} from 'react';
import { Tabs,List,Radio,NoticeBar } from 'antd-mobile';

import Header from '../../../components/Header';
import Content from '../../../components/Content';

import Super from './super';
import Integral from './integral';

import { tab } from '../../../data/top';

class Top extends Component {
	constructor(props){
		super(props);
		this.state = {

		};
	};

	onChange = (value) => {
		this.setState({
			value,
		});
	};

	componentWillUnmount(){
		this.setState = () => {};
	};

	render(){
		return (
			<Content>
				<Header title={`置顶服务`}/>

				<div className="choice tabsContainer">
					<Tabs tabs={tab}
						  initialPage={0}
						  //onChange={(tab, index) => { console.log('onChange', index, tab); }}
						  //onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
						  prerenderingSiblingsNumber={0}
						  useOnPan={false}
						  swipeable={false}
						  animated={false}
					>
						<div className="hallContainer">
							<Super {...this.props}/>
						</div>
						<div className="hallContainer">
							<Integral {...this.props} />
						</div>
					</Tabs>
				</div>
			</Content>
		)
	}
};

Top.propTypes = {

};

export default Top;

