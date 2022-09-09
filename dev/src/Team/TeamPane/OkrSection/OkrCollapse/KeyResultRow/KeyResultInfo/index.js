import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { formatDate, getDate } from '../../../../../../utils/dates';
import { EditIconText } from '../../../../../../shared/Icons';
import { useTeamUpdates } from '../../../../../../shared/hooks/useUpdates';
import QuickAddUpdate from '../QuickAddUpdate';

import './styles.css';

export default function KeyResultInfo(props) {

  
  // Get data
  const updates = useTeamUpdates(props.team);
  
  // QUICK FIX: Somehow, the data table only renders when the updates data is held in
  // state. So, we process the data after querying it and feed this into the
  // table for its initial load.
  const [initialData, setInitialData] = useState([]);
  useEffect( () => {
    if (updates.isSuccess) {
      let newUpdates = updates.data.filter(update => {
        return update.parentKrId === props.Id;
      });
      setInitialData(newUpdates);
    };
  }, [updates.isSuccess]);

  // Get dates
  const startDate = formatDate(props.startDate);
  const endDate = formatDate(props.endDate);

  // Update table everytime the table is populated
  const table = $('#kr-info-table');

  useEffect(
    () => {
      if (updates.isSuccess && updates.data.length > 0) {
        const updateData = updates.data.filter(update => {
          return update.parentKrId === props.Id;
        }).map(update => {
          return {...update, updateDate: getDate(update.updateDate)};
        });

        $(function () {
          if (!$.fn.dataTable.isDataTable("#kr-info-table")) {
            table.DataTable().destroy();
            table.DataTable({
              autoWidth: false,
              pageLength: 5,
              displayStart: 0,
              lengthMenu: [5, 10, 25, 50],
              order: [[0, "desc"]],
              fixedColumns: true,
              columnDefs: [
                {
                  width: "18%",
                  name: "updateDate",
                  targets: 0,
                  data: "updateDate",
                  className: "text-center",
                },
                {
                  width: "82%",
                  name: "updateText",
                  targets: 1,
                  data: "updateText",
                },
              ],
            });
            table.DataTable().clear().draw();
            table.DataTable().rows.add(initialData).draw();
          } else {
            table.DataTable().clear().draw();
            table.DataTable().rows.add(updateData).draw();
          }
        });
      }
    }, [updates, initialData]
  );

  // Revert to table page
  function resetTableView() {
    table.DataTable().page.len(5).draw(true);
    table.DataTable().page(0);
  };
  
  // Link to updates page
  const navigate = useNavigate();
  const editUpdates = () => navigate(`/updates/${props.Id}`);

  return (
    <>
      <div className="kr-info--panel">
        <Row className="align-items-center">
          <Col xs={9} className="kr-info--main-col">
            <h3 className="kr-info--header">
              <span className="me-3 text-green">
                {props.Title}
              </span>
            </h3>
            <div className="kr-info--subheader">
              <span>{`${startDate} - ${endDate}`}</span>
            </div>
            <div className="kr-info--description">
              {props.krDescription}
            </div>
          </Col>
          <Col xs={3} className="ps-4 text-center">
            <div className="align-items-center justify-content-center text-center d-flex">
              <span className="progress-card--metric-sm">
                {props.currentValue}
              </span>
              <span className="ps-3 pe-3 progress-card--metric-between-sm">
                /
              </span>
              <span className="progress-card--metric-sm">
                {props.maxValue}
              </span>
            </div>
            <Col className="text-center">
              <span className="progress-card--metric-title-sm">
                Completed
              </span>
            </Col>
          </Col>
        </Row>
      </div>

      <div className="kr-info--update-panel">
        <h3 className="kr-info--tag-text mb-4 align-items-center">
          <span className="me-4">Updates</span>
          <button className="btn kr-info--edit-button" onClick={editUpdates}>
            <span className="kr-info--edit-text me-1">Edit</span>
            <EditIconText className="kr-info--edit-icon" />
          </button>
        </h3>
        {updates.isSuccess &&
          <table
            className="table table-dark table-striped kr-info--table w-100"
            id="kr-info-table"
          >
            <thead className="thead-dark">
              <tr>
                <th className="text-center">Date</th>
                <th className="text-center">Update</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>}
        {!updates.isSuccess && "No data available."}
        <QuickAddUpdate 
          krId={props.Id}
          team={props.parentObjective.team}
        />
      </div>
    </>
  );
}