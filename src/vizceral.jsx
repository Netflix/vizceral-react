'use strict';

import { isEqual } from 'lodash';
import React from 'react'; // eslint-disable-line import/no-unresolved, import/no-extraneous-dependencies
import VizceralGraph from 'vizceral';
import PropTypes from 'prop-types';

function getPerformanceNow () {
  const g = window;
  if (g != null) {
    const perf = g.performance;
    if (perf != null) {
      try {
        const perfNow = perf.now();
        if (typeof perfNow === 'number') {
          return perfNow;
        }
      } catch (e) {
        // do nothing
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
 *              viewChanged={this.viewChanged}
 *              objectHighlighted={this.objectHighlighted}
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
    this.vizceral = new VizceralGraph(this.refs.vizCanvas, this.props.targetFramerate);
    this.updateStyles(this.props.styles);

    this.vizceral.on('viewChanged', this.props.viewChanged);
    this.vizceral.on('objectHighlighted', this.props.objectHighlighted);
    this.vizceral.on('objectHovered', this.props.objectHovered);
    this.vizceral.on('nodeUpdated', this.props.nodeUpdated);
    this.vizceral.on('nodeContextSizeChanged', this.props.nodeContextSizeChanged);
    this.vizceral.on('matchesFound', this.props.matchesFound);
    this.vizceral.on('viewUpdated', this.props.viewUpdated);

    // Pass our defaults to Vizceral in the case that it has different defaults.
    this.vizceral.setOptions({
      allowDraggingOfNodes: this.props.allowDraggingOfNodes,
      showLabels: this.props.showLabels
    });


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
      const perfNow = getPerformanceNow();
      this.vizceral.animate(perfNow === null ? 0 : perfNow);
      this.vizceral.updateBoundingRectCache();
    }, 0);
  }

  componentWillReceiveProps (nextProps) {
    if (!isEqual(nextProps.styles, this.props.styles)) {
      this.updateStyles(nextProps.styles);
    }
    if (!isEqual(nextProps.view, this.props.view)
        || !isEqual(nextProps.objectToHighlight, this.props.objectToHighlight)) {
      this.vizceral.setView(nextProps.view, nextProps.objectToHighlight);
    }

    if (!isEqual(nextProps.filters, this.props.filters)) {
      this.vizceral.setFilters(nextProps.filters);
    }
    if (!isEqual(nextProps.showLabels, this.props.showLabels)
        || !isEqual(nextProps.allowDraggingOfNodes, this.props.allowDraggingOfNodes)) {
      this.vizceral.setOptions({
        allowDraggingOfNodes: nextProps.allowDraggingOfNodes,
        showLabels: nextProps.showLabels
      });
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
    // If the data does not have an updated field, just assume it's modified now
    // This also solves the case between data updates
    nextProps.traffic.updated = nextProps.traffic.updated || Date.now();
    if (!this.props.traffic.nodes
        || nextProps.traffic.updated > (this.props.traffic.updated || 0)) {
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
  connectionHighlighted: PropTypes.func,
  /**
   * Object map of definitions. Refer to [github.com/Netflix/Vizceral/wiki/Configuration#definitions-for-data-to-display](https://github.com/Netflix/Vizceral/wiki/Configuration#definitions-for-data-to-display)
   */
  definitions: PropTypes.object,
  /**
   * Array of filter definitions and current values to filter out nodes and connections. Refer to
   * [github.com/Netflix/Vizceral/wiki/Configuration#filters](https://github.com/Netflix/Vizceral/wiki/Configuration#filters)
   */
  filters: PropTypes.array,
  /**
   * A search string to highlight nodes that match
   */
  match: PropTypes.string,
  /**
   * Map of modes to mode type, e.g. { detailedNode: 'volume' }
   */
  modes: PropTypes.object,
  /**
   * Callback for when an object is highlighted. The highlighted object is the only parameter.
   * `object.type` will be either 'node' or 'connection'
   */
  objectHighlighted: PropTypes.func,
  /**
   * Pass in the name of the object to highlight
   */
  objectToHighlight: PropTypes.string,
  /**
   * Callback for when the top level node context panel size changes. The updated dimensions is the only parameter.
   */
  nodeContextSizeChanged: PropTypes.func,
  /**
   * Callback when nodes match the match string. The matches object { total, visible } is the only property.
   */
  matchesFound: PropTypes.func,
  /**
   * Whether or not to show labels on the nodes.
   */
  showLabels: PropTypes.bool,
  /**
   * Nodes can be repositioned through dragging if and only if this is true.
   */
  allowDraggingOfNodes: PropTypes.bool,
  /**
   * Styles to override default properties.
   */
  styles: PropTypes.object,
  /**
   * The traffic data. See [github.com/Netflix/Vizceral/wiki/How-to-Use#graph-data-format](https://github.com/Netflix/Vizceral/wiki/How-to-Use#graph-data-format) for specification.
   */
  traffic: PropTypes.object,
  /**
   * Callback for when the view changed. The view array is the only property.
   */
  viewChanged: PropTypes.func,
  /**
   * Callback for when the current view is updated.
   */
  viewUpdated: PropTypes.func,
  /**
  * Target framerate for rendering engine
  */
  targetFramerate: PropTypes.number
};

Vizceral.defaultProps = {
  connectionHighlighted: () => {},
  definitions: {},
  filters: [],
  match: '',
  nodeHighlighted: () => {},
  nodeUpdated: () => {},
  nodeContextSizeChanged: () => {},
  matchesFound: () => {},
  objectHighlighted: () => {},
  objectHovered: () => {},
  objectToHighlight: null,
  showLabels: true,
  allowDraggingOfNodes: false,
  styles: {},
  traffic: {},
  viewChanged: () => {},
  viewUpdated: () => {},
  view: [],
  targetFramerate: null
};

export default Vizceral;
