var rowData = {};
var nWhatsapp = '';

var table = Tabulator.findTable('#brw_whats-tablewhats')[0]

const carregouTable = setInterval(() => {
    if(table == undefined){
        table = Tabulator.findTable('#brw_whats-tablewhats')[0];
    } else{
        clearInterval(carregouTable);
        
        const tableVisible = setInterval(() => {
            var header = document.getElementsByClassName('header')[0];
            var loadCircle = document.querySelector('#loadCircle');
            var textoLoader = document.querySelector('#texto-loader');

            if(table.dataLoader.requestOrder == 2){
                var parentCircle = loadCircle.parentNode;
                
                parentCircle.removeChild(loadCircle);
                parentCircle.removeChild(textoLoader);

                element.setAttribute("style", "visibility:visible;");
                clearInterval(tableVisible);
            }else{
                if (loadCircle == null){
                    loadCircle = document.createElement("div");
                    textoLoader = document.createElement("p");

                    loadCircle.id = 'loadCircle';
                    loadCircle.classList.add('loader-circle');

                    textoLoader.id = 'texto-loader'
                    textoLoader.innerText = 'Aguarde, carregando mensagens...'
                    textoLoader.classList.add('texto-loader')
                    
                    
                    header.insertAdjacentElement("afterend", loadCircle);
                    loadCircle.insertAdjacentElement("afterend", textoLoader);
                }
            }
        }, 500);

        
        
        table.on("rowClick", function(e, row){
            rowData = row.getData();
            nWhatsapp = rowData.N_WHATSAPP;
        });
    }
}, 1000);