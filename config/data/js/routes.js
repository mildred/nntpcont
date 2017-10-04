import m from "./mithril.js"
import Home from "./home.js"
import Page1 from "./page1.js"
import {LoginPage} from "./login.js"

class AuthRoute {
  constructor(r){
    this.route = r
  }
  onmatch(){
    if(!window.login) {
      return m.route.set("/login")
    } else {
      return this.route
    }
  }
}

export default {
  "/":      Home,
  "/login": new LoginPage(),
  "/page1": new AuthRoute(Page1),
}
