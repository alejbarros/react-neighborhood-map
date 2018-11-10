import React from 'react';
import {PropTypes} from 'prop-types'
import BarMap from './BarMap.js'


class MapGoogleReact extends React.Component {

  static propTypes = {
    locationsMap: PropTypes.array.isRequired,
    optionsMap: PropTypes.object.isRequired,
    onMapLoad: PropTypes.func.isRequired,
    openInfo: PropTypes.func.isRequired,
    close:PropTypes.func.isRequired
  }

  constructor(props) {
      super(props);
      this.state = {
          query: '',
          locations: ''
      };
  }


  onScriptLoad() {
      const optionsMap = this.props.optionsMap;
      const map = new window.google.maps.Map(
      document.getElementById(this.props.id), optionsMap);
      this.props.onMapLoad(map)
  }

  componentDidMount() {
    if (!window.google) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://maps.google.com/maps/api/js?key=AIzaSyCl4GEbbaHZUd9FijWUEeRXQGgHzCBV9Qc`;
      var x = document.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(script, x);
      script.addEventListener('load', e => {
        this.onScriptLoad()
      })
    } else {
      this.onScriptLoad()
    }
    var map = document.getElementById(this.props.id);
    map.style.height = window.innerHeight + "px";
    this.setState({
        locations: this.props.locationsMap
    });
  }


  render() {
    return (
       <div>
          <BarMap
                updateQuery={this.updateQuery}
                query={this.state.query}
                locationsMap={this.props.locationsMap}
                openInfo={this.props.openInfo}
                close={this.props.close} />
          <div id={this.props.id} role="application"/>
        </div>

    );
  }
}

export default MapGoogleReact
