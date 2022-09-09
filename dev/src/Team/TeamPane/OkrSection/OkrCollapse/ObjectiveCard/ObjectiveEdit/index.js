import { useQueryClient } from "react-query";
import slugify from "slugify";
import ObjectiveForm from "../../../ObjectiveForm";

export default function ObjectiveEdit(props) {
  // Create query client
  const queryClient = useQueryClient();

  // Invalidate and refetch
  const invalidateAndRefetch = () => {
    // queryClient.invalidateQueries('objectives', { refetchInactive: true });
    queryClient.invalidateQueries([`objectives-${slugify(props.team)}`], { refetchInactive: true });
    queryClient.refetchQueries({ stale: true, active: true, inactive: true });
  };

  // Objective form cleanup
  const formCleanup = () => {
    // Invalidate and refetch data
    invalidateAndRefetch();

    // Close modal
    props.setShowObjectiveEditModal(false);
  };

  return <ObjectiveForm
    formValues={props.objectiveFormValues}
    setFormValues={props.setObjectiveFormValues}
    team={props.team}
    freq={props.frequency}
    formCleanup={formCleanup}
    closeModal={props.closeModal}
    openDeleteModal={props.openDeleteModal}
    mode='edit'
  />;

}