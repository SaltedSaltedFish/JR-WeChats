
import './index.less';

import React,{ Component } from 'react';
import { Button,ActivityIndicator,Modal } from 'antd-mobile';

import { createForm } from 'rc-form';

import Content from '../../components/Content';
import Header from '../../components/Header';

import Api from '../../api/request';

class Audit extends Component {
	constructor(props){
		super(props);
		let userInfo = localStorage.signInfo?JSON.parse(localStorage.signInfo):{};

		this.state = {
			codeUrl:userInfo.cardPic || '',
			load:false,
			loading:false,
			userInfo,
		}
	};

	componentDidMount(){
		//console.log(this.state.userInfo);
	};

	submit = () => {
		this.props.form.validateFields((error, value) => {
			console.log(value);

			const { userInfo,codeUrl } = this.state;
			const { id } = userInfo;

			if ( !error ) {

				if ( codeUrl == '' ) {
					Modal.alert('请上传身份证照片');
					return;
				};

				if ( value.cardId.length != 18 ) {
					Modal.alert('请检查身份证号码');
					return;
				}

				value.cardPic = codeUrl;
				value.id = id;

				this.setState({
					loading:true,
				});

				Api.post('user/update',value)
					.then(res => {
						if ( res.errorCode == 0) {
							this.setState({
								loading:false,
							});
							Modal.alert('','提交成功，请等待管理员审核',[
								{text:'确定',onPress:()=>
									this.props.history.goBack()
								}
							]);
						}
					})
			} else {
				Modal.alert('请填写真实姓名和身份证号码');
			}

		});
	};

	verCode = e => {
		console.log(e.target.value);
	};

	upload = e => {

		this.setState({
			load:true
		});

		Api.post('fileUpload',{fileName:e.target.files[0]})
			.then(res => {
				if (res.errorCode == 0) {
					this.setState({
						codeUrl:res.data.url,
						load:false
					});
				}
			})
	};

	previewImage = (path) => {
		wx.previewImage({
			urls: [path]
		});
	};


	render(){

		const { getFieldProps } = this.props.form;
		const { codeUrl,userInfo } = this.state;

		return (
			<Content>
				<Header title={`身份信息`} />
				<div
					className="bd-phone release audit"
					style={{padding:'.1rem .6rem 0'}}
				>
					<form>
						<div className="form-group">
							<input type="text"
							       style={{paddingLeft:'0'}}
							       placeholder={`请输入真实姓名`}
							       {...getFieldProps('cardName',{
								       initialValue:userInfo.cardName || '',
								       rules: [{required: true}],
							       })}
							/>

						</div>

						<div className="form-group">
							<input type="text"
							       style={{paddingLeft:'0'}}
							       placeholder={`请输入身份证号码`}
							       {...getFieldProps('cardId',{
								       initialValue:userInfo.cardId || '',
								       rules: [{required: true}],
								       onChange:this.verCode,
							       })}
							/>
						</div>

						<div className="release-fill">
							<div className="release-group">
								<p className="title">
									身份证照片（要能清晰的看到身份证号码）
								</p>
								<label>
									<div className="add-photo">
										{
											codeUrl != ''?<img src={httpRequestFile + codeUrl} alt=""/>:null
										}
										<ActivityIndicator
											toast
											text="Loading..."
											animating={ this.state.load }
										/>
									</div>
									<input type="file" hidden onChange={ this.upload}/>
								</label>
							</div>

							<Button
								type={`primary`}
								size={`small`}
								style={{
									display:'inline-block',
									marginTop:'.2rem'
								}}
								onClick={ () => this.previewImage ( httpRequestFile + codeUrl )}

							>
								预览
							</Button>
						</div>

						<Button
							disabled={false}
							className={`submit`}
							onClick={this.submit}
							style={{
								marginBottom:'0'
							}}
						>
							提交
						</Button>
					</form>
				</div>

				<ActivityIndicator
					toast
					text="Loading..."
					animating={ this.state.loading }
				/>

			</Content>
		)
	}
};

Audit = createForm()(Audit);
export default Audit;