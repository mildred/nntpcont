import m from "./mithril.js"

class App {
	constructor(){
		this.list = new List()
	}
	view(){
		return [
			m("h1", {}, "App"),
			"Hello",
			"World",
			m(this.list)
		]
	}
}

class List {
	constructor(){
		this.template = template("list", {
			"li": {
				"line <- lines": {'.': "line"}
			}
		})
	}
	view(){
		var res = this.template({lines: [1, 2, 3, 4, 5]})
		return res
	}
}

export default App
