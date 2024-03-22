#include "../lib/tweb/tweb.ch"

function api_auth_wpp(oDom)
    
    local cCod_Func := ""
    local cFunc_auth
    local cSenha_auth
    local hData := {=>}
    
    do case    
        
        case oDom:GetProc() == 'AutenticaFuncionario'            
            cFunc_auth  := oDom:Get('codigo_func')
            cSenha_auth := oDom:Get('senha_func')
            
            if !empty(cSenha_auth)
                if Auth_funcionario(cFunc_auth, cSenha_auth)
                    hData['fil']  := oDom:Get('cod_fil')
                    hData['func']  := StrZero(val(cFunc_auth), 5)
                    hData['senha'] := cSenha_auth
                    hData['numero']  := oDom:Get('num_login')
                    hData['port'] := PhonePortaWhats(hData['numero'])

                    USessionStart()

                    Usession( 'data_user', hData )
                    Usession( 'data_in'	, dtoc( date() ) + ' - ' + time() )

                    URedirect('whatsapp')
                else
                    UsessionEnd()

                    oDom:SetError('Funcionário não autorizado!')
                    
                    oDom:Set('codigo_func', "")
                    oDom:Set('senha_func', "")
                endif                
            else
                oDom:SetError('Senha não pode ser vazia!')
            endif
            
        otherwise                       
            oDom:SetError("Proc don't defined => " + oDom:GetProc())    
    endcase
        
return oDom:send()
