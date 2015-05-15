window.iTorr?iTorr.Menu=function($,W,D){
	var 
	body=D.body,
	MENU=[],
	now_m,
	now_dom,
	hideM=function(e){

		O.className='h';
		D.onclick=null;

		if(now_m&&now_m.close)
			now_m.close(now_dom);
	},showM=function(e,m,dom){
		e.stopPropagation();
		e.preventDefault();

		now_m=m;
		now_dom=dom;
		dom.focus();

		var _o;
		O.innerHTML='';
		m.menu.each(function(o){
			if(!o)
				return true

			if(!o.type){
				_o=$.D('a');
				_o.innerHTML=o.text;
				if(o.func)
					_o.func=o.func;

				if(o.key){
					var span=$.D('span');
					span.innerHTML=o.key;
					_o.add(span);
				}
			}else if(o.type=='hr'){
				_o=$.D('hr');
			}
			O.add(_o);

		});

		if(m.open){
			m.open(dom);
		}

		var 
		top=e.clientY,
		left=e.clientX;

		var MaxLeft=O.offsetWidth+15;
		if(body.offsetWidth-left<MaxLeft)
			left=body.offsetWidth-MaxLeft;

		var MaxTop=O.offsetHeight+15;
		if(body.offsetHeight-top<MaxTop)
			top=body.offsetHeight-MaxTop;

		O.style.cssText='left:'+left+'px;top:'+top+'px;';
		O.className='';

		D.onclick=hideM;

		if(D.selection){
			D.selection.empty();
		}else if(W.getSelection){
			W.getSelection().removeAllRanges();
		}
	};

	var
	O=D.createElement('div');
	O.className='h';
	O.id='menu';
	body.appendChild(O);

	O.onclick=function(e){

		var o=e.target;
		while(o!=O){

			if(o.func)
				o.func(now_dom);
				
			o=o.parentNode;
		};
	}
	D.oncontextmenu=function(e){
		e=e||W.event;

		var o=e.target;

		hideM();

		while(o!=D){
			if(!MENU.each(function(menu){
				var dom=menu.dom;

				//console.log(dom)
				if((typeof dom=='string'&&$$(dom).indexOf(o)!=-1)||o==menu.dom){
					showM(e,menu,o);
					return false;
				}
			}))
				break;
			
			o=o.parentNode;
		};
	};
	O.oncontextmenu=function(e){
		e.stopPropagation();
		e.preventDefault();
	};

	var Menu={
		reg:function(){

			var
			A,dom,menu,config,
			arg=$.toArr(arguments);

			while(A=arg.shift()){
				if(A instanceof HTMLElement||typeof A=='string')
					dom=A;
				else if(A instanceof Array)
					menu=A;
				else if(A instanceof Object)
					config=A;
			}

			if(!config)
				config={};

			if(!dom)
				return alert('不正确的右键菜单注册');

			config.dom=dom;

			if(menu)
				config.menu=menu;

			
			MENU.push(config);
			// if(config.id)
			// 	O.id=config.id;
			// else
			// 	O.id='imenu';
			//console.log(config.dom);
			//config.dom.setAttribute('select','true');

			return Menu
		},del:function(dom){
			var i=MENU.length;
			while(i--){
				if(MENU[i].dom==dom){
					delete MENU[i];
				}
			}
		}
	}
	return Menu
}(iTorr,this,document):alert('请确保 itorr.js 在 menu 之前运行！')