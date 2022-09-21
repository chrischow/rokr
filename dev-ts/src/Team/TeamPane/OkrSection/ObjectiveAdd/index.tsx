import { useState } from "react";
import { useQueryClient } from "react-query";
import ObjectiveForm from "../../../../shared/ObjectiveForm";

interface ObjectiveAddProps {
  startDate: string;
  endDate: string;
  freq: string;
  team: string;
  staffOption: string;
  setShowObjectiveModal: Function;
}

export default function ObjectiveAdd(props: ObjectiveAddProps) {
  // Create query client
  const queryClient = useQueryClient();

  // Form values
  const defaultObjectiveValues = {
    Title: '',
    objectiveDescription: '',
    objectiveStartDate: props.startDate,
    objectiveEndDate: props.endDate,
    frequency: props.freq,
    team: props.team,
    owner: props.staffOption ? props.staffOption : ''
  };

  // Form state
  const [objectiveFormValues, setObjectiveFormValues] = useState({...defaultObjectiveValues});
  
  // Invalidate and refetch
  const invalidateAndRefetch = () => {
    queryClient.invalidateQueries(['objectives', 'team', props.team], { refetchInactive: true });
  };

  // Form cleanup
  const formCleanup = () => {
    // Invalidate and refetch data
    invalidateAndRefetch();
    
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