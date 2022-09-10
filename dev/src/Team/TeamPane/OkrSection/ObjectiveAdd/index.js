import { useQueryClient } from "react-query";
import slugify from "slugify";
import ObjectiveForm from "../../../../shared/ObjectiveForm";

export default function ObjectiveAdd(props) {
  // Create query client
  const queryClient = useQueryClient();

  // Invalidate and refetch
  const invalidateAndRefetch = () => {
    // queryClient.invalidateQueries('objectives', { refetchInactive: true });
    queryClient.invalidateQueries([`objectives-${slugify(props.team)}`], { refetchInactive: true });
    queryClient.refetchQueries({ stale: true, active: true, inactive: true });
  };

  // Form cleanup
  const formCleanup = () => {
    // Invalidate and refetch data
    invalidateAndRefetch();

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