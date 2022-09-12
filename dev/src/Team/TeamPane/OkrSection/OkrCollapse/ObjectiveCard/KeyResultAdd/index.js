import { useQueryClient } from "react-query";
import slugify from 'slugify';
import KeyResultForm from "../../../../../../shared/KeyResultForm";

export default function KeyResultAdd(props) {
  // Create query client
  const queryClient = useQueryClient();

  // Invalidate and refetch
  const invalidateAndRefetch = () => {
    // queryClient.invalidateQueries('keyResults', { refetchInactive: true });
    queryClient.invalidateQueries([`keyResults-${slugify(props.team)}`], { refetchInactive: true });
  };

  // Form cleanup
  const formCleanup = () => {
    // Invalidate and refetch data
    invalidateAndRefetch();

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
      invalidateAndRefetch={invalidateAndRefetch}
      mode="new"
    />

}