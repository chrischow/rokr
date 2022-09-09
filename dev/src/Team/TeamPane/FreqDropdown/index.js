import slugify from 'slugify';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import './styles.css';

export default function FreqDropdown(props) {

  // Handle updates
  const handleChange = (event) => {
    props.setDateOption(event.target.value);
  }

  // Populate options
  const options = props.options.map(option => {
    return <option key={`select-${props.freq}-${slugify(option)}`} value={option}>{option}</option>
  });

  return (
    <Row className="justify-content-center mt-3">
      <Col xs={3}>
        <select
          name={`subgroup-select-${props.freq}`}
          className="form-control form-dark nav-subgroup-dropdown"
          value={props.dateOption}
          onChange={handleChange}
        >
          {options}
        </select>
      </Col>
    </Row>
  );
}