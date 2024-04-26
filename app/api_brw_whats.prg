#include "defines_whats.ch"
#include "lib/tweb/tweb.ch" 

function Api_Brw_whats( oDom )
	local hSession

	if USessionReady()
        hSession := UGetSession()
    endif

	do case
		case oDom:GetProc() == 'setdatawhatsapi'
			SetDataWhatsApi( oDom )						
		case oDom:GetProc() == 'carregaorcamentos'
			//dialogOrcamentos( oDom )
			carregaEnviaOrcs( oDom )
		case oDom:GetProc() == 'preencheorcamentos'
			preencheEnviaOrcs( oDom )
		case oDom:GetProc() == 'marcafunc'
			marcaFunc( oDom )
		case oDom:GetProc() == 'encerraconversa'
			encerraConversa( oDom )	
		case oDom:GetProc() == 'vinculacontato'
			vinculaContato( oDom )	
		case oDom:GetProc() == 'encerrar_sessao'            
			USessionEnd()
			URedirect('/')
		otherwise 				
			oDom:SetError( "Proc don't defined => " + oDom:GetProc())
	endcase
	
retu oDom:Send()	





/***********************************/
			 /*NOVO*/
/***********************************/

static function SetDataWhatsApi( oDom )

	local hChats, hData
	local hPhone := {=>}
	local aRows := {}
	local aARQS := { { "ACE398.001",,, "ICE3982" },;
					 { "ACE026.001",,, "ICE026"  } }
	
	if ! abre_fecha_arquivos(aArqs, .T.)
		abre_fecha_arquivos(aArqs, .F.)
		return nil
	endif

	aRows := GetRows( "ACE398",, 150, oDom )	
	
	hChats := {=>}
			
	HB_HSet( hChats, 'chats', aRows )
	
	oDom:SetJs('setTableChats', hChats)
		
	abre_fecha_arquivos(aArqs, .F.)
	
retu nil







function GetRows( cAlias, nRecno, nTotal, oDom )

	local hSession, aReg, j
	local aRows 	:= {}
	
	local n 		:= 0
	local aStr  	:= (cAlias)->( DbStruct() )
	local nFields	:= len( aStr )
	local cSituacao := ""
	local hData	    := {=>}
	local hPhone	:= {=>}


	if (hData := USession('data_user')) == nil
		return aRows
	endif

	(cAlias)->( ordSetFocus("ICE3984") )	
	
	(cAlias)->( SetScope(0, Padr(hData['numero'], 13)) )	
	(cAlias)->( SetScope(1, Padr(hData['numero'], 13)) )		
	
	(cAlias)->( DbGoTop() )	
	
	if ace398->(DbVazio())
		return aRows
	endif

	
	/*hPhone['phone'] := hData['numero']
	hPhone['port'] := hData['port']

	oDom:SetJs('setPhone', hPhone)*/
	
	while n < nTotal .and. (cAlias)->( ! eof() ) 
			
		aReg := {=>}
		
		HB_HSet( aReg, 'id' 	, n )
		HB_HSet( aReg, '_recno' 	, (cAlias)->( Recno() ) )
		HB_HSet( aReg, 'id_serial' 	, Alltrim((cAlias)->ID_SERIAL))
		
		for j := 1 to nFields
			do case
				case (cAlias)->( FieldName( j ) ) == 'SITUACAO'
					if (cAlias)->( FieldGet( j ) ) == _novo_atend
						cSituacao := "Novo Atendimento"
					elseif (cAlias)->( FieldGet( j ) ) == _aguard_resp_cli
						cSituacao := "Aguardando Cli."
					elseif (cAlias)->( FieldGet( j ) ) == _aguard_resp_far
						cSituacao := "Aguardando Resp."
					elseif (cAlias)->( FieldGet( j ) ) == _atend_encerrado
						cSituacao := "Encerrado"
					elseif (cAlias)->( FieldGet( j ) ) == _nova_conversa
						cSituacao := "Nova Conversa"
					else
						cSituacao := "Indefinido"
					endif
					HB_HSet( aReg, (cAlias)->( FieldName( j ) ), cSituacao )
				case (cAlias)->( FieldName( j ) ) == 'ID_RETAG' .OR. (cAlias)->( FieldName( j ) ) == 'HORA'
					HB_HSet( aReg, (cAlias)->( FieldName( j ) ), (cAlias)->( FieldGet( j ) ) )
				case (cAlias)->( FieldName( j ) ) == 'PHONE'
					HB_HSet( aReg, (cAlias)->( FieldName( j ) ), formataTelefone( (cAlias)->( FieldGet( j ) ) ) ) 
				case (cAlias)->( FieldName( j ) ) == 'N_WHATSAPP'
					HB_HSet( aReg, (cAlias)->( FieldName( j ) ), formataTelefone( (cAlias)->( FieldGet( j ) ) ) ) 
				case (cAlias)->( FieldName( j ) ) == 'CHAVE_CLI'
					HB_HSet( aReg, (cAlias)->( FieldName( j ) ), retornaNomeCliente( , (cAlias)->( FieldGet( j ) ) ) ) 
				case (cAlias)->( FieldName( j ) ) == 'DATA'
					HB_HSet( aReg, (cAlias)->( FieldName( j ) ), STRTRAN(DTOC( STOD( (cAlias)->( FieldGet( j ) ) ) ), "-", "/" ) )
				case (cAlias)->( FieldName( j ) ) == 'FUNC_ABERT'
					HB_HSet( aReg, (cAlias)->( FieldName( j ) ), (cAlias)->( FieldGet( j ) ) + "-" + CodToDes( "F" + (cAlias)->( FieldGet( j ) ), "ace004.001", "ICE004", "TAB_DES" ) )
			endcase		
		next
		
		Aadd( aRows, aReg ) 

		(cAlias)->( DbSkip() )
		
		n++
	end 			

retu aRows 










function carregaEnviaOrcs( oDom)
	
	local aReg, aData
	local n := 1
	local aRows := {}
	local cWhatsapp := oDom:Get('nWhatsapp')
	local cDDD := Padr(SubStr(cWhatsapp, 2, 2), 4)
	local cNum := Padl(StrTran(SubStr(cWhatsapp, 5, Len(cWhatsapp)), '-', ''), 10)

	local aARQS := { {"ACE055.001"  ,,, "ICE0556"},;
		 			 {"ACE056.001"  ,,, "ICE0560"} }
					

	if ! abre_fecha_arquivos(aArqs, .T.)
		oDom:SetError('Erro ao abrir arquivos DBF de orçamentos!')
	else
		ACE055->( setScope( 0, cNum ) )
		ACE055->( setScope( 1, cNum ) )
		ACE055->( dbGoTop() )

		if ! ACE055->( DbVazio() )
			while ACE055->( ! eof() ) 
				aReg := {=>}
				
				HB_HSet( aReg, 'id', n )
				HB_HSet( aReg, '_recno', ACE055->( Recno() ) )
				HB_HSet( aReg, 'NUM', ACE055->rec_num )
				HB_HSet( aReg, 'NOME', ACE055->rec_nom )
				HB_HSet( aReg, 'DATA', FormataData(ACE055->rec_dat) )
				HB_HSet( aReg, 'VALOR', ACE055->rec_pre )
				HB_HSet( aReg, 'VALORTELA', 'R$ ' + Alltrim(Str(ACE055->rec_pre )))
				HB_HSet( aReg, 'QTD', ACE055->rec_qsp )
				HB_HSet( aReg, 'UN', retornaTipos(ACE055->rec_tipo, ACE055->rec_sub_h, ACE055->rec_tipo_h, "UNIDADE"))
				HB_HSet( aReg, 'TIPO', retornaTipos(ACE055->rec_tipo, ACE055->rec_sub_h, ACE055->rec_tipo_h))

				Aadd( aRows, aReg ) 

				n++

				ACE055->( DbSkip() )
			enddo
			
			aData := {=>}
			
			HB_HSet( aData, 'data', aRows )
			
			oDom:SetJs('inserirOrcs', aData)
		else
			oDom:SetMsg('Não existem orçamentos incluídos para este cliente!')
		endif
	endif

	abre_fecha_arquivos(aArqs, .F.)
	
return nil







function preencheEnviaOrcs (oDom)

	local aData
	local cMensagem := ''
	local aOrcs := oDom:Get('numorcs')
	local cArq := oDom:Get('nomearq')
	
	local aARQS := { {"ACE055.001"  ,,, "ICE0556"},;
		 			 {"ACE056.001"  ,,, "ICE0560"} }
					

	if ! abre_fecha_arquivos(aArqs, .T.)
		oDom:SetError('Erro ao abrir arquivos DBF de orçamentos!')
	else
		if GeraPDFNovoWhats(.F.,,,.T.,aORCS)
			aData := {=>}
			
			cArq := hb_CurDrive() + ":\" + CurDir() + "\" + "OrcWhats" + "\" + alltrim( cArq )

			HB_HSet( aData, 'arq', cArq )
			
			oDom:SetJs('enviaOrcPdf', aData)
		endif
	endif

	abre_fecha_arquivos(aArqs, .F.)

return nil








procedure marcaFunc( oDom, nIdRetag )
	local hSession, hData
	local cIdRetag 

	local aArqs := { {"ACE398.001"  ,,, "ICE3980"} }
	
	if ! abre_fecha_arquivos( aArqs, .T. )
		abre_fecha_arquivos( aArqs, .F. )
		return
	endif

	if nIdRetag <> nil
		cIdRetag := nIdRetag
	else
		cIdRetag := oDom:Get('idRetag')
	endif

	if USessionReady()
        hSession := UGetSession()
		hData := Usession( 'data_user' )

		if ace398->(DbSeekOrd(str(cIdRetag,11), "ICE3980"))
			ace398->(NetRLock())
			ace398->func_abert := hData['func']
			ace398->(DbUnlock())
		endif
	else
		oDom:SetError('Erro ao marcar funcionário no chat, faça logout e inicie a sessão novamente!')	
	endif

	abre_fecha_arquivos( aArqs, .F. )
	
return






procedure encerraConversa( oDom )

	local cIdRetag := oDom:Get('idRetag')
	local aArqs :=    { {"ACE397.001"  ,,, "ICE39702"},;
						{"ACE398.001"  ,,, "ICE3980"} }


	if ! abre_fecha_arquivos( aArqs, .T. )
		abre_fecha_arquivos( aArqs, .F. )
		return
	endif

	ace397->( setScope(0, str(cIdRetag,11) ) )
	ace397->( setScope(1, str(cIdRetag,11) ) )

	if ! ace397 -> (DbVazio()) .and. ace398->(DbSeekOrd(str(cIdRetag,11), "ICE3980"))
		ace397->( DbGoBottom() )

		ace397->(NetRLock())
		ace398->(NetRLock())

		ace397->situacao := ace398->situacao := _atend_encerrado
		
		marcaFunc(, cIdRetag)

		ace397->(DbUnlock())
		ace398->(DbUnlock())
	endif

	abre_fecha_arquivos( aArqs, .F. )

return




procedure vinculaContato(oDom)	

local nId := 0
local aNomes := {}
local hNomes := {=>}
local cNome := oDom:Get('nome')
local aARQS := { { "ACE026.001",,, "ICE026"  } }


if ! abre_fecha_arquivos(aArqs, .T.)
	abre_fecha_arquivos(aArqs, .F.)
	return
endif



ace026->(DbGoTop())

Do While ace026->(OrdWildSeek( "*" + Upper(Alltrim(cNome)) + "*", .T. ))
	aadd(aNomes, {nId, ace026->cli_nom})

	nId++
EndDo

HB_HSet( hNomes, 'nomes', aNomes )

oDom:SetJs('escolherNomeCadastro', hNomes)

abre_fecha_arquivos(aArqs, .F.)

return