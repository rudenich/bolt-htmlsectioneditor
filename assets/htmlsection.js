/*!
 *
 * jQuery TE 1.4.0 , http://jqueryte.com/
 * Copyright (C) 2013, Fatih Koca (fattih@fattih.com), (http://jqueryte.com/about)

 * jQuery TE is provided under the MIT LICENSE.
 *
*/

(function($){		
	$.fn.jqte = function(options){
  
		// default titles of buttons
		var varsTitle = [
			{title:"Source"},
            {title:'Layout'}
			];

		// default link-type names
		
		var vars = $.extend({
			// options
			'status'		: true,
			'css' 			: "jqte",
			'title'			: true,
			'titletext'		: varsTitle,
			'button'		: "OK",

			'fsize' 		: true,
			'funit'			: "px",
			'unlink'		: true,
            'layout'        : true,
			
			// events
			'change'		: "",
			'focus'			: "",
			'blur'			: ""
		}, options);
		
		// methods
		$.fn.jqteVal = function(value){
			$(this).closest("."+vars.css).find("."+vars.css+"_editor").html(value);
		}
		
		// browser information is received
		var thisBrowser = navigator.userAgent.toLowerCase();
		
		// if browser is ie and it version is 7 or even older, close title property
		if(/msie [1-7]./.test(thisBrowser))
			vars.title = false;
		
		var buttons = [];
		
		// insertion function for parameters to toolbar
		function addParams(name,command,key,tag,emphasis)
		{
			var thisCssNo  = buttons.length+1;
			return buttons.push({name:name, cls:thisCssNo, command:command, key:key, tag:tag, emphasis:emphasis});
		};
		
		// add parameters for toolbar buttons

		addParams('source','displaysource','','',false); // feature of displaying source
        addParams('layout','layout','','',false); // feature of displaying source

		return this.each(function(){
			if(!$(this).data("jqte") || $(this).data("jqte")==null || $(this).data("jqte")=="undefined")
				$(this).data("jqte",true);
			else 
				$(this).data("jqte",false);
			
			// is the status false of the editor
			if(!vars.status || !$(this).data("jqte"))
			{
				// if wanting the false status later
				if($(this).closest("."+vars.css).length>0)
				{
					var editorValue	= $(this).closest("."+vars.css).find("."+vars.css+"_editor").html();
					
					// add all attributes of element
					var thisElementAttrs = "";
					
					$($(this)[0].attributes).each(function()
					{
						if(this.nodeName!="style")
							thisElementAttrs = thisElementAttrs+" "+this.nodeName+'="'+this.nodeValue+'"';
					});
					
					var thisElementTag = $(this).is("[data-origin]") && $(this).attr("data-origin")!="" ? $(this).attr("data-origin") : "textarea";
					
					// the contents of this element
					var createValue	= '>'+editorValue;

					
					var thisClone = $(this).clone();
					
					$(this).data("jqte",false).closest("."+vars.css).before(thisClone).remove();
					thisClone.replaceWith('<'+ thisElementTag + thisElementAttrs + createValue + '</'+thisElementTag+'>');
				}
				return;
			}
			
			// element will converted to the jqte editor
			var thisElement = $(this);
			
			// tag name of the element
			var thisElementTag = $(this).prop('tagName').toLowerCase();
			
			// tag name of origin
			$(this).attr("data-origin",thisElementTag);
			
			// contents of the element
			var thisElementVal = $(this).is("[value]") || thisElementTag == "textarea" ? $(this).val() : $(this).html();
			
			// decode special html characters
			thisElementVal = thisElementVal.replace(/&#34;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
			
			// start jqte editor to after the element
			$(this).after('<div class="'+vars.css+'"></div>');
			
			// jqte
			var jQTE = $(this).next('.'+vars.css);
			
			// insert toolbar in jqte editor
			jQTE.html('<div class="'+vars.css+"_toolbar"+'" role="toolbar" unselectable></div><div class="'+vars.css+'_linkform" style="display:none" role="dialog"></div><div class="'+vars.css+"_editor"+'"></div>');
			
			var toolbar			= jQTE.find('.'+vars.css+"_toolbar"); // the toolbar variable
			var linkform		= jQTE.find('.'+vars.css+"_linkform"); // the link-form-area in the toolbar variable
			var editor			= jQTE.find('.'+vars.css+"_editor"); // the text-field of jqte editor
			var emphasize		= vars.css+"_tool_depressed"; // highlight style of the toolbar buttons
			
			// add to some tools in link form area
			linkform.append('<div class="'+vars.css+'_linktypeselect" unselectable></div><input class="'+vars.css+'_linkinput" type="text/css" value=""><div class="'+vars.css+'_linkbutton" unselectable>'+vars.button+'</div> <div style="height:1px;float:none;clear:both"></div>');
			
			var linktypeselect	= linkform.find("."+vars.css+"_linktypeselect"); // the tool of link-type-selector
			
			// add to the link-type-selector sub tool parts
			linktypeselect.append('<div class="'+vars.css+'_linktypeview" unselectable></div><div class="'+vars.css+'_linktypes" role="menu" unselectable></div>');

			
			// create to the source-area
			editor.after('<div class="'+vars.css+'_source '+vars.css+'_hiddenField"></div>');
			
			var sourceField = jQTE.find("."+vars.css+"_source"); // the source-area variable
			
			// move the element to the source-area
			thisElement.appendTo(sourceField);

			editor.attr("contenteditable","true").html(thisElementVal);

			// insertion the toolbar button
			for(var n = 0; n < buttons.length; n++)
			{
				// if setting of this button is activated (is it true?)
				if(vars[buttons[n].name])
				{
					// if it have a title, add to this button
					var buttonHotkey = buttons[n].key.length>0 ? vars.titletext[n].hotkey!=null && vars.titletext[n].hotkey!="undefined" && vars.titletext[n].hotkey!="" ? ' (Ctrl+'+vars.titletext[n].hotkey+')' : '' : '';
					var buttonTitle = vars.titletext[n].title!=null && vars.titletext[n].title!="undefined" && vars.titletext[n].title!="" ? vars.titletext[n].title+buttonHotkey : '';
					
					// add this button to the toolbar
					toolbar.append('<div class="'+vars.css+'_tool '+vars.css+'_tool_'+buttons[n].cls+'" role="button" data-tool="'+n+'" unselectable><a class="'+vars.css+'_tool_icon" unselectable></a></div>');
					
					// add the parameters to this button
					toolbar.find('.'+vars.css+'_tool[data-tool='+n+']').data({tag : buttons[n].tag, command : buttons[n].command, emphasis : buttons[n].emphasis, title : buttonTitle});

				}
			}
			
			// add the prefix of css according to browser
			var prefixCss = "";

			if(/msie/.test(thisBrowser)) // ie
				prefixCss = '-ms-';
			else if(/chrome/.test(thisBrowser) || /safari/.test(thisBrowser) || /yandex/.test(thisBrowser)) // webkit group (safari, chrome, yandex)
				prefixCss = '-webkit-';
			else if(/mozilla/.test(thisBrowser)) // firefox
				prefixCss = '-moz-';
			else if(/opera/.test(thisBrowser)) // opera
				prefixCss = '-o-';
			else if(/konqueror/.test(thisBrowser)) // konqueror
				prefixCss = '-khtml-';
			else 
				prefixCss = '';
				
			// the feature of placeholder
			if(vars.placeholder && vars.placeholder!="")
			{
				jQTE.prepend('<div class="'+vars.css+'_placeholder" unselectable><div class="'+vars.css+'_placeholder_text">'+vars.placeholder+'</div></div>');
				
				var placeHolder = jQTE.find("."+vars.css+"_placeholder");
				
				placeHolder.click(function(){
					editor.focus();
				});
			}
			// make unselectable to unselectable attribute ones
			jQTE.find("[unselectable]")
				.css(prefixCss+"user-select","none")
				.addClass("unselectable")
				.attr("unselectable","on")
				.on("selectstart mousedown",false);
			
			// each button of the toolbar
			var toolbutton = toolbar.find("."+vars.css+"_tool");

			// the event of click to the toolbar buttons
			toolbutton
				.unbind("click")
				.click(function(e){
                    if($(this).data('command')=='layout'){
                        var template = "<section><article><h2 class='article-title'>title</h2><p><i>article - intro</i></p><p>article content</p></article></section>"
                        editor.append(template);

                    }
					editor.trigger("change");
				})
				// the event of showing to the title bubble when mouse over of the toolbar buttons
				.hover(function(e){
				},function(){
					$('.'+vars.css+'_title').remove();
				});

			// the methods of the text fields
			editor

				// trigger change method of the text field when the text field modified
				.bind("keypress keyup keydown drop cut copy paste DOMCharacterDataModified DOMSubtreeModified",function()
				{
					// export contents of the text to the sources
					if(!toolbar.data("sourceOpened"))
						$(this).trigger("change");
						
					// hide the link-type-field
					
					// if the change method is added run the change method   
					if($.isFunction(vars.change))
						vars.change();
						
					// the feature of placeholder
					if(vars.placeholder && vars.placeholder!="")
						$(this).text()!="" ? placeHolder.hide() : placeHolder.show();
				})
				.bind("change",function()
				{
					if(!toolbar.data("sourceOpened"))
					{

					}
                    $(thisElement).val(editor.html());
				})

				// run to keyboard shortcuts
				.keydown(function(e)
				{
					// if ctrl key is clicked
					if(e.ctrlKey)
					{
						// check all toolbar buttons
						for(var n = 0; n < buttons.length; n++)
						{
							// if this settings of this button is activated (is it true)
							// if the keyed button with ctrl is same of hotkey of this button
							if(vars[buttons[n].name] && e.keyCode == buttons[n].key.charCodeAt(0))
							{
								if(buttons[n].command!='' && buttons[n].command!='linkcreator')
									selectionSet(buttons[n].command,null);
								
								else if(buttons[n].command=='linkcreator')
									selected2link();
									
								return false;
							}
						}
					}
				})

				// method of triggering to the highlight button

				// the event of focus to the text field
				.focus(function()
                {
					// add onfocus class
					jQTE.addClass(vars.css+"_focused");
					
					// prevent focus problem on opera
					if(/opera/.test(thisBrowser))
					{
						var range = document.createRange();
						range.selectNodeContents(editor[0]);
						range.collapse(false);
						var selection = window.getSelection();
						selection.removeAllRanges();
						selection.addRange(range);
					}
				})

				// the event of focus out from the text field
				.focusout(function()
				{
					// remove to highlights of all toolbar buttons
					toolbutton.removeClass(emphasize);
					
					// remove onfocus class	
					jQTE.removeClass(vars.css+"_focused");

				});
		});
	};
})(jQuery);