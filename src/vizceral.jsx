'use strict';

import { isEqual, some } from 'lodash';
import React from 'react'; // eslint-disable-line import/no-unresolved, import/no-extraneous-dependencies
import VizceralGraph from 'vizceral';


function getPerformanceNow() {
  let g = window;
  if (g != null) {
    let perf = g.performance;
    if (perf != null) {
      try {
        let perfNow = perf.now();
        if (typeof perfNow === "number") {
          return perfNow;
        }
      } catch (e) {
      }
    }
  }
  return null;
}

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
 *              view={this.state.currentView}
 *              showLabels={this.state.displayOptions.showLabels}
 *              physicsOptions={this.state.physicsOptions}
 *              filters={this.state.filters}
 *              graphsUpdated={this.graphsUpdated}
 *              viewChanged={this.viewChanged}
 *              objectHighlighted={this.objectHighlighted}
 *              rendered={this.rendered}
 *              nodeFocused={this.nodeFocused}
 *              nodeContextSizeChanged={this.nodeContextSizeChanged}
 *              matchesFound={this.matchesFound}
 *              match={this.state.searchTerm}
 *              modes={this.state.modes}
 *              definitions={this.state.definitions}
 *              styles={styles}
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
    this.vizceral.on('objectHighlighted', this.props.objectHighlighted);
    this.vizceral.on('nodeFocused', this.props.nodeFocused);
    this.vizceral.on('rendered', this.props.rendered);
    this.vizceral.on('nodeUpdated', this.props.nodeUpdated);
    this.vizceral.on('nodeContextSizeChanged', this.props.nodeContextSizeChanged);
    this.vizceral.on('matchesFound', this.props.matchesFound);
    this.vizceral.on('graphsUpdated', this.props.graphsUpdated);

    if (!isEqual(this.props.filters, Vizceral.defaultProps.filters)) {
      this.vizceral.setFilters(this.props.filters);
    }

    if (!isEqual(this.props.definitions, Vizceral.defaultProps.definitions)) {
      this.vizceral.updateDefinitions(this.props.definitions);
    }

    // Finish the current call stack before updating the view.
    // If vizceral-react was passed data directly without any asynchronous
    // calls to retrieve the data, the initially loaded graph would not
    // animate properly.
    setTimeout(() => {
      this.vizceral.setView(this.props.view || Vizceral.defaultProps.view, this.props.objectToHighlight);
      this.vizceral.updateData(this.props.traffic);
      let perfNow = getPerformanceNow();
      this.vizceral.animate(perfNow === null ? 0 : perfNow);
      this.vizceral.updateBoundingRectCache();
    }, 0);
  }

  componentWillReceiveProps (nextProps) {
    if (!isEqual(nextProps.styles, this.props.styles)) {
      this.updateStyles(nextProps.styles);
    }

    if (!isEqual(nextProps.view, this.props.view) ||
        !isEqual(nextProps.objectToHighlight, this.props.objectToHighlight)) {
      this.vizceral.setView(nextProps.view, nextProps.objectToHighlight);
    }

    if (!isEqual(nextProps.filters, this.props.filters)) {
      this.vizceral.setFilters(nextProps.filters);
    }
    if (!isEqual(nextProps.showLabels, this.props.showLabels)) {
      this.vizceral.setOptions({ showLabels: nextProps.showLabels });
    }
    if (!isEqual(nextProps.modes, this.props.modes)) {
      this.vizceral.setModes(nextProps.modes);
    }

    if (!isEqual(nextProps.definitions, this.props.definitions)) {
      this.vizceral.updateDefinitions(nextProps.definitions);
    }

    if (nextProps.match !== this.props.match) {
      this.vizceral.findNodes(nextProps.match);
    }

    if (!this.props.traffic.nodes || some(nextProps.traffic.nodes, (data, node) => !this.props.traffic.nodes[node] || this.props.traffic.nodes[node].updated !== data.updated)) {
      this.vizceral.updateData(nextProps.traffic);
    }
  }

  componentWillUnmount () {
    delete this.vizceral;
  }

  /* eslint-disable class-methods-use-this */
  render () {
    return (
      <div className="vizceral">
        <canvas style={{ width: '100%', height: '100%' }} ref="vizCanvas"/>
        <div className="vizceral-notice"></div>
      </div>
    );
  }
  /* eslint-enable class-methods-use-this */

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
   * Callback for when a connection is highlighted. The highlighted connection is the only parameter.
   */
  connectionHighlighted: React.PropTypes.func,
  /**
   * Object map of definitions. Refer to [github.com/Netflix/vizceral/DATAFORMATS.md#definitions](https://github.com/Netflix/vizceral/blob/master/DATAFORMATS.md#definitions)
   */
  definitions: React.PropTypes.object,
  /**
   * Array of filter definitions and current values to filter out nodes and connections. Refer to
   * [github.com/Netflix/vizceral/DATAFORMATS.md#filters](https://github.com/Netflix/vizceral/blob/master/DATAFORMATS.md#filters)
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
   * Map of modes to mode type, e.g. { detailedNode: 'volume' }
   */
  modes: React.PropTypes.object,
  /**
   * Callback for when a node is focused. The focused node is the only parameter.
   */
  nodeFocused: React.PropTypes.func,
  /**
   * Callback for when an object is highlighted. The highlighted object is the only parameter.
   * `object.type` will be either 'node' or 'connection'
   */
  nodeHighlighted: React.PropTypes.func,
  /**
   * Callback for when the top level node context panel size changes. The updated dimensions is the only parameter.
   */
  nodeContextSizeChanged: React.PropTypes.func,
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
   * The traffic data. See [github.com/Netflix/vizceral/DATAFORMATS.md](https://github.com/Netflix/vizceral/blob/master/DATAFORMATS.md) for specification.
   */
  traffic: React.PropTypes.object,
  /**
   * Callback for when the view changed. The view array is the only property.
   */
  viewChanged: React.PropTypes.func
};

Vizceral.defaultProps = {
  connectionHighlighted: () => {},
  definitions: {},
  filters: [],
  graphsUpdated: () => {},
  match: '',
  nodeFocused: () => {},
  nodeHighlighted: () => {},
  nodeUpdated: () => {},
  nodeContextSizeChanged: () => {},
  rendered: () => {},
  matchesFound: () => {},
  showLabels: true,
  styles: {},
  traffic: {},
  viewChanged: () => {},
  view: []
};

export default Vizceral;
