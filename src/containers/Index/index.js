import './index.less';
import React,{Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Tabs,List,Radio,NoticeBar,Carousel,Modal} from 'antd-mobile';

import TaskAllList from './allList';
import TaskGoldList from './goldList';
import TaskActivityList from './activity';
import Reward from './reward';

import Condition from '../../components/Condition';
import Invitation from '../../components/Invitation';
import Mask from '../../components/Mask';

import Api from '../../api/request';

import { UPDATEMASK } from '../../actions/mask';
import * as actions from '../../actions';

import { tab } from '../../data/';
import * as initialData from '../../data/release';

class EarnMoney extends Component {
	constructor(props){
		super(props);
		let condition = sessionStorage.indexCondition?JSON.parse(sessionStorage.indexCondition):{};
		let data = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};
		this.state = {
			newList:[],
			condition,
			isShow:false,
			data,
		};

		this.timer = {};
	};

	onChange = (value) => {
		this.setState({
			condition:{...value},
			isShow:!this.state.isShow
		});
	};

	onClose = () => {
		this.setState({isShow:!this.state.isShow})
	};

	componentDidMount(){
		//  获取新闻
		let currentPage = 1;
		Api.get('news/findAll',{currentPage})
			.then(res => {
				//console.log(res);
				if (res.errorCode == 0) {
					this.setState({
						newList:res.data
					},this.scroll);
				};
			})

		Api.get('wechat/findByCondiction',{currentPage:1,userId:this.state.data.id})
			.then(res => {
				console.log(res);
				if (res.errorCode == 0) {
					let data = res.data || {};

					if ( res.data.length == 0 ) {
						console.log('未发布名片');

						Modal.alert('','快来发布名片吧~',[{text:'确定',onPress:() => {
							this.props.history.replace('/release');
						}}]);
					};

				} else {
					//Modal.alert('用户不存在');
				};
			});
	};

	componentWillUnmount(){

		clearInterval(this.timer);

		sessionStorage.indexCondition = JSON.stringify(this.state.condition);

		this.setState = () => {};
	};

	render(){
		const { newList,condition,isShow } = this.state;

		let initialPage = sessionStorage.initialPage?Number(sessionStorage.initialPage):0;
		return (
			<div
				style={{
					height:'100%'
				}}
			>
				<div className="common-header">
					<p className="title">加人大厅</p>

					<div className="head-button right">
						<ul>
							<li
								className={`icon-condition`}
								onClick={this.onClose}
							>
							</li>
						</ul>
					</div>

					<div className="head-button left">
						<ul>
							<li
								style={{
									width:'auto',
									minWidth:'1rem',
									paddingLeft:'.2rem'
								}}
								onClick={(e) => {
									e.preventDefault();
									this.props.actions.update(UPDATEMASK,{
										headimgurl: httpRequestFile + '20180207\\4ceeb24822cb46ed9958e4cac85ad574.png'
									})
								}}
							>
								客服
							</li>
						</ul>
					</div>
				</div>
				<div
					className="noticebar"
				>
					{
						newList.length > 0?
							<Carousel className="my-carousel"
							          vertical
							          dots={false}
							          dragging={false}
							          swiping={false}
							          autoplay
							          infinite
							>
								{
									newList.map(s =>
										<div
											key={s.id}
											onClick={ () => this.props.history.push('/news')}
										>
											{s.title}
										</div>
									)
								}
							</Carousel>
						:<div>无通知</div>
					}

					{/*<NoticeBar*/}
						{/*id={`scroll`}*/}
						{/*mode={`link`}*/}
						{/*onClick = { () => console.log(2)}*/}
						{/*marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }}*/}
					{/*>*/}
						{/*{*/}
							{/*newList.length > 0?newList.map(s =>*/}
								{/*<li key={s.id}>{s.title}</li>*/}
							{/*):'暂无通知'*/}
						{/*}*/}
					{/*</NoticeBar>*/}
				</div>
				<div className="choice tabsContainer" style={{
					paddingTop:'1.48rem'
				}}>
					<Tabs tabs={tab}
						  initialPage={ initialPage }
						  onChange={(tab, index) => { sessionStorage.initialPage = index }}
						  //onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
						  prerenderingSiblingsNumber={0}
						  useOnPan={false}
						  swipeable={false}
						  animated={false}
					>
						<div className="hallContainer">
							<TaskAllList {...condition} />
						</div>
						<div className="hallContainer">
							<TaskActivityList {...condition} />
						</div>
						<div className="hallContainer">
							<TaskGoldList {...condition} />
						</div>
						{/*<div className="hallContainer">*/}
							{/*<Reward {...condition} />*/}
						{/*</div>*/}
					</Tabs>
				</div>

				<Mask />

				<Condition initial={condition} isShow={isShow} fn={this.onChange}/>

				{/*{*/}
					{/*isApp && !info.parentId?*/}
						{/*<Invitation />:null*/}
				{/*}*/}

			</div>
		)
	}
};

EarnMoney.propTypes = {

};

EarnMoney = connect(
	state => ({
		reduxState:state.MaskState
	}),
	dispatch => ({
		actions:bindActionCreators(actions,dispatch)
	})
)(EarnMoney);

EarnMoney = withRouter(EarnMoney);
export default EarnMoney;

