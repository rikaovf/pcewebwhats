#include "defines_whats.ch"


function api_dialog_orc( oDom )
	local hSession

	if USessionReady()
        hSession := UGetSession()
    endif

	do case
		case oDom:GetProc() == '//'
			SetDataWhatsApi( oDom )						
		otherwise 				
			oDom:SetError( "Proc don't defined => " + oDom:GetProc())
	endcase
	
retu oDom:Send()	
