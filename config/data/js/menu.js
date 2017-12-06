import {m, template, relative_url} from "./libs.js"

class Menu {
  constructor(){
    this.template = template(relative_url("./menu.html"), {
      "a&create": "link",
      "button&click": "login"
    })
    this.link = m.route.link
  }
  login(){
    window.login = true;
  }
  view(){
    return this.template(this)
  }
}

export default new Menu()
