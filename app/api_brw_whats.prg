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
			dialogOrcamentos( oDom )
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

	local aRows := {}
	local aARQS := { { "ACE398.001",,, "ICE3982" },;
					 { "ACE026.001",,, "ICE026" } }
	
	if ! abre_fecha_arquivos(aArqs, .T.)
		abre_fecha_arquivos(aArqs, .F.)
		return nil
	endif

	aRows := GetRows( "ACE398",, 150, oDom )	
	
	oDom:TableSetData( 'tablewhats', aRows )

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

	
	hPhone['phone'] := hData['numero']
	hPhone['port'] := hData['port']

	oDom:SetJs('setPhone', hPhone)
	
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









//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
///////////////////// DLG ORC ////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////


function dialogOrcamentos(oDom)
	local hSession
	local nWhatsapp := oDom:Get('nWhatsapp')
	local hData := {=>}
		
	///// SALVA O NUMERO DO CLIENTE PARA FILTRAR NO MOMENTO DA CHAMADA DO PROC
	if USessionReady()
        hSession := UGetSession()
    endif

	hData['ddd_orc'] := Padr(SubStr(nWhatsapp, 2, 2), 4)
	hData['n_orc']   := Padl(StrTran(SubStr(nWhatsapp, 5, Len(nWhatsapp)), '-', ''), 10)
		
	Usession( 'data_orc', hData )
	
	if USessionReady()
        hSession := UGetSession()
    endif
	///////////////////////////////////////////////////////////////////////////

	oDom:SetDialog('Orçamentos', dialogOrc())

return nil




static function dialogOrc()
	LOCAL o, oDlg, oBrw, oCol
	LOCAL aOptions := {}

	DEFINE DIALOG oDlg
	
		DEFINE FORM o ID 'dlgorc' API 'api_dialog_orc' OF oDlg
		
		INIT FORM o
			/////// BOTAO GENERICO PARA ATUALIZAR OS ORCS - APOS INICIO FICA HIDDEN //////
			BUTTON ID 'atualiza_orcs' LABEL '' ACTION 'setorcwhatsapi' GRID 1 OF o
			///////////////////////////////////////////////////////////////////////////////
			
			HTML o
				<script>
					var atualizaOrcs = document.getElementById("dlgorc-atualiza_orcs");

					setTimeout(() => {
						atualizaOrcs.click();
						atualizaOrcs.hidden = true;
					}, 100);
				</script>
			ENDTEXT


			ROW o VALIGN 'top'
				COL o CLASS 's-0' GRID 11

					aOptions := { 'index' => 'id',;
							      'maxHeight' => '85vh' }
					
					DEFINE BROWSE oBrw ID 'orcwhats' OPTIONS aOptions OF o 
						COL oCol TO oBrw CONFIG { 'title' => "Numero", 'field' => "NUM", 'width' => 200, 'headerSort' => .F. }
						COL oCol TO oBrw CONFIG { 'title' => "Nome", 'field' => "NOME", 'width' => 200, 'headerSort' => .F. }
						COL oCol TO oBrw CONFIG { 'title' => "Valor", 'field' => "VALOR", 'headerSort' => .F. }
						COL oCol TO oBrw CONFIG { 'title' => "Qtd.", 'field' => "QTD", 'headerSort' => .F. }
						COL oCol TO oBrw CONFIG { 'title' => "Tipo", 'field' => "TIPO", 'headerSort' => .F. }
						COL oCol TO oBrw CONFIG { 'title' => "Subtipo", 'field' => "SUBTIPO", 'headerSort' => .F. }
						COL oCol TO oBrw CONFIG { 'title' => "Subtipo 2", 'field' => "SSUBTIPO", 'headerSort' => .F. }
					INIT BROWSE oBrw 
				ENDCOL o			
			ENDROW o
		ENDFORM o
	
		INIT DIALOG oDlg RETURN

return nil











