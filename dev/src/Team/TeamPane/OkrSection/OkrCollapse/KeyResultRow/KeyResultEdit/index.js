import { useQueryClient } from 'react-query';
import KeyResultForm from '../../../../../../shared/KeyResultForm';

export default function KeyResultEdit(props) {

  // Create query client
  const queryClient = useQueryClient()

  // Invalidate and refetch
  const invalidateAndRefetch = () => {
    queryClient.invalidateQueries(['keyResults', 'team', props.team], { refetchInactive: true });
  };

  // Form cleanup
  const formCleanup = () => {
    // Invalidate and refetch data
    invalidateAndRefetch();

    // Close modal
    props.setShowKrEditModal(false);
  }

  // KR Form
  return <KeyResultForm
    formValues={props.krFormValues}
    setFormValues={props.setKrFormValues}
    objectiveOptions={props.objectiveOptions}
    selectDisabled={false}
    formCleanup={formCleanup}
    closeModal={props.closeModal}
    openDeleteModal={props.openDeleteModal}
    mode="edit"
  />
}