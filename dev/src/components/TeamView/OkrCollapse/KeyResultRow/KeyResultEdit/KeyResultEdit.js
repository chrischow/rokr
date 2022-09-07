import { useState } from 'react';
import { useQueryClient } from 'react-query';
import slugify from 'slugify';
import KeyResultForm from '../../../KeyResultForm/KeyResultForm';

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
    mode="edit"
  />
}