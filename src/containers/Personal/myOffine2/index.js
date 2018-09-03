

import React,{Component} from 'react';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import Api from "../../../api/request"
import AllList from "./allList";
import { ActivityIndicator,Modal } from 'antd-mobile';
class MyOffline2 extends Component {
    constructor(props){
        super(props);
        let DATA = props.reduxData?props.reduxData:null;
        this.state = {
            data:[],
            data1:[],
            data2:[],
            par:"您还没有下线",
            load:true,
            DATA,
            s:localStorage.signInfo?JSON.parse(localStorage.signInfo):{}
        };
    };
    // ck= () =>{
    //     Api.get("user/findByCondiction",{
    //         parentId:window.localStorage.parentId,
    //         currentPage:1,
    //     }).then(res=>{
    //         console.log(res);
    //             this.setState({
    //                 data:res.data,
    //                 load:false
    //             });
    //
    //
    //         console.log("map",this.state.data);
    //     });
    // };
    componentDidMount(){
        // this.ck();
    }


    render(){


        return (
            <Content>
                <Header title={`我的下线`}/>
                <div  className="offline" style={{height:"100%"}}>
                    <div className="offline-group" style={{height:"100%"}}>
                        <div className={`noData hasPadding`}>二级下线</div>
                        <AllList {...this.props}/>
                    </div>
                </div>

            </Content>
        )
    }
};

export default MyOffline2;