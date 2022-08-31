import { useState } from 'react';
import KeyResultForm from '../../../KeyResultForm/KeyResultForm';

export default function KeyResultEdit(props) {

  // Form cleanup
  const formCleanup = () => {
    // Invalidate and refetch data
    props.invalidateAndRefetch();

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
    invalidateAndRefetch={props.invalidateAndRefetch}
    mode="edit"
  />
}