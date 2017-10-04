import m from "./mithril.js"

class Menu {
  view(){
    return m("nav.navbar.navbar-expand-lg", [
        m("a.navbar-brand", {href: '/',      oncreate: m.route.link}, "Home"),
        m("a", {href: '/login', oncreate: m.route.link}, "Login"),
        m("a", {href: '/page1', oncreate: m.route.link}, "Page 1"),
    ])
  }
}

export default new Menu()
