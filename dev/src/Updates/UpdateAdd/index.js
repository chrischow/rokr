import UpdateForm from "../../shared/UpdateForm";

export default function UpdateAdd(props) {

  // Form cleanup
  const formCleanup = () => {
    // Invalidate and refetch data
    props.invalidateAndRefetch();

    // Reset form
    props.setUpdateAddFormValues({...props.defaultFormValues});

    // Close modal
    props.setShowUpdateAddModal(false);
  }

  return <UpdateForm
    setFormValues={props.setUpdateAddFormValues}
    formValues={props.updateAddFormValues}
    invalidateAndRefetch={props.invalidateAndRefetch}
    formCleanup={formCleanup}
    mode="new"
  />
}