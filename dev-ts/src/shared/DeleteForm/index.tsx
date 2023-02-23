import { useState } from 'react';
import useToken from '../hooks/useToken';
import { deleteQuery } from '../../shared/utils/query';
import { config } from '../../config';

interface DeleteFormProps {
  Title: string;
  itemType: string;
  closeModal: Function;
  Id?: number;
  keyResultIds?: number[];
  updateIds?: number[];
  invalidateUpdates?: Function | null;
  invalidateKeyResults?: Function | null;
  invalidateObjectives?: Function | null;
}

export default function DeleteForm(props: DeleteFormProps) {
  // Get token
  const token = useToken();

  // Submit button enabled state
  const [submitEnabled, setSubmitEnabled] = useState<boolean>(true);

  // Delete functions
  const deleteUpdates = (
    updateIds: number[],
    updateListId: string,
    reqDigest: string,
    callback: Function|null|undefined
  ) => {
    if (updateIds.length > 0) {
      updateIds.forEach(updateId => {
        deleteQuery(updateListId, updateId, reqDigest, callback)
      });
    }
  };

  // Delete
  const confirmDelete = () => {
    // Disable button
    setSubmitEnabled(false);

    // Get token
    const reqDigest = token.isSuccess && token.data.FormDigestValue;

    // Get list IDs
    const { objListTitle: objListId, krListTitle: krListId, updateListTitle: updateListId } = config;

    // Delete data
    if (props.itemType === 'Objective' && props.updateIds) {
      // Delete updates first
      deleteUpdates(props.updateIds, updateListId, reqDigest, props.invalidateUpdates);

      // Delete key results first
      if (props.keyResultIds && props.keyResultIds.length > 0) {
        props.keyResultIds.forEach(krId => {
          deleteQuery(krListId, krId, reqDigest, props.invalidateKeyResults);
        });
      }

      // Delete objective and close modal
      props.Id && deleteQuery(objListId, props.Id, reqDigest, () => {
        props.invalidateObjectives && props.invalidateObjectives();
        props.closeModal();
      });
    } else if (props.itemType === 'Key Result' && props.updateIds) {
      // Delete updates first
      deleteUpdates(props.updateIds, updateListId, reqDigest, props.invalidateUpdates);

      // Delete key result
      props.Id && deleteQuery(krListId, props.Id, reqDigest, () => {
        props.invalidateKeyResults && props.invalidateKeyResults();
        props.closeModal();
      });
    } else {
      props.Id && deleteQuery(updateListId, props.Id, reqDigest, props.invalidateUpdates);
      props.closeModal();
    }
  };

  // Get text to display
  const nKeyResults = props.keyResultIds && props.keyResultIds.length;
  const textKeyResults = props.keyResultIds && nKeyResults && `Key Result${nKeyResults > 1 ? "s " : " "}`
  const nUpdates = props.updateIds && props.updateIds.length;
  const textUpdates = props.updateIds && nUpdates && `Update${nUpdates > 1 ? "s " : " "}`
  return (
    <div className="text-center mt-3 mb-3">
      <h5>You are about to delete the following {props.itemType}:</h5>
      <div className="mt-4 mb-4">
        <h3 className="text-grey">{props.Title}</h3>
      </div>
      {((props.keyResultIds && nKeyResults != null && nKeyResults > 0) || (props.updateIds && nUpdates != null && nUpdates > 0)) &&
        <div className="mb-3 text-center">
          <div style={{ fontSize: '1.2rem', fontWeight: 'light' }}>
            <span className="text-red" style={{ fontWeight: 'bold' }}>Warning: </span>
            This item has 
            {props.keyResultIds && nKeyResults && nKeyResults > 0 && 
              <>
                <span className="text-red"> {nKeyResults}</span> {textKeyResults}
              </>
            }
            {props.updateIds && nUpdates && nUpdates > 0 &&
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
            console.log(`Delete Id=${props.Id}, ${props.Title}`);
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