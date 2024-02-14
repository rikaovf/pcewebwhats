var rowData = {};
var table = Tabulator.findTable('#brw_whats-tablewhats')[0]

const carregouTable = setInterval(() => {
    if(table == undefined){
        table = Tabulator.findTable('#brw_whats-tablewhats')[0];
    } else{
        clearInterval(carregouTable);

        table.on("rowClick", function(e, row){
            rowData = row.getData();
        });
    }
}, 1000);