'use strict';

import _ from 'lodash';
import React from 'react';
import VizceralGraph from 'vizceral';

class Vizceral extends React.Component {
  componentDidMount () {
    this.vizceral = new VizceralGraph(this.refs.vizCanvas);
    this.updateStyles(this.props.styles);

    this.vizceral.on('viewChanged', this.props.viewChanged);
    this.vizceral.on('nodeHighlighted', this.props.nodeHighlighted);
    this.vizceral.on('nodeFocused', this.props.nodeFocused);
    this.vizceral.on('rendered', this.props.rendered);
    this.vizceral.on('nodeUpdated', this.props.nodeUpdated);
    this.vizceral.on('regionContextSizeChanged', this.props.regionContextSizeChanged);
    this.vizceral.on('matchesFound', this.props.matchesFound);
    this.vizceral.on('graphsUpdated', this.props.graphsUpdated);

    this.vizceral.updateRegions(this.props.regions);
    this.vizceral.updateData(this.props.traffic, this.props.excludedEdgeNodes);

    if (!_.isEqual(this.props.view, Vizceral.defaultProps.view)) {
      this.vizceral.setView(this.props.view);
    }

    if (!_.isEqual(this.props.filters, Vizceral.defaultProps.filters)) {
      this.vizceral.setFilters(this.props.filters);
    }

    this.vizceral.animate();
    this.vizceral.updateBoundingRectCache();
  }

  componentWillReceiveProps (nextProps) {
    if (!_.isEqual(nextProps.styles, this.props.styles)) {
      this.updateStyles(nextProps.styles);
    }

    if (!_.isEqual(nextProps.filters, this.props.filters)) {
      this.vizceral.setFilters(nextProps.filters);
    }

    if (!_.isEqual(nextProps.showLabels, this.props.showLabels)) {
      this.vizceral.setOptions({ showLabels: nextProps.showLabels });
    }

    if (!_.isEqual(nextProps.view, this.props.view)) {
      this.vizceral.setView(nextProps.view);
    }

    if (nextProps.match !== this.props.match) {
      this.vizceral.findNodes(nextProps.match);
    }

    if (!this.props.traffic.regions || _.some(nextProps.traffic.regions, (data, region) => !this.props.traffic.regions[region] || this.props.traffic.regions[region].updated !== data.updated)) {
      this.vizceral.updateData(nextProps.traffic, nextProps.excludedEdgeNodes);
    }
  }

  componentWillUnmount () {
    delete this.vizceral;
  }

  render () {
    return (
      <div className="vizceral">
        <canvas style={{ width: '100%', height: '100%' }} ref="vizCanvas"/>
        <div className="connection-notice"><ul></ul></div>
      </div>
    );
  }

  updateStyles (styles) {
    const styleNames = this.vizceral.getStyles();
    const customStyles = styleNames.reduce((result, styleName) => {
      result[styleName] = styles[styleName] || result[styleName];
      return result;
    }, {});
    this.vizceral.updateStyles(customStyles);
  }
}

Vizceral.propTypes = {
  excludedEdgeNodes: React.PropTypes.array,
  filters: React.PropTypes.array,
  graphsUpdated: React.PropTypes.func,
  match: React.PropTypes.string,
  nodeFocused: React.PropTypes.func,
  nodeHighlighted: React.PropTypes.func,
  nodeUpdated: React.PropTypes.func,
  regionContextSizeChanged: React.PropTypes.func,
  regions: React.PropTypes.array,
  rendered: React.PropTypes.func,
  matchesFound: React.PropTypes.func,
  showLabels: React.PropTypes.bool,
  styles: React.PropTypes.object,
  traffic: React.PropTypes.object,
  viewChanged: React.PropTypes.func
};

Vizceral.defaultProps = {
  excludedEdgeNodes: [],
  filters: [],
  graphsUpdated: () => {},
  match: '',
  nodeFocused: () => {},
  nodeHighlighted: () => {},
  nodeUpdated: () => {},
  regionContextSizeChanged: () => {},
  regions: [],
  rendered: () => {},
  matchesFound: () => {},
  showLabels: true,
  styles: {},
  traffic: {},
  viewChanged: () => {}
};

export default Vizceral;
