import { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion'
import { useQueryClient } from 'react-query';
import { IconContext } from 'react-icons';
import { RiAddFill } from 'react-icons/ri';
import { getDate } from '../../../../../../shared/utils/dates';
import { UpdateFormValues } from '../../../../../../shared/types';
import UpdateForm from '../../../../../../shared/UpdateForm';
import './styles.css';

interface QuickAddUpdateProps {
  krId: number;
  team: string;
}

export default function QuickAddUpdate(props: QuickAddUpdateProps) {

  // Default form values
  const defaultFormValues = {
    updateText: '',
    updateDate: getDate(new Date()),
    parentKrId: props.krId,
    team: props.team
  };

  // State
  const [formToggle, setFormToggle] = useState<string | null>(null);
  const [updateFormValues, setUpdateFormValues] = useState<UpdateFormValues | null>(defaultFormValues)

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
              <IconContext.Provider value={{ className: "btn-okr-toggle-icon" }}>
                <RiAddFill />
              </IconContext.Provider>
              <span className="ms-1">Add Update</span>
            </div>
          </Accordion.Header>
          <Accordion.Body>
            {updateFormValues && 
              <UpdateForm
                formValues={updateFormValues}
                setFormValues={setUpdateFormValues}
                formCleanup={formCleanup}
                size="sm"
                mode='new'
              />
            }
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}