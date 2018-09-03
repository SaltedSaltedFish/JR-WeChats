/**
 * Created by Thinkpad on 2017/6/3.
 */
import './index.less';
import React from 'react';
import { withRouter } from 'react-router';


class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    };

    componentWillUnmount(){

    }

    clickHandle = _ =>{
        this.props.history.goBack();
    };

    render() {
    	const { back = true } = this.props;
        return (
            <div className="common-header">

	            {
	            	back?
			            <div
				            className="back"
				            onClick={this.clickHandle}
			            >
				            返回
			            </div>:null
	            }

                <p className="title">{this.props.title}</p>
                { this.props.children }
            </div>

        )
    }
}

Header = withRouter(Header);
export default Header;
