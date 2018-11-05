import React, {Component} from 'react';
import PlacesList from './component/PlacesList';

class App extends Component {
    /**
     * Constructor
     */
    constructor(props) {
        super(props);
        this.state = {
            'locations': [
                {
                  'name': "Flatstick Pub",
                  'type': "Bar",
                  'latitude':   47.600152,
                  'longitude': -122.331065,
                  'streetAddress': "240 2nd Avenue  Seattle, WA 98104"
                },
                {
                  'name': "Cherry Street Public House",
                  'type': "Coffe Shop",
                  'latitude':   47.600547,
                  'longitude': -122.332638,
                  'streetAddress': "224 Occidental Ave S, Seattle, WA 98104"
                },
                {
                  'name': "Starbucks Reserve",
                  'type': "Coffe Shop",
                  'latitude':   47.614092,
                  'longitude': -122.328258,
                  'streetAddress': "1124 Pike St, Seattle, WA 98101"
                },
                {
                  'name': "Slate Coffee",
                  'type': "Coffe Shop",
                  'latitude':   47.602523,
                  'longitude': -122.332427,
                  'streetAddress': "602 2nd Ave Seattle, WA 98104"
                },
                {
                  'name': "Delicatus",
                  'type': "Deli / Bodega and Sandwich Place",
                  'latitude':   47.601624,
                  'longitude': -122.334385,
                  'streetAddress': "99 Yesler Way, Seattle, WA 98104"
                },
                {
                  'name': "Starbucks",
                  'type': "Coffe Shop",
                  'latitude':  47.609033,
                  'longitude': -122.339943,
                  'streetAddress': "102 Pike St, Seattle, WA 98101"
                }
            ],
            'map': '',
            'infowindow': '',
            'prevmarker': ''
        };
        this.initMap = this.initMap.bind(this);
        this.openInfoWindow = this.openInfoWindow.bind(this);
        this.closeInfoWindow = this.closeInfoWindow.bind(this);
    }

    componentDidMount() {
        window.initMap = this.initMap;
        load('https://maps.googleapis.com/maps/api/js?key=AIzaSyCl4GEbbaHZUd9FijWUEeRXQGgHzCBV9Qc&callback=initMap')
    }

  initMap() {
        var self = this;
        var mapview = document.getElementById('map');
        mapview.style.height = window.innerHeight + "px";
        var map = new window.google.maps.Map(mapview, {
            center: {lat:47.600152, lng: -122.331065},
            zoom: 14,
            mapTypeControl: false
        });

        var InfoWindow = new window.google.maps.InfoWindow({});

        window.google.maps.event.addListener(InfoWindow, 'closeclick', function () {
            self.closeInfoWindow();
        });

        this.setState({
            'map': map,
            'infowindow': InfoWindow
        });

        window.google.maps.event.addDomListener(window, "resize", function () {
            var center = map.getCenter();
            window.google.maps.event.trigger(map, "resize");
            self.state.map.setCenter(center);
        });

        window.google.maps.event.addListener(map, 'click', function () {
            self.closeInfoWindow();
        });

        var locations = [];
        this.state.locations.forEach(function (location) {
            var longname = location.name + ' - ' + location.type;
            var marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng(location.latitude, location.longitude),
                animation: window.google.maps.Animation.DROP,
                map: map
            });

            marker.addListener('click', function () {
                self.openInfoWindow(marker);
            });

            location.longname = longname;
            location.marker = marker;
            location.display = true;
            locations.push(location);
        });
        this.setState({
            'locations': locations
        });
    }

    openInfoWindow(marker) {
        this.closeInfoWindow();
        this.state.infowindow.open(this.state.map, marker);
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        this.setState({
            'prevmarker': marker
        });
        this.state.infowindow.setContent('Loading Data...');
        this.state.map.setCenter(marker.getPosition());
        this.state.map.panBy(0, -200);
        this.getMarkerInfo(marker);
    }

      getMarkerInfo(marker) {
        var self = this;
        var clientId = "VSF1QA2ZF4R1BGC4Q2A5UO3GX4BJUF3S0VOAYXBRBZI2RM4T";
        var clientSecret = "YNE4JQWLBWCTMEYWNWPXZIGPITP5XQWZSFLNOJL1US0XAO2W";
        var url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng();
        fetch(url)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        self.state.infowindow.setContent("Sorry data can't be loaded");
                        return;
                    }

            response.json().then(function (data) {
                        var location_data = data.response.venues[0];
                        var name = '<b>Name: </b>' + location_data.name + '<br>';
                        var address = '<b>Address: </b>' + location_data.location.address + '<br>';
                        var city = '<b>City: </b>' + location_data.location.city + '<br>';
                        var country = '<b>Country: </b>' + location_data.location.country + '<br>';
                        var postalCode = '<b>Postal Code: </b>' + location_data.location.postalCode + '<br>';
                        var state = '<b>State: </b>' + location_data.location.state + '<br>';
                        var readMore = '<a href="https://foursquare.com/v/'+ location_data.id +'" target="_blank">Read More on Foursquare Website</a>'
                        self.state.infowindow.setContent(name + address + city + country + postalCode + state + readMore);
                    });
                }
            )
            .catch(function (err) {
                self.state.infowindow.setContent("Sorry data can't be loaded");
            });
    }

  closeInfoWindow() {
        if (this.state.prevmarker) {
            this.state.prevmarker.setAnimation(null);
        }
        this.setState({
            'prevmarker': ''
        });
        this.state.infowindow.close();
    }

    render() {
        return (
            <div>
                <PlacesList key="100" locations={this.state.locations} openInfoWindow={this.openInfoWindow}
                              closeInfoWindow={this.closeInfoWindow}/>
                <div id="map"></div>
            </div>
        );
    }
}

export default App;

function load(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
  
    ref.parentNode.insertBefore(script, ref);
}
