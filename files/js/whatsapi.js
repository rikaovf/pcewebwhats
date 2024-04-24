var dataMsg = '';


document.addEventListener('keyup', function(event) {

    if (event.key === 'Escape') {
        fechaConversa()        
    }
});



function abreMensagens(){

    dataMsg = '';
        
    fetch(`${config.server}:${config.port}/getmsgfromchat/?id=${rowData.id_serial}&limit=80`)
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



    ////////// FOTO E NOME DO  - ORÇAMENTOS
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
                                            [['id', 'contato-orcs'], ['onclick', 'solicitaOrcApi()']],
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


    ////////// DIV ANEXO
    var divAnexo = criaElementoDom('div',
                                    [['id', 'div_anexo']],
                                    ['btn_anexo'],
                                    textoBtn,
                                    'beforeend');

    var btnAnexo = criaElementoDom('input',
                                    [['id', 'btn_anexo'], ['type', 'file'], ['accept', 'file/*']],
                                    ['btn_anexo'],
                                    divAnexo,
                                    'beforeend');
    
    var btnAnexoImg = criaElementoDom('i',
                                        [['id', 'btn_anexo_svg']],
                                        ['bi', 'bi-paperclip']);
    
    divAnexo.appendChild(btnAnexoImg);

    divAnexo.addEventListener("click", ()=>{
        btnAnexo.click();
    })

    btnAnexo.addEventListener("change", (e)=>{
        EnviaAnexo(e);
    })
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
















function insereMensagemDom(msg, divMensagens, quotedMsg, idQuoted, msgFromMe){
    var msgQt = '';
    var divConversa = document.getElementById('conversa');
    var classmsg = ['msg', 'row', 'col-7', 'm-1', 'rounded', 'shadow-sm', 'p-2', 'mb-2'];
    var quotedMsg = typeof(quotedMsg) == 'undefined' ? false : true;
    var idSerialized = typeof(idQuoted) != 'undefined' ? idQuoted : msg.id._serialized;
    var tsMsg = new Date(( typeof(msg.timestamp) != 'undefined' ? msg.timestamp : 915062400) * 1000);
    var dateMsg = tsMsg.toLocaleDateString("pt-BR");
    var timeMsg = tsMsg.toLocaleTimeString("pt-BR");
    
    if (msg.hasQuotedMsg && !quotedMsg){        
        insereMensagemDom(msg._data.quotedMsg, divMensagens, true, msg._data.quotedStanzaID, msg.fromMe)
    } else if(!quotedMsg){
        if(dataMsg == ''){
            criaElementoDom('p', [], ['dataMsg'], divMensagens, 'beforeend', dateMsg);
            dataMsg = dateMsg;
        } else{
            if(dataMsg != dateMsg){
                criaElementoDom('p', [], ['dataMsg'], divMensagens, 'beforeend', dateMsg);
                dataMsg = dateMsg;
            }
        }
    }
    
    if(divConversa != undefined){
        if (msg.fromMe){
            classmsg.push('text-end', 'text-black', 'bg-success', 'fromMe');
        } else{
            if(msg.type == 'ciphertext'){
                msg.body = 'Falha ao descriptografar mensagem. Conferir no aparelho!'
                classmsg.push('text-start', 'text-black', 'bg-danger');
            }else{
                classmsg.push('text-start', 'text-black', 'bg-light');
            }
        }        
        
        if (!quotedMsg){        

            if(msg.type == 'chat' || msg.type == 'revoked'){
                criaElementoDom('p', [['data-id', msg.id.id]], classmsg, divMensagens, 'beforeend', msg.type == 'revoked' ? '🚫 Mensagem apagada' : msg.body, timeMsg);
            } else{
                switch(msg.type){
                    case 'image':
                        classmsg.push('imgMsg');
                        criaElementoDom('img', [['data-id', msg.id.id], ['id', idSerialized], ['src', '']], classmsg, divMensagens, 'beforeend', msg.body);
                        downloadInsereMedia(idSerialized, msg.type)
                        
                        break;
                    case 'video':
                        classmsg.push('videoMsg');
                        criaElementoDom('video', [['data-id', msg.id.id], ['id', idSerialized], ['src', ''], ['controls', '']], classmsg, divMensagens, 'beforeend', msg.body);
                        downloadInsereMedia(idSerialized, msg.type)
                        
                        break;
                    case 'ptt':
                        classmsg.push('audioMsg');
                        if(msg.fromMe){
                            classmsg.push('mediaFromMe');
                        }

                        var audioElement = criaElementoDom('p', [['data-id', msg.id.id], ['id', idSerialized]], classmsg, divMensagens, 'beforeend', undefined, timeMsg);
                        var audio = criaElementoDom('audio', [['src', ''], ['controls', '']], [], audioElement, 'beforeend');
                        carregaAudio(audio, idSerialized);
                        
                        break;
                    case 'document':
                        classmsg.push('docMsg', 'bi', msg._data.mimetype == 'application/pdf' ? 'bi-filetype-pdf' : 'bi-file-earmark-word');
                        if(msg.fromMe){
                            classmsg.push('mediaFromMe');
                        }

                        var docElement = criaElementoDom('a', [['data-id', msg.id.id], ['id', idSerialized]], classmsg, divMensagens, 'beforeend', msg.body, timeMsg);
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
                        //console.log('Tipo não suportado:\nid: ' + msg.id.id + '\ntype: ' + msg.type);
                }
            }
        } else{
            var classQt = ['msgQuote']

            if(msgFromMe){
                classQt.push('fromMe')
            }

            switch(msg.type){
                case 'image':
                    msgQt = criaElementoDom('p', [['data-id', idSerialized]], classQt, divMensagens, 'beforeend', '📷 Foto - ' + msg.body);
                    
                    break;
                case 'video':
                    msgQt = criaElementoDom('p', [['data-id', idSerialized]], classQt, divMensagens, 'beforeend', '🎥 Vídeo - ' + msg.body);
                    
                    break;
                case 'ptt':
                    msgQt = criaElementoDom('p', [['data-id', idSerialized]], classQt, divMensagens, 'beforeend', '🎵 Áudio - ' + msg.body);

                    break;
                case 'document':
                    msgQt = criaElementoDom('p', [['data-id', idSerialized]], classQt, divMensagens, 'beforeend', '📄 Documento - ' + msg.body);

                    break;
                case 'sticker':
                    msgQt = criaElementoDom('p', [['data-id', idSerialized]], classQt, divMensagens, 'beforeend', '📲 Figurinha - ' + msg.body);
                
                    break;
                case 'ciphertext':
                    msgQt = criaElementoDom('p', [['data-id', idSerialized]], classQt, divMensagens, 'beforeend', msg.body);
                    
                    break;
                default:
                    msgQt = criaElementoDom('p', [['data-id', idSerialized]], classQt, divMensagens, 'beforeend', msg.body);
                    
                    break;
                }
        
            msgQt.addEventListener('click', () => {
                navegaAteMensagem(idSerialized);
            })
    }
    }
    return;
}










function EnviaMensagem(arq, objMedia){
    
    var textArea = document.querySelector('#texto_input');
    var texto = textArea.value;
    var body = {}
    var envia = false;

    if(texto != '' && typeof(arq) == 'undefined'){        
        body = {
            id: rowData.id_serial,
            text: texto}/*,
            sendseen: true}*/

            envia = true;
    } else if(typeof(arq) != 'undefined'){
        body = {
            id: rowData.id_serial,
            text: texto != '' ? texto : '',
            type: undefined,
            media: arq,
            obj: objMedia }

            envia = true;
    }

    if (envia){                
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body) };

        fetch(`${config.server}:${config.port}/sendmsg`, options)
        .then(() => {
            var oPar = new Object();          
    
            oPar['idRetag'] = rowData.ID_RETAG;
            MsgApi('api_brw_whats', 'marcafunc', oPar);
            console.log("Mensagem enviada para " + body.id);
        })
        .catch((err) => {
            console.log(err);
        });
    }
    
    textArea.value = '';
}






function EnviaAnexo(t){

    var objMedia = {}
    var reader  = new FileReader();

    if (!(t.target && t.target.files && t.target.files.length > 0)) {
        return;
    }
    
    reader.onloadend = function () {
        let result = reader.result;
        const indexResult = result.indexOf(';');
        
        objMedia.mimetype = result.substr(0, indexResult);
        objMedia.data = result.substr(indexResult + 8);
        objMedia.filename = t.target.files[0].name;

        console.log(objMedia);
        
        EnviaMensagem(true, objMedia)
    }

    reader.readAsDataURL(t.target.files[0]);   
    
}









function criaElementoDom(tipo, atributos, classes, elementoInsert, posicaoInsert, conteudoElm, timeMsg, isStack){
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

    if(typeof(isStack) == 'undefined' && typeof(timeMsg) == 'string'){
        criaElementoDom('p', [], ['horarioMsg'], elemento, 'beforeend', timeMsg, undefined, true);
    }
    
    return elemento;
}









function fechaConversa(){
    var conv = document.getElementById('conversa_pai');
    var orcs = document.getElementById('div-orcs');
    
    //if(conv != null){
        children = [...element.children]
        children[0].classList.remove('col-5')
        children[0].classList.add('col-11')

        if(conv != null){
            element.removeChild(conv);
        }

        if(orcs != null){
            element.removeChild(orcs);
        }

        rowData = {};
        clearInterval(intervaloAtualiza);
        removeModals();
    //}
}






function atualizaMensagens(){

    var divConversa = document.getElementById('conversa');
    
    fetch(`${config.server}:${config.port}/getmsgfromchat/?id=${rowData.id_serial}&limit=10`)
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
    
    if(element.childElementCount > 2){
        var elementChildNodes = element.childNodes;
        element.removeChild(elementChildNodes[4]);
    }

    if(modalElements.length > 0){
        modalElements.map((modal)=>{
            bodyElement.removeChild(modal);
        })
    }
    
}









function solicitaOrcApi(){
    const divConversaPai = document.getElementById('conversa_pai');
    const listaOrcAberto = document.getElementById('lista-orcs');
    const chatList = [...element.children][0]

    if (! listaOrcAberto){
        chatList.classList.remove('col-5')
        chatList.classList.add('col-2')
        /*children[0].classList.remove('col-11')
        children[0].classList.add('col-5')

        divConversaPai.classList.remove('col-7');
        divConversaPai.classList.add('col-4');*/

        const divOrc = criaElementoDom('div',
                                      [['id', 'div-orcs']], ['col-3', 'borda_caixa_conv', 'div-orcs'],
                                      element,
                                      'beforeend');
                                      
        const btnOrc = criaElementoDom('button',
                                      [['id', 'envia-orcs'], ["onclick", "PreencheOrcs()"]], ['btn_envia-orcs'],
                                      divOrc,
                                      'beforeend',
                                      'Enviar selecionados');

        const divTableOrc = criaElementoDom('div',
                                      [['id', 'lista-orcs']], ['lista-orcs'],
                                      divOrc,
                                      'beforeend');
        

        montaTableOrc();
    } else{
        if(element.childElementCount > 2){
            var elementChildNodes = element.childNodes;
            
            element.removeChild(elementChildNodes[4]);
            
            chatList.classList.remove('col-2')
            chatList.classList.add('col-5')
            /*divConversaPai.classList.remove('col-4');
            divConversaPai.classList.add('col-7');*/
        }
        
    }
}







function montaTableOrc(){
    var tableorc = new Tabulator("#lista-orcs", {
                                                index: "id",
                                                selectable:true,
                                                columns: [ {title:"Numero", field:"NUM", hozAlign:"center"},
                                                           {title:"Nome", field:"NOME", width:200, headerSort: false, hozAlign:"center"},
                                                           {title:"Data", field:"DATA", width:200, headerSort: false, hozAlign:"center"},
                                                           {title:"Valor", field:"VALORTELA", headerSort: false, hozAlign:"center"},
                                                           {title:"Qtd.", field:"QTD", headerSort: false, hozAlign:"center"},
                                                           {title:"Un.", field:"UN", headerSort: false, hozAlign:"center"},
                                                           {title:"Tipo", field:"TIPO", headerSort: false, hozAlign:"center"} ],
    });

    solicitaDadosOrcApi()
}







function solicitaDadosOrcApi(){
    var oPar = new Object();          
    
    oPar['idRetag'] = rowData.ID_RETAG;
    oPar['nWhatsapp'] = rowData.N_WHATSAPP;

    MsgApi('api_brw_whats', 'carregaorcamentos', oPar);
    
    return
}






function inserirOrcs(data){
    const tableorc = Tabulator.findTable('#lista-orcs')[0];
    const orcs = data.data;

    tableorc.on("tableBuilt", ()=>{
        tableorc.setData(orcs);
    });
}







function PreencheOrcs(){
    const tableorc = Tabulator.findTable('#lista-orcs')[0];

    if (typeof(tableorc) != 'undefined'){
        const arrOrcs = tableorc.getSelectedRows();

        if(arrOrcs.length >= 1){
            var oPar = new Object();          
            
            oPar['numorcs'] = [];
            oPar['nomearq'] = '';
            
            arrOrcs.map((orc)=>{
                oPar['numorcs'].push(orc._row.data.NUM);
                oPar['nomearq'] += orc._row.data.NUM;
                tableorc.deselectRow(orc);
            })

            oPar['nomearq'] += '.pdf'

            MsgApi('api_brw_whats', 'preencheorcamentos', oPar);
        }        

    } else{
        alert('Erro na listagem de orçamentos, feche a conversa e abra novamente!');
    }
    
}





function enviaOrcPdf(arquivo){
    EnviaMensagem(arquivo.arq)
}




// exemploo de promisse
/*setTimeout(function() {
// Returns promise that resolves to all installed modules
function getAllModules() {
    return new Promise((resolve) => {
        const id = _.uniqueId("fakeModule_");
        window["webpackJsonp"](
            [],
            {
                [id]: function(module, exports, __webpack_require__) {
                    resolve(__webpack_require__.c);
                }
            },
            [id]
        );
    });
}*/









function navegaAteMensagem(idSerialized){
    const mensagens = [...document.getElementsByTagName('p')];
    
    mensagens.every((m)=>{
        if(m.dataset.id == idSerialized){
            m.scrollIntoView({ behavior: "smooth" });
            m.classList.toggle('piscaMensagem')
            setTimeout(()=>{
                m.classList.toggle('piscaMensagem')
            }, 4000)

            return false;
        }

        return true;
    })

}











function setTableChats(chats){
    
    var divTable = [...document.getElementsByClassName("tabulator-tableholder")][0];
    var tableLoad = typeof(divTable) != 'undefined'
    
    if (tableLoad){
        var scrollX = tableLoad ? divTable.scrollLeft : 0;
        var scrollY = tableLoad ? divTable.scrollTop : 0;
    }

    intervaloChecaTable = setInterval(()=>{
            if(tableReady){
                clearInterval(intervaloChecaTable);
                
                // vai depender da memória e processamento da máquina o tempo de atualização da tabela abaixo não adianta
                // por promise pois o método setData do tabulator é sincrono, e acaba travando a interface por alguns segundos.
                // Se botar pelo pceweb "oDom:TableSetData", ele demora o dobro de tempo, então optei por fazer por aqui.
                table.setData(chats.chats).then(()=>{
                    if(tableLoad){
                        divTable.scrollTo( { top: scrollY, left:scrollX } );
                    } 
                })
                /////////
            }
        }, 2000)

    return;
}










function encerraConversa(rowObj){
    var oPar = new Object();          
            
    oPar['idRetag'] = rowObj.ID_RETAG;

    MsgApi('api_brw_whats', 'encerraconversa', oPar);
}














function encerrarSessao(){
    MsgApi('api_brw_whats', 'encerrar_sessao');
    
    return
}