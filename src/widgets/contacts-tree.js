
/**
 * 通讯录树结构
 * @constructor {AccordionMenu}
 * @param  lixuedan
 
 */
export
 function AccordionMenu(options) {
	this.config = {
		containerCls        : '',               
		menuArrs            :  '',                         
		type                :  'click',                    
		renderCallBack      :  null,                       
		clickItemCallBack   : null                        
	};
	this.cache = {
		
	};
	this.init(options);
 }

 
 AccordionMenu.prototype = {

	constructor: AccordionMenu,

	init: function(options){
		this.config = $.extend(this.config,options || {});
		var self = this,
			_config = self.config,
			_cache = self.cache;
		
		$(_config.containerCls).each(function(index,item){
			
			self._renderHTML(item);

			self._bindEnv(item);
		});
	},
	_renderHTML: function(container){
		var self = this,
			_config = self.config,
			_cache = self.cache;
		var ulhtml = $('<ul></ul>');
		$(_config.menuArrs).each(function(index,item){
			var lihtml = $('<li><h2 class="active" data-id="'+item.value+'" data-lev="0" data-name="'+item.name+'" data-count="'+item.count+'"><i class="fa fa-sitemap"></i>'+item.name+'('+item.count+')</h2></li>');

			if(item.submenu && item.submenu.length > 0) {
				self._createSubMenu(item,item.submenu,lihtml);
			}
			$(ulhtml).append(lihtml);
		});
		$(container).html(ulhtml);
		
		_config.renderCallBack && $.isFunction(_config.renderCallBack) && _config.renderCallBack();
		
		self._levelIndent(ulhtml);
	},
	
	_createSubMenu: function(pitem,submenu,lihtml){
		var self = this,
			_config = self.config,
			_cache = self.cache;
		var subUl = $('<ul></ul>'),
			callee = arguments.callee,
			subLi;
		
		$(submenu).each(function(index,item){
			var url = item.url || 'javascript:void(0)';
			var value=item.value;
			var count=item.count;
			subLi = $('<li><a href="'+url+'" data-id="'+value+'" data-pid="'+pitem.value+'" data-name="'+item.name+'" data-count="'+item.count+'"><i class="fa fa-folder"></i> '+item.name+'('+count+')</a></li>');
			if(item.submenu && item.submenu.length > 0) {
				 $(subLi).children('a').prepend('<i class="fa fa-caret-right"></i>');
                callee(item,item.submenu, subLi);
			}
			$(subUl).append(subLi);
		});
		$(lihtml).append(subUl);
	},
	
	_levelIndent: function(ulList){
		var self = this,
			_config = self.config,
			_cache = self.cache,
			callee = arguments.callee;
	   
		var initTextIndent = 0,
			lev = 1,
			$oUl = $(ulList);
		
		while($oUl.find('ul').length > 0){
			initTextIndent = parseInt(initTextIndent,10) + 1;
			initTextIndents = parseInt(initTextIndent,10)*20+'px';
			$oUl.children().children('ul').addClass('lev-' + lev)
						.children('li').children("a").css('padding-left', initTextIndents).attr("data-lev",lev);
			$oUl = $oUl.children().children('ul');
			lev++;
		}
		$(ulList).find('ul').hide();
		$(ulList).find('ul:first').show();	
	},
	
	_bindEnv: function(container) {
		var self = this,
			_config = self.config;

		$('h2,a',container).unbind(_config.type);
		$('h2 i,a i',container).bind(_config.type,function(e){
			e.stopPropagation();
		});
		$('a',container).bind(_config.type,function(e){
			if($(this).siblings('ul').length > 0) {
				$(this).siblings('ul').slideToggle('slow').end();
			}
			$(this).addClass('active').parent('li').siblings().find('a').removeClass('active');
			$(this).parent('li').parent('ul').prev('a').removeClass('active');
			$(this).next('ul').children('li').find('a').removeClass('active');
			$(this).parent('li').siblings().find('ul').hide().end();
			_config.clickItemCallBack && $.isFunction(_config.clickItemCallBack) && _config.clickItemCallBack(e.target);
		});
		$('h2',container).bind(_config.type,function(e){
			$(this).siblings("ul").find('a').removeClass('active');
			_config.clickItemCallBack && $.isFunction(_config.clickItemCallBack) && _config.clickItemCallBack(e.target);

		});
	}
 };
