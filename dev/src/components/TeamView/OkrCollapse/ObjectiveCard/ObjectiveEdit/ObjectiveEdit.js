import ObjectiveForm from "../../../ObjectiveForm/ObjectiveForm";

export default function ObjectiveEdit(props) {

  // Objective form cleanup
  const formCleanup = () => {
    // Invalidate and refetch data
    props.invalidateAndRefetch();

    // Close modal
    props.setShowObjectiveEditModal(false);
  };

  return <ObjectiveForm
    formValues={props.objectiveFormValues}
    setFormValues={props.setObjectiveFormValues}
    team={props.team}
    freq={props.frequency}
    formCleanup={formCleanup}
    mode='edit'
  />;

}