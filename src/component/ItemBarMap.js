import React from 'react';

class ItemBarMap extends React.Component {
    /**
     * Render function of Places
     */
    render() {
        return (
            <li role="button" className="box" tabIndex="0" onKeyPress={this.props.openInfo.bind(this, this.props.data.marker)} onClick={this.props.openInfo.bind(this, this.props.data.marker)}>{this.props.data.longname}</li>
        );
    }
}

export default ItemBarMap;
