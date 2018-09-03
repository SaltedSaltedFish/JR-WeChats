import './index.less';
import React,{Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Tabs,List,Radio,NoticeBar,Modal } from 'antd-mobile';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import TaskAllList from './personal';
import TaskGoldList from './weChat';
import TaskActivityList from './public';

import { GETCLASSIFY } from '../../../actions/release';
import * as actions from '../../../actions';

import * as initialData from '../../../data/release';

class Release extends Component {
	constructor(props){
		super(props);
		let data = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};
		this.state = {
			data,
			userInfo:null,
			wechatGroup:null,
			wechatPublic:null
		};

		//console.log(initialData);
	};

	componentDidMount(){
		const { actions } = this.props;
		const { data } = this.state;

		this.getDefaultInfo();

		return;
		//  身份证认证
		actions.get('user/findById',{id:data.id})
			.then(res => {
				//console.log(res);
				if (res.errorCode == 0) {
					if ( res.data.state == 0 ) {
						this.getDefaultInfo();
					} else {
						console.log('未认证');
						Modal.alert('','未实名认证或者管理员未审核',[
							{text:'确定',onPress:()=>
								this.props.history.replace('/audit')
							}
						]);
					};
				};
			});
	};


	getDefaultInfo = () => {
		const { actions } = this.props;
		const { data } = this.state;
		let currentPage = 1;

		actions.getData('classify/findAll',{currentPage},GETCLASSIFY);

		//  个人名片
		actions.get('wechat/findByCondiction',{currentPage,userId:data.id})
			.then(res => {
				//console.log(res);
				if ( res.errorCode == 0 && res.data.length == 1 && res.data[0]) {
					//if ( res.errorCode == 0 && res.data[0]) {
					this.setState({
						userInfo:res.data[0] || {}
					});
				}
			})
		//  微信群
		actions.get('wechatGroup/findByCondiction',{currentPage,userId:data.id})
			.then(res => {
				//console.log(res);
				if ( res.errorCode == 0 && res.data.length == 1 && res.data[0]) {
					this.setState({
						wechatGroup:res.data[0] || {}
					});
				}
			})
		// 公众号
		actions.get('wechatPublic/findByCondiction',{currentPage,userId:data.id})
			.then(res => {
				//console.log(res);
				if ( res.errorCode == 0 && res.data.length == 1 && res.data[0]) {
					this.setState({
						wechatPublic:res.data[0] || {}
					});
				}
			})
	};

	componentWillUnmount(){
		this.setState = () => {};
	};

	render(){
		const { reduxState } = this.props;
		const { userInfo,wechatPublic,wechatGroup } = this.state;
		return (
			<Content>
				<Header title={`开始发布`}/>

				<div className="choice tabsContainer">
					<Tabs tabs={initialData.tab}
						  initialPage={0}
						  //onChange={(tab, index) => { console.log('onChange', index, tab); }}
						  //onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
						  prerenderingSiblingsNumber={0}
						  useOnPan={false}
						  swipeable={false}
						  animated={false}
					>
						<div className="hallContainer">
							<TaskAllList {...initialData} {...this.props} userInfo={userInfo}/>
						</div>
						<div className="hallContainer">
							<TaskGoldList {...initialData} {...this.props} wechatGroup={wechatGroup}/>
						</div>
						<div className="hallContainer">
							<TaskActivityList {...initialData} {...this.props} wechatPublic={wechatPublic}/>
						</div>
					</Tabs>
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

