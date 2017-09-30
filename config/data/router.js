
class MainRouter extends Component {
  constructor(root, clock){
    super()
    this.root = root()
    this.clock = new clock()
    this.refresh()
    window.addEventListener("hashchange", this.refresh.bind(this), false);
  }

  refresh(){
    console.log("component render " + location.hash)
    switch(location.hash) {
      case "#clock":
        this.render(this.clock.dom())
      default:
        this.render(this.root)
    }
  }
}
