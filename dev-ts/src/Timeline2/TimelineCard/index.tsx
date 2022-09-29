import { RiNodeTree } from 'react-icons/ri';
import { formatDate } from '../../shared/utils/dates';
import './styles.css';

interface ITimelineCard {
  objectiveTitle: string;
  krTitle: string;
  updateDate: string;
  updateText: string;
  team: string;
}

export default function TimelineCard(props: ITimelineCard) {
  // Get titles
  const objectiveTitle = `${props.objectiveTitle}${props.objectiveTitle.length > 47 ? '...' : ''}`
  const krTitle = `${props.krTitle}${props.krTitle.length > 47 ? '...' : ''}`

  return (
    <div className="mt-1 mb-1 timeline-card">
      <div className="timeline-card--title align-items-center">
        <strong>{props.team}</strong>
        <span className="text-grey ms-1 me-1">posted an update on</span>
        <span className="timeline-card--obj">
          {objectiveTitle}
        </span>
        <RiNodeTree className="text-grey ms-2 me-2" style={{ verticalAlign: 'bottom', marginBottom: '4px', display: 'inline' }} />
        <span className="timeline-card--kr">
          {krTitle}
        </span>
        <span className="ms-1 mt-1 text-grey">
          on {formatDate(props.updateDate)}.
        </span>
      </div>
      <div className="timeline-card--body mt-2">
        {props.updateText}
      </div>
    </div>
  );
}