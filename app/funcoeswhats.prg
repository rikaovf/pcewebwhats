#include "conc.ch"
#include "fileio.ch"

*********
procedure gravaLogWhatsapp( cMensagem, lForcaGravaLogWhatsapp, cLog  )
*********
    STATIC lGravaLogWhatsapp

    local nHandle

    hb_default(@lGravaLogWhatsapp, File( "GravaLogWhatsapp.flg" ))
    hb_default(@lForcaGravaLogWhatsapp, .F.)
    hb_default(@cLog, "WhatsApp.log")

    IF lGravaLogWhatsapp .OR. lForcaGravaLogWhatsapp
        cMensagem += hb_EoL()

        if !file( cLog )
            nHandle := fCreate( cLog, FC_NORMAL )
        else
            nHandle := fOpen( cLog, FO_READWRITE,  )
            FSeek( nHandle , 0, FS_END )
        endif

        fWrite( nHandle, dtoc(date()) + " " + Time() + " - " + OemToAnsi( cMensagem ) )

        fClose( nHandle )
    ENDIF

return
    