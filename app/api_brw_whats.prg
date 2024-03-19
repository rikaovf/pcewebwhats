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
	local idRetag := oDom:Get('idRetag')
	local aOrcs := {}
	local aARQS := { {"ACE003.001"  ,,,        },;
		 			 {"ACE055.001"  ,,, "ICE0555"},;
		 			 {"ACE056.001"  ,,, "ICE0560"},;
		 			 {"ACE920.001"  ,,, "ICE9200"},;
		 			 {"ACE921.001"  ,,, "ICE9211"},;
		 			 {"ACE922.001"  ,,, "ICE9220"},;
		 			 {"ACEWHATS.001",,,          },;
		 			 {"XCE010.001"  ,,, "YCE010" },;
		 			 {"ACE010.001"  ,,, "ICE010" } }
	 
	
	if ! abre_fecha_arquivos(aArqs, .T.)
		abre_fecha_arquivos(aArqs, .F.)
		return nil
	endif

	oDom:SetDialog('Orçamentos', dialogOrc(oDom, idRetag))
	
	abre_fecha_arquivos(aArqs, .F.)
return nil




static function dialogOrc(oDom, idRetag)
	LOCAL o, oDlg, oBrw, oCol
	LOCAL aRows := {}
	LOCAL aOptions := {}

	DEFINE DIALOG oDlg
	
		DEFINE FORM o ID 'dlgorc' API 'api_dialog_orc' OF oDlg
		
		INIT FORM o
			ROW o VALIGN 'top'
				COL o CLASS 's-0' GRID 11

					aOptions := { 'index' => 'id',;
							      'maxHeight' => '85vh' }
					
					DEFINE BROWSE oBrw ID 'orcwhats' OPTIONS aOptions OF o 
						aRows := GetRowsOrc( "ACE921",, 50, oDom, idRetag )	
		
						oDom:TableSetData( 'orcwhats', aRows )
					
						COL oCol TO oBrw CONFIG { 'title' => "Numero", 'field' => "CHAVE_CLI", 'width' => 200, 'headerSort' => .F. }
						COL oCol TO oBrw CONFIG { 'title' => "Paciente", 'field' => "N_WHATSAPP", 'width' => 200, 'headerSort' => .F. }
						COL oCol TO oBrw CONFIG { 'title' => "Tipo", 'field' => "SITUACAO", 'formatter' => '_CorSituacao', 'headerSort' => .F. }
						COL oCol TO oBrw CONFIG { 'title' => "Qtd.", 'field' => "DATA", 'headerSort' => .F. }
						COL oCol TO oBrw CONFIG { 'title' => "Data", 'field' => "HORA", 'headerSort' => .F. }
					INIT BROWSE oBrw 
				ENDCOL o			
			ENDROW o
		ENDFORM o
	
		INIT DIALOG oDlg RETURN

return nil










function GetRowsOrc( cAlias, nRecno, nTotal, oDom, idRetag )

	local aReg, j
	local aRows 	:= {}
	
	local n 		:= 0
	local aStr  	:= (cAlias)->( DbStruct() )
	local nFields	:= len( aStr )
	
	(cAlias)->( setScope( 0, PadL(idRetag), 11) )
	(cAlias)->( setScope( 1, PadL(idRetag), 11) ) 
	(cAlias)->( dbGoTop() )

	while n < nTotal .and. (cAlias)->( ! eof() ) 
			
		aReg := {=>}
		
		HB_HSet( aReg, 'id' 	, n )
		HB_HSet( aReg, '_recno' 	, (cAlias)->( Recno() ) )
		
		for j := 1 to nFields
			do case
				case (cAlias)->( FieldName( j ) ) == 'W_PEDID_ID'
					HB_HSet( aReg, (cAlias)->( FieldName( j ) ), (cAlias)->( FieldGet( j ) ) )
				case (cAlias)->( FieldName( j ) ) == 'W_NORC'
					HB_HSet( aReg, (cAlias)->( FieldName( j ) ), (cAlias)->( FieldGet( j ) ) )
					HB_HSet( aReg, (cAlias)->( FieldName( j ) ), CodToDes( ACE921->W_NORC, 'ace055.001', 'ICE0555', 'rec_qsp' ) )
					HB_HSet( aReg, (cAlias)->( FieldName( j ) ), CodToDes( ACE921->W_NORC, 'ace055.001', 'ICE0555', 'rec_qsp' ) )
					HB_HSet( aReg, (cAlias)->( FieldName( j ) ), CodToDes( ACE921->W_NORC, 'ace055.001', 'ICE0555', 'rec_qsp' ) )
					HB_HSet( aReg, (cAlias)->( FieldName( j ) ), CodToDes( ACE921->W_NORC, 'ace055.001', 'ICE0555', 'rec_qsp' ) )
					HB_HSet( aReg, (cAlias)->( FieldName( j ) ), CodToDes( ACE921->W_NORC, 'ace055.001', 'ICE0555', 'rec_qsp' ) )
					HB_HSet( aReg, (cAlias)->( FieldName( j ) ), CodToDes( ACE921->W_NORC, 'ace055.001', 'ICE0555', 'rec_qsp' ) )
					HB_HSet( aReg, (cAlias)->( FieldName( j ) ), CodToDes( ACE921->W_NORC, 'ace055.001', 'ICE0555', 'rec_qsp' ) )
			endcase		
		next
		
		Aadd( aRows, aReg ) 

		(cAlias)->( DbSkip() )
		
		n++
	end 			

retu aRows 












