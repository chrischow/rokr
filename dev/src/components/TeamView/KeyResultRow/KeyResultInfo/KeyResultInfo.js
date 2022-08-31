import { useEffect, useState } from 'react';
import $ from 'jquery';
import { EditIcon, EditIconText, AddIconText } from '../../../Icons/Icons';
import { formatDate } from '../../../../utils/dates';
import { useTeamUpdates } from '../../../../hooks/useUpdates';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './KeyResultInfo.css';

export default function KeyResultInfo(props) {

  // State data
  const [updateData, setUpdateData] = useState([]);

  // Get data
  const updates = useTeamUpdates(props.team);

  useEffect( () => {
    if (updates.isSuccess) {
      let newUpdates = updates.data.filter(update => {
        return update.parentKrId === props.Id;
      });
      
      setUpdateData(newUpdates);
    };
  }, [])

  // Get dates
  const startDate = formatDate(props.startDate);
  const endDate = formatDate(props.endDate);

  // Update table everytime the table is populated
  const table = $('#kr-info-table');

  useEffect(
    () => {
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

          table.DataTable().rows.add(updateData).draw();
        } else {
          table.DataTable().clear();
          table.DataTable().rows.add(updateData).draw();
        }
      });
    }, [updateData]
  );

  // Revert to table page
  function resetTableView() {
    table.DataTable().page.len(5).draw(true);
    table.DataTable().page(0);
  };

  return (
    <>
      <div className="kr-info--panel">
        <Row className="align-items-center">
          <Col xs={9} className="kr-info--main-col">
            <h3>
              <span className="me-3 text-green">
                {props.Title}
              </span>
              {/* <div style={{ display: 'inline-block', cursor: 'pointer', transition: '0.3s' }}>
                <EditIcon />
              </div> */}
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
          <button className="btn kr-info--edit-button">
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
      </div>
    </>
  );
}