
//跨浏览器的事件对象
var EventUtil={
	addHandler:function (element,type,handler) {
		if (element.addEventListener) {
			element.addEventListener(type,handler,false);
		}else if (element.attachEvent) {
			element.attachEvent("on"+type,handler);
		}else{
			element["on"+type]=handler;
		}
	},
	getEvent:function (event) {
		return event?event:window.event;
	},
	getTarget:function (event) {
		return event.target||event.srcElement;
	},
	preventDefault:function (event) {
		if (event.preventDefault) {
			event.preventDefault();
		}else{
			event.returnValue=false;
		}
	},
	removeHandler:function (element,type,handler) {
		if (element.removeEventListener) {
			element.removeEventListener(type,handler,false);
		}else if(element.detacheEvent){
			element.detacheEvent("on"+type,handler);
		}else{
			element["on"+type]=null;
		}
	},
	stopPropagation:function (event) {
		if (event.stopPropagation) {
			event.stopPropagation();
		}else{
			event.cancelBubble=true;
		}
	}
};


//将cookie转化成JS对象，取得cookie
function getCookie() {
	var cookie={};
	var all=document.cookie;
	if (all==="") {
		return cookie;
	}
	var list=all.split("; ");
	for (var i = 0; i < list.length; i++) {
		var item=list[i];
		var p=item.indexOf("=");
		var name=item.substring(0,p);
		name=decodeURIComponent(name);
		var value=item.substring(p+1);
		value=decodeURIComponent(value);
		cookie[name]=value;
	}
	return cookie;
}


//设置cookie函数
	function setCookie(name,value,expires,path,domain,secure) {
	var cookie=encodeURIComponent(name)+"="+encodeURIComponent(value);
	if (expires) {
		cookie+="; expires"+"="+expires.toGMTString();
	}
	if (path) {
		cookie+="; path"+"="+path;
	}
	if (domain) {
		cookie+="; domain"+"="+domain;
	}
	if (secure) {
		cookie+="; secure"+"="+secure;
	}
	document.cookie=cookie;
}


//登陆后判断要不要加载消息
function checkCookie() {
	var cookie={};
	var  res;
	var notestate;
	var note=document.getElementById("notebar");
	var follow=document.getElementById("follow");
	var followYet=document.getElementById("follow-yet");
	var loginForm=document.getElementById("loginForm")
	  res=getCookie();
 //判断顶部消息通知cookie
	if (res["notestate"]==1) {
		note.style.display="none";
	}
//判断登录cookie
	if (res["loginSuc"==1]) {
		loginForm.style.display="none";
	}
//判断关注cookie	
	if(res["followSuc"]==1){
		follow.style.display="none";
		followYet.style.display="inline-block";
	}	

}


//关闭顶部通知条函数，完成后设置相应的cookie
function closeNote() {
	var notestate;
	var note=document.getElementById("notebar");
	var nomore=document.getElementById("closenote");
	note.style.display="none";
//设置顶部消息栏cookie
	setCookie("notestate",1);	
}

//取得事件目标
var nomore=document.getElementById("closenote");
//点击不再提醒，触发事件，执行closeNote函数
EventUtil.addHandler(nomore,"click",closeNote);
//登陆后检查cookie
EventUtil.addHandler(window,"load",checkCookie);
// 没有登录cookie,点击关注，执行登录函数
form=document.getElementsByTagName("form")[0];
var follow=document.getElementById("follow");
EventUtil.addHandler(follow,"click",login);
// 登录函数
function login() {
var form=document.getElementsByTagName("form")[0],
nmsg = document.getElementById('message'),
inputName=form.username,
inputPswd=form.password,
loginForm=document.getElementById("loginForm");
//弹出登录框
loginForm.style.display="block";
}	
//点击关闭按钮，关闭登录框
var	closeLoginForm=document.getElementById("closeLoginForm");
loginForm=document.getElementById("loginForm");
//绑定事件
EventUtil.addHandler(closeLoginForm,"click",closeLoginBox);
//执行函数
function closeLoginBox() {
		loginForm.style.display="none";
}
//提示错误信息
function showError(node,msg) {
	node.className="error";
	nmsg.innerHTML+=msg;
	node.focus();
}
//验证用户名
function checkUserName() {
	var uName=inputName.value;
	var emsg="";
	if (uName.length<6||uName.length>11) {
		emsg="账号名必须大于6位小于11位";
	}
	//将错误信息显示出来
	if (!!emsg) {
		showError(inputName,emsg);
		 disableSubmit(true);
	}	
};
//验证密码
function checkPassword() {
	var pswd=inputPswd.value;
	var emsg = '';
        if (pswd.length<6){
        	emsg = '密码长度必须大于6位';
        }else if(!/\d/.test(pswd)||!/[a-z]/i.test(pswd)){
        	emsg = '密码必须包含数字和字母';
        }
        //将错误信息显示出来
		if (!!emsg) {
			showError(inputPswd,emsg);
			 disableSubmit(true);
		}
};
//清除错误提示样式
function clearError(node) {
	node.classList.remove("error");
	nmsg.innerHTML="";
}
//禁用提交按钮的状态选择
function disableSubmit(disabled){
	form.loginBtn.disabled = !!disabled;
	var method = !disabled?'remove':'add';
    form.loginBtn.classList[method]('disabled');
}
//输入时，清除错误提示样式与按钮禁用状态
EventUtil.addHandler(form,"input",function (event) {
	form=document.getElementsByTagName("form")[0],
	event=EventUtil.getEvent(event);
	// 还原错误状态
	clearError(event.target);
	//输入时，取消placeholder
	event.target.placeholder=" ";
    // 还原登录按钮状态
    disableSubmit(false);
})
//MD5函数
function md5cycle(x, k) {
var a = x[0], b = x[1], c = x[2], d = x[3];

a = ff(a, b, c, d, k[0], 7, -680876936);
d = ff(d, a, b, c, k[1], 12, -389564586);
c = ff(c, d, a, b, k[2], 17,  606105819);
b = ff(b, c, d, a, k[3], 22, -1044525330);
a = ff(a, b, c, d, k[4], 7, -176418897);
d = ff(d, a, b, c, k[5], 12,  1200080426);
c = ff(c, d, a, b, k[6], 17, -1473231341);
b = ff(b, c, d, a, k[7], 22, -45705983);
a = ff(a, b, c, d, k[8], 7,  1770035416);
d = ff(d, a, b, c, k[9], 12, -1958414417);
c = ff(c, d, a, b, k[10], 17, -42063);
b = ff(b, c, d, a, k[11], 22, -1990404162);
a = ff(a, b, c, d, k[12], 7,  1804603682);
d = ff(d, a, b, c, k[13], 12, -40341101);
c = ff(c, d, a, b, k[14], 17, -1502002290);
b = ff(b, c, d, a, k[15], 22,  1236535329);

a = gg(a, b, c, d, k[1], 5, -165796510);
d = gg(d, a, b, c, k[6], 9, -1069501632);
c = gg(c, d, a, b, k[11], 14,  643717713);
b = gg(b, c, d, a, k[0], 20, -373897302);
a = gg(a, b, c, d, k[5], 5, -701558691);
d = gg(d, a, b, c, k[10], 9,  38016083);
c = gg(c, d, a, b, k[15], 14, -660478335);
b = gg(b, c, d, a, k[4], 20, -405537848);
a = gg(a, b, c, d, k[9], 5,  568446438);
d = gg(d, a, b, c, k[14], 9, -1019803690);
c = gg(c, d, a, b, k[3], 14, -187363961);
b = gg(b, c, d, a, k[8], 20,  1163531501);
a = gg(a, b, c, d, k[13], 5, -1444681467);
d = gg(d, a, b, c, k[2], 9, -51403784);
c = gg(c, d, a, b, k[7], 14,  1735328473);
b = gg(b, c, d, a, k[12], 20, -1926607734);

a = hh(a, b, c, d, k[5], 4, -378558);
d = hh(d, a, b, c, k[8], 11, -2022574463);
c = hh(c, d, a, b, k[11], 16,  1839030562);
b = hh(b, c, d, a, k[14], 23, -35309556);
a = hh(a, b, c, d, k[1], 4, -1530992060);
d = hh(d, a, b, c, k[4], 11,  1272893353);
c = hh(c, d, a, b, k[7], 16, -155497632);
b = hh(b, c, d, a, k[10], 23, -1094730640);
a = hh(a, b, c, d, k[13], 4,  681279174);
d = hh(d, a, b, c, k[0], 11, -358537222);
c = hh(c, d, a, b, k[3], 16, -722521979);
b = hh(b, c, d, a, k[6], 23,  76029189);
a = hh(a, b, c, d, k[9], 4, -640364487);
d = hh(d, a, b, c, k[12], 11, -421815835);
c = hh(c, d, a, b, k[15], 16,  530742520);
b = hh(b, c, d, a, k[2], 23, -995338651);

a = ii(a, b, c, d, k[0], 6, -198630844);
d = ii(d, a, b, c, k[7], 10,  1126891415);
c = ii(c, d, a, b, k[14], 15, -1416354905);
b = ii(b, c, d, a, k[5], 21, -57434055);
a = ii(a, b, c, d, k[12], 6,  1700485571);
d = ii(d, a, b, c, k[3], 10, -1894986606);
c = ii(c, d, a, b, k[10], 15, -1051523);
b = ii(b, c, d, a, k[1], 21, -2054922799);
a = ii(a, b, c, d, k[8], 6,  1873313359);
d = ii(d, a, b, c, k[15], 10, -30611744);
c = ii(c, d, a, b, k[6], 15, -1560198380);
b = ii(b, c, d, a, k[13], 21,  1309151649);
a = ii(a, b, c, d, k[4], 6, -145523070);
d = ii(d, a, b, c, k[11], 10, -1120210379);
c = ii(c, d, a, b, k[2], 15,  718787259);
b = ii(b, c, d, a, k[9], 21, -343485551);

x[0] = add32(a, x[0]);
x[1] = add32(b, x[1]);
x[2] = add32(c, x[2]);
x[3] = add32(d, x[3]);

}

function cmn(q, a, b, x, s, t) {
a = add32(add32(a, q), add32(x, t));
return add32((a << s) | (a >>> (32 - s)), b);
}

function ff(a, b, c, d, x, s, t) {
return cmn((b & c) | ((~b) & d), a, b, x, s, t);
}

function gg(a, b, c, d, x, s, t) {
return cmn((b & d) | (c & (~d)), a, b, x, s, t);
}

function hh(a, b, c, d, x, s, t) {
return cmn(b ^ c ^ d, a, b, x, s, t);
}

function ii(a, b, c, d, x, s, t) {
return cmn(c ^ (b | (~d)), a, b, x, s, t);
}

function md51(s) {
txt = '';
var n = s.length,
state = [1732584193, -271733879, -1732584194, 271733878], i;
for (i=64; i<=s.length; i+=64) {
md5cycle(state, md5blk(s.substring(i-64, i)));
}
s = s.substring(i-64);
var tail = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
for (i=0; i<s.length; i++)
tail[i>>2] |= s.charCodeAt(i) << ((i%4) << 3);
tail[i>>2] |= 0x80 << ((i%4) << 3);
if (i > 55) {
md5cycle(state, tail);
for (i=0; i<16; i++) tail[i] = 0;
}
tail[14] = n*8;
md5cycle(state, tail);
return state;
}

/* there needs to be support for Unicode here,
 * unless we pretend that we can redefine the MD-5
 * algorithm for multi-byte characters (perhaps
 * by adding every four 16-bit characters and
 * shortening the sum to 32 bits). Otherwise
 * I suggest performing MD-5 as if every character
 * was two bytes--e.g., 0040 0025 = @%--but then
 * how will an ordinary MD-5 sum be matched?
 * There is no way to standardize text to something
 * like UTF-8 before transformation; speed cost is
 * utterly prohibitive. The JavaScript standard
 * itself needs to look at this: it should start
 * providing access to strings as preformed UTF-8
 * 8-bit unsigned value arrays.
 */
function md5blk(s) { /* I figured global was faster.   */
var md5blks = [], i; /* Andy King said do it this way. */
for (i=0; i<64; i+=4) {
md5blks[i>>2] = s.charCodeAt(i)
+ (s.charCodeAt(i+1) << 8)
+ (s.charCodeAt(i+2) << 16)
+ (s.charCodeAt(i+3) << 24);
}
return md5blks;
}

var hex_chr = '0123456789abcdef'.split('');

function rhex(n)
{
var s='', j=0;
for(; j<4; j++)
s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
+ hex_chr[(n >> (j * 8)) & 0x0F];
return s;
}

function hex(x) {
for (var i=0; i<x.length; i++)
x[i] = rhex(x[i]);
return x.join('');
}

function md5(s) {
return hex(md51(s));
}

/* this function is much faster,
so if possible we use it. Some IEs
are the only ones I know of that
need the idiotic second function,
generated by an if clause.  */

function add32(a, b) {
return (a + b) & 0xFFFFFFFF;
}

if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
function add32(x, y) {
var lsw = (x & 0xFFFF) + (y & 0xFFFF),
msw = (x >> 16) + (y >> 16) + (lsw >> 16);
return (msw << 16) | (lsw & 0xFFFF);
}
}
 
//表单提交事件
EventUtil.addHandler(form,"submit",function (event) {
	checkPassword();
	checkUserName();
	//取得事件
	event=EventUtil.getEvent(event);
	//提交后禁用提交按钮
	disableSubmit(true);
	//对传入UPL末尾的字符串进行编码
	function addURLParam(url,name,value) {
		url+=(url.indexOf("?")==-1?"?":"&");
		url+=name+"="+value;
		return url;
	}
	//调用Ajax
	var xhr=new XMLHttpRequest();
	//对URL进行编码
    var url=form.getAttribute("action");
    var inputN=form.username.value;
    var inputP=form.password.value;
    var inputN=md5(inputN);
    var inputP=md5(inputP);
    url=addURLParam(url,"userName",inputN);
    url=addURLParam(url,"password",inputP);
    xhr.onreadystatechange=function () {
    	if (xhr.readyState == 4) {
    		if ((xhr.status>=200&&xhr.status<300)||xhr.status==304) {
			   if (xhr.responseText ==1) {
			   	//登陆成功后，关闭登录浮层，设置登录cookie
			    var	loginForm=document.getElementById("loginForm");
				loginForm.style.display="none";
				setCookie("loginSuc",1);
			    } else{
			    	alert("账号或者密码不正确！")
			    }
    		}else{
    			alert("Request was unsuccessful:"+xhr.status);
    		}
    	}
    	}
	xhr.open("get",url,true);
	xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhr.send(null);
EventUtil.preventDefault(event);
});
//点击关注，变成已关注样式，并设置关注cookie
var follow=document.getElementById("follow");
var followYet=document.getElementById("follow-yet");
EventUtil.addHandler(follow,"click",attention);
	function attention() {
	res=getCookie();
	if (res["loginSuc"==1]) {
		follow.style.display="none";
		followYet.style.display="inline-block";
		setCookie("followSuc",1);
	}
}
//鼠标hover到轮播图上的导航按钮时，变成黑色
var navRight=document.getElementById("nav-right");
var searchIcon=navRight.getElementsByTagName("img")[0];
 function changeIcon() {
 	searchIcon.style.src="../img/ss2.png";
 }
 EventUtil.addHandler(searchIcon,"mouseenter",changeIcon);

//轮播图功能
(function () {
	var banner=document.getElementById("banner");
	var bannerDiv=banner.getElementsByTagName("div");
	var bannerImg=banner.getElementsByTagName("img");
	var	bannerIcon=document.getElementById("bannerIcon");	
	var  liIcon=bannerIcon.getElementsByTagName("li");
	 var index=0;
	 var currentIndex;
	 //设置定时器，5秒执行一次
	 dTimer=setInterval(function () {
	 	index++;
	 	if (index>=3) {
			index=0;
		}
		changeBanner();
	 },5000);
	 //停止轮播函数
	 function pause() {
	 	currentIndex=index;
	 	clearInterval(dTimer); 	
	 }
	 //继续轮播函数
	 function play() {
	 	//从当前位置开始轮播
	    index=currentIndex;
	   dTimer=setInterval(function () {
	 	index++;
	 	if (index>=3) {
			index=0;
		}
		changeBanner();
	 },5000);	
	 }
	 //hover到小图标上时切换
	 function iconHover(event) {
	 	event=EventUtil.getEvent(event);
	 	var target=EventUtil.getTarget(event);	
	 	var	bannerIcon=document.getElementById("bannerIcon");
			liIcon=bannerIcon.getElementsByTagName("li");
	 	for (var i = 0; i < liIcon.length; i++) {
	 		if (liIcon[i]==target) {
	 			currentIndex=i;
	 		}
	 	}
	 	clearInterval(dTimer);
	 	//继续轮播
	 	index=currentIndex;
	 	changeBanner();
	 }
//鼠标hover轮播图,停止轮播
EventUtil.addHandler(banner,"mouseover",pause);
//离开时，继续
EventUtil.addHandler(banner,"mouseout",play);
//点击轮播导航，切换轮播图
EventUtil.addHandler(bannerIcon,"click",iconHover);
	function changeBanner() {
	var currentDiv=bannerDiv[index];
	var alpha;
	var bannerIcon=document.getElementById("bannerIcon");
		liIcon=bannerIcon.getElementsByTagName("li");
	//清除导航按钮样式
	for (var i = 0; i < bannerDiv.length; i++) {
		bannerDiv[i].className=" ";
		liIcon[i].className=" ";
	}
	//设置轮播图初始透明度为0
	setOpacity(bannerDiv[index],0);
	//点击时，先让相应的轮播图出现
	bannerDiv[index].className+="displayBanner";
	//相应的导航按钮改变样式
	liIcon[index].className+="getBlack"
	//执行淡入函数
	fadeIn();

	//设置透明度的函数
	function setOpacity(ele,opacity) {
		if (ele.style.opacity!=null) {
		ele.style.opacity=opacity/100;
	}else{
		ele.style.filter = "alpha(opacity=" + opacity + ")"; 
	}
	}
	//淡入效果的函数
	function fadeIn() {
		var alpha=0;
		Otimer=setInterval(
		function () {
			if (alpha<=100){
			setOpacity(currentDiv,alpha);
			alpha+=10;
		}else{
			clearInterval(Otimer);
		}
		},100);
	}
	}	
})();


//tab选项卡功能
(function () {
	//取得相应的样式
	var tab=document.getElementById("tab");
	var tabDiv=tab.getElementsByTagName("div");
	var design=document.getElementById("design");
	var lan=document.getElementById("lan");
	var displayContent=document.getElementById("displayContent");
	var urlTab="http://study.163.com/webDev/couresByCategory.htm";
	var ulContent=displayContent.getElementsByTagName("ul")[0];
	var liUnits=ulContent.getElementsByTagName("li");
	var skip=document.getElementById("skip");
	var imgClass=document.getElementsByClassName("middlePhotoUrl");
	//设置初始的请求值
	var type=10,pageNo=1,psize=20;
	var responseText;
	//点击切换，tab项样式改变，下方课程列表刷新
	EventUtil.addHandler(tab,"click",changeTab);
	//相应的事件函数
	function changeTab(event) {
		//遍历，清除tab选项卡初始样式
		for (var i = 0; i < tabDiv.length; i++) {
			tabDiv[i].className=" ";
		}
		//取得事件目标
		event=EventUtil.getEvent(event);
		target=EventUtil.getTarget(event);
		//改变样式
		target.className="choose";
		//根据事件，取得下方课程列表相应的请求数据
		if (target.id=="lan") {
        		type=20;
        		psize=15;
        	}else{
        		type=10;
        		psize=20;
        	}
        //url编码
        	var urlTab="http://study.163.com/webDev/couresByCategory.htm";
        	urlTab=addURLParam(urlTab,"pageNo",pageNo);
            urlTab=addURLParam(urlTab,"psize",psize);
            urlTab=addURLParam(urlTab,"type",type);
        //调用Ajax，处理传回来的数据，刷新课程列表
        	callAjax("get",urlTab,callback);
		}
	//点击下方导航栏，跳转页面
	EventUtil.addHandler(skip,"click",changePage);
	//相应的事件函数
    function changePage(event) {
    	var skip=document.getElementById("skip");
    	var liSkips=skip.getElementsByTagName("li");
      	event=EventUtil.getEvent(event);
		target=EventUtil.getTarget(event);
		//向前，页面数值减1，到1时不再减
		if (target.id=="goBack") {
			pageNo=pageNo-1;
			if (pageNo<=1) {
				pageNo=1;
			}
		}
		//向后，加1
		else if (target.id=="goForward") {
			pageNo=pageNo+1;
		}else{
			//点击第几页，取得相应的值，作为pageNo的值进行请求
			pageNo=target.innerHTML;
		}
		//url编码
	    var urlTab="http://study.163.com/webDev/couresByCategory.htm";
            urlTab=addURLParam(urlTab,"pageNo",pageNo);
            urlTab=addURLParam(urlTab,"psize",psize);
            urlTab=addURLParam(urlTab,"type",type);
        //调用Ajax，处理传回来的数据，刷新课程列表
            callAjax("get",urlTab,callback);
       } 
       //课程卡片hover上去后出现浮层
       for (var i = 0; i < liUnits.length; i++) {	
       		//给每个课程卡片绑定时间，hover上去时，出现浮层
       		liUnits[i].onmouseover=function (liIndex) {
       			return function () {
       				var displayDetail=liUnits[liIndex].getElementsByClassName("details")[0];
       			       displayDetail.style.display="block";
       			}	
       		}(i);
       		//给每个课程卡片绑定时间，鼠标离开时，关闭浮层
       		liUnits[i].onmouseout=function (liIndex) {
       			return function () {
       				var displayDetail=liUnits[liIndex].getElementsByClassName("details")[0];
       			       displayDetail.style.display="none";
       			}
       		}(i);
       }
       //点击播放视频
       var displayVideo=document.getElementById("displayVideo");
       var displayVideoBox=document.getElementById("video");
       EventUtil.addHandler(displayVideo,"click",playVideo);
       function playVideo() {
       	displayVideoBox.style.display="block";
       }
       //右上角关闭浮层
       var closeVideoBox=document.getElementById("closeVideoBox");
      	EventUtil.addHandler(closeVideoBox,"click",closeVideo);
       	function closeVideo(event) {
       		event=EventUtil.getEvent(event);
       		displayVideoBox.style.display="none";
       		EventUtil.stopPropagation(event);
       	}
		//序列化url函数
	function addURLParam(url,name,value) {
		url+=(url.indexOf("?")==-1?"?":"&");
		url+=name+"="+value;
		return url;
	}
	//序列换URL，页面加载后，进行初始请求。   
	var urlTab=addURLParam(urlTab,"pageNo",pageNo);
	   urlTab=addURLParam(urlTab,"psize",psize);
	   urlTab=addURLParam(urlTab,"type",type);
	//登陆后调用Ajax获取第一页的数据
	callAjax("get",urlTab,callback);
	//AJax处理数据的函数
        function callback(responseText) {
        	var index;
        	var jsonText=JSON.parse(responseText);
        	var list=jsonText.list;
        	var liUnits=document.getElementsByClassName("unit");
        	var skip=document.getElementById("skip");
    		var liSkips=skip.getElementsByTagName("li");
    		//下方相应的页面数字变成绿色
    		for (var i = liSkips.length - 1; i >= 0; i--) {
			liSkips[i].style.color="#333333"
			}
			liSkips[pageNo-1].style.color="#339933";
        	//遍历课程卡片，写入数据
        	for (var i = 0; i < liUnits.length; i++) {
        		//语言项第一页数据格式不知道为什么很特殊。。单独判断下
        		if (type=="20"&&pageNo==1) {
        			for (var k = liUnits.length - 1; k >= 15; k--) {
        			liUnits[k].style.display="none";
        			liUnits[i].className="unit";
        		}
        		}else{
        		//取得的中图大小也不是很一致，统一设定下课程卡片的样式。
        			liUnits[i].className+="  setSize";
        			liUnits[i].style.display="block";
        		}
        		index=i;
  				//给每个课程卡片加上相应的ID
        		liUnits[i].setAttribute("id",list[index].id);
        		//给课程卡片和浮层加载上相应数据
	           var middlePhotoUrl=liUnits[i].getElementsByClassName("middlePhotoUrl");
	               for (var j= 0; j < middlePhotoUrl.length; j++) {
	               	   middlePhotoUrl[j].setAttribute("src",list[index].middlePhotoUrl);
	               }
	           //课程名称
	           var course=liUnits[i].getElementsByClassName("course");
	           		for (var j = 0; j < course.length; j++) {
	           			course[j].innerHTML=list[index].name;
	           		}
	           //课程提供者
	           var provider=liUnits[i].getElementsByClassName("provider");
	          		for (var j = 0; j < provider.length; j++) {
	           			provider[j].innerHTML=list[index].provider;
	           		}
	           //学习人数
	           var countNumber=liUnits[i].getElementsByClassName("countNumber");
	         		for (var j = 0; j < countNumber.length; j++) {
	           			countNumber[j].innerHTML=list[index].learnerCount;
	           		}
	           //价格
	           var price=liUnits[i].getElementsByClassName("price");
	           		for (var j = 0; j < price.length; j++) {
	           			if (list[index].price==0) {
	           				price[j].innerHTML="免费";
	           			}else{
	           				price[j].innerHTML="¥ "+list[index].price;
           				}
	           		}
	           //课程分类
	           var category=liUnits[i].getElementsByClassName("category");
	           for (var j = 0; j < category.length; j++) {
	           			category[j].innerHTML=list[index].categoryName;
	           		}
	           //课程描述
	           var description=liUnits[i].getElementsByClassName("description");
        			for (var j = 0; j < description.length; j++) {
	           			description[j].innerHTML=list[index].description;
	           		}		
        	}
        	//课程卡片的数量，大于请求到的数据数时，不显示多余的课程卡片。
        	for (var k = liUnits.length - 1; k >= psize; k--) {
        		liUnits[k].style.display="none";
        	}       	
        }
	//调用Ajax的函数           
	function callAjax(method,url,callback) {
		var xhr=new XMLHttpRequest();
            xhr.onreadystatechange=function () {
            	if (xhr.readyState == 4) {
            		if ((xhr.status>=200&&xhr.status<300)||xhr.status==304) {
					     callback(xhr.responseText);
					    }else{
            			alert("Request was unsuccessful:"+xhr.status);
            		}
            	}
            }	
        	xhr.open(method,url,true);
        	xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        	xhr.send(null);
	}
}
)();

//最热排行滚动更新	
(function () {
	var hotDiv=document.getElementById("hot");
	var hotLi=hotDiv.getElementsByTagName("li");
	var smallPhotoUrl=hotDiv.getElementsByClassName("smallPhotoUrl");
	var hotCourse=hotDiv.getElementsByClassName("hotCourse");
	var hotCourseNumber=hotDiv.getElementsByClassName("hotCourseNumber");
	var url="http://study.163.com/webDev/hotcouresByCategory.htm";
	//页面加载后，加载第一页数据
	callAjax("get",url,callback);
	//回调函数，处理AJAX请求到的数据
 	function callback(responseText) {
    	var jsonList=JSON.parse(responseText);
    	var index=0;
    	//加载第一页数据
    	refreshList();
    	//设置定时器，5秒刷新
    	var timer=setInterval(refreshList, 5000)
    	//加载数据函数
    	function refreshList() {
    		for (var i = 0; i < smallPhotoUrl.length; i++) {
    		//设置初始的辅助数字index为0 ，数据从index开始读取，
    		//每次更新后index加1，index大于是0时，说明20个数据已经遍历一遍了，
    		//然后设置index为0，进行循环，实现每次更新一个，滚动刷新。
    		var cIndex=index+i;
    		smallPhotoUrl[i].setAttribute("src",jsonList[cIndex].smallPhotoUrl);
    		hotCourse[i].innerHTML=jsonList[cIndex].name;
    		hotCourseNumber[i].innerHTML=jsonList[cIndex].learnerCount;
    		}
    		index++;
    		if (index>10) {
    			index=0;
    		}
    	}
    }
//ajax调用函数
function callAjax(method,url,callback) {
		var xhr=new XMLHttpRequest();
            xhr.onreadystatechange=function () {
            	if (xhr.readyState == 4) {
            		if ((xhr.status>=200&&xhr.status<300)||xhr.status==304) {
					     callback(xhr.responseText);
					    }else{
            			alert("Request was unsuccessful:"+xhr.status);
            		}
            	}
            }	
            	xhr.open(method,url,true);
            	xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            	xhr.send(null);
	}
}
)();