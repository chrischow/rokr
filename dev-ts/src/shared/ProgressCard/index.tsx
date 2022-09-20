import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ProgressCompletion, ProgressCardData } from "../types";

import "./styles.css";

interface MetricCountProps {
  title: string;
  styleHeaderText: string;
  styleMetricTitle: string;
  styleMetric: string;
  styleMetricBetween: string;
  data: ProgressCompletion;
}

function MetricCount(props: MetricCountProps) {
  return (
    <>
      <h4 className={props.styleHeaderText + " mb-2"}>{props.title}</h4>
      <div className="justify-content-center align-items-center text-center d-flex">
        <span className={props.styleMetric}>{props.data.completed}</span>
        <span className={props.styleMetricBetween}>/</span>
        <span className={props.styleMetric}>{props.data.total}</span>
      </div>
      <div className="text-center">
        <span className={props.styleMetricTitle}>Completed</span>
      </div>
    </>
  )
}

interface ProgressCardProps {
  progressId: string;
  isTeam: boolean;
  data: ProgressCardData
}

export default function ProgressCard(props: ProgressCardProps) {
  // Define styles
  let styleCircleText = 'progress-card--circle-text';
  let styleHeaderText = 'progress-card--header-text';
  let styleMetric = 'progress-card--metric';
  let styleMetricTitle = 'progress-card--metric-title';
  let styleMetricBetween = 'pl-3 pr-3 progress-card--metric-between';
  let styleCircleFont = 'progress-circle-font';

  // Change styles if progress card is for a team
  if (props.isTeam) {
    styleCircleText = styleCircleText + '-sm';
    styleHeaderText = styleHeaderText + '-sm';
    styleMetric = styleMetric + '-sm';
    styleMetricTitle = styleMetricTitle + '-sm';
    styleMetricBetween = styleMetricBetween + '-sm';
    styleCircleFont = styleCircleFont + '-sm';  
  }

  return (
    <Row className="justify-content-center align-items-center">
      <Col xs={6} className="text-center">
        <div id={props.progressId} className="progress-circle text-center">
          <div className={styleCircleFont + " progress-circle-value"}></div>
        </div>
        <div className={styleCircleText + " text-center mt-3"}>
          AVG Objective Progress
        </div>
      </Col>
      <Col xs={6} className="text-center">
      <MetricCount
          title="Objectives"
          styleHeaderText={styleHeaderText}
          styleMetric={styleMetric}
          styleMetricBetween={styleMetricBetween}
          styleMetricTitle={styleMetricTitle}
          data={props.data.objectiveCompletion}
        />
        <hr className="mt-4 mb-4" />
        <MetricCount
          title="Key Results"
          styleHeaderText={styleHeaderText}
          styleMetric={styleMetric}
          styleMetricBetween={styleMetricBetween}
          styleMetricTitle={styleMetricTitle}
          data={props.data.keyResultCompletion}
        />
      </Col>
    </Row>
  );
}