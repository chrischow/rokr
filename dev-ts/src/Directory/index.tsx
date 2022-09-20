import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useKeyResultsByFreq } from '../shared/hooks/useKeyResults';
import { useObjectivesByFreq } from '../shared/hooks/useObjectives';
import { formatDate } from '../shared/utils/dates';
import { SearchBar } from './SearchBar';
import { getColours, useGraphSettings } from './useGraphSettings';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Graph from './Graph';
import { KeyResult, Objective } from '../shared/types';

import 'vis-network/dist/dist/vis-network.min.css';
import './styles.css';

interface Node {
  id: string;
  title: string;
  group: string;
  color?: {
    background: string;
    border: string;
  };
  size?: number;
  label?: string;
  chosen?: boolean;
  mass?: number;
  margin?: number;
}

interface Edge {
  from: string;
  to: string;
  dashes?: boolean;
}

interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

interface ActiveNodeData {
  Title: string;
  description: string;
  team: string;
  startDate: string;
  endDate: string;
  minValue: number | null;
  maxValue: number | null;
  currentValue: number | null;
}

export default function Directory() {
  // Force re-render
  useLocation();
  
  // State
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [activeNodeData, setActiveNodeData] = useState<ActiveNodeData | null>(null);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [queryString, setQueryString] = useState<string>('');
  const [filteredNodes, setFilteredNodes] = useState<string[]>([]);

  // Get data
  const objectives = useObjectivesByFreq('annual');
  const keyResults = useKeyResultsByFreq('annual');

  // Get graph settings
  const { teamLookup, defaultNodes, defaultEdges } = useGraphSettings();

  useEffect(() => {

    if (objectives.isSuccess && keyResults.isSuccess) {

      // Initialise with org nodes
      const newGraphData: GraphData = {
        nodes: [],
        edges: []
      };

      // Add all KRs
      keyResults.data.forEach((kr: KeyResult) => {
        // Add to nodes
        newGraphData.nodes.push({
          id: `kr-${kr.Id}`,
          title: `${kr.Title}${kr.krDescription ? ` - ${kr.krDescription}`: ""}`,
          group: 'keyResults',
          color: getColours(kr.currentValue, kr.maxValue),
        });

        // Add edges from objective to KR
        newGraphData.edges.push({ from: `obj-${kr.parentObjective.Id}`, to: `kr-${kr.Id}` });
      })
      
      // Add all objectives
      objectives.data.forEach((obj: Objective) => {
        // Add to nodes
        newGraphData.nodes.push({
          id: `obj-${obj.Id}`,
          title: `${obj.Title}${obj.objectiveDescription ? ` - ${obj.objectiveDescription}` : ""}`,
          group: 'objectives',
          size: 30
        });

        // Add edge from org to objective
        newGraphData.edges.push({ from: teamLookup[obj.team as keyof typeof teamLookup], to: `obj-${obj.Id}` });
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
          const data = objectives.data.find((obj: Objective) => obj.Id === Number(nodeId));
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
          const data = keyResults.data.find((kr: KeyResult) => kr.Id === Number(nodeId));
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
        setActiveNodeData(null);
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
          {activeNodeData && Object.keys(activeNodeData).length > 0 &&
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
          {!activeNodeData &&
            <div className="mt-3">
              <h5>Please select an <span className="text-blue">Objective</span> or <span className="text-green">Key Result</span>.</h5>
            </div>
          }
        </Col>
      </Row>
    </>
  );
}