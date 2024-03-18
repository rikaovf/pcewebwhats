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


function abreMensagens(){
    
    if(phone.trim().length === 0 || port.trim().length === 0){
        alert("Há inconsistências na configuração do servidor whatsapp. Phone ou porta vazios!");
    } else{
        fetch(`${config.server}:${config.port}/getmsgfromchat/?id=${rowData.id_serial}`)
        .then((res) => {
            return res.json();
        })
        .then((msgs) =>{
            console.log(msgs);
            montaChat(msgs);
            intervaloAtualiza = setInterval(()=>{
                atualizaMensagens()
            }, 8000)
        })
        .catch((err) => {
            console.log(err);
        });
    }
}




function montaChat(msgs){
    
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
    
                                            
    var identificacaoContato = criaElementoDom('div',
                                               [['id', 'contato-nome']],
                                               ['contato-nome'],
                                               contatoPai,
                                               'beforeend',
                                               rowData.CHAVE_CLI);

    
    var orcamentosContato = criaElementoDom('button',
                                            [['id', 'contato-orcs'], ['data-live', ""], ['data-onclick','testeorca']],
                                            ['contato-orcs', 'bi', 'bi-list-ul'],
                                            contatoPai,
                                            'beforeend');

                                             

    //////////



    ////////// DIV TELA AONDE NAVEGA PELAS MENSAGENS
    var conversaNavegacao = criaElementoDom('div',
                                            [['id', 'conversa']],
                                            ['conversa', 'borda_caixa_conv', 'overflow-auto', 'col-7'],
                                            convPai,
                                            'beforeend');
    //////////



    ////////// CADA ELEMENTO DENTRO DESSE BLOCO, REPRESENTA UMA MENSAGEM RELACIONADA AO CONTATO
    msgs.forEach((msg) => {
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
    
    conversa.scrollTo( { top: 1000000000, behavior: "smooth" } );
    
    return;
}
















function insereMensagemDom(msg, divMensagens){
    var divConversa = document.getElementById('conversa');
    var classmsg = ['msg', 'row', 'col-7', 'm-1', 'rounded', 'shadow-sm', 'p-2', 'mb-2'];
    var idSerialized = msg.id._serialized;
    
    if(divConversa != undefined){
        if (msg.fromMe){
            classmsg.push('text-end', 'text-black', 'bg-success');
        } else{
            if(msg.type == 'ciphertext'){
                msg.body = 'Falha ao descriptografar mensagem. Conferir no aparelho!'
                classmsg.push('text-start', 'text-black', 'bg-danger');
            }else{
                classmsg.push('text-start', 'text-black', 'bg-light');
            }
        }        
        
        if(msg.type == 'chat'){
            criaElementoDom('p', [['data-id', msg.id.id]], classmsg, divMensagens, 'beforeend', msg.body);
        } else{
            switch(msg.type){
                case 'image':
                    classmsg.push('imgMsg');
                    criaElementoDom('img', [['data-id', msg.id.id], ['id', idSerialized], ['src', '']], classmsg, divMensagens, 'beforeend', msg.body);
                    downloadInsereMedia(idSerialized, msg.type)
                    
                    break;
                case 'ptt':
                    classmsg.push('audioMsg');
                    var audioElement = criaElementoDom('p', [['data-id', msg.id.id], ['id', idSerialized]], classmsg, divMensagens, 'beforeend');
                    var audio = criaElementoDom('audio', [['src', ''], ['controls', '']], [], audioElement, 'beforeend');
                    carregaAudio(audio, idSerialized);
                    
                    break;
                case 'document':
                    classmsg.push('docMsg', 'bi', msg._data.mimetype == 'application/pdf' ? 'bi-filetype-pdf' : 'bi-file-earmark-word');
                    var docElement = criaElementoDom('a', [['data-id', msg.id.id], ['id', idSerialized]], classmsg, divMensagens, 'beforeend', msg.body);
                    downloadDoc(idSerialized, docElement, msg._data.caption, msg.fromMe);
                    
                    break;
                case 'sticker':
                    classmsg.push('stickerMsg');
                    criaElementoDom('img', [['data-id', msg.id.id], ['id', idSerialized], ['src', '']], classmsg, divMensagens, 'beforeend', msg.body);
                    downloadInsereMedia(idSerialized, msg.type);
                    
                    break;
                case 'ciphertext':
                    classmsg.push('cipherText');
                    criaElementoDom('p', [['data-id', msg.id.id]], classmsg, divMensagens, 'beforeend', msg.body);
                    
                    break;
                default:
                    console.log('Tipo não suportado:\nid: ' + msg.id.id + '\ntype: ' + msg.type);
            }
        }
    }
    return;
}










function EnviaMensagem(){
    
    var textArea = document.querySelector('#texto_input');
    var texto = textArea.value;
    
    if(phone.trim().length === 0 || port.trim().length === 0){
        alert("Há inconsistências na configuração do servidor whatsapp. Phone ou porta vazios!");
    } else if(texto != ''){
        const body = {
            id: rowData.id_serial,
            text: texto}/*,
            type:'',
            media:'',
            sendseen: true}*/
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body) };
        
            fetch(`${config.server}:${config.port}/sendmsg`, options)
        .then(() => {
            console.log("Mensagem enviada para " + body.id);
        })
        .catch((err) => {
            console.log(err);
        });
    }
    
    textArea.value = '';
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









function fechaConversa(){
    var conv = document.getElementById('conversa_pai');
    
    if(conv != null){
        children = [...element.children]
        children[0].classList.remove('col-5')
        children[0].classList.add('col-11')

        element.removeChild(conv);
        rowData = {};
        clearInterval(intervaloAtualiza);
        removeModals();
    }
}






function atualizaMensagens(){

    var divConversa = document.getElementById('conversa');
    
    fetch(`${config.server}:${config.port}/getmsgfromchat/?id=${rowData.id_serial}`)
        .then((res) => {
            return res.json();
        })
        .then(msgs =>{
            if(divConversa == undefined) throw new Error('Problema ao inserir mensagens novas na conversa.');
            
            var msgNav = document.querySelector('#conversa').childNodes;
            var idUltimaMensagem = msgNav[msgNav.length-1].dataset.id;
            
            for(var m = msgs.length-1; m > 0; m--){
                if(msgs[m].id.id != idUltimaMensagem){
                    insereMensagemDom(msgs[m], divConversa)
                } else{
                    break;
                }
            }

            //divConversa.scrollTo( { top: 1000000000, behavior: "smooth" } );
        })
        .catch((err) => {
            console.log(err);
        });
}






function downloadInsereMedia(idSerial, tipo){


    fetch(`${config.server}:${config.port}/getmsgbyid/?id=${idSerial}`)
    .then((res) => {
        return res.json();
    })
    .then((media) => {
        if(media.length == 0) throw new Error('Erro ao baixar media');
        
        var elementoMedia = document.getElementById(idSerial);
        
        if(elementoMedia != undefined){
            var imagem = 'data:' + media.mimetype + ';base64,' + media.data;
            
            elementoMedia.setAttribute('src', imagem);
            
            if(tipo == 'image'){
                addModalImg(elementoMedia, idSerial);
            }

        } else throw  new Error('Mensagem não encontrada!');
        
        return(media);
    })
    .catch((err) => {
        // insere uma imagem de um 'x'
        return(err);
    });
}





function addModalImg(elementoImg, idSerial){
    var dialogImg = criaElementoDom('dialog', [['id', idSerial+'dlg']], ['dialogImg'], document.querySelector('body'), 'beforeend');
    var imagemAbrir = criaElementoDom('img', [['src', elementoImg.src]], ['imgDialogAberto'], dialogImg, 'afterbegin');

    elementoImg.addEventListener('click', ()=>{
        dialogImg.style.display = 'block';
    })

    dialogImg.addEventListener('click', ()=>{
        dialogImg.style.display = 'none';
    })
}





function downloadDoc(idSerialized, docElement, filename, fromMe){

fetch(`${config.server}:${config.port}/getmsgbyid/?id=${idSerialized}`)
.then((res) => {
    return res.json();
})
.then((media) => {
    if(media.length == 0) throw new Error('Erro ao baixar media');

    var doc = 'data:' + media.mimetype + ';base64,' + media.data;

    docElement.setAttribute('download', filename);
    docElement.setAttribute('href', doc);
    
    docElement.style.color = fromMe ? '#ffffff' : '#000000';
})
.catch((err) => {
    // insere uma imagem de um 'x'
    return(err);
});

}





function carregaAudio(audioElement, idSerialized){
    fetch(`${config.server}:${config.port}/getmsgbyid/?id=${idSerialized}`)
    .then((res) => {
        return res.json();
    })
    .then((media) => {
        if(media.length == 0) throw new Error('Erro ao baixar media');

        var audio = 'data:' + media.mimetype + ';base64,' + media.data;

        audioElement.setAttribute('src', audio);
    })
    .catch((err) => {
        // insere uma imagem de um 'x'
        return(err);
    });
}










function removeModals(){
    var bodyElement = document.querySelector('body');
    var modalElements = [...document.querySelectorAll('dialog')];

    
    if(modalElements.length > 0){
        modalElements.map((modal)=>{
            bodyElement.removeChild(modal);
        })
    }
    
}





