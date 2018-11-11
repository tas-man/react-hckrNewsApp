import React, { Component } from 'react';
import './App.css';
import update from 'immutability-helper';
import NavbarItem from './components/navbarItem';
import ContentItem from './components/contentItem';
import UniqueId from 'react-html-id';


class App extends Component {

  constructor(props) {
    super(props);
    UniqueId.enableUniqueIds(this);
    this.state = {
      navbarItems: [
        {id:this.nextUniqueId(), topic:"news", param:"showstories", btnState: "navBtn"},
        {id:this.nextUniqueId(), topic:"asks", param:"askstories", btnState: "navBtn"},
        {id:this.nextUniqueId(), topic:"jobs", param:"jobstories", btnState: "navBtn"}
      ],
      contentItems: [
        // Generic item containers, may be populated by story, ask or job
        {id:this.nextUniqueId(), item:{title: "", kids: 0, score: 0, url: "https://github.com/HackerNews/API"}},
        {id:this.nextUniqueId(), item:{title: "", kids: 0, score: 0, url: "https://github.com/HackerNews/API"}},
        {id:this.nextUniqueId(), item:{title: "", kids: 0, score: 0, url: "https://github.com/HackerNews/API"}},
        {id:this.nextUniqueId(), item:{title: "", kids: 0, score: 0, url: "https://github.com/HackerNews/API"}},
        {id:this.nextUniqueId(), item:{title: "", kids: 0, score: 0, url: "https://github.com/HackerNews/API"}},
        {id:this.nextUniqueId(), item:{title: "", kids: 0, score: 0, url: "https://github.com/HackerNews/API"}},
        {id:this.nextUniqueId(), item:{title: "", kids: 0, score: 0, url: "https://github.com/HackerNews/API"}},
        {id:this.nextUniqueId(), item:{title: "", kids: 0, score: 0, url: "https://github.com/HackerNews/API"}},
        {id:this.nextUniqueId(), item:{title: "", kids: 0, score: 0, url: "https://github.com/HackerNews/API"}},
        {id:this.nextUniqueId(), item:{title: "", kids: 0, score: 0, url: "https://github.com/HackerNews/API"}}
        ]
    }
  }

  requestHckrNews = (param) => {
    fetch("https://hacker-news.firebaseio.com/v0/" + param + ".json?print=pretty")
      .then(res => res.json())
      .then((result) => {
        // Use retrieved IDs to request stories
        let requestStory = (id) => {
          fetch("https://hacker-news.firebaseio.com/v0/item/" + result[id] + ".json?print=pretty")
            .then(res => res.json())
            .then((result) => {
              if(result["title"]){
                this.setState({
                  contentItems: update(this.state.contentItems, {[id]: {item: {title: {$set: [result["title"]] }}}})
                });
              }
              if(result["kids"]){
                let kidsArr = result["kids"];
                this.setState({
                  contentItems: update(this.state.contentItems, {[id]: {item: {kids: {$set: [kidsArr.length] }}}})
                })
              }
              if(result["score"]){
                this.setState({
                  contentItems: update(this.state.contentItems, {[id]: {item: {score: {$set: [result["score"]] }}}})
                });
              }
              if(result["url"]){
                this.setState({
                  contentItems: update(this.state.contentItems, {[id]: {item: {url: {$set: [result["url"]] }}}})
                })
              }
              if(id < 9){
                requestStory(++id)
              }
            },
            (error) => {
              console.log("Error requesting story with id: " + result["id"] + " --- " + error);
            })
        }
        requestStory(0);
      },
      (error) => {
        this.setState({
          error: error
        });
        // Show error message to user
        document.getElementById("App-errorMessage").style.display = "block";
        console.log(error);
      })
  }

  requestNewsByType = (param, event) => {
    if(typeof(param) == "string"){
      this.requestHckrNews(param);
      let navBtnStates = ["navBtn", "navBtn", "navBtn"];
      let activeClass = "navBtn-active";

      switch (param) {
        case "showstories":
          navBtnStates[0] = activeClass;
          break;
        case "askstories":
          navBtnStates[1] = activeClass;
          break;
        case "jobstories":
          navBtnStates[2] = activeClass;
          break;
        default:
          console.log("Invalid parameter passed to function requestNewsByType(), param not recognized");
      }
      this.setState({
          navbarItems: update(this.state.navbarItems, {
            0: {btnState: {$set: navBtnStates[0] }},
            1: {btnState: {$set: navBtnStates[1] }},
            2: {btnState: {$set: navBtnStates[2] }}
          })
      });
    } else {
      console.log("Invalid parameter passed to function requestNewsByType(), string required");
    }

  }

  componentDidMount() {
    // Make initial API call
    this.requestNewsByType("showstories");
  }


  render() {
    return (
      <div className="App">
        <div className="App-center-wrapper">
        <header className="App-header">
          <div className="App-headline-wrapper">
            <h1>hckr news</h1>
            <h4>An unofficial UI inspired by the original</h4>
          </div>
          <div className="App-navbar-wrapper">
            <ul className="App-navbar-list">
              {
                this.state.navbarItems.map((navItem, index) => {
                  return(
                    <NavbarItem key={navItem.id}
                                btnState={navItem.btnState}
                                callApi={this.requestNewsByType.bind(this, navItem.param)}>
                                {navItem.topic}
                    </NavbarItem>
                  )
                })
              }
            </ul>
          </div>
        </header>

        <div className="App-content-wrapper">
          <ul className="App-content-list">
            <div id="App-errorMessage">No stories available at this time, please try again later</div>
            {
              this.state.contentItems.map((contItem, index) => {
                return(
                  <ContentItem  key={contItem.id}
                                kids={contItem.item["kids"]}
                                score={contItem.item["score"]}
                                url={contItem.item["url"]}>
                                {contItem.item["title"]}
                  </ContentItem>
                )
              })
            }
            <span className="App-content-more">
              <button id="App-more-btn">more</button>
            </span>
          </ul>
        </div>

        <footer className="App-footer">

        </footer>
        </div>
      </div>
    );
  }
}

export default App;
