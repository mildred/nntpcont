'use strict';

const { Component } = window.React;
const { render } = window.ReactDOM;
const template = react_template(window.React);
const h = window.React.createElement

/** Example classful component */
class App extends Component {
	componentDidMount() {
		this.setState({ message:'Hello!' });
	}
	render(props, state) {
		return (
			h('div', {id:'app'},
				h(Header, { message: JSON.stringify(state) }),
				h(Main)
			)
		);
	}
}


/** Components can just be pure functions */
const Header = (props) => {
	return h('header', null,
		h('h1', null, 'App'),
		props.message && h('h2', null, props.message)
	);
};


/** Instead of JSX, use: h(type, props, ...children) */
class Main extends Component {
	/*constructor(){
		super()
		this.template = template("list", {
			"li": {
				"line <- lines": {'.': "line"}
			}
		})
	}*/
	render() {
		//var elems = h('main', null, this.template({lines: [1, 2, 3, 4, 5]}))
		//console.log("clearseam: %o", elems)
		//return elems
		const items = [1,2,3,4,5].map( (item) => (
			h('li', {id:item}, 'Item '+item)
		));
		var res = (
			h('main', null,
				h('ul', null, items)
			)
		);
		console.log("react: %o", res)
		return res
	}
}


render(h(App), document.querySelector("#main"));
