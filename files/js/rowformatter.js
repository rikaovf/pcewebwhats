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