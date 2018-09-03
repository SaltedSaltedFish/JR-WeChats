
import './index.css';
import React,{Component} from 'react';

export default class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            StateHeight:StateHeight
        };
    };

	onChange = () => {

		const documentHeight = document.documentElement.clientHeight;
		const documentWeight = document.documentElement.clientWidth;

		//console.log(documentHeight);

		this.setState({
			StateHeight:documentHeight
		});

		document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + 'px';
	};

    componentDidMount() {
        window.addEventListener('resize', this.onChange);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onChange);
    }
    render(){

	    let style = this.props.style?this.props.style:{};
	    let className = this.props.className?`bg ${this.props.className}`:'bg';

        return(
	        <div className={className} style={{...style,height:document.documentElement.clientHeight + 'px'}}>
                {this.props.children}
            </div>
        )
    }
}