import { useNavigate } from 'react-router-dom';
import ProgressCard from '../../ProgressCard/ProgressCard';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function Card(props) {
  const navigate = useNavigate();
  const goToTeamPage = () => {
    return navigate('/' + props.slug);
  }

  return (
    <Col xs={6} className="card--outer" onClick={goToTeamPage}>
      <div className="card--inner">
        <h4 className="card--header text-center mb-3">{props.teamName}</h4>
        <ProgressCard progressId={props.slug} data={props.data} isTeam={true} />
      </div>
    </Col>
  );
}

// HomeCards
export default function HomeTeamCards(props) {
  var cards = props.teams.map(team => {
    if (team.teamName !== 'RAiD') {
      return (
        <Card
          teamName={team.teamName}
          key={`card-${team.slug}`}
          slug={team.slug}
          data={props.allTeamsProgressData[team.teamName]}
        />
      );
    }
  });

  return (
    <Row className="align-items-center mt-3 mx-auto">
      {cards}
    </Row>
  );
}