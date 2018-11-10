import React, {Component} from 'react';
import MapGoogleReact from './component/MapGoogleReact.js';
import * as locationsAPI from './data/locations.js'
import * as foursquareApi from './data/foursquareApi.js'
import './App.css'

class App extends Component {

  constructor(props) {
      super(props);
      this.state = {
        locationsMap : locationsAPI.data,
        optionsMap : { center: { lat: 47.600152, lng: -122.331065}, zoom: 14 },
        infowindow: '',
        markerPrev: ''
      };
      this.open_info = this.open_info.bind(this);
      this.close_info = this.close_info.bind(this);
  }

    add_marks = (map) => {
        var InfoWindow = new window.google.maps.InfoWindow({});
        this.setState({ infowindow: InfoWindow });
        var locations = [];
        var self = this;
        this.state.locationsMap.forEach(function (location) {
            var longname = location.name + ' - ' + location.type;
            var marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng(location.latitude, location.longitude),
                animation: window.google.maps.Animation.DROP,
                map: map
            });

            marker.addListener('click', e => {
              self.open_info(marker);
            });
            location.longname = longname;
            location.marker = marker;
            location.display = true;
            locations.push(location);
        });
        this.setState({
            locationsMap: locations
        });
    }

    set_details(data){
      var location_data = data.response.venues[0];
      var name = '<b>Name: </b>' + location_data.name + '<br>';
      var address = '<b>Address: </b>' + location_data.location.address + '<br>';
      var city = '<b>City: </b>' + location_data.location.city + '<br>';
      var country = '<b>Country: </b>' + location_data.location.country + '<br>';
      var postalCode = '<b>Postal Code: </b>' + location_data.location.postalCode + '<br>';
      var state = '<b>State: </b>' + location_data.location.state + '<br>';
      var readMore = '<a href="https://foursquare.com/v/'+ location_data.id +'" target="_blank">Read More on Foursquare Website</a>'
      this.state.infowindow.setContent(name + address + city + country + postalCode + state + readMore);
    }

    set_error_api() {
      this.state.infowindow.setContent("Sorry data can't be loaded");
    }

    get_info_details(marker){
      foursquareApi.get_info(marker)
           .then(data => {
             this.set_details(data);
           })
           .catch(() => this.set_error_api());
    }

    open_info(marker) {
        this.close_info(marker);
        this.state.infowindow.open(document.getElementById("myMap"), marker);
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        this.get_info_details(marker);
        this.setState({ markerPrev: marker });
    }

    close_info(marker){
      if (this.state.markerPrev) {
          this.state.markerPrev.setAnimation(null);
      }
      this.setState({
          markerPrev: ''
      });
      this.state.infowindow.close();
    }

    render() {
        return (
           <div className="App">
              <MapGoogleReact id="myMap"
               locationsMap={this.state.locationsMap}
               optionsMap={this.state.optionsMap}
               onMapLoad={this.add_marks}
               openInfo={this.open_info}
               close={this.close_info}
               />
            </div>

        );
    }
}

export default App;
