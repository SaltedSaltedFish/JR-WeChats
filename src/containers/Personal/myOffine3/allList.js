

import React,{Component} from 'react';
import { is } from 'immutable';
import ListViewComponent from '../../../components/ListViewTest';
class Personal extends Component {
    constructor(props){
        super(props);
        let DATA = props.reduxData?props.reduxData:null;
        let condition = {
            parentId:window.localStorage.parentId
        };
        this.state = {
            data:null,

            DATA,
            condition
        };

        this.url = 'user/findByCondiction';
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

	rows = (data) =>{
		let name = data.vip?data.vip.name.split('-')[0]:false;
		return (
            <div className="per-info"
                 style={{
				     background:'white',
				     marginBottom:'0',
				     borderBottom: '1px solid #ccc'
			     }}
                 data={data}
            >
                <div
                    className={'top vip' + ( name?data.vip.type:'0' )}
                >
                    <div className="img">
                        <div className="img-group">
                            <img
                                src={data.headimgurl || ''}
                            />
                        </div>
                    </div>
                    <div className="info">
                        <p className="title">
								<span
                                    className="title-name"
                                >
									{data.nickname}
								</span>
							{
								name?
                                    <span className="vip-nameplate">{name}</span>:
                                    <span className="vip-nameplate">普通用户</span>
							}
                        </p>
                        <p className="photo" style={{color:'#333'}}>{data.createTime}</p>
                    </div>
                </div>
            </div>
		)
	};

    render(){
        const { condition } = this.state;
        console.log(condition);
        return (
            <ListViewComponent
                rows={ this.rows }
                url={ this.url }
                condition={condition}
            />
        )
    }
};

export default Personal;