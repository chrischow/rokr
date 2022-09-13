import { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion'
import { useQueryClient } from 'react-query';
import { getDate } from '../../../../../../utils/dates';
import { AddIconText } from '../../../../../../shared/Icons';
import UpdateForm from '../../../../../../shared/UpdateForm';

import './styles.css';

export default function QuickAddUpdate(props) {
  
  // Default form values
  const defaultFormValues = {
    updateText: '',
    updateDate: getDate(new Date()),
    parentKrId: props.krId,
    team: props.team
  };

  // State
  const [formToggle, setFormToggle] = useState(null);
  const [updateFormValues, setUpdateFormValues] = useState(defaultFormValues)

  // Create query client
  const queryClient = useQueryClient();

  // Invalidate and refetch
  const invalidateAndRefetch = () => {
    queryClient.invalidateQueries(['updates', 'team', props.team], { refetchInactive: true });
    queryClient.invalidateQueries(['updates', 'kr', props.krId], { refetchInactive: true });
  };

  // Toggle accordion
  const toggleForm = () => {
    const newFormToggle = formToggle === 'open' ? null : 'open';
    setFormToggle(newFormToggle);
  }
  // Close accordion
  const formCleanup = () => {
    // Invalidate and refetch data
    invalidateAndRefetch();

    // Reset form
    setUpdateFormValues(defaultFormValues);
    
    // Close collapsible
    setFormToggle(null);
  }
  
  return (
    <div className="mt-4">
      <Accordion activeKey={formToggle}>
        <Accordion.Item eventKey="open">
          <Accordion.Header
            onClick={toggleForm}
            className="quick-add-update--header"
          >
            <div className="d-flex align-items-end">
              <AddIconText className="btn-okr-toggle-icon" />
              <span className="ms-1">Add Update</span>
            </div>
          </Accordion.Header>
          <Accordion.Body>
            <UpdateForm 
              formValues={updateFormValues}
              setFormValues={setUpdateFormValues}
              formCleanup={formCleanup}
              size="sm"
              mode='new'
            />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}