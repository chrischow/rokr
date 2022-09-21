import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './styles.css';

interface ProgressBarProps {
  progress: number;
  isKeyResult: boolean;
}

export default function ProgressBar(props: ProgressBarProps) {
  const progressNow = Math.floor(100 * Number(props.progress));
  const progressNowString = String(progressNow ? progressNow : 0) + '%';

  const progressStyle = {
    width: progressNowString
  };

  const progressClass = props.isKeyResult ? "progress progress-keyresult" : "progress";
  const progressBarClass = props.isKeyResult ? "progress-bar progress-keyresult" : "progress-bar";
  const progressBarText = props.isKeyResult ? "progress-text-sm" : 'progress-text';

  return (
    <Row className="align-items-center">
      <Col xs={9}>
        <div className={progressClass}>
          <div
            className={progressBarClass}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressNow}
            style={progressStyle}
          ></div>
        </div>
      </Col>
      <Col xs={3} className="text-center">
        <span className={progressBarText}>{progressNowString}</span>
      </Col>
    </Row>
  );
}