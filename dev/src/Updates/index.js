import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "react-query";
import { useKeyResult } from "../shared/hooks/useKeyResults";
import { useKrUpdatesDirect } from "../shared/hooks/useUpdates";
import { getDate } from "../utils/dates";
import SharedModal from "../shared/SharedModal";
import UpdatesTable from "./UpdatesTable";
import UpdateAdd from "./UpdateAdd";
import UpdateEdit from "./UpdateEdit";
import DeleteForm from "../shared/DeleteForm";


export default function Updates(props) {

  // Create query client
  const queryClient = useQueryClient();

  // Invalidate and refetch
  const invalidateAndRefetch = () => {
    queryClient.invalidateQueries(['updates', krId], { refetchInactive: true });
    team && queryClient.invalidateQueries(['updates', team], { refetchInactive: true });
    queryClient.refetchQueries({ stale: true, active: true, inactive: true });
  };

  // State
  const [updateAddFormValues, setUpdateAddFormValues] = useState({});
  const [defaultAddUpdateValues, setDefaultAddUpdateValues] = useState({});
  const [updateEditFormValues, setUpdateEditFormValues] = useState({});
  const [showUpdateAddModal, setShowUpdateAddModal] = useState(false);
  const [showUpdateEditModal, setShowUpdateEditModal] = useState(false);
  const [showUpdateDeleteModal, setShowUpdateDeleteModal] = useState(false);
  const [team, setTeam] = useState('');
  
  // Get data
  const { krId } = useParams();
  const keyResult = useKeyResult(krId);
  const updates = useKrUpdatesDirect(krId);

  // Initialise variables once data is loaded
  useEffect(() => {
    if (keyResult.isSuccess) {
      // Default add form values
      const data = {
        updateText: '',
        updateDate: getDate(new Date()),
        parentKrId: krId,
        team: keyResult.data.parentObjective.team
      };
      setUpdateAddFormValues(data);
      setDefaultAddUpdateValues(data);
      setTeam(keyResult.data.parentObjective.team);
    }
  }, [keyResult.isSuccess])

  // Navigation
  const navigate = useNavigate();
  const backToTeamPage = () => {
    if (team) {
      navigate(`/${team}`);
    }
  }
  
  // ADD FORM
  // Add Update Form
  const addUpdate = () => {
    return <UpdateAdd
      updateAddFormValues={updateAddFormValues}
      setUpdateAddFormValues={setUpdateAddFormValues}
      setShowUpdateAddModal={setShowUpdateAddModal}
      defaultFormValues={defaultAddUpdateValues}
      invalidateAndRefetch={invalidateAndRefetch}
      krId={krId}
    />;
  }

  // Close add update modal
  const handleCloseUpdateAddModal = () => {
    // Reset form
    setUpdateAddFormValues({...defaultAddUpdateValues});
    setShowUpdateAddModal(false);
  };

  // EDIT FORM
  const launchEditModal = (update) => {
    // Show modal
    setShowUpdateEditModal(true);
    // Populate edit modal form
    setUpdateEditFormValues(update);
  };

  // Close edit update modal
  const handleCloseUpdateEditModal = () => {
    // Reset form
    if (showUpdateDeleteModal) {
      setUpdateEditFormValues({});
    }
    setShowUpdateEditModal(false);
  };

  const editUpdate = () => {
    return <UpdateEdit
      updateEditFormValues={updateEditFormValues}
      setUpdateEditFormValues={setUpdateEditFormValues}
      setShowUpdateEditModal={setShowUpdateEditModal}
      invalidateAndRefetch={invalidateAndRefetch}
      closeModal={handleCloseUpdateEditModal}
      openDeleteModal={() => setShowUpdateDeleteModal(true)}
      krId={krId}
    />
  };

  // DELETE UPDATE FORM
  // Close delete modal
  const handleCloseUpdateDeleteModal =() => {
    setShowUpdateDeleteModal(false);
  };

  const deleteUpdate = () => {
    return <DeleteForm
      Id={updateEditFormValues.Id}
      Title={updateEditFormValues.updateText}
      itemType='Update'
      invalidateUpdates={invalidateAndRefetch}
      closeModal={handleCloseUpdateDeleteModal}
    />;
  };

  return (
    <>
      <h1>Key Result Updates</h1>
      {keyResult.isSuccess &&
        <h3>
          {keyResult.data.Title} -
          <span className="text-green"> {keyResult.data.parentObjective.team}</span>
        </h3>
      }
      <div className="mt-4">
        <button className="btn btn-blue mr-3" onClick={() => setShowUpdateAddModal(true)}>Add Update</button>
        <button className="btn btn-secondary float-end" onClick={backToTeamPage}>
          Back to Team Page
        </button>
      </div>
      <div className="directory--container mt-4">
        {updates.isSuccess && <UpdatesTable
          updateData={updates.data}
          launchEditModal={launchEditModal}
        />}
      </div>
      <SharedModal
        modalTitle="New Update"
        show={showUpdateAddModal}
        onHide={() => setShowUpdateAddModal(false)}
        renderModalContent={() => addUpdate()}
        handleCloseModal={handleCloseUpdateAddModal}
      />
      <SharedModal
        modalTitle="Edit Update"
        show={showUpdateEditModal}
        onHide={() => setShowUpdateEditModal(false)}
        renderModalContent={() => editUpdate()}
        handleCloseModal={handleCloseUpdateEditModal}
      />
      <SharedModal
        modalTitle="Delete Update"
        show={showUpdateDeleteModal}
        onHide={() => setShowUpdateDeleteModal(false)}
        renderModalContent={() => deleteUpdate()}
        handleCloseModal={handleCloseUpdateDeleteModal}
      />
    </>
  );
}