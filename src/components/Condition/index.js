import './index.less';

import React,{Component} from 'react';

import { refsObj } from '../../utils/small_tools';

import * as initialData from '../../data/release';

class ConditionInput extends Component {
	constructor(props){
		super(props);
		let initial = props.initial;
		this.state = {
			provinceValue:initial.province || ' ',
			initial
		}
	};

	submit = () => {
		let obj = refsObj(this.refs);
		//console.log(obj);
		this.props.fn(obj);
	};


	render(){

		const { provinceValue,initial } = this.state;
		const { isShow } = this.props;
		const { province,city } = initialData;

		return (
			<div
				className={`condition-input`}
				style={
					isShow?{display:'block',opacity:'1'}:{display:'none',opacity:'0'}
				}
			>
				<div className="container release-fill">
					<div className="release-group">
						<p className="title">
							城市筛选
						</p>
						<select
							className={`input`}
							ref={'province'}
							data-name="省份"
							data-must
							onChange={e => this.setState({provinceValue:e.target.value})}
							style={{
								marginBottom:'.2rem'
							}}
							defaultValue={ provinceValue }
						>
							<option value="">全部</option>
							{
								province.map(s =>
									<option key={s} value={s}>{s}</option>
								)
							}
						</select>

						<select
							className={'input'}
							data-name="城市"
							ref={`city`}
							//data-must
						>
							<option value=" ">全部</option>
							{
								provinceValue && provinceValue != ' '?
									city[provinceValue]?city[provinceValue].map(s =>
										<option key={s} value={s}>{s}</option>
									):null
									:null
							}
						</select>
					</div>

					<div
						className="release-group"
						style={{
							overflow: 'hidden'
						}}
					>
						<span
							className="button"
							style={{
								marginBottom:'0'
							}}
							onClick={this.submit}
						>
							确定
						</span>
					</div>
				</div>
			</div>
		)
	};
};

export default ConditionInput;