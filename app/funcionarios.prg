#include "conc.ch"

function RetornaFiliais()

local aARQS := { { "ACE086.001",,, "ICE086" } }

local aFil := {}

if ! abre_fecha_arquivos(aArqs, .T.)
    abre_fecha_arquivos(aArqs, .F.)
    return nil
endif

ace086->(DbGotop())

while ! ace086->(Eof())
    aadd(aFil, ace086->fil_cod)

    ace086->(Dbskip())
enddo

abre_fecha_arquivos(aArqs, .F.)

return aFil









function RetornaFuncionarios( lCodigo, cFILIAL )

LOCAL cFIL_004


LOCAL aARQS := { { "ACE004.001",,, "ICE004" } }
LOCAL aFunc := {}

hb_default(@lCodigo , .T.) 
hb_default(@cFILIAL, "")

if ! abre_fecha_arquivos(aArqs, .T.)
    abre_fecha_arquivos(aArqs, .F.)
    return nil
endif

ACE004 -> ( SetScope(0, "F") )
ACE004 -> ( SetScope(1, "F") )

IF ! EMPTY( cFILIAL )
    P071_ADIC_FILTRO( @cFIL_004, "(EMPTY(TAB_FILIAL).OR.TAB_FILIAL = '" + cFILIAL + "')", )
ENDIF
    
ACE004 -> ( DBSETFILTER( &( "{ ||" + cFIL_004 + "}" ), cFIL_004 ) )
ACE004 -> ( DBGOTOP() )

WHILE ! ACE004->( EOF() )
    AADD(aFunc, IF(lCodigo, SUBSTR( ACE004->TAB_COD, 2, 5 ), OEMTOANSI( ACE004->TAB_DES ) ) )
    ? ACE004->TAB_COD
    ACE004->( DBSKIP() )
ENDDO
    
ACE004->( dbClearFilter() )
    
abre_fecha_arquivos(aArqs, .F.)

return aFunc










function Auth_funcionario(cFunc, cSenha)

LOCAL lAutorizado := .f.
LOCAL aARQS := { { "ACE004.001",,, "ICE004" } }


if ! abre_fecha_arquivos(aArqs, .T.)
    abre_fecha_arquivos(aArqs, .F.)
    return nil
endif


IF ace004 -> ( DbSeekOrd( "F" + StrZero(val(cFunc), 5), "ICE0044" ) ) .and. ! ace004->tab_inativ .and. valida_senha_web( cSenha, ACE004->TAB_SEN2 )
    lAutorizado := .T.
ENDIF    

abre_fecha_arquivos(aArqs, .F.)


return lAutorizado







function valida_senha_web( cSenha, eSenha )


local lRetorno := .F.
local cChave_Crypt := CHR(07)+CHR(01)+CHR(02)+CHR(03)+CHR(05)+CHR(08)+CHR(13)+CHR(21)+CHR(34)+CHR(55)
    
local cSENHA_GENERICA   := "MMFF"
local eSENHA_DIGITADA   := SPACE( 10 )
local eSENHA_FISICA     := SPACE( 10 )

default eSenha := SPACE(11)

cSenha := upper( cSenha )

eSENHA_DIGITADA := crypt( cSenha, cChave_Crypt )
cSENHA_GENERICA := SenhaDoMes()
eSENHA_FISICA   := RET_PARAMETRO( "ACE700.001", "SENHAFISIC", "" )

lRETORNO := eSENHA_DIGITADA == eSenha .or. eSENHA_DIGITADA == eSENHA_FISICA .or. TRIM( cSenha ) == cSENHA_GENERICA

return lRetorno




function RetornaEtapas(lCodigo)

local n

local aArqs := { { "ACE353.001",,, "ICE3530" } }

local cItems := ParametroGenerico( "RespRec", "ItemPedirFilialRetirada", "" )
local aItems := {}

hb_default(@lCodigo, .F.)

if ! abre_fecha_arquivos(aArqs, .T.)
    abre_fecha_arquivos(aArqs, .F.)
    return aItems
endif

if ! empty(cItems)
    aItems := HB_ATokens(cItems, ";" )

    if ! lCodigo
        for n := 1 to len(aItems)
            if ACE353 -> ( DbSeekOrd( StrZero(val(aItems[n]), 2) , "ICE3530" ) )
                aItems[n] := aItems[n] + " - " + ACE353->RESP_IITEM
            endif
        next
    endif
endif

abre_fecha_arquivos(aArqs, .F.)

return aItems





function BuscaFuncionario(cFunc, lDesc)

local cCodigo_Func := ""

local aARQS := { { "ACE004.001",,, "ICE004" } }

hb_default(@lDesc, .F.)

if ! abre_fecha_arquivos(aArqs, .T.)
    abre_fecha_arquivos(aArqs, .F.)
    return nil
endif


IF ace004 -> ( DbSeekOrd( "F" + StrZero(cFunc, 5), "ICE0044" ) ) .and. ! ace004->tab_inativ
    if ! lDesc
       cCodigo_Func := ace004->tab_cod
    else
        cCodigo_Func := ace004->tab_des
    endif
ENDIF    

abre_fecha_arquivos(aArqs, .F.)

return cCodigo_Func