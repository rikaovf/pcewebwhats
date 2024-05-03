function errorMsgApi(objErro){

    if(typeof(objErro.erro[2]) != 'undefined' && objErro.erro[2] != ''){
        $('#contato-nome')[0].innerText = objErro.erro[2];
    }

    errorMsg(objErro.erro[0], objErro.erro[1]);

}



function errorMsg(erro, titulo, trava){
    var dlgErro = document.getElementById('dlgErro');
    var bodyElm = [...document.getElementsByTagName('body')][0];
    
    trava = typeof(trava) != 'undefined' ? trava : false;
   
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
    
        if(!trava){
            btnErro.addEventListener('click',(e)=>{
                dlgErro.style.display = 'none';
            })        
        }
    }
}







function msgSimNao(msg, titulo){
    var dlgSimNao = document.getElementById('dlgSimNao');
    var bodyElm = [...document.getElementsByTagName('body')][0];
    
   
    if(dlgSimNao != null){
        var titSimNao = document.getElementById('titSimNao');
        var msgSimNao = document.getElementById('msgSimNao');

        if(typeof(titulo) != 'undefined'){
            titSimNao.innerText = titulo;
        }

        msgSimNao.innerText = msg;
        dlgSimNao.style.display = 'block';
    } else{
        dlgSimNao = criaElementoDom('dialog', [['id', 'dlgSimNao']], ['dlgSimNao'], bodyElm, 'afterbegin');
        
        var boxDlg = criaElementoDom('div', [['id', 'boxDlgSimNao']], ['boxDlg'], dlgSimNao, 'afterbegin');
        var btnErro = criaElementoDom('i', [['id', 'btnSairSimNao']], ['bi', 'bi-x-lg', 'btnErro'], boxDlg, 'beforeend');
    
        criaElementoDom('p', [['id', 'titSimNao']], ['titErro'], boxDlg, 'beforeend', typeof(titulo) != 'undefined' ? titulo : 'Alerta');
        criaElementoDom('hr', [[]], ['sepSimNao'], boxDlg, 'beforeend');
        
        criaElementoDom('p', [['id', 'msgSimNao']], ['msgErro'], boxDlg, 'beforeend', msg);
    
        criaElementoDom('button', [['id', 'btnConfirma'], ['onclick', 'deleteChat()']], ['btnSimNao'], boxDlg, 'beforeend', 'Confirma');
        criaElementoDom('button', [['id', 'btnCancela'], ['onclick', "$('#dlgSimNao').remove()"]], ['btnSimNao'], boxDlg, 'beforeend', 'Cancela');
        
        btnErro.addEventListener('click',(e)=>{
            dlgSimNao.style.display = 'none';
        })        
    }
   
}
