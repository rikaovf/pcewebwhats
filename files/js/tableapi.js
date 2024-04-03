var rowData = {};
var intervaloAtualizaHeader = 0;
var intervaloAtualizaTable = 0;
var header = document.getElementsByClassName('header')[0];
var table = Tabulator.findTable('#brw_whats-tablewhats')[0];
var loadCircle = document.querySelector('#loadCircle');
var textoLoader = document.querySelector('#texto-loader');


loadCircle = document.createElement("div");
textoLoader = document.createElement("p");

loadCircle.id = 'loadCircle';
loadCircle.classList.add('loader-circle');

textoLoader.id = 'texto-loader'
textoLoader.innerText = 'Aguarde, carregando mensagens...'
textoLoader.classList.add('texto-loader')


if(typeof(header) == 'undefined'){
    intervaloAtualizaHeader = setInterval(()=>{
        header = document.getElementsByClassName('header')[0];
        if(typeof(header) != 'undefined'){
            clearInterval(intervaloAtualizaHeader);
            header.insertAdjacentElement("afterend", loadCircle);
            loadCircle.insertAdjacentElement("afterend", textoLoader);
        }
    }, 1000);
}



if(typeof(table) == 'undefined'){
    intervaloAtualizaTable = setInterval(()=>{
        table = Tabulator.findTable('#brw_whats-tablewhats')[0]

        if(typeof(table) != 'undefined' && table.dataLoader.requestOrder == 2){
            var tableElement = document.getElementById('brw_whats-tablewhats');
            var parentCircle = loadCircle.parentNode;
                        
            clearInterval(intervaloAtualizaTable);

            tableElement.classList.add('borda_caixa_conv')

            parentCircle.removeChild(loadCircle);
            parentCircle.removeChild(textoLoader);
        
            element.setAttribute("style", "visibility:visible;");    
            
            table.on("rowClick", function(e, row){
                if(rowData.length == 0){
                    rowData = row.getData();
                    abreMensagens();
                } else{
                    var auxData = row.getData();
                    if(rowData.id_serial != auxData.id_serial){
                        rowData = auxData;
                        removeModals();
                        abreMensagens();
                    }
                }
            });
        }
    }, 1000);
}