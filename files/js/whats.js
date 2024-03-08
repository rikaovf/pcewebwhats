document.addEventListener('keyup', function(event) {

    if (event.key === 'Escape') {
        fechaConversa()        
    }
});



function setPhone(phoneData){

    if(phoneEmpty){
        phone = phoneData.phone;
        port = phoneData.port;
    }

}


function _CorSituacao( cell, formatterParams, onRendered ) { 
    let pos = cell;
    let row = pos.getRow();
    let element = row.getElement();
    
    // table-danger = mais claro // bg-danger = mais opaco
    if ( cell.getValue() == "Novo Atendimento" ){
        element.classList.add('table-danger')}
    else if( cell.getValue() == "Aguardando Cli." ){
        element.classList.add('table-warning')}
    else if( cell.getValue() == "Aguardando Resp." ){
        element.classList.add('table-success')}
    else if( cell.getValue() == "Encerrado" ){
        element.classList.add('table-primary')}
    
    return cell.getValue();
}


function abrirConversa(msgs){
    var elementoContato = document.getElementById('contato');
        
    if (usuarioClicou && elementoContato != undefined){
        if(elementoContato.dataset.num != nWhatsapp){
            timeoutMsgAtualiza.map((instancia)=>{
                clearTimeout(instancia);
            })        
            
            atualiza = false;
            clicouMesmaConversa = false;
        } else{
            clicouMesmaConversa = true;
        }
    }

    setTimeout(()=>{
        carregaConversa(msgs);
    }, "300")
}






function carregaConversa(msgs){
    
    var arrMsgs = msgs[0];

    if(!clicouMesmaConversa){
        carregaConversaSelecionada(arrMsgs);

        timeoutMsgAtualiza.push(setTimeout(() => {
                                    clicaNaConversaAtualiza();        
                                }, 8000));
        }
        
    return true;
}





function clicaNaConversaAtualiza(){
    let chats = [...[...document.getElementsByClassName('tabulator-table')][0].childNodes]

    chats.every((chat)=>{
        if(chat.childNodes[2].innerText == nWhatsapp){
            atualiza = true;
            chat.click();
            console.log('clicou');
            
            return false;
        } else{
            atualiza = false;
        }

        return true;
    })
}





function carregaConversaSelecionada(arrMsgs){
    
    if(!atualiza){
        if (element.childElementCount > 1){
        let conversa = element.lastElementChild;
        element.removeChild(conversa);
        }

        children = [...element.children]
        children[0].classList.remove('col-11')
        children[0].classList.add('col-5')

        ////////// DIV PAI - CONTEM MENSAGENS - INPUT ENVIAR - BOTAO ENVIAR
        var convPai = document.createElement("div");

        convPai.id = 'conversa_pai';
        convPai.classList.add('conversa_pai', 'col-7');
        element.insertAdjacentElement("beforeend", convPai);
        //////////

        ////////// DIV CONTATO PAI
        var contatoPai = criaElementoDom('div',
                                         [['id', 'contato'], ['data-num', rowData.N_WHATSAPP]],
                                         ['contato', 'borda_caixa_conv', 'col-12'],
                                         convPai,
                                         'beforeend');
        //////////



        ////////// FOTO E NOME DO CONTATO
        var profilePicContato = criaElementoDom('img',
                                                [['id', 'contato-foto'],['src', '../../data/whats-contato.png'],['alt', 'Profile Picture']],
                                                ['contato-foto'],
                                                contatoPai,
                                                'beforeend');
        
                                                console.log(rowData.CHAVE_CLI);
        var identificacaoContato = criaElementoDom('div',
                                                   [['id', 'contato-nome']],
                                                   ['contato-nome'],
                                                   contatoPai,
                                                   'beforeend',
                                                   rowData.CHAVE_CLI);
        //////////



        ////////// DIV TELA AONDE NAVEGA PELAS MENSAGENS
        var conversaNavegacao = criaElementoDom('div',
                                                [['id', 'conversa']],
                                                ['conversa', 'borda_caixa_conv', 'overflow-auto', 'col-7'],
                                                convPai,
                                                'beforeend');
        //////////



        ////////// CADA ELEMENTO DENTRO DESSE BLOCO, REPRESENTA UMA MENSAGEM RELACIONADA AO CONTATO
        arrMsgs.forEach((msg) => {
            insereMensagemDom(msg, conversaNavegacao)
        });
        ///////////



        ////////// DIV PAI DO INPUT ENVIAR E DO BOTAO ENVIAR
        var textoBtn = criaElementoDom('div',
                                       [['id', 'texto_btn']],
                                       ['texto_btn', 'borda_caixa_conv', 'col-12'],
                                       convPai,
                                       'beforeend');
        //////////


        ////////// DIV INPUT ENVIAR
        var textoEnviar = criaElementoDom('textarea',
                                          [['id', 'texto_input'], ['name', 'Mensagem'], ['rows', 2], ['cols', 50]],
                                          ['texto_input'],
                                          textoBtn,
                                          'beforeend');
       
        textoEnviar.addEventListener('keyup', function(event) {

            if (! event.shiftKey && event.key === 'Enter') {
                textoEnviar.value = textoEnviar.value.slice(0, textoEnviar.value.length - 1);
                EnviaMensagem();
            }
        });
        //////////


        ////////// DIV BOTAO ENVIAR
        var btnEnviar = criaElementoDom('button',
                                        [['id', 'btn_envia'], ["onclick", "EnviaMensagem()"]],
                                        ['btn_envia'],
                                        textoBtn,
                                        'beforeend');

        var btnEnviarImg = criaElementoDom('i',
                                           [['id', 'btn_enviar_svg']],
                                           ['bi', 'bi-send-fill']);

        btnEnviar.appendChild(btnEnviarImg);
        ///////////        
    } else{
        var conversaNav = document.querySelector('#conversa');
        var msgNav = document.querySelector('#conversa').childNodes;
        var idUltimaMensagem = msgNav[msgNav.length-1].dataset.id
        
        for(var m = arrMsgs.length-1; m > 0; m--){
            if(arrMsgs[m].msg_id != idUltimaMensagem){
                insereMensagemDom(arrMsgs[m], conversaNav)
            } else{
                break;
            }
        }
    }

    conversa.scrollTo( { top: 1000000000, behavior: "smooth" } );

    return;
}







function insereMensagemDom(msg, divMensagens){
    let classmsg = ['msg', 'row', 'col-7', 'm-1', 'rounded', 'shadow-sm', 'p-2', 'mb-2'];
                
    if (msg.st == "S"){
        classmsg.push('text-end', 'text-black', 'bg-success');
    } else{
        classmsg.push('text-start', 'text-black', 'bg-light');
    }        

    criaElementoDom('p', [['data-id', msg.msg_id]], classmsg, divMensagens, 'beforeend', msg.text);

    return;
}










function EnviaMensagem(){
    
    var textArea = document.querySelector('#texto_input');
    var texto = textArea.value;
    
    if(phone.trim().length === 0 || port.trim().length === 0){
        alert("Há inconsistências na configuração do servidor whatsapp. Phone ou porta vazios!");
    } else if(texto != ''){
        let numEnviar = '55' + rowData.N_WHATSAPP.replace(/[ ()-]/g,"") + '@c.us';
        const body = {
            id: numEnviar,
            text: texto}/*,
            type:'',
            media:'',
            sendseen: true}*/
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body) };
        
        fetch(config.server + ':' + config.port + '/sendmsg', options)
        .then(() => {
            console.log("Mensagem enviada para " + body.id)
        })
        .catch((err) => {
            console.log(err);
        });
    }
    
    textArea.value = '';
}






function fechaConversa(){
    var conv = document.getElementById('conversa_pai');
    
    if(conv != null){
        children = [...element.children]
        children[0].classList.remove('col-5')
        children[0].classList.add('col-11')

        element.removeChild(conv);
        
        nWhatsapp = '';
        usuarioClicou = false;
        atualiza = false;
    }
}





function criaElementoDom(tipo, atributos, classes, elementoInsert, posicaoInsert, conteudoElm){
    var elemento = document.createElement(tipo);

    if(atributos != undefined){
        atributos.forEach(atrib => {
            elemento.setAttribute(atrib[0], atrib[1])
        });
    }

    if(classes != undefined){
        classes.forEach(classe => {
            elemento.classList.add(classe);
        });
    }

    if(elementoInsert != undefined){
        elementoInsert.insertAdjacentElement( elementoInsert != undefined ? posicaoInsert : "beforeend", elemento);
    }

    if(conteudoElm != undefined){
        elemento.innerText = conteudoElm;
    }

    return elemento;
}