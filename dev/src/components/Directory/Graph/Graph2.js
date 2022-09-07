import { useEffect, useRef, useState, useContext, Component, createRef } from 'react';
import { Network } from 'vis-network';
import { useGraphSettings, options } from '../useGraphSettings';

export default class Graph2 extends Component {
  constructor(props) {
    super(props);
    this.state = { localGraph: null };
    this.mapContainer = createRef(null);
  }

  componentDidMount() {
    
    console.log('Graph component has mounted.')
    // Initialise network
    this.network = new Network(this.mapContainer.current, this.props.graphData, options);
    this.network.fit();

    // Set active node (if any) upon click; remove search query if clicking away
    this.network.on('click', params => {
      this.props.setActiveNode(params.nodes[0]);
      this.network.selectNodes(params.nodes);
      if (params.nodes.length === 0) {
        this.props.setQueryString('');
      }
    });

    // On double-click, zoom to node or edge if present, or reset zoom otherwise
    this.network.on('doubleClick', params => {
      if (params.nodes.length !== 0 || params.edges.length !== 0) {
        this.network.moveTo({
          position: {
            x: params.pointer.canvas.x,
            y: params.pointer.canvas.y
          },
          scale: 1.5
        })
      } else {
        this.network.fit();
      }
    });

    // Scroll to bottom
    this.network.on('selectNode', params => {
      setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 100);
    });

    // Save network
    this.props.setGraph({network: this.network, exists: true});
    // network = null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      this.props.graphData.nodes.length > 0 && this.props.queryString && 
      this.props.queryString.trim() !== '' && this.network != null) {
        // console.log(props.filteredNodes);
      this.network.selectNodes(this.props.filteredNodes);
    }
    else {
      if (this.network != null){
        this.network.unselectAll();
      }
    }
  }

  componentWillUnmount() {
    console.log('Graph component has unmounted.');
    this.network = null;
    // this.setState({localGraph: null});
  }

  render() {
    return <div ref={this.mapContainer} className="map-container" />;
  }
}
