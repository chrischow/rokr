import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useKeyResult } from "../../../hooks/useKeyResults";
import { useKrUpdates } from "../../../hooks/useUpdates";
import { getDate } from "../../../utils/dates";
import SharedModal from "../../SharedModal/SharedModal";
import UpdatesTable from "../UpdatesTable/UpdatesTable";
import UpdateAdd from "../UpdateAdd/UpdateAdd";
import UpdateEdit from "../UpdateEdit/UpdateEdit";


export default function UpdatesMain(props) {

  // State
  const [updateAddFormValues, setUpdateAddFormValues] = useState({});
  const [defaultAddUpdateValues, setDefaultAddUpdateValues] = useState({});
  const [updateEditFormValues, setUpdateEditFormValues] = useState({});
  const [showUpdateAddModal, setShowUpdateAddModal] = useState(false);
  const [showUpdateEditModal, setShowUpdateEditModal] = useState(false);
  const [team, setTeam] = useState('');
  
  // Get data
  const { krId } = useParams();
  const keyResult = useKeyResult(krId);
  const updates = useKrUpdates(krId);

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

  const editUpdate = () => {
    return <UpdateEdit
      updateEditFormValues={updateEditFormValues}
      setUpdateEditFormValues={setUpdateEditFormValues}
      setShowUpdateEditModal={setShowUpdateEditModal}
    />
  };

  // Close edit update modal
  const handleCloseUpdateEditModal = () => {
    // Reset form
    setUpdateEditFormValues({});
    setShowUpdateEditModal(false);
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
    </>
  );
}