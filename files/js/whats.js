document.addEventListener('keyup', function(event) {

    if (event.key === 'Escape') {
        var conv = document.getElementById('conversa_pai');
        
        if(conv != null){
            children[0].classList.remove('col-5')
            children[0].classList.add('col-11')

            element.removeChild(conv);
        }
    }
});






function setPhone(phoneData){

    if(phoneEmpty){
        phone = phoneData.phone;
        port = phoneData.port;
    }

}





function abrir_conversa(msgs){
    setTimeout(()=>{
        carregaConversa(msgs);
    }, "300")
}






function carregaConversa(msgs){
    
    var arrMsgs = msgs[1];
    
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
    var contatoPai = document.createElement("div");
    
    contatoPai.id = 'contato';
    contatoPai.classList.add('contato', 'borda_caixa_conv', 'col-12');
    convPai.insertAdjacentElement("beforeend", contatoPai);
    //////////
    
    
    ////////// FOTO E NOME DO CONTATO
    var profilePicContato = document.createElement("img");
    var identificacaoContato = document.createElement("div");
    
    profilePicContato.id = 'contato-foto';
    profilePicContato.src = '../../data/whats-contato.png';
    profilePicContato.alt = 'Profile Picture';
    profilePicContato.classList.add('contato-foto')
    
    identificacaoContato.id = 'contato-nome';
    identificacaoContato.classList.add('contato-nome');
    identificacaoContato.innerText = rowData.CHAVE_CLI;

    contatoPai.insertAdjacentElement("beforeend", profilePicContato);
    contatoPai.insertAdjacentElement("beforeend", identificacaoContato);						
    //////////



    ////////// DIV TELA AONDE NAVEGA PELAS MENSAGENS
    var conversaNavegacao = document.createElement("div");

    conversaNavegacao.id = 'conversa';
    conversaNavegacao.classList.add('conversa', 'borda_caixa_conv', 'overflow-auto', 'col-7');
    convPai.insertAdjacentElement("beforeend", conversaNavegacao);
    //////////

    
    ////////// CADA ELEMENTO DENTRO DESSE BLOCO, REPRESENTA UMA MENSAGEM RELACIONADA AO CONTATO
    arrMsgs.forEach((msg) => {
        let mensagem = document.createElement("p");
        
        mensagem.classList.add('msg', 'row', 'col-7', 'm-1', 'rounded', 'shadow-sm', 'p-2', 'mb-2');

        if (msg.st == "S"){
            mensagem.classList.add('text-end', 'text-black', 'bg-success');
        } else{
            mensagem.classList.add('text-start', 'text-black', 'bg-light');
        }        
        
        mensagem.innerText = msg.text;
       
        conversaNavegacao.insertAdjacentElement("beforeend", mensagem);
    });
    ///////////


    
    
    
    
    ////////// DIV PAI DO INPUT ENVIAR E DO BOTAO ENVIAR
    var textoBtn = document.createElement("div");
    
    textoBtn.id = 'texto_btn';
    textoBtn.classList.add('texto_btn', 'borda_caixa_conv', 'col-12');
    convPai.insertAdjacentElement("beforeend", textoBtn);
    //////////






    ////////// DIV INPUT ENVIAR
    var textoEnviar = document.createElement("textarea");

    textoEnviar.id = 'texto_input';
    textoEnviar.setAttribute("name", "Mensagem");
    textoEnviar.setAttribute("rows", 2);
    textoEnviar.setAttribute("cols", 50);
    textoEnviar.classList.add('texto_input');
    
    textoBtn.insertAdjacentElement("beforeend", textoEnviar);
    
    textoEnviar.addEventListener('keyup', function(event) {

        if (! event.shiftKey && event.key === 'Enter') {
            textoEnviar.value = textoEnviar.value.slice(0, textoEnviar.value.length - 1);
            EnviaMensagem();
        }
    });
    //////////
    
    
    
    ////////// DIV BOTAO ENVIAR
    var btnEnviar = document.createElement("button");
    var btnEnviarImg = document.createElement("i");

    btnEnviar.id = 'btn_envia';
    btnEnviar.type = "button";
    btnEnviar.classList.add('btn_envia');
    btnEnviar.setAttribute("onclick", "EnviaMensagem()");

    btnEnviarImg.id = 'btn_envia_svg';
    btnEnviarImg.classList.add('btn_envia', 'bi', 'bi-send-fill');

    btnEnviar.appendChild(btnEnviarImg);
    
    textoBtn.insertAdjacentElement("beforeend", btnEnviar);
    ///////////


    conversa.scrollTo( { top: 1000000000, behavior: "smooth" } );

    return true;
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
        
        fetch("http://10.10.10.105:3000/sendmsg", options)
        .then(() => {
            console.log("Mensagem enviada para " + body.id)
        })
        .catch((err) => {
            console.log(err);
        });
    }
    
    textArea.value = '';
}