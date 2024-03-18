<?prg
#include "lib/tweb/tweb.ch" 

    LOCAL o, oWeb, oBrw, aOptions
	
	if ! UsessionReady()
		URedirect('/')
	endif
	
	DEFINE WEB oWeb TITLE 'Concentra Whatsapp'

		oWeb:AddCss("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css")
		oWeb:AddCss("files/css/whats.css")
		oWeb:AddCss("files/css/loader.css")	
		oWeb:AddJs("files/js/whatsapi.js")
		oWeb:AddJs("files/js/rowformatter.js")
	
		DEFINE FORM o ID 'brw_whats' API 'api_brw_whats' OF oWeb 
		
		INIT FORM o 
		
			
			////////////////// CABEÇALHO ////////////////
			HTML o
				<div class="header">
				<div class="img-w col12"></div>
			ENDTEXT
			IF USessionReady()
				HTML o
					<button id="btn_sair" type="button" class="btn_sair" data-live="" data-onclick="encerrar_sessao" name="encerrar_sessao" value="">
						<i id="btn_sair_svg" class="btn_sair_svg bi bi-power"></i>						
					</button>
				ENDTEXT		
			ENDIF
			HTML o
				</div>
			ENDTEXT
			//////////////// FIM CABEÇALHO //////////////


			/////// BOTAO GENERICO PARA ATUALIZAR OS CHATS - APOS INICIO FICA HIDDEN //////
			BUTTON ID 'atualiza_chats' LABEL '' ACTION 'setdatawhatsapi' GRID 1 OF o
			///////////////////////////////////////////////////////////////////////////////
			

			////////////// INICIALIZAÇÃO DE VARIAVEIS //////////////
			HTML o
				<script>
					var phone = '';
					var port = '';
					var idRetag = '';
					var config = {};
					var phoneEmpty = true;
					var atualiza = false;
					var clicouMesmaConversa = false;    
					var timeoutMsgAtualiza = [];
					var atualizaChats = document.getElementById("brw_whats-atualiza_chats");

					setTimeout(() => {
						atualizaChats.click();
						atualizaChats.hidden = true;
					}, 100);
				</script>

				<script type="module">
					import {configServer} from '../files/js/config.js'
					
					config = configServer;
				</script>
			ENDTEXT	
			//////////////////////////////////////////////////////////



			ROW o VALIGN 'top'
				COL o CLASS 's-0' GRID 11

					aOptions := { 'index' => 'id',;
								  'maxHeight' => '85vh',;
								  'columnHeaderSortMulti' => .F. }
					
					aEvents := { { 'name' => 'rowClick' , 'proc' => 'infocliente'} }
					
					DEFINE BROWSE oBrw ID 'tablewhats' OPTIONS aOptions EVENTS aEvents OF o 
						COL oCol TO oBrw CONFIG { 'title' => "Nome", 'field' => "CHAVE_CLI", 'width' => 200, 'headerFilter' => .T., 'headerSort' => .F. }
						COL oCol TO oBrw CONFIG { 'title' => "Telefone", 'field' => "N_WHATSAPP", 'width' => 200, 'headerFilter' => .T., 'headerSort' => .F. }
						COL oCol TO oBrw CONFIG { 'title' => "Situação", 'field' => "SITUACAO", 'formatter' => '_CorSituacao', 'headerSort' => .F. }
						COL oCol TO oBrw CONFIG { 'title' => "Data", 'field' => "DATA", 'headerSort' => .F. }
						COL oCol TO oBrw CONFIG { 'title' => "Hora", 'field' => "HORA", 'headerSort' => .F. }
						COL oCol TO oBrw CONFIG { 'title' => "Funcionário", 'field' => "FUNC_ABERT", 'width' => 1000, 'headerSort' => .F. }
					INIT BROWSE oBrw 
				ENDCOL o			
			ENDROW o		
			


			/// ESCONDE BOTAO ATUALIZA - E INICIA ATUALIZAÇÃO POR INTERVALO DOS CHATS ///
			///////// ATRIBUI TAMBEM ID AO CONTAINER, PARA APLICAR ESTILOS CSS //////////
			HTML o
				<script>
					var element = [...document.getElementsByClassName("row align-items-start justify-content-start")][0];
					var brwWhats = document.getElementById("brw_whats");

					element.setAttribute("style", "visibility:hidden;")
					element.id = 'container-whats';
					
					
					brwWhats.classList.add('col-12');

					setInterval(() => {
						atualizaChats.click();
					}, 10000);
				</script>
			ENDTEXT	
			/////////////////////////////////////////////////////////////////////////////
		ENDFORM o

		oWeb:AddJs("files/js/tableapi.js")
	
		INIT WEB oWeb RETURN
?>

