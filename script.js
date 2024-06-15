$(document).ready(function() {
    let columnCount = 0;
    let rowCount = 0;
    let columnData = [];
    let currentStep = 1;

    function showStep(step) {
        if (step === 1) {
            $('#defineColumns').show();
            $('#addData').hide();
        } else {
            $('#defineColumns').hide();
            $('#addData').show();
        }
        $('#stepIndicator').text(`Step ${step}/2`);
        currentStep = step;
    }

    function addTextColumn() {
        columnCount++;
        $('#columnFields').append(`
            <div id="column-${columnCount}">
                <label for="textColumnLabel-${columnCount}">Column Name:</label>
                <input type="text" id="textColumnLabel-${columnCount}" name="textColumnLabel-${columnCount}" placeholder="Column name">
                <button type="button" class="removeColumn" data-id="${columnCount}">Remove</button>
            </div>
        `);
    }

    function addSelectColumn() {
        columnCount++;
        $('#columnFields').append(`
            <div id="column-${columnCount}">
                <label for="selectColumnLabel-${columnCount}">Column Name:</label>
                <input type="text" id="selectColumnLabel-${columnCount}" name="selectColumnLabel-${columnCount}" placeholder="Column name">
                <label for="selectOptions-${columnCount}">Options (comma-separated):</label>
                <input type="text" id="selectOptions-${columnCount}" name="selectOptions-${columnCount}" placeholder="option1,option2">
                <button type="button" class="removeColumn" data-id="${columnCount}">Remove</button>
            </div>
        `);
    }

    function addDataRow() {
        rowCount++;
        const row = $(`<div id="row-${rowCount}" class="data-row"></div>`);
        columnData.forEach((column, index) => {
            if (column.options) {
                let selectOptions = column.options.map(option => `<option value="${option}">${option}</option>`).join('');
                row.append(`
                    <div>
                        <label for="data-${rowCount}-${index}">${column.label}:</label>
                        <select id="data-${rowCount}-${index}" name="data-${rowCount}-${index}">
                            ${selectOptions}
                        </select>
                    </div>
                `);
            } else {
                row.append(`
                    <div>
                        <label for="data-${rowCount}-${index}">${column.label}:</label>
                        <input type="text" id="data-${rowCount}-${index}" name="data-${rowCount}-${index}">
                    </div>
                `);
            }
        });
        row.append(`<button type="button" class="removeRow" data-id="${rowCount}">Remove</button>`);
        $('#dataRows').append(row);
    }

    $('#addTextColumn').click(addTextColumn);
    $('#addSelectColumn').click(addSelectColumn);
    $('#addDataRow').click(addDataRow);

    $(document).on('click', '.removeColumn', function() {
        const id = $(this).data('id');
        $(`#column-${id}`).remove();
    });

    $(document).on('click', '.removeRow', function() {
        const id = $(this).data('id');
        $(`#row-${id}`).remove();
    });

    $('#columnForm').submit(function(event) {
        event.preventDefault();
        columnData = [];
        $('#columnFields div[id^="column-"]').each(function() {
            const label = $(this).find('input[name^="textColumnLabel"], input[name^="selectColumnLabel"]').val();
            const options = $(this).find('input[name^="selectOptions"]').val();
            columnData.push({ label, options: options ? options.split(',').map(opt => opt.trim()) : null });
        });

        // Show data input form
        $('#dataForm').show();
        $('#columnForm').hide();
        $('#dataRows').empty();
        addDataRow();
        showStep(2);
    });

    $('#dataForm').submit(function(event) {
        event.preventDefault();
        let formData = [];
        $('#dataRows .data-row').each(function() {
            let row = {};
            $(this).find('div').each(function(index) {
                const label = columnData[index].label;
                const value = $(this).find('input, select').val();
                row[label] = value;
            });
            formData.push(row);
        });

        // Clear table before adding new data
        $('#dataTable thead').empty();
        $('#dataTable tbody').empty();

        // Add headers
        let headers = '<tr>';
        if (formData.length > 0) {
            Object.keys(formData[0]).forEach(key => {
                headers += `<th>${key}</th>`;
            });
            headers += '</tr>';
            $('#dataTable thead').append(headers);

            // Add data rows
            formData.forEach(row => {
                let dataRow = '<tr>';
                Object.values(row).forEach(value => {
                    dataRow += `<td>${value}</td>`;
                });
                dataRow += '</tr>';
                $('#dataTable tbody').append(dataRow);
            });
        }
    });

    $('#nextStep').click(function() {
        if (currentStep === 1) {
            $('#columnForm').submit();
        } else if (currentStep === 2) {
            $('#dataForm').submit();
        }
    });

    $('#prevStep').click(function() {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
            $('#dataForm').hide();
            $('#columnForm').show();
        }
    });

    $('#dataForm').hide();
    showStep(1);
});
