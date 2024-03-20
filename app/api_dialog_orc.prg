#include "defines_whats.ch"


function api_dialog_orc( oDom )
    local hSession

	if USessionReady()
        hSession := UGetSession()
    endif

	do case
		case oDom:GetProc() == 'setorcwhatsapi'
			SetOrcWhatsApi( oDom )						
		otherwise 				
			oDom:SetError( "Proc don't defined => " + oDom:GetProc())
	endcase
	
retu oDom:Send()	






function SetOrcWhatsApi(oDom)	
    local aRows := GetRowsOrc( "ACE055",, 50, oDom)	
    
    if len(aRows) > 0
        oDom:TableSetData( 'orcwhats', aRows )
    endif
return nil


    








function GetRowsOrc( cAlias, nRecno, nTotal, oDom)
	local n := 1
    local aReg
	local aRows := {}	
	
    local hSession
    local hData := {=>}

    local aARQS := { {"ACE003.001"  ,,,        },;
                     {"ACE055.001"  ,,, "ICE0556"},;
                     {"ACE056.001"  ,,, "ICE0560"},;
                     {"ACE920.001"  ,,, "ICE9200"},;
                     {"ACE921.001"  ,,, "ICE9211"},;
                     {"ACE922.001"  ,,, "ICE9220"},;
                     {"ACEWHATS.001",,,          },;
                     {"XCE010.001"  ,,, "YCE010" },;
                     {"ACE010.001"  ,,, "ICE010" } }


    
    if ! abre_fecha_arquivos(aArqs, .T.)
		oDom:SetError('Erro ao abrir arquivos harbour')
    elseif (hData := USession('data_orc')) == nil
        oDom:SetError('Erro ao recuperar cookies, contate a concentra!')
    else
        (cAlias)->( setScope( 0, hData['n_orc'] ) )
        (cAlias)->( setScope( 1, hData['n_orc'] ) )
        (cAlias)->( dbGoTop() )
            
        if ! (cAlias)->( DbVazio() )
            while (cAlias)->( ! eof() ) 
                
                oDom:Console((cAlias)->rec_num)

                aReg := {=>}
                
                HB_HSet( aReg, 'id', n )
                HB_HSet( aReg, '_recno', (cAlias)->( Recno() ) )
                HB_HSet( aReg, 'NUM', (cAlias)->rec_num )
                HB_HSet( aReg, 'NOME', (cAlias)->rec_nom )
                HB_HSet( aReg, 'DATA', StoD((cAlias)->rec_dat) )
                HB_HSet( aReg, 'VALOR', (cAlias)->rec_pre )
                HB_HSet( aReg, 'QTD', (cAlias)->rec_qsp )
                HB_HSet( aReg, 'TIPO', (cAlias)->rec_tipo )
                HB_HSet( aReg, 'SUBTIPO', (cAlias)->rec_sub_h )
                HB_HSet( aReg, 'SSUBTIPO', (cAlias)->rec_tipo_h )
        
                Aadd( aRows, aReg ) 
        
                n++
        
                (cAlias)->( DbSkip() )
            enddo
        else
            oDom:SetMsg('Não existem orçamentos incluídos para este cliente!')
        endif
    endif
	
    abre_fecha_arquivos(aArqs, .F.)

return aRows 