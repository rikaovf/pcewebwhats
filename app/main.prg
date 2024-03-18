// PCEWEB - By Ricieri 01/12/2023 16:42
// Desenvolvido para conferência e geração de pacotes  via datalogic, para a Drogal.
#define VK_ESCAPE	27

#include "Conc.ch"
#include "directry.ch"

#require "hbmemio"

REQUEST HB_LANG_PT
REQUEST HB_CODEPAGE_PTISO
REQUEST HB_CODEPAGE_PT850
REQUEST HB_MEMIO
REQUEST HB_GT_WVT
REQUEST HB_GT_WVT_DEFAULT
REQUEST HB_GT_WIN


function main()
    #include "iniweb.prg"
return ServerPceWEb()




function ServerPceWEb()
    InitServer()    
    ? "Server On"
    //while ! Esc() --> aumenta absurdamente o processamento, troquei pela linha abaixo.
    while inkey(0) != VK_ESCAPE
    enddo      
return nil




procedure ConectarLeto();return
procedure ExecutaProgramaLocal();return
procedure __eCancel();return
procedure INIMODO();return
procedure PILHA();return
procedure SCRSAVE();return
procedure LOG_DE_EVENTOS();return
procedure SCRREST();return
procedure BEEP();return
procedure NC_SHIFT();return
procedure APAGALIXO();return
procedure REDE_WINDOWS_VERIFICA_CONFIGURACAO();return
                        


                