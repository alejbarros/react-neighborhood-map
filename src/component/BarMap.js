import React, {Component} from 'react';
import ItemBarMap from './ItemBarMap.js';
import {PropTypes} from 'prop-types'

class BarMap extends Component {

    static propTypes = {
      locationsMap: PropTypes.array.isRequired,
      openInfo:PropTypes.func.isRequired,
      close:PropTypes.func.isRequired,
      query: PropTypes.string.isRequired
    }
      constructor(props) {
          super(props);
          this.state = {
              locations: '',
              query: '',
              suggestions: true,
          };
         this.show_hide_suggestion = this.show_hide_suggestion.bind(this);
      }

      updateQuery = (query) => {
            var locations = [];
            var self = this;
            this.state.locations.forEach(function (location) {
                self.props.close(location.marker);
                location.marker.setAnimation(null);
                if (location.longname.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                    location.marker.setVisible(true);
                    locations.push(location);
                } else {
                    location.marker.setVisible(false);
                }

            });
            this.setState({
                locations: locations,
                query : query
            });
            this.check_locations(query);
        };

       check_locations(query){
         if(query === "") {
           var locations = [];
           this.props.locationsMap.forEach(function (location) {
             location.marker.setVisible(true);
             locations.push(location);
           });
           this.setState({
             locations: locations
           });
           this.render();
         }
       }

       componentWillMount() {
           this.setState({
               locations: this.props.locationsMap
           });
       }

       show_hide_suggestion(){
         this.setState({
           suggestions: !this.state.suggestions
         });
       }

   render() {
     var locationlist =  this.state.locations.map(function (listItem, index) {
           return (<ItemBarMap key={index} data={listItem} openInfo={this.props.openInfo.bind(this)}/>);}, this);
        return(
        <div className="side-nav">
            <div className="menu-box">
            <h5>Main Menu</h5>
            </div>
            <div className="searchbox">
                <input type="text" className="search" tabIndex="1" role="search" aria-label="Search"  placeholder="Filter Locations..."
                value={this.state.query}
                onChange={(event) => this.updateQuery(event.target.value)}
                />
                </div>
                <ul>
                 {this.state.suggestions && locationlist}
                </ul>
                <button className="buttonSpecial" onClick={this.show_hide_suggestion}>Show/Hide Suggestions</button>

        </div>
      );
   }

}

export default BarMap;
