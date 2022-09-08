import { useEffect, useState } from 'react';
import { useKeyResultsByFreq } from '../../hooks/useKeyResults';
import { useObjectivesByFreq } from '../../hooks/useObjectives';
import { formatDate } from '../../utils/dates';
import { SearchBar } from './SearchBar/SearchBar';
import { getColours, useGraphSettings } from './useGraphSettings';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Graph from './Graph/Graph';
// import Graph2 from './Graph/Graph2';

import './Directory.css';
import 'vis-network/dist/dist/vis-network.min.css';
import { useLocation } from 'react-router-dom';

export default function Directory(props) {
  // Force re-render
  useLocation();
  
  // State
  const [activeNode, setActiveNode] = useState(null);
  const [activeNodeData, setActiveNodeData] = useState({});
  const [graphData, setGraphData] = useState(null);
  const [queryString, setQueryString] = useState('');
  const [filteredNodes, setFilteredNodes] = useState([]);

  // Get data
  const objectives = useObjectivesByFreq('annual');
  const keyResults = useKeyResultsByFreq('annual');

  // Get graph settings
  const { teamLookup, defaultNodes, defaultEdges } = useGraphSettings();

  useEffect(() => {

    if (objectives.isSuccess && keyResults.isSuccess) {

      // Initialise with org nodes
      const newGraphData = {
        nodes: [],
        edges: []
      };

      // Add all KRs
      keyResults.data.forEach(kr => {
        // Add to nodes
        newGraphData.nodes.push({
          id: `kr-${kr.Id}`,
          title: kr.krDescription,
          group: 'keyResults',
          color: getColours(kr.currentValue, kr.maxValue),
        });

        // Add edges from objective to KR
        newGraphData.edges.push({ from: `obj-${kr.parentObjective.Id}`, to: `kr-${kr.Id}` });
      })
      
      // Add all objectives
      objectives.data.forEach(obj => {
        // Add to nodes
        newGraphData.nodes.push({
          id: `obj-${obj.Id}`,
          title: `${obj.Title} - ${obj.objectiveDescription}`,
          group: 'objectives',
          size: 30
        });

        // Add edge from org to objective
        newGraphData.edges.push({ from: teamLookup[obj.team], to: `obj-${obj.Id}` });
      });

      // Reverse all nodes
      newGraphData.nodes.push(...defaultNodes);
      newGraphData.edges.push(...defaultEdges);
      setGraphData(newGraphData);
    }
  }, [objectives.isSuccess, keyResults.isSuccess]);

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

  // Update search
  useEffect(() => {
    if (graphData && graphData.nodes.length > 0) {
      if (queryString && queryString.trim() !== '') {
        const newFilteredNodes = graphData.nodes
          .filter(node => {
            if (node.group === 'objectives' || node.group === 'keyResults') {
              return node.title.toLowerCase().includes(queryString);
            } else {
              return false;
            }
          })
          .map(node => node.id);
        setFilteredNodes(newFilteredNodes);
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
      <Row>
        {objectives.isSuccess && keyResults.isSuccess && <Col xs={12} className="mt-4">
          <div className="map-container-wrapper">
            {objectives.isSuccess && keyResults.isSuccess && graphData != null &&
              <Graph
                graphData={graphData}
                setActiveNode={setActiveNode}
                setQueryString={setQueryString}
                queryString={queryString}
                graph={props.graph}
                setGraph={props.setGraph}
                filteredNodes={filteredNodes}
              />
            }
            <div className="map-container--overlay">
              <table>
                <thead className="text-center">
                  <tr><th>Legend</th></tr>
                </thead>
                <tbody className="text-center">
                  <tr><td><div className="legend legend--org-entity">Org. Entity</div></td></tr>
                  <tr><td><div className="legend legend--obj">Objective</div></td></tr>
                  <tr><td><div className="legend legend--kr-red">{`KR (< 0.4)`}</div></td></tr>
                  <tr><td><div className="legend legend--kr-yellow">{`KR (0.4 to 0.7)`}</div></td></tr>
                  <tr><td><div className="legend legend--kr-green">{`KR (> 0.7)`}</div></td></tr>
                </tbody>
              </table>
            </div>
          </div>
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
                    <h5 className="directory--tag">
                      {activeNodeData.team} {activeNodeData.minValue !== null ? "Key Result" : "Objective"}
                    </h5>
                    <h3 className="directory--info-header mt-3">
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