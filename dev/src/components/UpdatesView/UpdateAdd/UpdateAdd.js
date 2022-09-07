import { useState } from "react";
import { useQueryClient } from "react-query";
import { getDate } from "../../../utils/dates";
import UpdateForm from "../UpdateForm/UpdateForm";

export default function UpdateAdd(props) {

  // Create query client
  const queryClient = useQueryClient();

  // Invalidate and refetch
  const invalidateAndRefetch = () => {
    queryClient.invalidateQueries('updates', { refetchInactive: true });
    queryClient.refetchQueries({ stale: true, active: true, inactive: true });
  };

  // Form cleanup
  const formCleanup = () => {
    // Invalidate and refetch data
    invalidateAndRefetch();

    // Reset form
    props.setUpdateAddFormValues({...props.defaultFormValues});

    // Close modal
    props.setShowUpdateAddModal(false);
  }

  return <UpdateForm
    setFormValues={props.setUpdateAddFormValues}
    formValues={props.updateAddFormValues}
    invalidateAndRefetch={invalidateAndRefetch}
    formCleanup={formCleanup}
    mode="new"
  />
}