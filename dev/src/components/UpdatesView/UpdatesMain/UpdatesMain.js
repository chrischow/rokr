import { useParams } from "react-router-dom";
import { useKeyResult } from "../../../hooks/useKeyResults";
import { useKrUpdates } from "../../../hooks/useUpdates";


export default function UpdatesMain(props) {
  // Get data
  const { krId } = useParams();
  const keyResult = useKeyResult(krId);
  const updates = useKrUpdates(krId);
  keyResult.isSuccess && console.log(keyResult.data);
  updates.isSuccess && console.log(updates.data);

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
        <button className="btn btn-blue mr-3">Add Update</button>
        <button className="btn btn-secondary float-end">Back to Team Page</button>
      </div>
      <div className="directory--container mt-4">
        Table here
      </div>
    </>
  );
}