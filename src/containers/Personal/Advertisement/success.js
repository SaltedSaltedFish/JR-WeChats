import './index.less';

import React,{Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Header from '../../../components/Header';
import Content from '../../../components/Content';

import * as actions from '../../../actions';

class AdvSuccess extends Component {
	constructor(props){
		super(props);
		let dataState = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};

		this.state = {
			dataState,
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
				<Header title={`发布成功`}/>
				<div className="adv-success">
					<div className="img">

					</div>
					<p className={`title`}>恭喜您，广告发布成功！</p>

					<div className="adv button">
						<Link
							to={{
								pathname:'/already',
								replace:true
							}}
						>
							查看已发布广告
						</Link>
					</div>
				</div>
			</Content>
		)
	}
};

AdvSuccess = connect(
	state => ({
		data:state.ReleaseState.data
	}),
	dispatch => ({
		actions:bindActionCreators(actions,dispatch)
	})
)(AdvSuccess);
export default AdvSuccess;