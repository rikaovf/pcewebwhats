<?prg
#include "lib/tweb/tweb.ch" 

    LOCAL o, oWeb, oBrw, aOptions
	
	if ! UsessionReady()
		URedirect('/')
	endif
	
	DEFINE WEB oWeb TITLE 'Concentra Whatsapp'

		oWeb:AddCss("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css")
		oWeb:AddCss("files/css/whats.css")	
		oWeb:AddJs("files/js/whats.js")
	
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


			BUTTON ID 'atualiza_chats' LABEL '' ACTION 'setdatawhats' CLASS 'p-2' GRID 1 OF o

			HTML o
				<script>
					var phone = '';
					var port = '';
					var phoneEmpty = 'true';
					var config = {};
					var atualiza = document.getElementById("brw_whats-atualiza_chats");

					setTimeout(() => {
						atualiza.click();
						atualiza.hidden = true;
					}, 100);
				</script>

				<script type="module">
					import {configServer} from '../files/js/config.js'
					
					config = configServer;
				</script>
			ENDTEXT	
			
			ROW o VALIGN 'top'
			
				COL o CLASS 's-0' GRID 11
				
					//	https://tabulator.info/docs/5.4/options
				
					aOptions := { ;
						'index' => 'id',;
						'maxHeight' => '85vh',;
						'selectable' => 1;
					}
					
					aEvents := { { 'name' => 'rowClick' , 'proc' => 'abreconversa'} }
					
					DEFINE BROWSE oBrw ID 'tablewhats' OPTIONS aOptions EVENTS aEvents OF o 
						
						//	https://tabulator.info/docs/5.4/columns 
						
						COL oCol TO oBrw CONFIG { 'title' => "Nome", 'field' => "CHAVE_CLI", 'width' => 200 }
						COL oCol TO oBrw CONFIG { 'title' => "Telefone", 'field' => "N_WHATSAPP", 'width' => 200 }
						COL oCol TO oBrw CONFIG { 'title' => "Situação", 'field' => "SITUACAO", 'formatter' => '_CorSituacao' }
						COL oCol TO oBrw CONFIG { 'title' => "Data", 'field' => "DATA" }
						COL oCol TO oBrw CONFIG { 'title' => "Hora", 'field' => "HORA" }
						COL oCol TO oBrw CONFIG { 'title' => "Funcionário", 'field' => "FUNC_ABERT", 'width' => 1000 }
					INIT BROWSE oBrw 

				ENDCOL o			
		
			ENDROW o		
			
			HTML o
				<script>
					var element = [...document.getElementsByClassName("row align-items-start justify-content-start")][0];
					var card = [...document.getElementsByClassName("card")][0];
					
					var brwWhats = document.getElementById("brw_whats");

					element.id = 'container-whats';
					
					brwWhats.classList.add('col-12');
					card.classList.add('borda_caixa_conv');

					setInterval(() => {
						atualiza.click();
					}, 10000);
				</script>
			ENDTEXT	
		
		ENDFORM o

		oWeb:AddJs("files/js/table.js")
	
		INIT WEB oWeb RETURN
?>

