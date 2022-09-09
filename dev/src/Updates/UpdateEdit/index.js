import UpdateForm from "../../shared/UpdateForm";

export default function UpdateEdit(props) {

  // Form cleanup
  const formCleanup = () => {
    // Invalidate and refetch data
    props.invalidateAndRefetch();

    // Reset form
    // props.setUpdateEditFormValues({});

    // Close modal
    props.setShowUpdateEditModal(false);
  }

  return <UpdateForm
    setFormValues={props.setUpdateEditFormValues}
    formValues={props.updateEditFormValues}
    invalidateAndRefetch={props.invalidateAndRefetch}
    formCleanup={formCleanup}
    closeModal={props.closeModal}
    openDeleteModal={props.openDeleteModal}
    mode="edit"
  />
}