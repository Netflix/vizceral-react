#vizceral-react
This is a react wrapper around [Vizceral](https://github.com/Netflix/vizceral).

## Setup
1. Install package
   `npm install vizceral-react --save`
2. import vizceral-react to start using
   ```js
   import Vizceral from 'vizceral-react';
   <Vizceral traffic={this.state.trafficData}
             excludedEdgeNodes={this.state.excludedEdgeNodes}
             view={this.state.currentView}
             showLabels={this.state.displayOptions.showLabels}
             filters={this.state.filters}
             graphsUpdated={this.graphsUpdated}
             viewChanged={this.viewChanged}
             nodeHighlighted={this.nodeHighlighted}
             rendered={this.rendered}
             nodeFocused={this.nodeFocused}
             regionContextSizeChanged={this.regionContextSizeChanged}
             matchesFound={this.matchesFound}
             match={this.state.searchTerm}
   />
   ```
