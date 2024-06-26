/////// colocar no PCE000 quando iniciar o mesmo, fazer uma varredura em todos os registros do 
////// 398 para que ele preencha todos os PHONES no 920, senao vai dar pau.

********
function RetornaNumeros()
********

LOCAL aNums := {}
local aARQS := { { "ACE920.001",,, "ICE9202" } }

if ! abre_fecha_arquivos(aArqs, .T.)
    abre_fecha_arquivos(aArqs, .F.)
    return nil
endif

while ! ace920->(eof())
    aadd(aNums, ace920->w_far_num)
    ace920->(dbskip())
enddo

abre_fecha_arquivos(aArqs, .T.)

return aNums



********
function PhonePortaWhats(cNum)
********
local cPort := ""
local aARQS := { { "ACE920.001",,, "ICE9202" } }

if ! abre_fecha_arquivos(aArqs, .T.)
    abre_fecha_arquivos(aArqs, .F.)
    return nil
endif

ace920->(DbGoTop())

if ace920->(OrdKeyCount()) = 1
    cPort := "3000"
elseif ace920->(DbSeek(cNum))
    cPort := allTrim(ACE920->W_DATA)
endif

abre_fecha_arquivos(aArqs, .T.)

return cNum




********
function formataTelefone( cFone )
********
    LOCAL cFoneRet := ""

    cFone := Right( cFone, 11 )

    do case
        case len(alltrim(cFone)) = 10
            cFoneRet := transform( cFone, "@R (99) 9999-9999" )

        otherwise
            cFoneRet := transform( cFone, "@R (99)99999-9999" )

    endcase

return cFoneRet
        
    
    
    


******************************
function retornaNomeCliente( lFoneGrupo, cChaveCli, lForcaAtualiza )
******************************
    LOCAL cCli_Nome  := ""
    LOCAL cCli_chave := alltrim(ACE398->chave_cli)
    LOCAL lLocked

    hb_default(@lFoneGrupo, .F.)
    hb_default(@cChaveCli, .F.)
    hb_default(@lForcaAtualiza, .F.)
    
    IF !empty( cChaveCli)
        if ACE398->( dbSeekord( cChaveCli, "ICE3981" ) )
            cCli_chave := alltrim(ACE398->chave_cli)
        else
            cCli_Nome := "Cliente não encontrado"
        endif
    ENDIF

    if ACE398->(dbVazio())
        return cCli_Nome
    endif

    if lFoneGrupo
        cCli_chave := alltrim(ACE397->chave_cli)
    endif

    if !lFoneGrupo .and. (empty(cCli_chave) .or. cCli_chave = "NaoEncontrado" .or. cCli_chave = "Erro" .or. lForcaAtualiza )
        cCli_chave := retornaChaveCliente(, "ACE398")
        IF ! ACE398->chave_cli == cCli_chave
            IF !( lLocked := ACE398->(IsLocked()) )
            ACE398->(netDbRLock())
            ENDIF
            ACE398->chave_cli := cCli_chave
            IF ! lLocked
            ACE398->(dbUnlock())
            ENDIF
        ENDIF
    endif

    if lFoneGrupo .and. (empty(cCli_chave) .or. cCli_chave = "NaoEncontrado" .or. cCli_chave = "Erro" .or. left(cCli_chave, 3) = "GRP")
        cCli_Nome := transform( ACE397->n_whatsapp, "@R 99 (99) 99999-9999" )

    elseif empty(cCli_chave)
        cCli_Nome := ""

    elseif left(cCli_chave, 3) = "GRP"
        cCli_Nome := hb_StrToUTF8(CodToDes( cCli_chave + ACE398->PHONE, "ACE920.001", "ICE9200", "W_NOMEGRP" ))

    elseif cCli_chave = "NaoEncontrado"
        cCli_Nome := "Telefone não cadastrado."

    elseif cCli_chave = "Erro"
        cCli_Nome := "Erro no registro da mensagem."

    else
        cCli_Nome := hb_StrToUTF8(CodToDes( cCli_chave, "ACE026.001", "ICE0268", "CLI_NOM" ))

    endif

return cCli_Nome





********
function retornaChaveCliente( lForcaCliente, cAlias, cFone )
    ********
    local cGrupo := ""
    local cChave_Cli := ""
    local cDDD := ""
    local nRec

    hb_default(@lForcaCliente, .F.) 
    hb_default(@cAlias, "") 
    hb_default(@cFone, "") 
    
    if empty(cFone)
        cFone := (cAlias)->n_whatsapp

        if !lForcaCliente .and. cAlias = "SQLMensagens"
            cGrupo := (cAlias)->n_wpp_grp
        endif
    endif

    if len( alltrim( cFone ) ) > 9
        cFone := right( cFone, len(cFone)-4 )
//    cFone := right( alltrim( cFone ), len(cFone)-4 )
    endif

    cFone := padl( alltrim(cFone), FoneTamanho() )

    if !empty(cGrupo)
        cChave_Cli := "GRP" + cGrupo

    elseif !empty( cFone )

        if ACE026->( dbSeekOrd( padl(cFone, 10), "ICE0261"  ) ) .or.; // Tel
            ACE026->( dbSeekOrd( padl(cFone, 10), "ICE02610" ) ) .or.; // Fone1
            ACE026->( dbSeekOrd( padl(cFone, 10), "ICE02611" ) ) .or.; // Fone2
            ACE026->( dbSeekOrd( padl(cFone, 10), "ICE02612" ) )       // Fone3


            //Pegar a chave no titular se for o caso. Por Barbosa 20/03/2020.
            nRec := ace026->( RecNo(  ) )
            if ParametroWhatsApp("CLI_CHTIT",,.T.) .and. !Empty( Ace026->Cli_Chatit ) .and. Ace026->(DbSeekOrd(Ace026->Cli_ChaTit,"ICE0268") )
            ace026->(DbGoTo(nRec))
            cChave_Cli := Ace026->Cli_Chatit
            else
            cChave_Cli := ACE026->cli_chave
            endif

        else
            cChave_Cli := "NaoEncontrado"

        endif

    else
        cChave_Cli := "Erro"
    endif

return cChave_Cli
    
    
    



function DbVazio()

    local nREG, lVAZIO
    
    if EMPTY( ALIAS() )
        return ( .T. )
    endif
    
    nREG   := RecNo()
    
    DbGoTop()
    
    lVAZIO := BOF() .AND. EOF()
    
    DbGoto( nREG )
     
Return ( lVAZIO )








FUNCTION ParametroWhatsApp( cCampo, cFilial, uDefault, uValor )
    local nPosicao
    local nHandle
    //local uValor := uDefault
 
    hb_default(@cFilial, NIL)
    hb_default(@uDefault, NIL)
    hb_default(@uValor, uDefault)
    

    xNETUSE( "ACEWHATS.001", "ACEWHATS", "C" )
    
    SELECT ACEWHATS
    
    if !EMPTY(cFILIAL)
       DBSETFILTER( { || ACEWHATS->FILIAL == cFILIAL } )
    endif
 
    if ( nPOSICAO :=  FIELDPOS( cCAMPO ) ) > 0
       if Empty( uValor) .or. !Empty( uDefault )
          uValor := FIELDGET( nPOSICAO )
       endif   
 
       if (  Empty( uValor) .and. ValType(uValor) != "L" ) .or. (ValType( uValor ) == "N" .and. uValor == 0 )
          uValor := uDefault
       endif
    
       try
          NETDBRLOCK()
          FIELDPUT( nPOSICAO, uValor )
          DBUNLOCK()
       catch
          
       end   
    
    endif
 
    DBCLEARFILTER()
 
 RETURN uValor












 function retornaFil()
    local cFil := ''
    local hSession, hData

    if USessionReady()
        hSession := UGetSession()
    endif

	if (hData := USession('data_user')) != nil
		cFil := hData['fil']
	endif

return cFil 














function FormataData(dData)

    local cData := DtoC(StoD(dData))
    
return SubStr(cData, 9, 2) + '/' + SubStr(cData, 6, 2) + '/' + SubStr(cData, 1, 4)













function retornaTipos(nTipo, nSub, nHSub, cCampo)

local aARQS := {}
local aFiliais := Directory('FIL?????', 'D')
local cTipo := StrZero(nTipo, 2) + StrZero(nSub, 2) + StrZero(nHSub, 2)

ADelPack( aFiliais, { |e,i| ! FILE(e[i, 1] + "\ACE090.001") } )

if len(aFiliais) > 0 .and. !ParametroLogico("NaoConsideraFiliais90")
    Aadd(aARQS, { '\FIL' + allTrim(RetornaFil()) + "\ACE090.001","TIPOS",, "ICE0901" } )
else
    Aadd(aARQS, { "ACE090.001", "TIPOS",, "ICE0901" } )
endif

if ! abre_fecha_arquivos(aArqs, .T.)
    abre_fecha_arquivos(aArqs, .F.)
    cTipo := "Erro no arquivo"
    return cTipo
endif

if ! TIPOS->( DBSEEKORD( cTipo, "ICE0901" ) )
    cTipo := "Não detectado"
else
    if empty(cCampo)
        cTipo := TIPOS->MNU_DES
    else
        do case
            case cCampo == "UNIDADE"
                cTipo := Upper(TIPOS->MNU_APRES)
            otherwise
                cTipo := ""
        endcase            
    endif
endif

abre_fecha_arquivos(aArqs, .F.)

return cTipo