!function(e){function n(r){if(t[r])return t[r].exports;var o=t[r]={exports:{},id:r,loaded:!1};return e[r].call(o.exports,o,o.exports,n),o.loaded=!0,o.exports}var t={};return n.m=e,n.c=t,n.p="",n(0)}([function(e,n,t){"use strict";var r=t(2),o=self,s=["message","request","response","notification","close","error"],i=null;o.onmessage=function(e){var n=e.data,t=n[0],a=n[1];switch(t){case"open":i=r["default"].open.apply(r["default"],a).then(function(e){i=e,s.forEach(function(e){i.on(e,function(){for(var n=[],t=0;t<arguments.length;t++)n[t-0]=arguments[t];return o.postMessage([e,n])})}),o.postMessage(["open","Successfully opened connection"])})["catch"](function(e){o.postMessage(["error","Could not open connection: "+e])});break;case"sendMessage":i?i.sendMessage.apply(i,a):o.postMessage(["error","Connection is not opened"]);break;case"close":i.close()}}},function(e,n){"use strict";n.headerToString=function(e){var n=[];for(var t in e)n.push(t+": "+e[t]+";");return n.join(" ")},n.messageToString=function(e){return n.headerToString(e.header)+" :: "+(e.body instanceof Blob?"[binary data]":JSON.stringify(e.body))}},function(e,n,t){"use strict";var r=this&&this.__extends||function(e,n){function t(){this.constructor=e}for(var r in n)n.hasOwnProperty(r)&&(e[r]=n[r]);e.prototype=null===n?Object.create(n):(t.prototype=n.prototype,new t)},o=t(3),s=t(6),i=t(9),a=t(4),u=function(e){function n(n){var t=this;e.call(this),this.ws=n,this.currentSeq=1,this.pendingRequests={},this.requestTimeout=15e3,this.ws.onmessage=function(e){var n=e.data;s.parseMessage(n).then(function(e){var n=e[0],r=e[1];a.debug("fosp: received message ",r,n),t.emit("message",n,r)})["catch"](function(e){a.error(e)})},this.ws.onclose=function(e){t.emit("close",e.code,e.reason)},this.ws.onerror=function(e){t.emit("error",e)},this.on("message",function(e,n){"method"in e?t.emit("request",e,n):"status"in e?t.emit("response",e,n):"event"in e?t.emit("notification",e):(a.warn("fosp: recieved unknow type of message"),a.debug("fosp: message is ",e))}),this.on("response",function(e,n){var r=t.pendingRequests[n];"undefined"!=typeof r&&(clearTimeout(r.timeoutHandle),delete t.pendingRequests[n],r.resolve(e))}),this.on("close",function(e,n){a.info("Connection closed, code "+e+": "+n)}),this.on("error",function(){a.error("fosp: fatal! unrecoverable error occured on connection")})}return r(n,e),n.open=function(e){var t=e.scheme||"wss",r=e.host,o=e.port||1337;return new Promise(function(e,s){var i=new WebSocket(t+"://"+r+":"+o);i.binaryType="arraybuffer",i.onopen=function(){e(new n(i))},i.onerror=function(e){s(e)}})},n.prototype.isOpen=function(){return this.ws.readyState===WebSocket.OPEN},n.prototype.sendMessage=function(e,n){a.debug("fosp: sending message ",n,e);try{var t=i.serializeMessage(e,n);this.ws.send(t)}catch(r){console.error(r)}},n.prototype.close=function(){this.ws.close()},n.prototype.sendRequest=function(e){var n=this,t={resolve:null,reject:null},r=new Promise(function(e,n){t.resolve=e,t.reject=n}),o=this.currentSeq;return this.currentSeq++,this.pendingRequests[o]=t,t.timeoutHandle=setTimeout(function(){delete n.pendingRequests[o],t.reject("timeout")},this.requestTimeout),this.sendMessage(e,o),r},n}(o.EventEmitter);Object.defineProperty(n,"__esModule",{value:!0}),n["default"]=u},function(e,n){"use strict";var t=function(){function e(){}return e.prototype.on=function(e,n){this._events=this._events||{},this._events[e]=this._events[e]||[],this._events[e].push(n)},e.prototype.emit=function(e){for(var n=[],t=1;t<arguments.length;t++)n[t-1]=arguments[t];if(this._events=this._events||{},e in this._events!=!1)for(var r=0;r<this._events[e].length;r++)this._events[e][r].apply(this,Array.prototype.slice.call(arguments,1))},e}();n.EventEmitter=t},function(e,n){"use strict";var t=!0,r=!0,o=!0,s=!0;n.debug=function(e){for(var n=[],r=1;r<arguments.length;r++)n[r-1]=arguments[r];t&&console.debug.apply(console,[e].concat(n))},n.warn=function(e){r&&console.warn(e)},n.error=function(e){o&&console.error(e)},n.info=function(e){s&&console.info(e)}},function(e,n,t){"use strict";var r=t(1);n.CREATED="CREATED",n.UPDATED="UPDATED",n.DELETED="DELETED",n.Events=[n.CREATED,n.UPDATED,n.DELETED],n.notificationToString=function(e){return e.event+" "+e.resource+" :: "+r.messageToString(e)}},function(e,n,t){"use strict";var r=t(7),o=t(8),s=t(5);n.parseMessage=function(e){return new Promise(function(n,t){try{e instanceof ArrayBuffer?n(a(e)):"string"==typeof e?n(i(e)):t(new Error("Unable to parse "+e.toString()+" of type "+typeof e))}catch(r){t(r)}})};var i=function(e){var n=e.split("\r\n\r\n"),t=n[0],r=n.slice(1),o=u(t),s=o[0],i=o[1];if(r instanceof Array&&r.length>0){var a=r.join("\r\n");if(""!==a)try{s.body=JSON.parse(a)}catch(c){s.body=a}}return[s,i]},a=function(e){for(var n="",t=e.byteLength,r=0,o=null,s=new Uint8Array(e);t>r;){var i=s[r],a=s[r+1],c=s[r+2],f=s[r+3];if(0===(128&i))n+=String.fromCharCode(i),r+=1;else if(192===(224&i))n+=String.fromCharCode((i<<6)+(63&a)),r+=2;else if(224===(240&i))n+=String.fromCharCode((i<<12)+((63&a)<<6)+(63&c)),r+=3;else{if(240!==(248&i))throw new Error("UTF-8 Encoding error!");n+=String.fromCharCode((i<<18)+((63&a)<<12)+((63&c)<<6)+(63&f)),r+=4}if(n.length>=4&&"\r\n\r\n"===n.substring(n.length-4))break}t>r&&(o=s.subarray(r));var l=u(n),p=l[0],d=l[1];return p.body=o,[p,d]},u=function(e){var n=null,t=0,i=e.split("\r\n"),a=i[0],u=i.slice(1),d=a.split(" "),h=d[0];d.slice(1);if(r.Methods.indexOf(h)>=0)v=c(a),n=v[0],t=v[1];else if(o.Statuses.indexOf(h)>=0)E=f(a),n=E[0],t=E[1];else{if(!(s.Events.indexOf(h)>=0))throw new Error("Type of message unknown: "+h);n=l(a)}return n.header=p(u),[n,t];var v,E},c=function(e){var n=e.split(" "),t=n[0],r=n[1],o=n[2],s=parseInt(o,10),i={method:t,resource:r};return[i,s]},f=function(e){var n=e.split(" "),t=n[0],r=n[1],o=n[2],s=parseInt(r,10),i=parseInt(o,10),a={status:t,code:s};return[a,i]},l=function(e){var n=e.split(" "),t=n[0],r=n[1],o={event:t,resource:r};return o},p=function(e){for(var n={},t=0,r=e;t<r.length;t++){var o=r[t];if(""===o)break;var s=o.split(": "),i=s[0],a=s[1];n[i]=a}return n}},function(e,n,t){"use strict";var r=t(1);n.OPTIONS="OPTIONS",n.AUTH="AUTH",n.GET="GET",n.LIST="LIST",n.CREATE="CREATE",n.PATCH="PATCH",n.DELETE="DELETE",n.READ="READ",n.WRITE="WRITE",n.Methods=[n.OPTIONS,n.AUTH,n.GET,n.LIST,n.CREATE,n.PATCH,n.DELETE,n.READ,n.WRITE],n.requestToString=function(e){return e.method+" "+e.resource+" :: "+r.messageToString(e)},n.validateRequest=function(e){if(e.method===n.WRITE&&!(e.body instanceof Blob))throw new Error("Invalid body for WRITE request")}},function(e,n,t){"use strict";var r=t(1);n.SUCCEEDED="SUCCEEDED",n.FAILED="FAILED",n.Statuses=[n.SUCCEEDED,n.FAILED],n.validateResponse=function(e){if(e.code<=0)throw new Error("Unknown response code: "+e.code)},n.responseToString=function(e){return e.status+" "+e.code+" :: "+r.messageToString(e)}},function(e,n){"use strict";n.serializeMessage=function(e,n){var s="";if("method"in e){var i=e;s=[i.method,i.resource,n].join(" ")}else if("status"in e){var a=e;s=[a.status,a.code,n].join(" ")}else{if(!("event"in e))throw new Error("Tried to serialize a message that is not a message");var u=e;s=[u.event,u.resource].join(" ")}var c=s+"\r\n"+t(e),f=e.body;if(f instanceof ArrayBuffer){var l=f.byteLength;l>0&&(c+="\r\n");for(var p=o(c),d=p.length,h=new Uint8Array(new ArrayBuffer(d+l)),v=new Uint8Array(f),E=0;d>E;E++)h[E]=p[E];for(E=0;l>E;E++)h[E+d]=v[E];return h}return c+"\r\n"+r(e)};var t=function(e){var n="";for(var t in e.header)n+=t+": "+e.header[t]+"\r\n";return n},r=function(e){return"undefined"!=typeof e.body&&null!==e.body?JSON.stringify(e.body):""},o=function(e){for(var n=[],t=0;t<e.length;t++){var r=e.charCodeAt(t);128>r?n.push(r):2048>r?n.push(192|r>>6,128|63&r):55296>r||r>=57344?n.push(224|r>>12,128|r>>6&63,128|63&r):n.push(239,191,189)}return n}}]);
//# sourceMappingURL=d8c8f1f6ecc26cdff4da.worker.js.map