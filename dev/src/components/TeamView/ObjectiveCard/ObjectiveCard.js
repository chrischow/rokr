import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { CaretIcon, EditIconText, AddIconText } from '../../Icons/Icons';

import './ObjectiveCard.css';

export default function ObjectiveCard(props) {
  const editObjective = () => {
    console.log('Edit objective');
  }
  const addKR = () => {
    console.log('Add KR');
  }

  return (
    <div className="objective-card">
      <Row className="align-items-top mt-2">
        <div className="arrow-div">
          <Button
            className={
              "btn-collapse text-center" + 
              (props.isClicked ? " rotated" : "")}
            variant='collapse'
            aria-controls={props.objId}
            aria-expanded={props.isClicked}
            onClick={() => props.setIsClicked(prevState => !prevState)}
            id={`btn-${props.objId}`}
          >
            <CaretIcon />
          </Button>
        </div>
        <Col xs={7}>
          <h5 className="objective-card--title text-left">
            <span className="mr-2">{props.Title}</span>
          </h5>
          {props.isClicked && (
            <>
              <div className="objective-card--description mb-2">
                {props.objectiveDescription}
              </div>
              <button
                className="btn objective-card--edit-button mr-3"
                onClick={editObjective}
              >
                <span className="objective-card--edit-text mr-1">
                  Edit
                </span>
                <EditIconText className="objective-card--edit-icon" />
              </button>
              <button
                className="btn objective-card--add-kr-button"
                onClick={addKR}
              >
                <span className="objective-card--add-kr-text mr-1">Add KR</span>
                <AddIconText className="objective-card--edit-icon" />
              </button>
            </>
          )}
        </Col>
        <Col xs={2} className="text-center">
          <span className="objective-card--text">
            {props.objectiveEndDate}
          </span>
        </Col>
        <Col xs={3} className="objective-card--progress-bar">
          ProgressBar here
        </Col>
      </Row>
    </div>
  );
}