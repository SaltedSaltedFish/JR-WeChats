import './index.css';

import React,{Component} from 'react';

class Footer extends Component {
    constructor(){
        super();
    }

    render(){
        let style = this.props.style?this.props.style:{};
        let click = this.props.onClick?this.props.onClick:_=>{};
        return (
            <div
                className="footer"
                onClick={click}
                style={style}
            >
                {this.props.children}
            </div>
        )
    }
}

export default Footer;