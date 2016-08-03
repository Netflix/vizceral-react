## Vizceral

From [`src/vizceral.jsx`](src/vizceral.jsx)

![](https://raw.githubusercontent.com/Netflix/vizceral/master/logo.png)

This is a react wrapper around [Vizceral](https://github.com/Netflix/vizceral).

## Setup
1. Install package
   `npm install vizceral-react --save`
2. import vizceral-react to start using

   ```js
   import Vizceral from 'vizceral-react';
   <Vizceral traffic={this.state.trafficData}
             view={this.state.currentView}
             showLabels={this.state.displayOptions.showLabels}
             filters={this.state.filters}
             graphsUpdated={this.graphsUpdated}
             viewChanged={this.viewChanged}
             nodeHighlighted={this.nodeHighlighted}
             rendered={this.rendered}
             nodeFocused={this.nodeFocused}
             nodeContextSizeChanged={this.nodeContextSizeChanged}
             matchesFound={this.matchesFound}
             match={this.state.searchTerm}
             modes={this.state.modes}
             definitions={this.state.definitions}
             styles={styles}
   />
   ```

## Props

#### definitions

```js
// Default: {}
definitions: Object
```

Object map of definitions. Refer to https://github.com/Netflix/vizceral/DATAFORMATS.md#definitions

#### filters

```js
// Default: []
filters: Array
```

Array of filter definitions and current values to filter out nodes and connections. Refer to https://github.com/Netflix/vizceral/DATAFORMATS.md#filters

#### graphsUpdated

```js
// Default: () => {}
graphsUpdated: Function
```

Callback for when the graph objects are modified

#### match

```js
// Default: ''
match: String
```

A search string to highlight nodes that match

#### matchesFound

```js
// Default: () => {}
matchesFound: Function
```

Callback when nodes match the match string. The matches object { total, visible } is the only property.

#### modes

```js
modes: Object
```

Map of modes to mode type, e.g. { detailedNode: 'volume' }

#### nodeContextSizeChanged

```js
// Default: () => {}
nodeContextSizeChanged: Function
```

Callback for when the top level node context panel size changes. The updated dimensions is the only parameter.

#### nodeFocused

```js
// Default: () => {}
nodeFocused: Function
```

Callback for when a node is focused. The focused node is the only parameter.

#### nodeHighlighted

```js
// Default: () => {}
nodeHighlighted: Function
```

Callback for when a node is highlighted. The highlighted node is the only parameter.

#### nodeUpdated

```js
// Default: () => {}
nodeUpdated: 
```

#### rendered

```js
// Default: () => {}
rendered: Function
```

Callback when a graph has been rendered. The name of the graph that was rendered is the only property.

#### showLabels

```js
// Default: true
showLabels: Boolean
```

Whether or not to show labels on the nodes.

#### styles

```js
// Default: {}
styles: Object
```

Styles to override default properties.

#### traffic

```js
// Default: {}
traffic: Object
```

The traffic data. See https://github.com/Netflix/vizceral/DATAFORMATS.md for specification.

#### viewChanged

```js
// Default: () => {}
viewChanged: Function
```

Callback for when the view changed. The view array is the only property.

<br><br>
