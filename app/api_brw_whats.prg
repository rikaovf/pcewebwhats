#include "defines_whats.ch"


function Api_Brw_whats( oDom )
	local hSession

	if USessionReady()
        hSession := UGetSession()
    endif

	do case
		case oDom:GetProc() == 'setdatawhats'
			SetDataWhats( oDom )						
		case oDom:GetProc() == 'abreconversa'
			SetMsgWhats( oDom )
		case oDom:GetProc() == 'encerrar_sessao'            
			USessionEnd()
			URedirect('/')
		otherwise 				
			oDom:SetError( "Proc don't defined => " + oDom:GetProc())
	endcase
	
retu oDom:Send()	







static function SetDataWhats( oDom )

	local aRows := {}
	local aARQS := { { "ACE398.001",,, "ICE3982" },;
					 { "ACE026.001",,, "ICE026" } }
	
	if ! abre_fecha_arquivos(aArqs, .T.)
		abre_fecha_arquivos(aArqs, .F.)
		return nil
	endif

	aRows  	:= GetRows( "ACE398", 1, 150, oDom )	
	
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
					HB_HSet( aReg, (cAlias)->( FieldName( j ) ), DTOC( STOD( (cAlias)->( FieldGet( j ) ) ) ) )
				case (cAlias)->( FieldName( j ) ) == 'FUNC_ABERT'
					HB_HSet( aReg, (cAlias)->( FieldName( j ) ), (cAlias)->( FieldGet( j ) ) + "-" + CodToDes( "F" + (cAlias)->( FieldGet( j ) ), "ace004.001", "ICE004", "TAB_DES" ) )
			endcase		
		next
		
		Aadd( aRows, aReg ) 

		(cAlias)->( DbSkip() )
		
		n++
	end 			

retu aRows 





function SetMsgWhats( oDom )

local hBrowse, hUpdated, n

local aMsgs := {}

local aARQS := { { "ACE397.001",,, "ICE39702" } }


if ! abre_fecha_arquivos(aArqs, .T.)
	abre_fecha_arquivos(aArqs, .F.)
	return nil
endif


try
	hBrowse 	:= oDom:Get( 'tablewhats' )
	hUpdated	:= hBrowse['selected'][1]

	if hUpdated == nil .or. empty(hUpdated)
		Throw( ErrorNew( "Erro de mensagens", 0, 0, "Forced Error", "Erro ao carregar mensagens." ) )
	endif
catch
	oDom:SetError("Erro ao abrir as mensagens!")
	
	return nil
end



ace397 -> ( SetScope(0, Padl(hUpdated['ID_RETAG'], 11)) )
ace397 -> ( SetScope(1, Padl(hUpdated['ID_RETAG'], 11)) )

ace397 -> ( DbGoTop() )

n := 0

while ! ace397->(eof())
	Aadd( aMsgs,  { "id" => alltrim(str(n++)),;
				    "st" => ace397->st,;
				    "media_type" => ace397->media_type,;
					"text" => ace397->text,;
					"data" => ace397->data,;
					"hora" => ace397->hora,;
					"resposta" => ace397->resposta}	)

	ace397->(DbSkip())
enddo

oDom:SetJs('abrir_conversa', { 'msgs', aMsgs } )

abre_fecha_arquivos(aArqs, .F.)

return nil