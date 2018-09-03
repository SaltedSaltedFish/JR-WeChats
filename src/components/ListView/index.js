import './index.less';
import React,{Component} from 'react';
import {PullToRefresh, ListView,ActivityIndicator} from 'antd-mobile';

class ListViewComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            num:10
        }
    };

    renderCustomIcon() {
        return [
            <div key="0" className="am-refresh-control-pull">
                <span>Pull down to refresh</span>
            </div>,
            <div key="1" className="am-refresh-control-release">
                <span>Release to refresh</span>
            </div>,
        ];
    };

    renderCustomLoading(){
        return [
            <div key="0">
                <ActivityIndicator />
            </div>
        ]
    };

    render(){
        let {dataSource,hasMore,rollingState,rows,onScroll,refreshing,onRefresh,onEndReached , num,style} = this.props;
        if (!style) {
            style = {}
        };
        if (!num) {
            num = this.state.num;
        };
        return (
            <div>
                {
                    !dataSource?
                        <div style={{padding:'10PX 0'}}>
                            <ActivityIndicator />
                        </div>:
                        <ListView
                            ref="lv"
                            style={{...style}}
                            dataSource={dataSource}
                            renderRow={(s,v)=> rows(s,v)}
                            initialListSize={num}
                            pageSize={num}
                            scrollRenderAheadDistance={200}
                            scrollEventThrottle={20}
                            onScroll={onScroll}
                            scrollerOptions={{ scrollbars: false }}
                            pullToRefresh={<PullToRefresh
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                icon={this.renderCustomIcon()}
                                loading={this.renderCustomLoading()}
                            />}

                            //onEndReached = {!hasMore?this.onEndReached:null}
                            onEndReached = {onEndReached}
                            // 当onEndReachedThreshold大于1时，的确进入页面就触发了，如果设置0~1则是按照正常的逻辑触发。
                            //onEndReachedThreshold = {1}
                            renderFooter={()=> (
								dataSource._cachedRowCount>0?
									(
										dataSource._cachedRowCount<10 || !onEndReached?
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
}

export default ListViewComponent;