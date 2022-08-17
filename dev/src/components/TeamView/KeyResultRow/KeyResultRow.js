import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import ProgressBar from "../ProgressBar/ProgressBar";

import './KeyResultRow.css';

export default function KeyResultRow(props) {
  const toggleModal = () => {
    console.log('Toggle kr-modal');
  }

  const editKeyResult = () => {
    console.log('Toggle kr-edit-modal');
  }

  return (
    <div className="keyresult-row">
      <Row className="align-items-center">
        <Col xs={5}>
          <div className="keyresult-row--title">
            {props.Title}
          </div>
        </Col>
        <Col xs={2} className="text-center">
          <div
            className="keyresult-row--action-btn keyresult-row--edit-text mb-1"
            onClick={toggleModal}
          >
            <span className="keyresult-row--action-btn-text">View</span>
            {props.nLatestUpdates > 0 && 
              <span className="keyresult-row--new-updates"> ({props.nLatestUpdates} New)</span>
            }
          </div>
          <div
            className="keyresult-row--action-btn keyresult-row--edit-text"
            onClick={editKeyResult}
          >
            <span className="keyresult-row--action-btn-text">Edit</span>
          </div>
        </Col>
        <Col xs={2} className="text-center">
          <span className="keyresult-row--text">{props.krEndDate}</span>
        </Col>
        <Col xs={3} className="keyresult-row--progress-bar">
          <ProgressBar progress={props.progress} isKeyResult={true} />
        </Col>
      </Row>
    </div>
  );
}