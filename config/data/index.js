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

var Menu = {
    view: function() {
        return m("nav", [
            m("a[href=/]", {oncreate: m.route.link}, "Home"),
            m("a[href=/page1]", {oncreate: m.route.link}, "Page 1"),
        ])
    }
}

var Page1 = {
    view: function() {
        return [
            m(Menu),
            m("h1", "Page 1")
        ]
    }
}

var Home = {
    view: function() {
        return [
            m(Menu),
            m("h1", "Home"),
            m(App)
        ]
    }
}

var Page1 = {
    view: function() {
        return [
            m(Menu),
            m("h1", "Page 1")
        ]
    }
}

var login = false

class AuthRoute {
	constructor(r){
		this.route = r
	}
	onmatch(){
		if(!login) {
			return m.route.set("/login")
		} else {
			return this.route
		}
	}
}

m.route(document.body, "/", {
    "/":      Home,
    "/login": Home,
    "/page1": new AuthRoute(Page1),
})
