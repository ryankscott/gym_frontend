// TODO: Fix UTCOffset(0) 
/// TODO: Mobile responsiveness  

var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('lodash');
var moment = require('moment');
var fetch = require('fetchify')(Promise).fetch;

var NavBar = React.createClass({
    render: function() {
        return (
                <div className="navBar">
                    <h1> Gym Search </h1>
                </div>
            );
        }
});
ReactDOM.render(<NavBar />, document.getElementById('navbar'));


//SearchBar
var SearchBar = React.createClass({
    handleChange: function() {
    this.props.onUserInput(
        {filterText: this.refs.filterTextInput.value}
        );
    },
    render: function() {
        return (
                <input
                    type="text"
                    placeholder="Search..."
                    onChange={this.handleChange}
                    value={this.props.filterText}
                    ref="filterTextInput"
                />
        )
    }
});


// FilterableGymClassTable
var FilterableGymClassTable = React.createClass({
    getInitialState: function() {
        return {
            filteredGym: '',
            filterText: '',
            filterDay: '',
            filterDayBefore: '',
            filterDayAfter: '',
            gymclass: [],
            url: "http://localhost:9000/?limit=100"
        };
    },

    getClasses: function(url) {
        fetch(url).then(
            _.throttle(function(response) { 
            return response.json();
            }, 500)).then(function(res){
                this.filterResults(res)
            }.bind(this))
    },

    filterResults: function(response) {
    this.setState({
        gymclass: response,
        }) 
    },

    componentDidMount: function() {
        this.getClasses(this.state.url);
    },   

    componentWillUnmount: function() {
      this.serverRequest.abort();
    },

    handleDayChange: function(e) {
        var before, after = "";
        switch (e.filterDay) {
            case "today":
                after = moment().format("YYYY-MM-DDTHH:mm:ssZ");
                before = moment().endOf('day').format("YYYY-MM-DDTHH:mm:ssZ");
                break;
            case "tomorrow":
                after = moment().add(1,'days').startOf('day').format("YYYY-MM-DDTHH:mm:ssZ");
                before = moment().add(1,'days').endOf('day').format("YYYY-MM-DDTHH:mm:ssZ");
                break;
            case "thisWeek":
                after = moment().format("YYYY-MM-DDTHH:mm:ssZ");
                before = moment().add(1,'weeks').endOf('day').format("YYYY-MM-DDTHH:mm:ssZ");
                break;
        }
         this.setState({
             filterDayAfter: after,
             filterDayBefore: before
         })
         var url = this.state.url + "&gym=" + this.state.filteredGym + "&name=" + this.state.filterText + "&before=" + encodeURIComponent(before) + "&after=" + encodeURIComponent(after);
         this.getClasses(url);
    },

    handleGymChange: function(input) {
    var url = this.state.url + "&gym=" + input.filteredGym + "&name=" + this.state.filterText + "&before=" + encodeURIComponent(this.state.filterDayBefore) + "&after=" + encodeURIComponent(this.state.filterDayAfter);
    this.setState({
        filteredGym: input.filteredGym
    });
     this.getClasses(url);
    },

    handleTextChange: function(input) {
        this.setState({
            filterText: input.filterText
        });
        var url = this.state.url +  "&gym=" + this.state.filteredGym + "&name=" + input.filterText + "&before=" + encodeURIComponent(this.state.filterDayBefore) + "&after=" + encodeURIComponent(this.state.filterDayAfter);
        this.getClasses(url);
        },
    
    render: function() {
        return (
                <div>
                <div id="filterBar">
                <SearchBar 
                    filterText={this.state.filterText}
                    onUserInput={this.handleTextChange}
                    />
                    <GymSelect 
                        filteredGym={this.state.filteredGym}
                        onUserInput={this.handleGymChange}
                    />
                     <DaySelect 
                     filterDay={this.state.filterDay}
                     onUserInput={this.handleDayChange}
                     />
                </div>
               <div> 
                <GymClassTable
                    gymclass={this.state.gymclass}
                />
                </div>
                </div>
        )
    }
}); 

var DaySelect = React.createClass({
    getInitialState:function(){
        return {};
    },

    dayChange:function(event){
       this.props.onUserInput(
            {filterDay: event.target.value}
        );
    },
  
    render: function() {
        return (
           <select id = "dropdown"
            value={this.state.day} 
            onChange={this.dayChange} 
           >
                <option value="">Any day</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="thisWeek">This week</option>
            </select> 
        )
    }
});

var GymSelect = React.createClass({
  getInitialState:function(){
      return {};
  },
    gymChange:function(event){
        this.props.onUserInput(
            {filteredGym: event.target.value}
        );
    },
  
    render: function() {
        return (
           <select id = "dropdown"
            value={this.state.gym} 
            onChange={this.gymChange} 
           >
                <option value="">Any Gym</option>
                <option value="city">City</option>
                <option value="britomart">Britomart</option>
                <option value="takapuna">Takapuna</option>
                <option value="newmarket">Newmarket</option>
            </select> 
        )
    }
});

// GymClassTable
var GymClassTable = React.createClass({ 
    render: function() {
        var rows = [];
        var currentDay = null;
        if (this.props.gymclass != null) {
            this.props.gymclass.forEach(function(gymclass, index) {
                if (currentDay == null) {
                    var currentDay = moment(gymclass.startdatetime);
                }
                rows.push(<GymClassRow gymclass={gymclass} key={index}/>);
            }.bind(this));
        } else {
            rows = [];
        }
        return (
    <div className="listOfCards"> {rows} </div>
        );
    }
});


var GymClassRow = React.createClass({
    render: function() {
        return (
            <div className="mdl-card mdl-card mdl-shadow--2dp">
            <div className="mdl-card__title">
                <h2 className="mdl-card__title-text">{this.props.gymclass.name}</h2>
            </div>
            <div className="mdl-card__supporting-text">
            <ul>
                <h4>{this.props.gymclass.gym.toLowerCase()} </h4>
                <p> {this.props.gymclass.location.toLowerCase()} <br/>
                {moment(this.props.gymclass.startdatetime).utcOffset("+0").format("dddd h:mm a").toLowerCase()} <br/>
                {moment.duration(moment(this.props.gymclass.enddatetime).diff(moment(this.props.gymclass.startdatetime))).asMinutes()} minutes </p>
             </ul>
            </div>
            </div>
        )
    }
});

ReactDOM.render(
        <FilterableGymClassTable />,
    document.getElementById('content')
);

