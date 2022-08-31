import { useEffect, useRef, useState } from 'react';
import { useKeyResults } from '../../hooks/useKeyResults';
import { useObjectives } from '../../hooks/useObjectives';
import { Network, Dataset } from 'vis-network';

import './Directory.css';
import 'vis-network/dist/dist/vis-network.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Directory(props) {
  
  // State
  const [activeNode, setActiveNode] = useState(null);
  const [activeNodeData, setActiveNodeData] = useState({});
  const [graphData, setGraphData] = useState({
    nodes: [],
    edges: []
  });
  
  // Get data
  const objectives = useObjectives();
  const keyResults = useKeyResults();

  useEffect(() => {
    if (objectives.isSuccess && keyResults.isSuccess) {
      let annualObjectives = objectives.data.filter(obj => {
        return obj.frequency === 'annual';
      });
      const teamLookup = {
        RAiD: 'org-0',
        PAB: 'org-1',
        SWiFT: 'org-2',
        RDO: 'org-3',
        CyDef: 'org-4',
        SES: 'org-5',
      }

      // Initialise with org nodes
      const newGraphData = {
        nodes: [
          {id: 'org-0', label: 'RAiD', title: 'RSAF Agility, Innovation, and Digital', group: 'king', level: 0, margin: 20},
          {id: 'org-1', label: 'PAB', title: 'Plans & Architecting Branch', group: 'org', level: 1, margin: 20},
          {id: 'org-2', label: 'SWiFT', title: 'SWiFT', group: 'org', level: 1, margin: 20},
          {id: 'org-3', label: 'RDO', title: 'RSAF Data Office', group: 'org', level: 1, margin: 20},
          {id: 'org-4', label: 'CyDef', title: 'Cyber Defence Branch', group: 'org', level: 1, margin: 20},
          {id: 'org-5', label: 'SES', title: 'Software Engineering Squadron', group: 'org', level: 1, margin: 20},
        ],
        edges: [
          {from: 'org-0', to: 'org-1'},
          {from: 'org-0', to: 'org-2'},
          {from: 'org-0', to: 'org-3'},
          {from: 'org-0', to: 'org-4'},
          {from: 'org-0', to: 'org-5'},
        ]
      };

      annualObjectives.forEach(obj => {
        // Add to nodes
        newGraphData.nodes.push({
          id: `obj-${obj.Id}`,
          label: obj.Title,
          title: obj.objectiveDescription,
          group: 'objectives',
          level: 2
        });

        // Add edge from org to objective
        newGraphData.edges.push({from: teamLookup[obj.team], to: `obj-${obj.Id}`});

        // Get KRs
        let relatedKRs = keyResults.data.filter(kr => {
          return kr.parentObjective.Id === obj.Id;
        });

        relatedKRs.forEach((kr, idx) => {
          // Add to nodes
          newGraphData.nodes.push({
            id: `kr-${kr.Id}`,
            label: `KR ${idx+1}`,
            title: kr.krDescription,
            group: 'keyResults',
            level: 3
          });

          // Add edges from objective to KR
          newGraphData.edges.push({from: `obj-${obj.Id}`, to: `kr-${kr.Id}`});
        });
      });
      newGraphData.nodes = newGraphData.nodes.reverse()
      newGraphData.edges = newGraphData.edges.reverse()
      setGraphData(newGraphData);
    }
  }, [objectives.status, keyResults.status]);

  // Create reference
  const mapContainer = useRef(null);
  
  // Create network
  useEffect(() => {
    if (mapContainer.current) {
      let network = new Network(mapContainer.current, graphData, options);
      network.on('click', params => {
        setActiveNode(params.nodes[0]);
      });
    }
  }, [graphData])

  useEffect(() => {
    if (objectives.isSuccess && keyResults.isSuccess){
      if (activeNode) {
        const [nodeType, nodeId] = activeNode.split('-');
        if (nodeType === 'obj') {
          const currentObjective = objectives.data.find(obj => obj.Id === Number(nodeId));
          setActiveNodeData(currentObjective);
        } else if (nodeType === 'kr') {
          const currentObjective = keyResults.data.find(kr => kr.Id === Number(nodeId));
          setActiveNodeData(currentObjective);
        } 
      } else {
        setActiveNodeData({});
      }
    }
  }, [activeNode])
  
  // Styles
  const orgStyle = {
    color: {background: '#000C1D', border: '#8497B0'},
    chosen: {
      node: (values, id, selected, hovering) => {
        values.color = '#FF5364';
        values.borderColor = '#ff2c41';
      }
    },
    font: {color: 'white', face: 'Bahnschrift Light', size: 40},
    shape: 'box'
  };

  const options = {
    height: '600px',
    width: '100%',
    interaction: {
      tooltipDelay: 100
    },
    // layout: {hierarchical: true},
    groups: {
      king: {...orgStyle, font: {...orgStyle.font, size: 60}},
      org: {...orgStyle},
      objectives: {
        ...orgStyle,
        color: {...orgStyle.color, background: '#7B73F0', border: '#5a50ec'},
        font: {...orgStyle.font, size: 25}
      },
      keyResults: {
        ...orgStyle,
        color: {...orgStyle.color, background: '#27DDCB', border: '#1ebfaf'},
        font: {...orgStyle.font, size: 25}
      }
    },
    nodes: {shape: 'box', opacity: 0.75},
    edges: {color: '#8497B0'},
  };

  return (
    <>
      <h1>Directory</h1>
      <Row>
        <Col xs={12} xl={8} className="mt-5">
          <div ref={mapContainer} className="map-container" />
        </Col>
        <Col xs={12} xl={4} className="mt-5">
          <h2>Details</h2>
          {Object.keys(activeNodeData).length > 0 && 
            <>
              <div className="mt-4">
                <h4>{activeNodeData.Title}</h4>
                <p>Description: {activeNodeData.objectiveDescription}</p>
                <p>Team: {activeNodeData.team}</p>
                <p>Dates: {activeNodeData.objectiveStartDate} to {activeNodeData.objectiveEndDate}</p>
              </div>
            </>
          }
          {Object.keys(activeNodeData).length === 0 && 
            <h4>Please select a node.</h4>
          }
        </Col>
      </Row>
    </>
  );
}