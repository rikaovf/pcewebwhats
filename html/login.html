<?prg 
#include "lib/tweb/tweb.ch" 

LOCAL o, oWeb, oSelect, oSelectFil

LOCAL aNumeros := RetornaNumeros()

LOCAL hSession
LOCAL hData := {=>}


DEFINE WEB oWeb TITLE 'Login' 

oWeb:cCharset = 'UTF-8'

oWeb:AddCss("files/css/login.css")
oWeb:AddJs("files/js/login.js")

if UsessionReady()
  URedirect('whatsapp')
else
  DEFINE FORM o ID 'login_fil' API 'api_auth_wpp' OF oWeb 
    o:cSizing 	:= 'lg'       	
  
  INIT FORM o  
    DIV o ID 'div_login' CLASS 'div_login'
    
      ROWGROUP o
        SELECT oSelectFil ID 'cod_fil' LABEL 'Selecione a filial:' PROMPT RetornaFiliaisWpp() VALUES RetornaFiliaisWpp() GRID 6  OF o
      ENDROW o		  

      ROWGROUP o
        SELECT oSelect ID 'num_login' LABEL 'Selecione o número:' PROMPT aNumeros VALUES aNumeros OF o
      ENDROW o		
    
      ROWGROUP o
          GET ID 'codigo_func' VALUE '' LABEL 'Codigo:' OF o	
      ENDROW o

      ROWGROUP o
          GET ID 'senha_func' VALUE '' TYPE 'password' LABEL 'Senha:' OF o	
      ENDROW o

      ROWGROUP o
          BUTTON ID 'auth' LABEL 'Login' ACTION 'AutenticaFuncionario' OF o
      ENDROW o
  ENDFORM o

  HTML o
    <script>
       redimensionaElementos()
    </script>
  ENDTEXT
endif

INIT WEB oWeb RETURN
?>