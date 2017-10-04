import m from "./mithril.js"
import App from "./app.js"
import Menu from "./menu.js"

var Home = {
  view: function() {
    return [
      m(Menu),
      m("h1", "Home"),
      m(App)
    ]
  }
}

export default Home

