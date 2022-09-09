import useToken from '../../../hooks/useToken';
import { deleteQuery } from '../../../utils/query';
import { config } from '../../../config';


export default function DeleteForm(props) {
  // Get token
  const token = useToken();
  console.log(props.keyResultIds);
  console.log(props.updateIds);
  // Delete
  const confirmDelete = () => {
    // Get token
    const reqDigest = token.isSuccess && token.data.FormDigestValue;
    
    // Get list IDs
    const { objListId, krListId } = config;

    // Delete data
    if (props.itemType === 'Objective') {
      // Delete key results first
      if (props.keyResultIds.length > 0){
        props.keyResultIds.map(krId => {
          deleteQuery(krListId, krId, reqDigest, () => {
            props.invalidateKeyResults();
          });
        });
      }
      // Delete objective and close modal
      deleteQuery(objListId, props.Id, reqDigest, () => {
        props.invalidateObjectives();
        props.closeModal();
      });
    } else {
      // Delete key result
      deleteQuery(krListId, props.Id, reqDigest, () => {
        props.invalidateKeyResults();
      });
    }
  };

  return (
    <div className="text-center mt-3 mb-3">
      <h5>You are about to delete the following {props.itemType}:</h5>
      <div className="mt-4 mb-4">
        <h3 className="text-grey">{props.Title}</h3>
      </div>
      {props.keyResultIds.length > 0 && <div className="mb-3 text-center">
        <div style={{ fontSize: '1.2rem', fontWeight: 'light' }}>
        <span className="text-red" style={{fontWeight: 'bold'}}>Warning: </span>
         This Objective has <span className="text-red">{props.keyResultIds.length}</span> {`Key Result${props.keyResultIds.length > 1 ? "s" : ""}`} that will be deleted as well.
        </div>
      </div>}
      <div className="mt-3">
        <button
          className="btn btn-red"
          onClick={() => {
            console.log(`Delete Id=${props.Id}, ${props.Title}`);
            confirmDelete();
          }}
        >
          {`Yes, Delete ${props.itemType}${props.keyResultIds.length > 0 ? " and its Key Results" : ""}`}
        </button>
      </div>
    </div>
  );
}