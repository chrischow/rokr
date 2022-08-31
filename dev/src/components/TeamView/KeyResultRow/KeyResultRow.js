import { useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import ProgressBar from "../ProgressBar/ProgressBar";
import SharedModal from "../../SharedModal/SharedModal";

import './KeyResultRow.css';
import KeyResultInfo from "./KeyResultInfo/KeyResultInfo";

export default function KeyResultRow(props) {
  // State
  const [showKrInfoModal, setShowKrInfoModal] = useState(false);
  const [showKrEditModal, setShowKrEditModal] = useState(false);

  // Render KR info
  const viewKrInfo = () => <KeyResultInfo {...props} />;

  const editKr = () => <KeyResultInfo {...props} />;

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
            onClick={() => setShowKrInfoModal(true)}
          >
            <span className="keyresult-row--action-btn-text">View</span>
            {props.nLatestUpdates > 0 && 
              <span className="keyresult-row--new-updates"> ({props.nLatestUpdates} New)</span>
            }
          </div>
          <div
            className="keyresult-row--action-btn keyresult-row--edit-text"
            onClick={() => setShowKrEditModal(true)}
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
      <SharedModal
        modalTitle="Key Result Details"
        show={showKrInfoModal}
        onHide={() => setShowKrInfoModal(false)}
        renderModalContent={() => viewKrInfo()}
        handleCloseModal={() => setShowKrInfoModal(false)}
      />
      <SharedModal
        modalTitle="Edit Key Result"
        show={showKrEditModal}
        onHide={() => setShowKrEditModal(false)}
        renderModalContent={() => editKr()}
        handleCloseModal={() => setShowKrEditModal(false)}
      />
    </div>
  );
}