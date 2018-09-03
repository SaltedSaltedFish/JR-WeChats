import './index.less';
import React,{Component} from 'react';
import { TabBar,ActivityIndicator,Modal } from 'antd-mobile';
import Bundle from '../../components/Bundle';


// const Index = (props) => (
// 	<Bundle load={() => import('../../containers/Index')}>
// 		{(Index) => <Index {...props}/>}
// 	</Bundle>
// );
//
// const Invitation = (props) => (
// 	<Bundle load={() => import('../../containers/Invitation')}>
// 		{(Invitation) => <Invitation {...props}/>}
// 	</Bundle>
// );
//
// const PurVip = (props) => (
// 	<Bundle load={() => import('../../containers/PurVip')}>
// 		{(PurVip) => <PurVip {...props}/>}
// 	</Bundle>
// );
//
// const Personal = (props) => (
// 	<Bundle load={() => import('../../containers/Personal')}>
// 		{(Personal) => <Personal {...props}/>}
// 	</Bundle>
// );

import Index from '../../containers/Index';
import Invitation from '../../containers/Invitation';
import PurVip from '../../containers/PurVip';
import Personal from '../../containers/Personal';


import Content from '../../components/Content';

import Api from '../../api/request';


class Home extends Component {
	constructor(props){
		super(props);
		//console.log(props);
		let selectedTab = sessionStorage.selectedTab?sessionStorage.selectedTab:'blueTab';
		let load = false;
		this.state = {
			selectedTab,
			hidden: false,
			fullScreen: true,
			load,
		};
	};

	componentDidMount(){

	};

	componentWillUnmount(){
		sessionStorage.selectedTab = this.state.selectedTab;
		this.setState = () => {};
	};

	render(){
		return (
			<Content
				style={{paddingTop:0}}
			>

				<ActivityIndicator
					toast
					text="Loading..."
					animating={ this.state.load }
				/>

				<div style={{height:'100%'}}>
					<TabBar
						unselectedTintColor="#808080"
						tintColor="#1c1c1c"
						barTintColor="white"
						hidden={this.state.hidden}
						className={`home-tab`}
					>
						<TabBar.Item
							title="加人大厅"
							key="join"
							className={`people`}
							icon={{uri:require(`../../../static/images/home/tool-quanzi-nor.svg`)}}
							selectedIcon={{uri:require(`../../../static/images/home/tool-quanzi-pre.svg`)}}

							selected={this.state.selectedTab === 'blueTab'}
							onPress={() => {
								this.setState({
									selectedTab: 'blueTab',
								});
							}}
							data-seed="logId"
						>
							<Index />
						</TabBar.Item>
						<TabBar.Item
							icon={{uri:require(`../../../static/images/home/tool-yaoqing-nor.svg`)}}
							selectedIcon={{uri:require(`../../../static/images/home/tool-yaoqing-pre.svg`)}}

							title="邀请好友"
							className={`invita`}
							key="inv"
							selected={this.state.selectedTab === 'redTab'}
							onPress={() => {
								this.setState({
									selectedTab: 'redTab',
								});
							}}
							data-seed="logId1"
						>
							<Invitation selected={this.state.selectedTab}/>
						</TabBar.Item>
						<TabBar.Item
							icon={{uri:require(`../../../static/images/home/tool-fabu-nor.svg`)}}
							selectedIcon={{uri:require(`../../../static/images/home/tool-fabu-pre.svg`)}}

							title="购买会员"
							className={`vip`}
							key="pur"
							selected={this.state.selectedTab === 'greenTab'}
							onPress={() => {
								this.setState({
									selectedTab: 'greenTab',
								});
							}}
						>
							<PurVip />
						</TabBar.Item>
						<TabBar.Item
							icon={{uri:require(`../../../static/images/home/tool-geren-nor.svg`)}}
							selectedIcon={{uri:require(`../../../static/images/home/tool-geren-pre.svg`)}}

							title="个人中心"
							className={`myself`}
							key="my"
							selected={this.state.selectedTab === 'yellowTab'}
							onPress={() => {
								this.setState({
									selectedTab: 'yellowTab',
								});
							}}
						>
							<Personal selected={this.state.selectedTab} />
						</TabBar.Item>
					</TabBar>
				</div>
			</Content>
		)
	}
};

export default Home;