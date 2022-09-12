import { useState } from "react";
import { useQueryClient } from "react-query";
import slugify from "slugify";
import ObjectiveForm from "../../../../shared/ObjectiveForm";

export default function ObjectiveAdd(props) {
  // Create query client
  const queryClient = useQueryClient();

  // Form values
  const defaultObjectiveValues = {
    Title: '',
    objectiveDescription: '',
    objectiveStartDate: props.startDate,
    objectiveEndDate: props.endDate,
    frequency: props.freq,
    team: props.teamName,
    owner: props.staffOption ? props.staffOption : ''
  };

  // Form state
  const [objectiveFormValues, setObjectiveFormValues] = useState({...defaultObjectiveValues});
  
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
    // props.setObjectiveFormValues({...props.defaultValues});
    
    // Close modal
    props.setShowObjectiveModal(false);
  }
  
  return <ObjectiveForm
      formValues={objectiveFormValues}
      setFormValues={setObjectiveFormValues}
      formCleanup={formCleanup}
      mode='new'
    />;
}