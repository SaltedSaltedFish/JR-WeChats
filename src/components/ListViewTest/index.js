import './index.less';
import React,{ Component } from 'react';
import { PullToRefresh, ListView,ActivityIndicator } from 'antd-mobile';

import { is } from 'immutable';

import Api from '../../api/request';

var data = [1,2,3,4,5,6,7,8,9,10];

class ListViewComponent extends Component {
	constructor(props){
		super(props);
		let condition = props.condition?props.condition:{};
		let pageSize = props.num?props.num:10;
		let initialListSize = pageSize;
		let fixc = props.fixc?props.fixc:{};
		condition = {
			...condition,
			...fixc
		};

		//console.log(condition);

		/**
		 * 参数说明
		 * @param action   redux的action
		 * @param method 请求的方式
		 * @param this.url  请求的地址
		 * @param { obj } dataSource 数据源
		 * @param { Number } num 没次展示的数据个数
		 * @param { Number } pageNow 请求的分页位置
		 * @param { Number } totalPageSize 总的页数
		 * @param { Boolean } refreshing 是否在刷新
		 * @param { Boolean } hasMore 是否可以继续加载更多
		 * @param { Boolean } rollingState 是否在加载更多
		 * @param { obj } fixc 固定条件
		 * @param { string } listSource  列表数据源
		 * @param { fn } callback 回调
		 */
		this.state = {
			dataSource:false,
			pageSize,
			initialListSize,
			refreshing:false,
			hasMore:false,
			rollingState:false,
			isLoading:true,
			currentPage:2,

			listViewHeight:0,

			condition,
			array:[],

		};

		this.callback = false;

		props.callback?this.callback = true:null;  //  回调，用于返回请求到的数据

		this.dataSource = new ListView.DataSource({
			rowHasChanged : (row1,row2) => row1 !== row2  // 只更新于有变化的数据
		});

		this.url = props.url;
		this.method = props.method?props.method:'get';

		this.timer = null;
		//console.log(this.url);
	};

	componentDidMount(){

		let listViewHeight = this.refs.viewContainer.offsetHeight;
		this.state.listViewHeight = listViewHeight; //  防止在没有更新listViewHeight的时候使用到了这个变量

		//console.log(listViewHeight);
		this.setState({
			listViewHeight
		});

		if (this.props.data) {
			this.setState({
				...this.props.data
			});

			return;
		};

		this.update();

	};

	componentWillMount () {
		/*
        * @param { obj } this.props.data 是存储在redux中的数据
        * */
	};

	componentWillReceiveProps(nextProps){
		//console.log(nextProps);
		if (nextProps.update) {
			let fixc = nextProps.fixc || {};
			this.state.condition = {
				...nextProps.condition,
				...fixc,
			};
			this.update({type:'flip'});
		};
	};

	componentWillUpdate(props){
		//console.log(props,this.refs.lv);
	};

	shouldComponentUpdate(nextProps, nextState){
		var thisProps = this.props || {}, thisState = this.state || {};

		if (Object.keys(thisProps).length !== Object.keys(nextProps).length ||
			Object.keys(thisState).length !== Object.keys(nextState).length) {
			return true;
		}

		for (var key in nextProps) {
			if (!is(thisProps[key], nextProps[key])) {
				return true;
			}
		}

		for (var key in nextState) {
			if (thisState[key] !== nextState[key] || !is(thisState[key], nextState[key])) {
				return true;
			}
		}
		return false;
	};

	componentWillUnmount(){
		/*
		* @param { fn } this.props.action 触发redux的action 由父组件传递过来，存储对应的数据
		* */
		this.props.action?this.props.action(this.state):null;
		clearInterval(this.timer);
		this.setState = () => {};
	};

	update = type => {
		let { array ,condition,listViewHeight,initialListSize } = this.state;
		const { isEndReached = true } = this.props;
		let totalPageSize;
		let viewHeight;

		isEndReached?condition.currentPage = 1:null;


		if ( !this.url ) {

			this.timer = setInterval(()=> {
				clearInterval(this.timer);
				this.setState({
					dataSource:this.dataSource.cloneWithRows(data),
					refreshing: false,
					totalPageSize:2
				});
			},500);

			return;
		};

		//	用来改变条件时，换掉数据
		if ( type && type.type == 'flip') {
			this.setState({
				dataSource : false
			});
		};

		return Api[this.method](this.url,condition)
			.then(res => {
				if (res.errorCode == 0) {

					let data = {};

					this.props.listSource? data = res.data[this.props.listSource]:data = res.data;

					array = data;

					this.state.dataSource = '';
					//_?_.refs.lv.scrollTo(0,0):null;
					this.state.dataSource = false;

					totalPageSize = isEndReached?res.pageInfo.totalPageSize:0;

					this.setState({
						dataSource:this.dataSource.cloneWithRows(array),
						totalPageSize:totalPageSize,
						isRequest:false,
						hasMore:false,
						currentPage:2,
						array
					},() => {

						viewHeight = this.refs.lv.listviewRef.ListViewRef.InnerScrollViewRef.offsetHeight;

						this.callback?this.props.callback(res.data):null;

						if ( isEndReached ) {
							if ( viewHeight < listViewHeight ) {

								this.setState({
									initialListSize: initialListSize * (res.pageInfo.currentPage + 1 )
								},this.onEndReached)

							};
						};
					});
				};
			});
	};

	//  下拉
	onRefresh = () => {
		this.setState({ refreshing: true});

		if ( !this.url ) {
			this.update();
			return;
		};
		this.update()
			.then(() => {
				this.timer = setInterval(()=> {
					clearInterval(this.timer);
					this.setState({
						refreshing: false
					});
				},500);
			})
	};

	onEndReached = () =>{
		let { isLoading,currentPage,hasMore,totalPageSize,condition,array } = this.state;

		if( totalPageSize < currentPage ){
			this.setState({
				hasMore:true
			});

			return;
		}

		this.setState({
			rollingState:true
		});

		if(isLoading && !hasMore) {
			this.state.isLoading = false; //  改变但不刷新状态
			condition.currentPage = currentPage;

			if ( !this.url ) {
				let array = [12,13,14,15,16,17,18,19,20];
				currentPage += 1;
				data.push(array);
				this.timer = setInterval(()=> {
					clearInterval(this.timer);
					this.setState({
						dataSource:this.dataSource.cloneWithRows(data),
						currentPage,
						isLoading:true,
						rollingState:false
					})
				},500);
				return;
			};

			Api[this.method](this.url,condition)
				.then(res => {
					if(res.errorCode == 0) {
						let data = res.data;
						array.push(...data);
						currentPage += 1;
						this.setState({
							dataSource:this.dataSource.cloneWithRows(array),
							array,
							currentPage,
							isLoading:true,
							rollingState:false
						},()=> this.callback?this.props.callback(array):null)
					}
				});
		}
	};

	renderCustomDeactivate(){
		return [
			<div key="0" className="am-refresh-control-pull">
				<span>下拉可刷新</span>
			</div>
		]
	};

	renderCustomActivate(){
		return [
			<div key="1" className="am-refresh-control-release">
				<span>释放刷新</span>
			</div>,
		];
	};

	renderCustomRelease(){
		return [
			<div key="0">
				<ActivityIndicator />
			</div>
		]
	};

	renderCustomFinish(){
		return [
			<div key="0" className="am-refresh-control-release">
				<span>完成刷新</span>
			</div>
		]
	};

	render(){
		/**
		 * 说明
		 * @param rows  行样式
		 * @param num   每次加载的数量
		 * @param style 自定义样式
		 * @param onScroll  监听滚动
		 * @param isEndReached  是否需要加载更多
		 *
		 * 高度存在BUG
		 */
		let { rows,style = {},onScroll, isEndReached = true } = this.props;
		let {
			dataSource,pageSize,hasMore,initialListSize,refreshing,rollingState,listViewHeight
		}
			= this.state;
		//console.log(this.props);
		return (
			<div
				className="listContainer"
				ref={`viewContainer`}
			>
				{
					!dataSource?
						<div style={{padding:'10PX 0'}}>
							<ActivityIndicator />
						</div>:
						<ListView
							style={{
								height:listViewHeight + 'px',
								//minHeight:'74vh'
								...style
							}}
							ref={`lv`}
							dataSource={dataSource}
							renderRow={(s,v)=> rows(s,v)}
							initialListSize={initialListSize}
							pageSize={pageSize}
							scrollRenderAheadDistance={200}
							scrollEventThrottle={20}
							onScroll={onScroll}
							scrollerOptions={{ scrollbars: false }}
							pullToRefresh={<PullToRefresh
								direction={`down`}
								distanceToRefresh={25}
								refreshing={refreshing}
								onRefresh={this.onRefresh}
								indicator={{
									deactivate:this.renderCustomDeactivate(),
									activate:this.renderCustomActivate(),
									release:this.renderCustomRelease(),
									finish:this.renderCustomFinish()
								}}
							/>}

							//onEndReached = {!hasMore?this.onEndReached:null}
							onEndReached = {!hasMore && !rollingState && isEndReached?this.onEndReached:null}
							// 当onEndReachedThreshold大于1时，的确进入页面就触发了，如果设置0~1则是按照正常的逻辑触发。
							//onEndReachedThreshold = {1}
							renderFooter={()=> (
								dataSource._cachedRowCount>0?
									(
										dataSource._cachedRowCount<10 || !isEndReached?
											null:
											<div style={{textAlign:'center'}}>
												{hasMore?'Loaded':'Loading...'}
											</div>
									)
									:
									<div className="noData">
										No Data
									</div>
							)}
						/>
				}
			</div>
		)
	}
};

ListViewComponent.propTypes = {

};

export default ListViewComponent;