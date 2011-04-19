// The MIT License
// 
// Copyright (c) 2011 Valle del Bit
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.


// Autor: 		Mario Rivera Angeles (lis.mario.rivera@gmail.com)
// Twitter:  	twitter.com/mra_capri
// Objetivo: 	Plugin que incrusta una calculadora basica
// Version: 	1.0.0

/**
 * Inicia closure
 */
(function($) {

	var ONE = 1;
	var COMMAND = 'command';
	var CSS = 'css';
	
	/**
	 *  Metodos principales
	 */
	var methods = {
		/**
		 * Inicia la calculadora
		 * @param {array} [options] Recibe el arreglo de opciones del plugin
		 */		
		init : function(options){
			// Agrega la ui al elemento
			$($.fn.calculator.buildUi()).appendTo(this);
			//busca a los elementos a y les agrega la configuracion de boton
			$(this).find("a").button();
			//Establece la configuracion del elemento
			$(this)
				.css({
					"height":"40px",
					"width":"auto",
					"bottom":"0px",
					"left":"100px",
					"position":"fixed",
					"z-index":"1000",
					"background-color": '#fff' //options.css.background
				});
				
			//Le damos la caracteristica de movible
			$(this).draggable();
			//Define las funciones de los botones
			$.fn.calculator.defineFunctions(this, options.result);
		}
	};

	/**
	 * Plugin jQuery valle del bit que sirve remarcar los componentes
	 * @param {array} [options] Recibe el arreglo de opciones del plugin
	 * @return {object} 
	 */
	$.fn.calculator = function(options, result) {
		// Permite crear un solo elemento
		if($(this).size() == ONE){
			// inicializacion de opciones del plugin antes de contruir el plugin
			var opts = $.fn.calculator.defaults;
			
			// Verifica si la funcion ha sido definida
			if($.isFunction(options)){
				result = options;
				options = {};
				opts = $.extend({}, opts, {"result":result});
			}
			
			// verifica si las opciones viene en el closure, sino
			// le asigna valores por default
			var _options = !options ? opts : options;
			if(_options.hasOwnProperty(COMMAND) && !_options.hasOwnProperty(CSS)){
				_options = $.extend({}, opts.css, opts.result);
			}else if(!_options.hasOwnProperty(COMMAND) && _options.hasOwnProperty(CSS)){
				_options = $.extend({}, opts.command, opts.result);
			}else if(!_options.hasOwnProperty(COMMAND) && !_options.hasOwnProperty(CSS)){
				_options = $.extend({}, opts);
			}else{
				_options = opts;
			}
			
			// itera y reformatea cada elemento que coincide con el elemento
			return this.each(function() {
				// Ejecuta los comandos
				if((typeof(_options.command) === 'string') && methods[_options.command]) {
					return methods[_options.command].apply($(this), [_options]);
				}else{
					return methods['init'].apply($(this), [_options]);
				}
			});		
		}else{
			$(this).text("Plugin require only ONE element!");
		}
	};	
	
	/**
	 * Escribe en el log
	 * @param {object} $object El objeto que va escribirse en el log
	 * @return {void}
	 */
	function debug($object) {
		if (window.console && window.console.log)
			window.console.log($object);
	};
	
	/**
	 * Construye la interfaz de usuario
	 * @return {string} HTML de la interfaz de usuario
	 */
	$.fn.calculator.buildUi = function() {
		var htmlUi = "";
		htmlUi = htmlUi + "<a id='button1'>1</a>";
		htmlUi = htmlUi + "<a id='button2'>2</a>";
		htmlUi = htmlUi + "<a id='button3'>3</a>";
		htmlUi = htmlUi + "<a id='button4'>4</a>";
		htmlUi = htmlUi + "<a id='button5'>5</a>";
		htmlUi = htmlUi + "<a id='button6'>6</a>";
		htmlUi = htmlUi + "<a id='button7'>7</a>";
		htmlUi = htmlUi + "<a id='button8'>8</a>";
		htmlUi = htmlUi + "<a id='button9'>9</a>";
		htmlUi = htmlUi + "<a id='button0'>0</a>";
		htmlUi = htmlUi + "<a id='buttonAddition'>+</a>";
		htmlUi = htmlUi + "<a id='buttonSubtraction'>-</a>";
		htmlUi = htmlUi + "<a id='buttonMultiplication'>*</a>";
		htmlUi = htmlUi + "<a id='buttonDivision'>/</a>";
		htmlUi = htmlUi + "<a id='buttonResult'>=</a>";
		htmlUi = htmlUi + "<a id='buttonClear'>C</a>";
		htmlUi = htmlUi + "<a id='operation'>Operacion</a>";
		return htmlUi;
	};
	
	/**
	 * Define las funciones de los botones
	 * @param {object} element El elemento seleccionado
	 * @return {void}
	 */
	var operation = "";
	var stringResult = "";
	$.fn.calculator.defineFunctions = function(element, result) {
		$(element).find(".ui-button[id^=button]").click(function(event){
			var buttonSelected = $(event.target).text();
			switch(buttonSelected){
				case '0': operation = operation + '0'; break;
				case '1': operation = operation + '1'; break;
				case '2': operation = operation + '2'; break;
				case '3': operation = operation + '3'; break;
				case '4': operation = operation + '4'; break;
				case '5': operation = operation + '5'; break;
				case '6': operation = operation + '6'; break;
				case '7': operation = operation + '7'; break;
				case '8': operation = operation + '8'; break;
				case '9': operation = operation + '9'; break;
				case '+': operation = operation + '+'; break;
				case '-': operation = operation + '-'; break;
				case '*': operation = operation + '*'; break;
				case '/': operation = operation + '/'; break;
				case '=': 					
					stringResult = eval(operation.length > 0 ?operation:''); 
					$(element).find("a#operation span.ui-button-text").text(stringResult); 
					if($.isFunction(result)){result(stringResult);}
					stringResult = '';
					operation = '';
					break;
				case 'C': 
					operation = '';
					$(element).find("a#operation span.ui-button-text").text("Operacion");
					break;
			}
			if(buttonSelected != '=' && buttonSelected != 'C'){
				$(element).find("a#operation span.ui-button-text").text(operation);
			}
		});
	};	
	
	/**
	 * Establece los defaults del plugin
	 */
	$.fn.calculator.defaults = {
		css: {
			background : '#FFF'
		},
		command: 'init'
	};

})(jQuery);