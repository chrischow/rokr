import ObjectiveForm from "../../ObjectiveForm/ObjectiveForm";

export default function ObjectiveAdd(props) {
  // Form cleanup
  const formCleanup = () => {
    // Invalidate and refetch data
    props.invalidateAndRefetch();

    // Reset form
    props.setObjectiveFormValues({
      Title: '',
      objectiveDescription: '',
      objectiveStartDate: props.startDate,
      objectiveEndDate: props.endDate,
      frequency: props.freq,
      team: props.teamName,
      owner: props.staffOption ? props.staffOption : ''
    });
    
    // Close modal
    props.setShowObjectiveModal(false);
  }
  
  return <ObjectiveForm
      formValues={props.objectiveFormValues}
      setFormValues={props.setObjectiveFormValues}
      formCleanup={formCleanup}
      mode='new'
    />;
}