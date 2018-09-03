

import React,{Component} from 'react';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import Api from "../../../api/request"
import { ActivityIndicator,Modal } from 'antd-mobile';
import AllList from "./allList";
class MyOffline3 extends Component {
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
    //         this.setState({
    //             data:res.data,
    //             load:false
    //         });
    //
    //
    //         console.log("map",this.state.data);
    //     });
    // };
    componentDidMount(){
        // this.ck();
    }


    render(){
        const {data,data1,data2,par,par1,par2} = this.state;
        //console.log("map",data);
        //console.log("map1",data1);
        return (
            <Content>
                <Header title={`我的下线`}/>
                <div  className="offline" style={{height:"100%"}}>
                    <div className="offline-group" style={{height:"100%"}}>
                        <div className={`noData hasPadding`}>三级下线</div>
                        <AllList/>
                    </div>
                </div>

            </Content>
        )
    }
};

export default MyOffline3;