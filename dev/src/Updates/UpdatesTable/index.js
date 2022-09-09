import $ from 'jquery';
import { useEffect } from 'react';
import { editIconString } from '../../shared/Icons';
import { getDate } from '../../utils/dates';

export default function UpdatesTable(props) {

  // Initialise state for no. of entries
  const dataTableSettings = {
      autoWidth: false,
      pageLength: 10,
      displayStart: 0,
      lengthMenu: [10, 25, 50, 75, 100],
      order: [
          [0, 'desc']
      ],
      fixedColumns: true,
      columnDefs: [
          {width: '15%', name: 'date', targets: 0, data: 'updateDate', className: "text-center"},
          {
              width: '75%', name: 'text', targets: 1, data: 'updateText',
              className: "directory--table-text-sm", sortable: false},
          {width: '10%', name: 'linkButton', targets: 2, data: 'linkButton', sortable: false, className: "text-center"},
          {width: '0%', name: 'id', targets: 3, data: 'Id', visible: false},
          {width: '0%', name: 'parentKrId', targets: 4, data: 'parentKrId', visible: false},
      ]
  };

  useEffect(function() {
      $(function() {
          const updateData = props.updateData.map(function(item) {
              return {
                  ...item,
                  updateDate: getDate(item.updateDate),
                  linkButton: '<span class="updates-table--link">' + editIconString + '</span>'
              };
          })

          // Render datatable
          const table = $('#updates-table');
          if (! $.fn.dataTable.isDataTable( '#updates-table' )) {
              table.DataTable(dataTableSettings);
              table.DataTable().rows.add(updateData).draw();
          } else {
              table.DataTable().clear();
              table.DataTable().rows.add(updateData).draw();
          }
          
          // Link function
          $('#updates-table tbody').prop('onclick', 'span').off('click')
          $('#updates-table tbody').on('click', 'span', function() {
              let {
                Id, updateDate, updateText, parentKrId, team
              } = table.DataTable().row($(this).parents('tr')).data();
              const data = {
                Id, updateDate, updateText, parentKrId, team
              };
              props.launchEditModal(data);
          });
      });
  }, [props.updateData]);

  return (
      <table className="table-dark table-striped directory--table w-100" id="updates-table">
          <thead>
              <tr>
                  <th className="text-center">Date</th>
                  <th className="text-center">Description</th>
                  <th className="text-center">Edit</th>
              </tr>
          </thead>
          <tbody className="align-items-center">
          </tbody>
      </table>
  );
}