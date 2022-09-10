import { useState } from 'react';
import useToken from '../hooks/useToken';
import { deleteQuery } from '../../utils/query';
import { config } from '../../config';


export default function DeleteForm(props) {
  // Get token
  const token = useToken();

  // Submit button enabled state
  const [submitEnabled, setSubmitEnabled] = useState(true);

  // Delete
  const confirmDelete = () => {
    // Disable button
    setSubmitEnabled(false);

    // Get token
    const reqDigest = token.isSuccess && token.data.FormDigestValue;

    // Get list IDs
    const { objListId, krListId, updateListId } = config;

    // Delete data
    if (props.itemType === 'Objective') {
      // Delete updates first
      if (props.updateIds.length > 0) {
        props.updateIds.map(updateId => {
          console.log(`Deleted Update Id=${updateId}`);
        });
      }

      // Delete key results first
      if (props.keyResultIds.length > 0) {
        props.keyResultIds.map(krId => {
          console.log(`Deleted KR Id=${krId}`);
        });
      }

      // Delete objective and close modal
      console.log(`Deleted Objective Id=${props.Id}`);
      alert('Fake-deleted items. Check the console.')
      props.closeModal();
    } else if (props.itemType === 'Key Result') {
      // Delete updates first
      if (props.updateIds.length > 0) {
        props.updateIds.map(updateId => {
          console.log(`Deleted Update Id=${updateId}`);
        });
      }

      // Delete key result and close modal
      console.log(`Deleted KR Id=${props.Id}`);
      alert('Fake-deleted items. Check the console.')
      props.closeModal();
    } else {
      // Delete update and close modal
      console.log(`Deleted Update Id=${props.Id}`);
      alert('Fake-deleted items. Check the console.')
      props.closeModal();
    }
  };

  // Get text to display
  const nKeyResults = props.keyResultIds && props.keyResultIds.length;
  const textKeyResults = props.keyResultIds && `Key Result${nKeyResults > 1 ? "s " : " "}`
  const nUpdates = props.updateIds && props.updateIds.length;
  const textUpdates = props.updateIds && `Update${nUpdates > 1 ? "s " : " "}`
  
  return (
    <div className="text-center mt-3 mb-3">
      <h5>You are about to delete the following {props.itemType}:</h5>
      <div className="mt-4 mb-4">
        <h3 className="text-grey">{props.Title}</h3>
      </div>
      {((props.keyResultIds && nKeyResults > 0) || (props.updateIds && nUpdates > 0)) &&
        <div className="mb-3 text-center">
          <div style={{ fontSize: '1.2rem', fontWeight: 'light' }}>
            <span className="text-red" style={{ fontWeight: 'bold' }}>Warning: </span>
            This item has 
            {props.keyResultIds && nKeyResults > 0 && 
              <>
                <span className="text-red"> {nKeyResults}</span> {textKeyResults}
              </>
            }
            {props.updateIds && nUpdates > 0 &&
              <>
                {props.keyResultIds && props.updateIds && `and`}
                <span className="text-red"> {nUpdates}</span> {textUpdates}
              </>
            }
            that will be deleted as well.
          </div>
        </div>
      }
      <div className="mt-3">
        <button
          className="btn btn-red"
          onClick={() => {
            confirmDelete();
          }}
          disabled={!submitEnabled}
        >
          {`Yes, Delete ${props.itemType}${(nKeyResults || nUpdates) ? " and its related items." : "."}`}
        </button>
      </div>
    </div>
  );
}