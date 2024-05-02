var rowData = {};
var intervaloAtualizaHeader = 0;
var intervaloAtualizaTable = 0;
var tableReady = false;
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

        if(typeof(table) != 'undefined'){ //&& table.dataLoader.requestOrder == 2){
            var tableElement = document.getElementById('brw_whats-tablewhats');
            var parentCircle = loadCircle.parentNode;

            tableReady = true;
                        
            clearInterval(intervaloAtualizaTable);

            tableElement.classList.add('borda_caixa_conv')

            parentCircle.removeChild(loadCircle);
            parentCircle.removeChild(textoLoader);
        
            element.setAttribute("style", "visibility:visible;");    
            
            configuraMenuContexto();
            
            table.on("rowClick", function(e, row){
                if(rowData.length == 0){
                    rowData = row.getData();
                    abreMensagens();
                } else{
                    var auxData = row.getData();
                    if(rowData.id_serial != auxData.id_serial){
                        rowData = auxData;
                        clearInterval(intervaloAtualiza);
                        removeModals();
                        abreMensagens();
                    }
                }
            });



            /*table.on("rowDblClick", function(e, row){
                if (confirm("Encerrar conversa?")) {
                    var auxData = row.getData();

                    encerraConversa(auxData);
                }
            });*/
        }
    }, 1000);
}




async function configuraMenuContexto(){   
    var bodyElement = document.querySelector('body');    
    var tableHolder = [...document.getElementsByClassName('tabulator-tableholder')][0];
    
    //Div pai das opções menu contexto
    var menuContexto = criaElementoDom('div',
                                       [['id', 'menuContexto']],
                                       ['menuContexto'],
                                       bodyElement,
                                       'afterbegin');
    
    
    
    criaElementoDom('div',
                    [['id', 'opContexto'], ['name', 'Encerrar'], ['onclick', 'encerraConversa()']],
                    [],
                    menuContexto,
                    'beforeend',
                    'Encerrar conversa');
    
    criaElementoDom('div', 
                    [['id', 'opContexto'], ['name', 'Apagar'], ['onclick', "msgSimNao('O chat será apagado tambem da base de dados da concentra!', 'Deseja apagar chat?')"]],
                    [],
                    menuContexto,
                    'beforeend',
                    'Apagar conversa');

    criaElementoDom('div',
                    [['id', 'opContexto'], ['name', 'Vincular'], ['onclick', 'vinculaContato()']],
                    [],
                    menuContexto,
                    'beforeend',
                    'Vincular contato');



    tableHolder.addEventListener('contextmenu', (e)=>{
        var chat = document.elementFromPoint(e.clientX, e.clientY);
        
        chat.click();

        $('.menuContexto').css({
            "margin-left": e.clientX,
            "margin-top": e.clientY
        }).show()
        
        e.preventDefault();

        window.addEventListener('click', function(){
            $('.menuContexto').hide();
        })        
    })

}
