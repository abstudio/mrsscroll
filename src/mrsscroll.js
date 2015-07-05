// Perform custom scrollbar
define(['./mrsscroll.css'],function() {
  var nu=navigator.userAgent,
  aus=['Mozilla','IE'],
  // Remove event listner polyfill
  removeEventListner = function(el, type, handler) {
    if ( el.addEventListener ) {
      el.removeEventListener(type, handler, false);
    }  else if ( elem.attachEvent ) {
      el.detachEvent("on" + type, handler);
    } else {
      el["on"+type] = null;
    };
  },
  // Event listner polyfill
  eventListner = function(el, type, handler, once) {
      var realhandler = once ? function() {
        removeEventListner(el, type, realhandler);
      } : handler;
      if ( el.addEventListener ) {
        listen = el.addEventListener( type, handler, false );
      } else if (el.attachEvent) {
         listen = el.addEventListener( 'on'+type, handler, false );
      } else {
        el['on'+type] = handler;
      }
      return el;
  },
  retfalse = function() { return !!0; },
  disableSelection = function(el) {
      if (nu.indexOf(aus[0]) != -1) // FF
      el.style['MozUserSelect']='none';
      else if (nu.indexOf(aus[1]) != -1) // IE
      eventListner(el, 'selectstart.disableTextSelect', retfalse);
      else 
      eventListner(el, 'mousedown.disableTextSelect', retfalse);
  },
  enableSelection = function(el) {
      if (nu.indexOf(aus[0]) != -1) // FF
      el.style['MozUserSelect']='';
      else if (nu.indexOf(aus[1]) != -1) // IE
      removeEventListner(el, 'selectstart.disableTextSelect', retfalse);
      else 
      removeEventListner(el, 'mousedown.disableTextSelect', retfalse);
  },
  mixin = (function() {
    var mixinup = function(a,b) { 
      for(var i in b) { 
        
        if (b.hasOwnProperty(i)) { 
                
          a[i]=b[i]; 
        } 
      } 
      return a; 
    } 
    
    return function(a) { 
      var i=1; 
      for (;i<arguments.length;i++) { 
        if ("object"===typeof arguments[i]) {
          mixinup(a,arguments[i]); 
        } 
      } 
      return a;
    }
  })(),
  wresizeEventLsts=function(listners) {
    wresizeEventLsts.l.push(listners);
  };
  wresizeEventLsts.l=[];
  eventListner(window, 'resize', function(e) {
    for (i=0;i<wresizeEventLsts.l.length;i++) {
      wresizeEventLsts.l[i].apply(window, [e]);
    }
  });
  return function(a, config) {

    var 
    config = mixin({
      gapSize: 5
    },config||{}),
    listen,
    i,
    d=document,
    s, // Scrollable
    n, // Custom scrollbar wrapper
    r, // Runner
    height, // Runner height
    scrollTop, // Start scroll top,
    // Scroll handler    
    handlerScroll = function(e) {
      var mod = 1 - ((config.gapSize*2) / ( (100 - parseInt(r.style.height))/100 * s.clientHeight)) ;
      console.log('mod', mod);
      r.style.top = ( ((100 - parseInt(r.style.height))*mod) * (s.scrollTop/(s.scrollHeight-s.clientHeight)) )+( (1-mod)/2 * (100 - parseInt(r.style.height)))+'%';
    },
    drag = !!0,
    screenY = 0,
    handlerMove = function(e) {
      var d = ((height*(scrollTop/(s.scrollHeight-s.clientHeight)))+(e.screenY-screenY));
      if (d>height) d = height;
      else if (d<0) d = 0;
      // set Scroll top
      s.scrollTop = Math.round((s.scrollHeight-s.clientHeight)*(d/height));
    },
    handlerUp = function(e) {
      drag=!!0;
      // Enable selection
      enableSelection(s);
      // remove listen for window move
      removeEventListner(window, 'mousemove', handlerMove);
      e.stopPropagation();
    },
    handlerDown = function(e) {
      drag=!0;screenY=e.screenY; 
      height=s.clientHeight-parseInt(window.getComputedStyle(r).height);
      scrollTop=s.scrollTop;
      // Disable selection
      disableSelection(s);
      // Listen for window move
      eventListner(window, 'mousemove', handlerMove);
      eventListner(window, 'mouseup', handlerUp, true);
      e.preventDefault();
      return false;
    },
    handlerWrapDown = function(e) {
     if(e.offsetX>n.offsetWidth-20){
        s.scrollTop = Math.round((s.scrollHeight-s.clientHeight)*(e.offsetY/n.offsetHeight));
        handlerDown(e);
      }
    },
    recharge_rh = function() {
        i = (100*(s.clientHeight/s.scrollHeight).toFixed(2));

        r.style.height = (i==100)?0:i+'%';
    },
    n=d.createElement('div');
    r=d.createElement('figure');
    s=d.createElement('div');
    
    // Wrap each insert elements
    for (i=0;i<a.childNodes.length;i++) {
      s.appendChild(a.childNodes[0]);
    }
    a.appendChild(n);
    n.appendChild(r);
    n.appendChild(s);
    n.className = '-morulus-customsb';
    // Set size of runner
    recharge_rh();
    handlerScroll();

    // Listen for scroll
    eventListner(s,'scroll',handlerScroll);
    // Listen for drug
    eventListner(r,'mousedown',handlerDown);
    eventListner(r,'mouseup',handlerUp);
    // Listerb for drug on wrapper
    eventListner(n,'mousedown',handlerWrapDown);
    // Watch window resize
    wresizeEventLsts(function() {
      recharge_rh()
    });
    return recharge_rh;
  };
});