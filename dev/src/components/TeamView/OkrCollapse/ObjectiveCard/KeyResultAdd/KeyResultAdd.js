import KeyResultForm from "../../../KeyResultForm/KeyResultForm";

export default function KeyResultAdd(props) {
  // Form cleanup
  const formCleanup = () => {
    // Invalidate and refetch data
    props.invalidateAndRefetch();

    // Reset form
    props.setKrFormValues({...props.defaultKrValues});

    // Close modal
    props.setShowKrAddModal(false);
  }

  return <KeyResultForm
      formValues={props.krFormValues}
      setFormValues={props.setKrFormValues}
      objectiveOptions={props.objectiveOptions}
      selectDisabled={true}
      formCleanup={formCleanup}
      invalidateAndRefetch={props.invalidateAndRefetch}
      mode="new"
    />

}