'use strict';

import _ from 'lodash';
import React from 'react';
import VizceralGraph from 'vizceral';

/**
 * ![](https://raw.githubusercontent.com/Netflix/vizceral/master/logo.png)
 *
 * This is a react wrapper around [Vizceral](https://github.com/Netflix/vizceral).
 *
 * ## Setup
 * 1. Install package
 *    `npm install vizceral-react --save`
 * 2. import vizceral-react to start using
 *
 *    ```js
 *    import Vizceral from 'vizceral-react';
 *    <Vizceral traffic={this.state.trafficData}
 *              excludedEdgeNodes={this.state.excludedEdgeNodes}
 *              view={this.state.currentView}
 *              showLabels={this.state.displayOptions.showLabels}
 *              filters={this.state.filters}
 *              graphsUpdated={this.graphsUpdated}
 *              viewChanged={this.viewChanged}
 *              nodeHighlighted={this.nodeHighlighted}
 *              rendered={this.rendered}
 *              nodeFocused={this.nodeFocused}
 *              regionContextSizeChanged={this.regionContextSizeChanged}
 *              matchesFound={this.matchesFound}
 *              match={this.state.searchTerm}
 *    />
 *    ```
 *
 * ## Props
 */
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
  /**
   * Array of edge nodes to exclude from the global view
   */
  excludedEdgeNodes: React.PropTypes.array,
  /**
   * Array of filter definitions and current values to filter out nodes and connections. Refer to github.com/Netflix/vizceral/DATAFORMATS.md#filters
   */
  filters: React.PropTypes.array,
  /**
   * Callback for when the graph objects are modified
   */
  graphsUpdated: React.PropTypes.func,
  /**
   * A search string to highlight nodes that match
   */
  match: React.PropTypes.string,
  /**
   * Callback for when a node is focused. The focused node is the only parameter.
   */
  nodeFocused: React.PropTypes.func,
  /**
   * Callback for when a node is highlighted. The highlighted node is the only parameter.
   */
  nodeHighlighted: React.PropTypes.func,
  /**
   * Callback for when the global region context panel size changes. The updated dimensions is the only parameter.
   */
  regionContextSizeChanged: React.PropTypes.func,
  /**
   * The regions that are known to layout the graph before actual data is available.
   */
  regions: React.PropTypes.array,
  /**
   * Callback when a graph has been rendered. The name of the graph that was rendered is the only property.
   */
  rendered: React.PropTypes.func,
  /**
   * Callback when nodes match the match string. The matches object { total, visible } is the only property.
   */
  matchesFound: React.PropTypes.func,
  /**
   * Whether or not to show labels on the nodes.
   */
  showLabels: React.PropTypes.bool,
  /**
   * Styles to override default properties.
   */
  styles: React.PropTypes.object,
  /**
   * The traffic data. See github.com/Netflix/vizceral/DATAFORMATS.md for specification.
   */
  traffic: React.PropTypes.object,
  /**
   * Callback for when the view changed. The view array is the only property.
   */
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
