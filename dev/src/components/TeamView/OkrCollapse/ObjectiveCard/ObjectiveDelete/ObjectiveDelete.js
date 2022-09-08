import DeleteForm from "../../../DeleteForm/DeleteForm";

export default function ObjectiveDelete(props) {
  if (props.nKeyResults > 0) {
    return (
      <div className="mt-5 mb-5 text-center">
        <div style={{ fontSize: '1.2rem', fontWeight: 'light' }}>
          This objective has <span className="text-red">{props.nKeyResults}</span> {`Key Result${props.nKeyResults > 1 ? "s" : ""}`} attached.<br />
          Please review and delete {props.nKeyResults > 1 ? "them" : "it"} first.
        </div>
      </div>
    );
  } else {
    return <DeleteForm 
      Id={props.Id}
      Title={props.Title}
      itemType="Objective"
      closeModal={props.closeModal}
    />
  }
}