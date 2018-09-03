import './index.less';
import React,{Component} from 'react';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Tabs } from 'antd-mobile';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import Ordinary from './ordinary';
import Special from './special';

import * as actions from '../../../actions';

import * as initialData from '../../../data/release';
import { tab } from '../../../data/adv';

class Release extends Component {
	constructor(props){
		super(props);
		let data = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};
		this.state = {
			data
		};
	};

	componentDidMount(){

	};

	componentWillUnmount(){
		this.setState = () => {};
	};

	render(){
		//const { reduxState } = this.props;
		//console.log(this.props);
		return (
			<Content>
				<Header
					title={`发布广告`}
				>
					<div className="head-button right">
						<ul>
							<li
								style={{
									width:'auto',
									paddingRight:'.2rem'
								}}
							>
								<Link
									to={{
										pathname:'/already'
									}}
								>
									已发任务
								</Link>
							</li>
						</ul>
					</div>
				</Header>

				<div className="choice tabsContainer">
					<div className="hallContainer">
						<Ordinary {...initialData} history={this.props.history}/>
					</div>
					{/*<Tabs tabs={tab}*/}
						  {/*initialPage={0}*/}
						  {/*//onChange={(tab, index) => { console.log('onChange', index, tab); }}*/}
						  {/*//onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}*/}
						  {/*prerenderingSiblingsNumber={0}*/}
						  {/*useOnPan={false}*/}
						  {/*swipeable={false}*/}
						  {/*animated={false}*/}
					{/*>*/}
						{/*<div className="hallContainer">*/}
							{/*<Ordinary {...initialData} history={this.props.history}/>*/}
						{/*</div>*/}
						{/**/}
						{/*<div className="hallContainer">*/}
							{/*<Special {...initialData} history={this.props.history}/>*/}
						{/*</div>*/}
					{/*</Tabs>*/}
				</div>
			</Content>
		)
	}
};

Release.propTypes = {

};

Release = connect(
	state => ({
		reduxState:state.ReleaseState
	}),
	dispatch => ({
		actions:bindActionCreators(actions,dispatch)
	})
)(Release);

export default Release;