/**
 * Created by Thinkpad on 2017/6/23.
 */
import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Redirect
} from 'react-router-dom';

/*首页tab展示*/
import Home from './containers/Home';
/*登录页面*/
import Login from './containers/Sign/Login';
import BdPhone from './containers/Sign/BdPhone';
import BdWeChat from './containers/Sign/BdWeChat';
/*名片*/
import InfoCard from './components/TaskList/details';
/*个人中心*/
import Bill from './containers/Personal/bill';
import PerDetails from './containers/Personal/details';
import Release from './containers/Personal/release';
import Top from './containers/Personal/top';
import Recharge from './containers/Personal/Recharge';
import Withdrawals from './containers/Personal/Withdrawals';
import MyInter from './containers/Personal/myInter';
import MyOrder from './containers/Personal/myOrder';
import MyOffline from './containers/Personal/myOffline';
import MyOffline2 from './containers/Personal/myOffine2';
import MyOffline3 from './containers/Personal/myOffine3';
/*已经领取任务*/
import Receive from './containers/Personal/Receive';
/*发布红包任务*/
import Advertisement from './containers/Personal/Advertisement';
import AdvSuccess from './containers/Personal/Advertisement/success';
import Already from './containers/Personal/Advertisement/Already';
import EffectDetails from './containers/Personal/Advertisement/Already/details';
import AdvEdit from './containers/Personal/Advertisement/edit';
/*红包奖励*/
import RedReward from './containers/Personal/Red';
import AdvDetails from './components/List0/details';
/*新闻*/
import News from './containers/News';
import NewsDetails from './containers/News/details';
/*新手教程*/
import Course from './containers/Personal/Course';
import CourseDetails from './containers/Personal/Course/details';
/*统计页面*/
import AdvStatistics from './components/AdvStatistics';
/**/
import Audit from './containers/audit';
/**/
import WeChantTools from './utils/weChat_tools';
/**/

isMicroMessenger = true;
isApp = false;

let url1 = authorizedAddress;
let url2 = "weixin/auth";
let userInfo = JSON.parse(localStorage.signInfo||'{}');

const isLoggedIn = (props) => {

	if ( !localStorage.jr_VERSION || Number(localStorage.jr_VERSION) != jr_VERSION ) {
		localStorage.clear();
		sessionStorage.clear();
	};

	if ( isApp ) {

		if ( Object.keys(userInfo).length == 0 ) {
			return false;
		};

	} else {
		//WeChantTools.auth( url1,url2,userInfo );
	};

    return true;
};

const array = [
	//	重写部分
	{
		pathname:'/login',
		component:Login
	},{
		pathname:'/bdPhone',
		component:BdPhone
	},{
		pathname:'/bdWeChat',
		component:BdWeChat
	},

	{
		pathname:'/bill',
		component:Bill
	},{
		pathname:'/per_details',
		component:PerDetails
	},{
		pathname:'/release',
		component:Release
	},{
		pathname:'/top',
		component:Top
	},{
		pathname:'/my_inter',
		component:MyInter
	},{
		pathname:'/my_order',
		component:MyOrder
	},{
		pathname:'/my_off',
		component:MyOffline
	},{
        pathname:'/my_off2',
        component:MyOffline2
    },{
        pathname:'/my_off3',
        component:MyOffline3
    },{
		pathname:'/recharge',
		component:Recharge
	},{
		pathname:'/withdrawals',
		component:Withdrawals
	}

	,{
		pathname:'/news',
		component:News
	},{
		pathname:'/news_details',
		component:NewsDetails
	}

	/*新手教程*/
	,{
		pathname:'/course',
		component:Course
	},{
		pathname:'/course_details',
		component:CourseDetails
	},

	/*名片详情*/
	{
		pathname:'/info_card',
		component:InfoCard
	}
	/*发布红包任务*/
	,{
		pathname:'/adv',
		component:Advertisement
	},{
		pathname:'/adv_success',
		component:AdvSuccess
	},{
		pathname:'/already',
		component:Already
	},{
		pathname:'/effect_details',
		component:EffectDetails,
	},{
		pathname:'/adv_edit',
		component:AdvEdit,
	},
	/*红包奖励*/
	{
		pathname:'/red_reward',
		component:RedReward
	},{
		pathname:'/adv_details',
		component:AdvDetails
	},
	/*已领取任务*/
	{
		pathname:'/receive',
		component:Receive
	},
	{
		pathname:'/audit',
		component:Audit
	}
	/*统计页面*/
	,{
		pathname:'/adv_statistics',
		component:AdvStatistics
	}
	/**/
];

const routes = (
    <div>
        <Route exact path="/" render={(props)=>(
            isLoggedIn(props)?(<Home {...props}/>):(<Redirect to="/login"/>)
        )}/>

		{
			array.map((s,v)=>
				<Route key={v} path={s.pathname} component={s.component} />
			)
		}
    </div>
);

export default routes;