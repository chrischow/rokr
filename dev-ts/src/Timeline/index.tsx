import { useEffect } from 'react';
import { useKeyResults } from '../shared/hooks/useKeyResults';
import { useObjectives } from '../shared/hooks/useObjectives';
import { useUpdates } from '../shared/hooks/useUpdates';
import { getDate } from '../shared/utils/dates';
import { Objective, KeyResult, Update } from '../shared/types';
import $ from 'jquery';

import './styles.css';

export default function Timeline() {
  // Get data
  const objectives = useObjectives();
  const keyResults = useKeyResults();
  const updates = useUpdates();
  // rabz;
  // Prepare table data
  const tableData = (objectives.isSuccess && keyResults.isSuccess && updates.isSuccess) ?
    updates.data.map((update: Update) => {
      // Get key result
      const kr = keyResults.data.find((keyResult: KeyResult) => keyResult.Id === update.parentKrId);

      // Get objective
      const obj = objectives.data.find((objective: Objective) => objective.Id === kr.parentObjective.Id);

      return {
        ...update,
        krTitle: kr.Title,
        objectiveTitle: obj.Title,
        updateDate: getDate(update.updateDate)
      };
    }) : null;

  useEffect(() => {
    if (tableData && tableData.length > 0) {
      // DataTable settings
      const dataTableSettings = {
        autoWidth: false,
        pageLength: 25,
        displayStart: 0,
        lengthMenu: [10, 25, 50, 75, 100],
        order: [
          [0, 'desc'],
          [1, 'asc'],
          [2, 'asc'],
        ],
        fixedColumns: true,
        columnDefs: [
          { width: '15%', name: 'date', targets: 0, data: 'updateDate', className: "text-center" },
          { width: '25%', name: 'date', targets: 1, data: 'objectiveTitle' },
          { width: '25%', name: 'date', targets: 2, data: 'krTitle' },
          {
            width: '35%', name: 'text', targets: 3, data: 'updateText',
            className: "directory--table-text-sm", sortable: false
          },
          { width: '0%', name: 'id', targets: 4, data: 'Id', visible: false },
          { width: '0%', name: 'parentKrId', targets: 5, data: 'parentKrId', visible: false },
        ]
      };

      $(function () {
        // Render DataTable
        const table = $('#updates-table');
        if (!$.fn.dataTable.isDataTable('#updates-table')) {
          table.DataTable(dataTableSettings);
          table.DataTable().rows.add(tableData).draw();
        } else {
          table.DataTable().clear();
          table.DataTable().rows.add(tableData).draw();
        }

        // Link function
        $('#updates-table tbody').prop('onclick', 'span').off('click');
        $('#updates-table tbody').on('click', 'span', () => {
          table.DataTable().row($(this).parents('tr')).data();
        })
      });
    }
  }, [tableData]);

  return (
    <>
      <h1 className="mb-4">Updates Timeline</h1>
      <div className="directory--container">
        {objectives.isSuccess && keyResults.isSuccess && updates.isSuccess && updates.data.length > 0 &&
          <table className="table-dark table-striped directory--table w-100" id="updates-table">
            <thead>
              <tr>
                <th className="text-center">Date</th>
                <th className="text-center">Objective</th>
                <th className="text-center">Key Result</th>
                <th className="text-center">Description</th>
              </tr>
            </thead>
            <tbody className="align-items-center">
            </tbody>
          </table>
        }
        {(!objectives.isSuccess || !keyResults.isSuccess || !updates.isSuccess || updates.data.length === 0) &&
          <span className="no-data">No data to display.</span>
        }
      </div>
    </>
  )
}