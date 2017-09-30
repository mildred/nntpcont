window.addEventListener('load', function(){

  function button(click) {
    var btn_tmpl = template("button", {
      "button": "text",
      "button@title": "title",
      "button&click": "click"
    })
    var dom = btn_tmpl({
      text: "Double",
      title: "Double the list",
      click: click
    })
    return dom
    /*
    return {
      tag: 'button',
      attrs: {title: 'double the list'},
      events: {click: click},
      children: 'double'
    }
    */
  }

  function list(data){
    this.lines = data
    console.log("list")

    this.render = template2(this, "list", {
      "li": {
        "line <- lines": {'.': "line"}
      }
    })

    this.setState = function(data){
      this.lines = data
    }
  }

  function clock(){
    function render(oldDOM){
      console.log(oldDOM)
      return {
        tag: 'strong',
        children: (new Date()).toString(),
        events: {
          $destroyed: clear
        }
      }
    }

    //var i = setInterval(tick, 1000)
    function tick(){
      cito.vdom.update(dom, render)
    }

    function clear(){
      console.log("clear")
      clearInterval(i)
    }

    var dom = render()
    return dom
  }

  /*
  function clock2(){
    this.date = (new Date()).toString()
    console.log("clock2")
    var t = template2(this, "clock", {
      strong: 'date'
    })

    var i = setInterval(tick.bind(this), 1000)
    function tick(){
      this.date = (new Date()).toString()
      console.log("clock2")
      t(this)
    }

    return t(this)
  }*/

  class clock2 extends Component {
    constructor(){
      super()
      this.tmpl = template("clock", {
        strong: 'date'
      })

      var i = setInterval(this.tick.bind(this), 1000)
      this.tick()
    }

    tick(){
      this.date = (new Date()).toString()
      console.log("clock2")
      this.render(this.tmpl(this))
    }
  }

  function template(name, directives){
    var tmpltag = cito.vdom.fromDOM(document.querySelector("template[name='"+name+"']").content)
    return $clearseam.citojsdom(tmpltag, directives)
  }

  function template2(component, name, directives) {
    var t = template(name, directives)
    return function(data){
      var dom = t(data === undefined ? component : data)
      if(component._vdom) {
        cito.vdom.update(component._vdom, dom)
      }
      component._vdom = dom
      return dom
    }
  }


  function hello(name){
    console.log("hello")
    var tmpl = template("hello", {
      'span': 'name'
    })
    return tmpl({name: name})
  }

  function page(){
    var self = this
    this.clock = (new clock2()).dom()
    this.button = new button(doubleList.bind(this))
    this.array = ["a", "b", "c"]
    this.list = new list(this.array)
    var t = template2(this, "page", {
      "p": "clock",
      "span": "button",
      "div": "list"
    })
    console.log("page")
    return t(this)

    function doubleList(){
      this.array = this.array.concat(this.array);
      // FIXME: try to find a way to avoid instanciating new component
      //this.list = new list(this.array)
      this.list.setState(this.array)
      t(this)
    }
  }

  function root() {
    var items = [
      {tag: 'li', children: 'text'}
    ];

    //var clk = new clock2()
    //var btn = button(doubleList)
    var pageobj = new page()
    //console.log({btn: JSON.stringify(btn)})

    function doubleList() {
      items = items.concat(items);
      cito.vdom.update(dom, render);
    }

    function render(){
      return {
        tag: 'div', children: [
          //{tag: 'p', children: clk},
          //btn,
          //hello(hello('world')),
          {tag: 'ul', children: items},
          {tag: 'hr'},
          pageobj
        ]
      }
    }

    var dom = render()
    return dom
  }

  function Node(){
    var data = ["elem1"]

    function onClick(){
      // modify data
      cito.vdom.update(this.dom, this.render)
    }

    this.render = $pure.build(document.querySelector("template"), {
      template: 'mapping'
    }).render(data)
  }

  var router = new MainRouter(root, clock2)
  console.log(cito.vdom.append(document.body, router.dom()))
})

