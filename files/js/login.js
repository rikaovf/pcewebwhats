function redimensionaElementos(){
    const divLogin = document.getElementById('login_fil-div_login');
    const divsFilhoLogin = [...divLogin.children];

    divsFilhoLogin.forEach((e)=>{
        [...e.children][0].classList.remove('col-4');
    })

    let labelElements = [...document.getElementsByTagName('label')]

    labelElements.forEach((e)=>{
        e.classList.remove('col-form-label-lg');
    })

    let concentraLogo = document.createElement("i");
    
    concentraLogo.setAttribute("id", "logo-concentra");
    divLogin.insertAdjacentElement("afterbegin", concentraLogo);
}