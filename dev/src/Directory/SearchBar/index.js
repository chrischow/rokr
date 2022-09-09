import Form from 'react-bootstrap/Form';
import './styles.css'

export const SearchBar = (props) => {
  // Function to handle change in keywords
  const handleChange = (event) => {
    props.setQueryString(event.target.value.toLowerCase());
  }

  return (
    <Form onSubmit={(event) => event.preventDefault()}>
      <Form.Control 
        type="text"
        value={props.queryString}
        placeholder={props.placeholder}
        className="searchbar--bar mx-auto"
        onChange={handleChange}>
      </Form.Control>
    </Form>
  );
}