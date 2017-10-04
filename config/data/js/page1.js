import Menu from "./menu.js"
import m from "./mithril.js"

var Page1 = {
    view: function() {
        return [
            m(Menu),
            m("h1", "Page 1")
        ]
    }
}

export default Page1
