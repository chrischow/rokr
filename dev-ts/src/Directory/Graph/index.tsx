import { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import { useGraphSettings } from '../useGraphSettings';

import 'vis-network/dist/dist/vis-network.min.css';

interface GraphProps {
  graphData: any;
  filteredNodes: any;
  queryString: string;
  setActiveNode: Function;
  setQueryString: Function;
}

export default function Graph(props: GraphProps) {

  // State
  const [localGraph, setLocalGraph] = useState<Network | null>(null);

  // Create references
  const mapContainer = useRef(null);

  // Get graph settings
  const { options } = useGraphSettings();

  // Launch and teardown
  useEffect(() => {
    if (mapContainer.current) {
      // Initialise network
      let network: Network;
      network = new Network(mapContainer.current, props.graphData, options);
      network.fit();

      // Set active node (if any) upon click; remove search query if clicking away
      network.on('click', params => {
        props.setActiveNode(params.nodes[0]);
        network.selectNodes(params.nodes);
        if (params.nodes.length === 0) {
          props.setQueryString('');
        }
      });

      // On double-click, zoom to node or edge if present, or reset zoom otherwise
      network.on('doubleClick', params => {
        if (params.nodes.length !== 0 || params.edges.length !== 0) {
          network.moveTo({
            position: {
              x: params.pointer.canvas.x,
              y: params.pointer.canvas.y
            },
            scale: 1.5
          })
        } else {
          network.fit();
        }
      });
      
      setLocalGraph(network);
    }
  }, []);

  useEffect(() => {
    if (
      props.graphData.nodes.length > 0 && props.queryString && 
      props.queryString.trim() !== '' && localGraph != null) {
      localGraph.selectNodes(props.filteredNodes);
    }
    else {
      if (localGraph != null){
        localGraph.unselectAll();
      }
    }
  }, [props.queryString, props.filteredNodes, props.graphData.nodes, localGraph])

  return (
    <div ref={mapContainer} className="map-container" />
  );
}