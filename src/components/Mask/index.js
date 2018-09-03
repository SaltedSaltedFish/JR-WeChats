
import './index.less';

import React,{ Component } from 'react';
import { ActivityIndicator,Modal } from 'antd-mobile';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { UPDATEMASK,CLOSEMASK } from '../../actions/mask';
import Native from '../../utils/Native';

class Mask extends Component {
	constructor(props){
		super(props);
		let { style = {}} = this.props;
		this.state = {
			style
		};
	};

	componentWillReceiveProps(props){

	};

	componentDidMount(){
		//this.props.actions.update(UPDATEMASK,{name:'测试',age:'28'})
	};

	componentWillUnmount(){
		this.setState = () => {};
	};

	onClose = (e) => {
		e.preventDefault();
		this.setState({
			style:{
				display:'none'
			}
		});
	};

	update = (e) => {
		//console.log(e.target.tagName);
		if ( e.target.tagName == 'IMG') {
			return;
		};

		const { actions } = this.props;
		actions.update(CLOSEMASK);
	};

	click = (e,url) => {
		e.stopPropagation();

		//console.log(url);

		Modal.alert('保存在本地', '', [
			{ text: '取消', onPress: () => console.log('cancel') },
			{
				text: '确定',
				onPress: () => {
					Native.downloader(url);
				}
			},
		]);

		return false;
	};

	render(){
		//let { style } = this.state;
		const { reduxState,actions } = this.props;
		//console.log(this.props);
		if ( reduxState.loading ) {
			return (
				<ActivityIndicator
					toast
					text="Loading..."
					animating={ true }
				/>
			)
		};
		return (
			<div
				className={`project-mask ` + (reduxState.class?reduxState.class:'')}
				style={{display:reduxState.isShow?'flex':'none'}}
				onClick={ this.update }
			>
				{
					reduxState.receive?
						<div className="img">
							<p>{ reduxState.text }</p>
						</div>:
						<div className="img">
							<img
								src={ reduxState.headimgurl }
								alt="加载中"
								onClick={ isMicroMessenger?null: e => this.click(e,reduxState.headimgurl) }
							/>
						</div>
				}
			</div>
		)
	};
};

Mask = connect(
	state => ({
		reduxState:state.MaskState
	}),
	dispatch => ({
		actions:bindActionCreators(actions,dispatch)
	})
)(Mask);
export default Mask;