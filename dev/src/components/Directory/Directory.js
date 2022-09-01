import { useEffect, useRef, useState } from 'react';
import { useKeyResults } from '../../hooks/useKeyResults';
import { useObjectives } from '../../hooks/useObjectives';
import { Network, Dataset } from 'vis-network';

import './Directory.css';
import 'vis-network/dist/dist/vis-network.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { formatDate } from '../../utils/dates';
import { SearchBar } from './SearchBar/SearchBar';

export default function Directory(props) {

  // State
  const [activeNode, setActiveNode] = useState(null);
  const [activeNodeData, setActiveNodeData] = useState({});
  const [graphData, setGraphData] = useState(null);
  const [currNetwork, setCurrNetwork] = useState(null);
  const [queryString, setQueryString] = useState('');

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
      // Tooltip functions
      function htmlTitle(html) {
        const div = document.createElement("div");
        div.classList.add("directory-tooltip");
        div.innerHTML = html;
        return div;
      }

      // Initialise with org nodes
      const newGraphData = {
        nodes: [
          { id: 'org-0', label: 'RAiD', title: htmlTitle('RSAF Agility, Innovation, and Digital'), group: 'king', level: 0, margin: 20, mass: 6, chosen: false },
          { id: 'org-1', label: 'PAB', title: 'Plans & Architecting Branch', group: 'org', level: 1, margin: 20, mass: 3, chosen: false },
          { id: 'org-2', label: 'SWiFT', title: 'SWiFT', group: 'org', level: 1, margin: 20, mass: 3, chosen: false },
          { id: 'org-3', label: 'RDO', title: 'RSAF Data Office', group: 'org', level: 1, margin: 20, mass: 3, chosen: false },
          { id: 'org-4', label: 'CyDef', title: 'Cyber Defence Branch', group: 'org', level: 1, margin: 20, mass: 3, chosen: false },
          { id: 'org-5', label: 'SES', title: 'Software Engineering Squadron', group: 'org', level: 1, margin: 20, mass: 3, chosen: false },
        ],
        edges: [
          { from: 'org-0', to: 'org-1' },
          { from: 'org-0', to: 'org-2' },
          { from: 'org-0', to: 'org-3' },
          { from: 'org-0', to: 'org-4' },
          { from: 'org-0', to: 'org-5' },
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
        newGraphData.edges.push({ from: teamLookup[obj.team], to: `obj-${obj.Id}` });

        // Get KRs
        let relatedKRs = keyResults.data.filter(kr => {
          return kr.parentObjective.Id === obj.Id;
        });

        relatedKRs.forEach((kr, idx) => {
          // Add to nodes
          newGraphData.nodes.push({
            id: `kr-${kr.Id}`,
            label: `KR ${idx + 1}`,
            title: kr.krDescription,
            group: 'keyResults',
            level: 3
          });

          // Add edges from objective to KR
          newGraphData.edges.push({ from: `obj-${obj.Id}`, to: `kr-${kr.Id}` });
        });
      });
      newGraphData.nodes = newGraphData.nodes.reverse()
      newGraphData.edges = newGraphData.edges.reverse()
      setGraphData(newGraphData);
    }
  }, [objectives.status, keyResults.status]);

  // Create references
  const mapContainer = useRef(null);
  const infoPanel = useRef(null);

  // Create network
  useEffect(() => {
    if (mapContainer.current && graphData) {
      // Initialise network
      let network = new Network(mapContainer.current, graphData, options);

      // Set active node (if any) upon click; remove search query if clicking away
      network.on('click', params => {
        setActiveNode(params.nodes[0]);
        network.selectNodes(params.nodes);
        if (params.nodes.length === 0) {
          setQueryString('');
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
      
      // Scroll to bottom
      network.on('selectNode', params => {
        // const offset = infoPanel.current.offsetTop + infoPanel.current.offsetHeight;
        setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 100);
      })
      // Save network
      setCurrNetwork(network);
    }
  }, [graphData])

  // Update active node for displaying info, standardising the info fields
  useEffect(() => {
    if (objectives.isSuccess && keyResults.isSuccess) {
      if (activeNode) {
        const [nodeType, nodeId] = activeNode.split('-');
        if (nodeType === 'obj') {
          const data = objectives.data.find(obj => obj.Id === Number(nodeId));
          setActiveNodeData({
            Title: data.Title,
            description: data.objectiveDescription,
            startDate: data.objectiveStartDate,
            endDate: data.objectiveEndDate,
            team: data.team,
            minValue: null,
            currentValue: null,
            maxValue: null,
          });
        } else if (nodeType === 'kr') {
          const data = keyResults.data.find(kr => kr.Id === Number(nodeId));
          setActiveNodeData({
            Title: data.Title,
            description: data.krDescription,
            startDate: data.krStartDate,
            endDate: data.krEndDate,
            team: data.parentObjective.team,
            minValue: data.minValue,
            currentValue: data.currentValue,
            maxValue: data.maxValue,
          });
        }
      } else {
        setActiveNode(null);
        setActiveNodeData({});
      }
    }
  }, [activeNode])

  // Styles
  const orgStyle = {
    color: { background: '#000C1D', border: '#8497B0' },
    chosen: {
      node: (values, id, selected, hovering) => {
        values.color = '#FF5364';
        values.borderColor = '#ff2c41';
      }
    },
    font: { color: 'white', face: 'Bahnschrift Light', size: 40 },
    shape: 'box'
  };

  const options = {
    height: '450px',
    width: '100%',
    interaction: {
      tooltipDelay: 10
    },
    // layout: {hierarchical: true},
    groups: {
      king: { ...orgStyle, font: { ...orgStyle.font, size: 60 } },
      org: { ...orgStyle },
      objectives: {
        ...orgStyle,
        color: { ...orgStyle.color, background: '#7B73F0', border: '#5a50ec' },
        font: { ...orgStyle.font, size: 25 }
      },
      keyResults: {
        ...orgStyle,
        color: { ...orgStyle.color, background: '#27DDCB', border: '#1ebfaf' },
        font: { ...orgStyle.font, size: 25 }
      }
    },
    nodes: { shape: 'box', opacity: 0.75 },
    edges: { color: '#8497B0' },
  };

  // Update search
  useEffect(() => {
    if (graphData && graphData.nodes.length > 0) {
      if (queryString && queryString.trim() !== '') {
        const filteredNodes = graphData.nodes
          .filter(node => {
            return node.title.toLowerCase().includes(queryString) || node.label.toLowerCase().includes(queryString);
          })
          .map(node => node.id);
        
          currNetwork.selectNodes(filteredNodes);
      }
    }
  }, [queryString, graphData])

  return (
    <>
      <h1>Directory</h1>
      <div className="mt-4">
        <SearchBar 
          queryString={queryString}
          setQueryString={setQueryString}
          placeholder="Search for OKRs..." 
        />
      </div>
      <Row ref={infoPanel}>
        {objectives.isSuccess && keyResults.isSuccess && <Col xs={12} className="mt-4">
          <div ref={mapContainer} className="map-container" />
        </Col>}
        <Col xs={12} className="mt-5">
          <h2>Details</h2>
          {Object.keys(activeNodeData).length > 0 &&
            <>
              <div className="directory--info-panel mt-3">
                <Row className="align-items-center">
                  <Col
                    xs={(activeNodeData.minValue === null) ? 12 : 9}
                    className={`kr-info--main-col ${activeNodeData.minValue === null ? "noborder" : ""}`}
                  >
                    <h3 className="directory--info-header">
                      <span className="me-3 text-green">
                        {activeNodeData.Title}
                      </span>
                    </h3>
                    <div className="kr-info--subheader">
                      <span>{`${formatDate(activeNodeData.startDate)} - ${formatDate(activeNodeData.endDate)}`}</span>
                    </div>
                    <div className="kr-info--description">
                      {activeNodeData.description}
                    </div>
                  </Col>
                  {(activeNodeData.minValue !== null) && <Col xs={3} className="ps-4 text-center">
                    <div className="align-items-center justify-content-center text-center d-flex">
                      <span className="progress-card--metric-sm">
                        {activeNodeData.currentValue}
                      </span>
                      <span className="ps-3 pe-3 progress-card--metric-between-sm">
                        /
                      </span>
                      <span className="progress-card--metric-sm">
                        {activeNodeData.maxValue}
                      </span>
                    </div>
                    <Col className="text-center">
                      <span className="progress-card--metric-title-sm">
                        Completed
                      </span>
                    </Col>
                  </Col>}
                </Row>
              </div>
            </>
          }
          {Object.keys(activeNodeData).length === 0 &&
            <div className="mt-3">
              <h5>Please select an <span className="text-blue">Objective</span> or <span className="text-green">Key Result</span>.</h5>
            </div>
          }
        </Col>
      </Row>
    </>
  );
}