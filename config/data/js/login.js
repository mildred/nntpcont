import {m, template, relative_url} from "./libs.js"
import Menu from "./menu.js"

export class LoginButton {
  login(){
    window.login = true
  }
  view(){
    return m("button", {onclick: this.login}, "Login")
  }
}

export class LoginPage {
  constructor(){
    this.menu = m(Menu)
    this.template = template(relative_url("./login.html"), {
      "+.": "menu",
      "button&click": "login"
    })
  }
  login(){
    window.login = true
  }
  view(){
    return this.template(this)
  }
}

