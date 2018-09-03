import './index.less';
import React,{Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Tabs } from 'antd-mobile';

import Header from '../../../../components/Header';
import Content from '../../../../components/Content';
import Have from './have';
import End from './end';

import * as actions from '../../../../actions';

import { already } from '../../../../data/adv';

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
		return (
			<Content>
				<Header title={`已发广告`}/>

				<div className="choice tabsContainer">
					<div className="hallContainer">
						<Have history={this.props.history}/>
					</div>
				</div>

				{/*<div className="choice tabsContainer">*/}
					{/*<Tabs tabs={ already }*/}
						  {/*initialPage={0}*/}
						  {/*//onChange={(tab, index) => { console.log('onChange', index, tab); }}*/}
						  {/*//onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}*/}
						  {/*prerenderingSiblingsNumber={0}*/}
						  {/*useOnPan={false}*/}
						  {/*swipeable={false}*/}
						  {/*animated={false}*/}
					{/*>*/}
						{/*<div className="hallContainer">*/}
							{/*<Have history={this.props.history}/>*/}
						{/*</div>*/}
						{/*<div className="hallContainer">*/}
							{/*<End history={this.props.history}/>*/}
						{/*</div>*/}
					{/*</Tabs>*/}
				{/*</div>*/}
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

