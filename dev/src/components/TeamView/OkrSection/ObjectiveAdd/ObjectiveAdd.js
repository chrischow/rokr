import ObjectiveForm from "../../ObjectiveForm/ObjectiveForm";

export default function ObjectiveAdd(props) {
  // Form cleanup
  const formCleanup = () => {
    // Invalidate and refetch data
    props.invalidateAndRefetch();

    // Reset form
    props.setObjectiveFormValues({...props.defaultValues});
    
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