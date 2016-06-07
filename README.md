#vizceral-react
This is a react wrapper around [Vizceral](https://github.com/Netflix/vizceral).

## Setup
Requires stage-0 babel preset.

1. Install package
   `npm install vizceral-react --save`
2. Install stage-0 preset, if not already present
   `npm install babel-preset-stage-0 --save`
3. Modify `.babelrc` to include the new preset
   ```
   {
     "presets": [ "react", "es2015", "stage-0" ],
   }
   ```
4. import vizceral-react to start using
   ```jsx
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
