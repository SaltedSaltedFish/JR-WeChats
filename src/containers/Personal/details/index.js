import './index.less';

import React,{Component} from 'react';
import { List,Modal,DatePicker  } from 'antd-mobile';
import { Link } from 'react-router-dom';

import Api from '../../../api/request';

import Content from '../../../components/Content';
import Header from '../../../components/Header';

import TimeConversion from '../../../utils/TimeConversion';

const Item = List.Item;
const prompt = Modal.prompt;

class PerDetails extends Component {
	constructor(props){
		super(props);
		let data = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};
		//const now = new Date((data.age.toString().indexOf('-') == '-1'?TimeConversion.date():data.age) ||TimeConversion.date());
		this.state = {
			data,
			refresh:false,
			//date: now,
		};
		this.list = [
			[
				{
					title:'昵称',
					extra:data.nickname,
					name:'nickname'
				}
			],[
				{
					title:'微信号',
					extra:data.wxid,
					name:'wxid'
				},{
					title:'手机号',
					extra:data.phone,
					name:'phone'
				}
			],[
				{
					title:'性别',
					extra:data.sex == '1'?'男':'女',
					name:'sex'
				},{
					title:'年龄',
					extra:data.age,
					name:'age'
				}
			]
		];
	};

	update = (value,key,obj) => {
		//console.log(value,key);
		let id = this.state.data.id;

		if ( value == '' ) {
			Modal.alert('请输入修改内容');
			return;
		};
		if ( key == 'sex') {
			if ( value == '男') {
				value = 1;
			} else if ( value == '女') {
				value = 2;
			} else {
				Modal.alert('暂时只可更改为男女');
				return;
			}
		};
		let condition = {
			id,
			[key]:value
		};

		//console.log(condition);

		Api.post('user/update',condition)
			.then(res => {
				if (res.errorCode == 0) {
					localStorage.signInfo = JSON.stringify(res.data);
					Modal.alert('修改成功','',[
						{text:'确定',onPress : () => this.setState({
							refresh:!this.state.refresh
						})}
					]);
				} else {
					Modal.alert('修改失败');
				}
			})
	};

	click = () => {
		localStorage.clear();
		//console.log(this.props.history);
		this.props.history.length = 1;
		this.props.history.replace('/');
	};

	render(){
		let data = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};
		let list = [
			[
				{
					title:'昵称',
					extra:data.nickname,
					name:'nickname'
				}
			],[
				{
					title:'微信号',
					extra:data.wxid,
					name:'wxid'
				},{
					title:'手机号',
					extra:data.phone,
					name:'phone'
				}
			],[
				{
					title:'性别',
					extra:data.sex == '1'?'男':'女',
					name:'sex'
				},{
					title:'年龄',
					extra:data.age,
					name:'age'
				}
			]
		];
		return (
			<Content>
				<Header title={`个人资料`}/>
				<List style={{
					marginTop:'.3rem'
				}} className={`list-group`}>
					<Item
						extra={
						<div className="img">
							<img src={data.headimgurl} alt=""/>
						</div>
					}>
						头像
					</Item>
				</List>
				{
					list.map((s,v)=>
						<List key={v} className={`list-group`}>
							{
								s.map(n=>
									n.name == 'ageeeeeee'?
										<DatePicker
											key={n.title}
											mode="date"
											title="选择年月日"
											extra="请选择年月日"
											value={ this.state.date }
											onChange={ date => this.setState({ date })}
										>
											<List.Item>出生年月</List.Item>
										</DatePicker>
										:
										<Item
											key={n.title}
											extra={n.extra}
											onClick ={ n.name == 'phone'?
												() => this.props.history.push('/bdPhone'):
												() => prompt('','修改' + n.title,[
													{text:'取消'},
													{text:'确定',onPress : (value) => this.update(value,n.name,n)}
												],'default',n.extra)
											}
										>
											{n.title}
										</Item>
								)
							}
						</List>
					)
				}

				<List
					style={{
						marginTop:'.3rem'
					}}
					className={`list-group`}
					onClick={ () => this.props.history.push('/audit') }

				>
					<Item
						arrow={`horizontal`}
					>
						身份证信息
					</Item>
				</List>

				{
					isApp?
						<Item
							onClick = { this.click }
						>
							退出
						</Item>:null
				}
			</Content>
		)
	}
};

export default PerDetails;