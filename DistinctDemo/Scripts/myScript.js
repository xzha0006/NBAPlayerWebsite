function updateDataTableSelectAllCtrl(table) {
    var $table = table.table().node();
    var $chkbox_all = $('tbody input[type="checkbox"]', $table);
    var $chkbox_checked = $('tbody input[type="checkbox"]:checked', $table);
    var chkbox_select_all = $('thead input[name="select_all"]', $table).get(0);

    // If none of the checkboxes are checked
    if ($chkbox_checked.length === 0) {
        chkbox_select_all.checked = false;
        if ('indeterminate' in chkbox_select_all) {
            chkbox_select_all.indeterminate = false;
        }

        // If all of the checkboxes are checked
    } else if ($chkbox_checked.length === $chkbox_all.length) {
        chkbox_select_all.checked = true;
        if ('indeterminate' in chkbox_select_all) {
            chkbox_select_all.indeterminate = false;
        }

        // If some of the checkboxes are checked
    } else {
        chkbox_select_all.checked = true;
        if ('indeterminate' in chkbox_select_all) {
            chkbox_select_all.indeterminate = true;
        }
    }
}

$(document).ready(function () {
    // Setup - add a text input to each footer cell
    $('#data tfoot td').each(function () {
        var title = $(this).text();
        if (title === "Actions") {
            $(this).html('<td></td>');
        }
        else {
            var seatchTitle = "Search " + title;
            $(this).html('<input type="text" class="form-control" style="width:100%"  placeholder="'+seatchTitle+'"/>');
        }
    });

    var table = $('#data').DataTable({
    });
    table.columns().every(function () {
        var that = this;

        $('input', this.footer()).on('keyup change', function () {
            if (that.search() !== this.value) {
                that.search(this.value).draw();
            }
        });
    });

    $('#teamTable tfoot td').each(function () {
        var title = $(this).text();
        if (title === "Actions" || title === "Logo") {
            $(this).html('<td></td>');
        }
        else {
            var seatchTitle = "Search " + title;
            $(this).html('<input type="text" class="form-control" style="width:100%"  placeholder="' + seatchTitle + '"/>');
        }
    });
    var teamTable = $('#teamTable').DataTable({
        buttons:['csv', 'pdf']
    });
    teamTable.columns().every(function () {
        var that = this;

        $('input', this.footer()).on('keyup change', function () {
            if (that.search() !== this.value) {
                that.search(this.value).draw();
            }
        });
    });

    $('#userTable tfoot td').each(function () {
        var title = $(this).text();
        if (title === "Actions" || title === "Logo") {
            $(this).html('<td></td>');
        }
        else {
            var seatchTitle = "Search " + title;
            $(this).html('<input type="text" class="form-control" style="width:100%"  placeholder="' + seatchTitle + '"/>');
        }
    });

    var rows_selected = [];
    var userTable = $('#userTable').DataTable({
     
        'columnDefs': [{
            'targets': 0,
            'searchable': false,
            'orderable': false,
            'width': '1%',
            'className': 'dt-body-center',
            'render': function (data, type, full, meta) {
                return '<input type="checkbox">';
            }
        }],
        'rowCallback': function (row, data, dataIndex) {
            // Get row ID
            var rowId = data[0];

            // If row ID is in the list of selected row IDs
            if ($.inArray(rowId, rows_selected) !== -1) {
                $(row).find('input[type="checkbox"]').prop('checked', true);
                $(row).addClass('selected');
            }
        }

    });
    userTable.columns().every(function () {
        var that = this;

        $('input', this.footer()).on('keyup change', function () {
            if (that.search() !== this.value) {
                that.search(this.value).draw();
            }
        });
    });

    $('#userTable tbody').on('click', 'input[type="checkbox"]', function (e) {
        var $row = $(this).closest('tr');

        // Get row data
        var data = userTable.row($row).data();

        // Get row ID
        var rowId = data[0];

        // Determine whether row ID is in the list of selected row IDs 
        var index = $.inArray(rowId, rows_selected);

        // If checkbox is checked and row ID is not in list of selected row IDs
        if (this.checked && index === -1) {
            rows_selected.push(rowId);

            // Otherwise, if checkbox is not checked and row ID is in list of selected row IDs
        } else if (!this.checked && index !== -1) {
            rows_selected.splice(index, 1);
        }

        if (this.checked) {
            $row.addClass('selected');
        } else {
            $row.removeClass('selected');
        }

        // Update state of "Select all" control
        updateDataTableSelectAllCtrl(userTable);

        // Prevent click event from propagating to parent
        e.stopPropagation();
    });

    // Handle click on table cells with checkboxes
    $('#userTable').on('click', 'tbody td, thead th:first-child', function (e) {
        $(this).parent().find('input[type="checkbox"]').trigger('click');
    });

    // Handle click on "Select all" control
    $('thead input[name="select_all"]', userTable.table().container()).on('click', function (e) {
        if (this.checked) {
            $('#userTable tbody input[type="checkbox"]:not(:checked)').trigger('click');
        } else {
            $('#userTable tbody input[type="checkbox"]:checked').trigger('click');
        }

        // Prevent click event from propagating to parent
        e.stopPropagation();
    });

    // Handle table draw event
    userTable.on('draw', function () {
        // Update state of "Select all" control
        updateDataTableSelectAllCtrl(userTable);
    });

    $('#send_email_btn').click(function () {
        var emails = [];
        var rows_sel = document.getElementsByClassName("selected");
        console.log(rows_sel);
        for (var i = 0; i < rows_sel.length; i++) {
            emails.push(rows_sel[i].cells[1].innerHTML.trim());
        }
        console.log(emails);
        //userTable.row()
        if (emails.length > 0) {
            $.ajax({
                url: 'GetEmails',
                type: "POST",
                data: JSON.stringify({ emails: emails }),
                contentType: 'application/json;charset=utf-8',
                success: function (res) {
                    window.location.href = "Email";
                }
           
            });
        }
        
    });
});

