import { useQueryClient } from 'react-query';
import slugify from 'slugify';
import KeyResultForm from '../../../../../../shared/KeyResultForm';

export default function KeyResultEdit(props) {

  // Create query client
  const queryClient = useQueryClient()

  // Invalidate and refetch
  const invalidateAndRefetch = () => {
    // queryClient.invalidateQueries('keyResults', { refetchInactive: true });
    queryClient.invalidateQueries([`keyResults-${slugify(props.team)}`], { refetchInactive: true });
    queryClient.refetchQueries({ stale: true, active: true, inactive: true });
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