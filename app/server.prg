#INCLUDE "hbthread.ch"

REQUEST TWeb
REQUEST DBSETFILTER
REQUEST HB_TRANSLATE
REQUEST HB_CODEPAGE_UTF8
REQUEST HB_LANG_ES
REQUEST TWEB

function InitServer()
    hb_cdpSelect("UTF8")
    hb_LangSelect('ES')

	Set( _SET_DATEFORMAT, 'YYYY-MM-DD' )
	
    hb_threadStart( HB_THREAD_INHERIT_MEMVARS, @WebServer() )
return nil

 

 

function WebServer()

       local oServer := UHttpd2New()

       oServer:lUtf8 := .t.
       oServer:SetPort(83)
       oServer:SetDirFiles( 'data' )
       oServer:SetDirFiles( 'files' )
       oServer:bInit := {|hInfo| ShowInfo( hInfo ) }
       
       oServer:cSessionPath := '.sessions' // Default path session ./sessions
       oServer:cSessionName := 'USESSID' // Default session name USESSID
       oServer:cSessionPrefix := 'sess_' // Default prefix sess_
       oServer:cSessionSeed := 'm!PaswORD@' // Password default ...
       oServer:nSessionDuration := 3600 // Default duration session time 3600
       oServer:nSessionGarbage := 1000 // Default totals sessions executed for garbage
       oServer:nSessionLifeDays := 3 // Default days stored for garbage 3
       oServer:lSessionCrypt := .F. // Default crypt session .F.

       oServer:Route( '/', 'login.html' )   
       oServer:Route( 'whatsapp', 'whatsapp.html' )   
       
        if ! oServer:Run()
            ? "=> Server error:", oServer:cError
            return 1
        endif
        
    return 0





    function ShowInfo( hInfo ) 

        HB_HCaseMatch( hInfo, .f. )
    
        ? '---------------------------------'	
        ?  'Server Harbour9000 was started...'
        ?  '---------------------------------'
        ?  'Version httpd2...: ' + hInfo[ 'version' ]
        ?  'Start............: ' + hInfo[ 'start' ]
        ?  'Port.............: ' + ltrim(str(hInfo[ 'port' ]))
        ?  'OS...............: ' + OS()
        ?  'Harbour..........: ' + VERSION()
        ?  'Build date.......: ' + HB_BUILDDATE()
        ?  'Compiler.........: ' + HB_COMPILER()
        ?  'SSL..............: ' + if( hInfo[ 'ssl' ], 'Yes', 'No' )
        ?  'Trace............: ' + if( hInfo[ 'debug' ], 'Yes', 'No' )
        ?  'Codepage.........: ' + hb_SetCodePage() + '/' + hb_cdpUniID( hb_SetCodePage() )
        ?  'UTF8 (actived)...: ' + if( hInfo[ 'utf8' ], 'Yes', 'No' )
        ?  '---------------------------------'
    
    retu nil