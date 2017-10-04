export const m = window.m
export const clearseamdom = $clearseam.mithrildom(m)
export const clearseam = $clearseam(clearseamdom)

export class ScriptPath {
  constructor(index){
    const callerIndex = index + 1 || 1
    try {
      throw new Error();
    } catch(e) {
      this.stackLines = e.stack.split('\n')
        .filter((l) => l.length > 0)
        .map((l) => l.match(/^([^@]*)@(.*):([0-9]+):([0-9]+)$/).slice(1))
      this.stackLine = this.stackLines[callerIndex]
    }
  }

  base() {
    return this.stackLine[1].match(/^(.*)\/[^\/]*$/)[1] + '/';
  }

  location() {
    return this.stackLine[1]
  }

  url(relpath) {
    if(relpath) {
      return new URL(relpath, this.stackLine[1])
    } else {
      return new URL(this.stackLine[1])
    }
  }

  func() {
    return this.stackLine[0];
  }

  line() {
    return parseInt(this.stackLine[2]);
  }

  column() {
    return parseInt(this.stackLine[3]);
  }
}

export function relative_url(path) {
  return new ScriptPath(1).url(path).href
}

export function fetch_template(name, directives) {
  return fetch(name)
    .then((r) => r.text())
    .then((html) => {
      let parser = new DOMParser()
      let doc = parser.parseFromString(html, "text/html")
      console.log(name+" document: %o", doc)
      return doc
    })
    .then((doc) => doc.querySelector("template").content)
    .catch((err) => console.error(err))
    .then((frag) => document.importNode(frag, true))
    .then((dom) => clearseamdom.fromDOM(dom))
    .then((tmpltag) => clearseam(tmpltag, directives))
}

export function async_template(future_template, loading) {
  let template = function(){
    return loading || m("p", {}, "loading...")
  }
  future_template.then((tmpl) => {
    template = tmpl
    m.redraw()
  })
  return function(data) {
    return template(data)
  }
}

export function template(name, directives, loading_component) {
  if(name.indexOf('/') >= 0) {
    return async_template(fetch_template(name, directives), loading_component)
  }
  let dom = document.querySelector("template[name='"+name+"']").content
  let tmpltag = clearseamdom.fromDOM(dom)
  //console.log("template "+name+" dom: %o", dom)
  //console.log("template "+name+" vdom: %o", tmpltag)
  return clearseam(tmpltag, directives)
}

export class Component {
  constructor(){
    this.template = function(){
      return m("loading")
    }
    this.init_called = false
  }
  async init(){
  }
  view(){
    if(!this.init_called) {
      this.init().then((res) => (null))
      this.init_called = true
    }
    this.template
  }
}

