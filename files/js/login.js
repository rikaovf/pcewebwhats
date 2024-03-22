function redimensionaElementos(){
    const divLogin = document.getElementById('login_fil-div_login');
    const divsFilhoLogin = [...divLogin.children];
    const senhaEnter = document.getElementById('login_fil-senha_func');
    const botaoLogin = document.getElementById('login_fil-auth');

    divsFilhoLogin.forEach((e)=>{
        [...e.children][0].classList.remove('col-4', 'col-6');
    })

    let labelElements = [...document.getElementsByTagName('label')]

    labelElements.forEach((e)=>{
        e.classList.remove('col-form-label-lg');
    })

    let concentraLogo = document.createElement("i");
    
    concentraLogo.setAttribute("id", "logo-concentra");
    divLogin.insertAdjacentElement("afterbegin", concentraLogo);

    senhaEnter.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            botaoLogin.click();
        }
    });
}