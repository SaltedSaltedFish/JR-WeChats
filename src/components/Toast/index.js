import './index.less';

import React,{Component} from 'react';

class ZDQToast extends Component {
	constructor(props){
		super(props);
	};

	render(){
		const { info } = this.props;
		return (
			<div className={`toast`}>
				<div className="icon"></div>
				<p className={`toast-text`}>{info}</p>
			</div>
		)
	};
};

export default ZDQToast;