import { useQueryClient } from "react-query";
import UpdateForm from "../UpdateForm/UpdateForm";

export default function UpdateEdit(props) {

  // Create query client
  const queryClient = useQueryClient();

  // Invalidate and refetch
  const invalidateAndRefetch = () => {
    queryClient.invalidateQueries(['updates', props.krId], { refetchInactive: true });
    queryClient.refetchQueries({ stale: true, active: true, inactive: true });
  };

  // Form cleanup
  const formCleanup = () => {
    // Invalidate and refetch data
    invalidateAndRefetch();

    // Reset form
    // props.setUpdateEditFormValues({});

    // Close modal
    props.setShowUpdateEditModal(false);
  }

  return <UpdateForm
    setFormValues={props.setUpdateEditFormValues}
    formValues={props.updateEditFormValues}
    invalidateAndRefetch={invalidateAndRefetch}
    formCleanup={formCleanup}
    mode="edit"
  />
}