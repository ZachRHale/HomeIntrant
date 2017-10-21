function pug_attr(t,e,n,f){return e!==!1&&null!=e&&(e||"class"!==t&&"style"!==t)?e===!0?" "+(f?t:t+'="'+t+'"'):("function"==typeof e.toJSON&&(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||e.indexOf('"')===-1)?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"):""}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;
function pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\n"+i+"\n\n"+n.message,n}function renderDuesOwedOut(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {"views\u002Fduesowedout.pug":"h2 Dues You Owe\ntable(class=\"table table-striped text-center\")\n    each due in dues\n        if (userid == due.debtor_id)\n            tr(class=\"due\")  \n                td You owe #{due.creditor_firstname} #{due.amount.toFixed(2)} for #{due.type} \n                    \n                    if (due.paid == 1)\n                        i(style=\"color:red;font-size:12px\") Acceptance Pending\n                    else\n                        span(emoji=\"pile-of-poo\" emoji-tone=\"light\")\n                        button(class=\"btn btn-success pay-due\" onclick=\"payDue('\" + due.id + \"')\") Pay\nh2(style=\"color:red\") -$#{due}"};
;var locals_for_with = (locals || {});(function (due, dues, userid) {;pug_debug_line = 1;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + "\u003Ch2\u003E";
;pug_debug_line = 1;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + "Dues You Owe\u003C\u002Fh2\u003E";
;pug_debug_line = 2;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + "\u003Ctable class=\"table table-striped text-center\"\u003E";
;pug_debug_line = 3;pug_debug_filename = "views\u002Fduesowedout.pug";
// iterate dues
;(function(){
  var $$obj = dues;
  if ('number' == typeof $$obj.length) {
      for (var pug_index0 = 0, $$l = $$obj.length; pug_index0 < $$l; pug_index0++) {
        var due = $$obj[pug_index0];
;pug_debug_line = 4;pug_debug_filename = "views\u002Fduesowedout.pug";
if ((userid == due.debtor_id)) {
;pug_debug_line = 5;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + "\u003Ctr class=\"due\"\u003E";
;pug_debug_line = 5;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + " ";
;pug_debug_line = 6;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + "\u003Ctd\u003E";
;pug_debug_line = 6;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + "You owe ";
;pug_debug_line = 6;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = due.creditor_firstname) ? "" : pug_interp));
;pug_debug_line = 6;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + " ";
;pug_debug_line = 6;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = due.amount.toFixed(2)) ? "" : pug_interp));
;pug_debug_line = 6;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + " for ";
;pug_debug_line = 6;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = due.type) ? "" : pug_interp));
;pug_debug_line = 6;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + " ";
;pug_debug_line = 8;pug_debug_filename = "views\u002Fduesowedout.pug";
if ((due.paid == 1)) {
;pug_debug_line = 9;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + "\u003Ci style=\"color:red;font-size:12px;\"\u003E";
;pug_debug_line = 9;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + "Acceptance Pending\u003C\u002Fi\u003E";
}
else {
;pug_debug_line = 11;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + "\u003Cspan emoji=\"pile-of-poo\" emoji-tone=\"light\"\u003E\u003C\u002Fspan\u003E";
;pug_debug_line = 12;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + "\u003Cbutton" + (" class=\"btn btn-success pay-due\""+pug_attr("onclick", "payDue('" + due.id + "')", true, false)) + "\u003E";
;pug_debug_line = 12;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + "Pay\u003C\u002Fbutton\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";
}
      }
  } else {
    var $$l = 0;
    for (var pug_index0 in $$obj) {
      $$l++;
      var due = $$obj[pug_index0];
;pug_debug_line = 4;pug_debug_filename = "views\u002Fduesowedout.pug";
if ((userid == due.debtor_id)) {
;pug_debug_line = 5;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + "\u003Ctr class=\"due\"\u003E";
;pug_debug_line = 5;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + " ";
;pug_debug_line = 6;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + "\u003Ctd\u003E";
;pug_debug_line = 6;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + "You owe ";
;pug_debug_line = 6;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = due.creditor_firstname) ? "" : pug_interp));
;pug_debug_line = 6;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + " ";
;pug_debug_line = 6;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = due.amount.toFixed(2)) ? "" : pug_interp));
;pug_debug_line = 6;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + " for ";
;pug_debug_line = 6;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = due.type) ? "" : pug_interp));
;pug_debug_line = 6;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + " ";
;pug_debug_line = 8;pug_debug_filename = "views\u002Fduesowedout.pug";
if ((due.paid == 1)) {
;pug_debug_line = 9;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + "\u003Ci style=\"color:red;font-size:12px;\"\u003E";
;pug_debug_line = 9;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + "Acceptance Pending\u003C\u002Fi\u003E";
}
else {
;pug_debug_line = 11;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + "\u003Cspan emoji=\"pile-of-poo\" emoji-tone=\"light\"\u003E\u003C\u002Fspan\u003E";
;pug_debug_line = 12;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + "\u003Cbutton" + (" class=\"btn btn-success pay-due\""+pug_attr("onclick", "payDue('" + due.id + "')", true, false)) + "\u003E";
;pug_debug_line = 12;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + "Pay\u003C\u002Fbutton\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";
}
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ftable\u003E";
;pug_debug_line = 13;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + "\u003Ch2 style=\"color:red;\"\u003E";
;pug_debug_line = 13;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + "-$";
;pug_debug_line = 13;pug_debug_filename = "views\u002Fduesowedout.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = due) ? "" : pug_interp)) + "\u003C\u002Fh2\u003E";}.call(this,"due" in locals_for_with?locals_for_with.due:typeof due!=="undefined"?due:undefined,"dues" in locals_for_with?locals_for_with.dues:typeof dues!=="undefined"?dues:undefined,"userid" in locals_for_with?locals_for_with.userid:typeof userid!=="undefined"?userid:undefined));} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);};return pug_html;}