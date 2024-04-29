function errorMsgApi(objErro){

    if(objErro.erro[2] != ''){
        $('#contato-nome')[0].innerText = objErro.erro[2];
    }

    errorMsg(objErro.erro[0], objErro.erro[1]);

}



function errorMsg(erro, titulo){
    var dlgErro = document.getElementById('dlgErro');
    var bodyElm = [...document.getElementsByTagName('body')][0];
    
   
    if(dlgErro != null){
        var titErro = document.getElementById('titErro');
        var msgErro = document.getElementById('msgErro');

        if(typeof(titulo) != 'undefined'){
            titErro.innerText = titulo;
        }

        msgErro.innerText = erro;
        dlgErro.style.display = 'block';
    } else{
        dlgErro = criaElementoDom('dialog', [['id', 'dlgErro']], ['dlgErro'], bodyElm, 'afterbegin');
        
        var boxDlg = criaElementoDom('div', [['id', 'boxDlg']], ['boxDlg'], dlgErro, 'afterbegin');
        var btnErro = criaElementoDom('i', [['id', 'btnErro']], ['bi', 'bi-x-lg', 'btnErro'], boxDlg, 'beforeend');
    
        criaElementoDom('p', [['id', 'titErro']], ['titErro'], boxDlg, 'beforeend', typeof(titulo) != 'undefined' ? titulo : 'Erro');
        criaElementoDom('hr', [[]], ['sepErro'], boxDlg, 'beforeend');
        
        criaElementoDom('p', [['id', 'msgErro']], ['msgErro'], boxDlg, 'beforeend', erro);    
    
        btnErro.addEventListener('click',(e)=>{
            dlgErro.style.display = 'none';
        })        
    }
}