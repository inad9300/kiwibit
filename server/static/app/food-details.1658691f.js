parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({13:[function(require,module,exports) {

},{}],45:[function(require,module,exports) {
"use strict";function e(e,t){t.forEach(function(t){return e.appendChild("string"==typeof t?document.createTextNode(t):t)})}exports.__esModule=!0,exports.addChildren=e;
},{}],51:[function(require,module,exports) {
"use strict";function t(t){return t instanceof Object&&t.constructor===Object}exports.__esModule=!0,exports.isObject=t;
},{}],46:[function(require,module,exports) {
"use strict";exports.__esModule=!0;var r=require("./isObject");function t(t,s){for(var i in s)s.hasOwnProperty(i)&&("role"===i||i.startsWith("aria-")?t.setAttribute(i,s[i]):r.isObject(s[i])?e(t[i],s[i]):t[i]=s[i])}function e(t,s){for(var i in s)s.hasOwnProperty(i)&&(r.isObject(s[i])?(t[i]||(t[i]={}),e(t[i],s[i])):t[i]=s[i])}exports.assignProperties=t;
},{"./isObject":51}],37:[function(require,module,exports) {
"use strict";exports.__esModule=!0;var n,t=require("../addChildren"),r=require("../assignProperties");function u(n,u,e){var o=document.createElement(n);return void 0!==u&&r.assignProperties(o,u),void 0!==e&&t.addChildren(o,e),o}!function(n){n.x=function(n,t,r){return u("x-"+n,t,r)}}(n=exports.h||(exports.h={})),function(n){n.a=function(n,t){return u("a",n,t)},n.abbr=function(n,t){return u("abbr",n,t)},n.address=function(n,t){return u("address",n,t)},n.area=function(n){return u("area",n)},n.article=function(n,t){return u("article",n,t)},n.aside=function(n,t){return u("aside",n,t)},n.audio=function(n,t){return u("audio",n,t)},n.b=function(n,t){return u("b",n,t)},n.base=function(n){return u("base",n)},n.bdi=function(n,t){return u("bdi",n,t)},n.bdo=function(n,t){return u("bdo",n,t)},n.blockquote=function(n,t){return u("blockquote",n,t)},n.body=function(n,t){return u("body",n,t)},n.br=function(n){return u("br",n)},n.button=function(n,t){return u("button",n,t)},n.canvas=function(n,t){return u("canvas",n,t)},n.caption=function(n,t){return u("caption",n,t)},n.cite=function(n,t){return u("cite",n,t)},n.code=function(n,t){return u("code",n,t)},n.col=function(n){return u("col",n)},n.colgroup=function(n,t){return u("colgroup",n,t)},n.data=function(n,t){return u("data",n,t)},n.datalist=function(n,t){return u("datalist",n,t)},n.dd=function(n,t){return u("dd",n,t)},n.del=function(n,t){return u("del",n,t)},n.details=function(n,t){return u("details",n,t)},n.dfn=function(n,t){return u("dfn",n,t)},n.dialog=function(n,t){return u("dialog",n,t)},n.div=function(n,t){return u("div",n,t)},n.dl=function(n,t){return u("dl",n,t)},n.dt=function(n,t){return u("dt",n,t)},n.em=function(n,t){return u("em",n,t)},n.embed=function(n){return u("embed",n)},n.fieldset=function(n,t){return u("fieldset",n,t)},n.figcaption=function(n,t){return u("figcaption",n,t)},n.figure=function(n,t){return u("figure",n,t)},n.footer=function(n,t){return u("footer",n,t)},n.form=function(n,t){return u("form",n,t)},n.h1=function(n,t){return u("h1",n,t)},n.h2=function(n,t){return u("h2",n,t)},n.h3=function(n,t){return u("h3",n,t)},n.h4=function(n,t){return u("h4",n,t)},n.h5=function(n,t){return u("h5",n,t)},n.h6=function(n,t){return u("h6",n,t)},n.head=function(n,t){return u("head",n,t)},n.header=function(n,t){return u("header",n,t)},n.hr=function(n){return u("hr",n)},n.html=function(n,t){return u("html",n,t)},n.i=function(n,t){return u("i",n,t)},n.iframe=function(n,t){return u("iframe",n,t)},n.img=function(n){return u("img",n)},n.input=function(n){return u("input",n)},n.ins=function(n,t){return u("ins",n,t)},n.kbd=function(n,t){return u("kbd",n,t)},n.label=function(n,t){return u("label",n,t)},n.legend=function(n,t){return u("legend",n,t)},n.li=function(n,t){return u("li",n,t)},n.link=function(n){return u("link",n)},n.main=function(n,t){return u("main",n,t)},n.map=function(n,t){return u("map",n,t)},n.mark=function(n,t){return u("mark",n,t)},n.meta=function(n){return u("meta",n)},n.meter=function(n,t){return u("meter",n,t)},n.nav=function(n,t){return u("nav",n,t)},n.noscript=function(n,t){return u("noscript",n,t)},n.object=function(n,t){return u("object",n,t)},n.ol=function(n,t){return u("ol",n,t)},n.optgroup=function(n,t){return u("optgroup",n,t)},n.option=function(n,t){return u("option",n,t)},n.output=function(n,t){return u("output",n,t)},n.p=function(n,t){return u("p",n,t)},n.param=function(n){return u("param",n)},n.picture=function(n,t){return u("picture",n,t)},n.pre=function(n,t){return u("pre",n,t)},n.progress=function(n,t){return u("progress",n,t)},n.q=function(n,t){return u("q",n,t)},n.rb=function(n,t){return u("rb",n,t)},n.rp=function(n,t){return u("rp",n,t)},n.rt=function(n,t){return u("rt",n,t)},n.rtc=function(n,t){return u("rtc",n,t)},n.ruby=function(n,t){return u("ruby",n,t)},n.s=function(n,t){return u("s",n,t)},n.samp=function(n,t){return u("samp",n,t)},n.script=function(n,t){return u("script",n,t)},n.section=function(n,t){return u("section",n,t)},n.select=function(n,t){return u("select",n,t)},n.small=function(n,t){return u("small",n,t)},n.source=function(n){return u("source",n)},n.span=function(n,t){return u("span",n,t)},n.strong=function(n,t){return u("strong",n,t)},n.style=function(n,t){return u("style",n,t)},n.sub=function(n,t){return u("sub",n,t)},n.summary=function(n,t){return u("summary",n,t)},n.sup=function(n,t){return u("sup",n,t)},n.table=function(n,t){return u("table",n,t)},n.tbody=function(n,t){return u("tbody",n,t)},n.td=function(n,t){return u("td",n,t)},n.template=function(n,t){return u("template",n,t)},n.textarea=function(n,t){return u("textarea",n,t)},n.tfoot=function(n,t){return u("tfoot",n,t)},n.th=function(n,t){return u("th",n,t)},n.thead=function(n,t){return u("thead",n,t)},n.time=function(n,t){return u("time",n,t)},n.title=function(n,t){return u("title",n,t)},n.tr=function(n,t){return u("tr",n,t)},n.track=function(n){return u("track",n)},n.u=function(n,t){return u("u",n,t)},n.ul=function(n,t){return u("ul",n,t)},n.var_=function(n,t){return u("var",n,t)},n.video=function(n,t){return u("video",n,t)},n.wbr=function(n){return u("wbr",n)}}(n=exports.h||(exports.h={}));
},{"../addChildren":45,"../assignProperties":46}],38:[function(require,module,exports) {
"use strict";exports.__esModule=!0;var n,e=require("../addChildren"),t=require("../assignProperties");function r(n,r,u){var i=document.createElementNS("http://www.w3.org/2000/svg",n);return void 0!==r&&t.assignProperties(i,r),void 0!==u&&e.addChildren(i,u),i}!function(n){n.a=function(n,e){return r("a",n,e)},n.circle=function(n,e){return r("circle",n,e)},n.clipPath=function(n,e){return r("clipPath",n,e)},n.defs=function(n,e){return r("defs",n,e)},n.desc=function(n,e){return r("desc",n,e)},n.ellipse=function(n,e){return r("ellipse",n,e)},n.feBlend=function(n,e){return r("feBlend",n,e)},n.feColorMatrix=function(n,e){return r("feColorMatrix",n,e)},n.feComponentTransfer=function(n,e){return r("feComponentTransfer",n,e)},n.feComposite=function(n,e){return r("feComposite",n,e)},n.feConvolveMatrix=function(n,e){return r("feConvolveMatrix",n,e)},n.feDiffuseLighting=function(n,e){return r("feDiffuseLighting",n,e)},n.feDisplacementMap=function(n,e){return r("feDisplacementMap",n,e)},n.feDistantLight=function(n,e){return r("feDistantLight",n,e)},n.feFlood=function(n,e){return r("feFlood",n,e)},n.feFuncA=function(n,e){return r("feFuncA",n,e)},n.feFuncB=function(n,e){return r("feFuncB",n,e)},n.feFuncG=function(n,e){return r("feFuncG",n,e)},n.feFuncR=function(n,e){return r("feFuncR",n,e)},n.feGaussianBlur=function(n,e){return r("feGaussianBlur",n,e)},n.feImage=function(n,e){return r("feImage",n,e)},n.feMerge=function(n,e){return r("feMerge",n,e)},n.feMergeNode=function(n,e){return r("feMergeNode",n,e)},n.feMorphology=function(n,e){return r("feMorphology",n,e)},n.feOffset=function(n,e){return r("feOffset",n,e)},n.fePointLight=function(n,e){return r("fePointLight",n,e)},n.feSpecularLighting=function(n,e){return r("feSpecularLighting",n,e)},n.feSpotLight=function(n,e){return r("feSpotLight",n,e)},n.feTile=function(n,e){return r("feTile",n,e)},n.feTurbulence=function(n,e){return r("feTurbulence",n,e)},n.filter=function(n,e){return r("filter",n,e)},n.foreignObject=function(n,e){return r("foreignObject",n,e)},n.g=function(n,e){return r("g",n,e)},n.gradient=function(n,e){return r("gradient",n,e)},n.image=function(n,e){return r("image",n,e)},n.line=function(n,e){return r("line",n,e)},n.linearGradient=function(n,e){return r("linearGradient",n,e)},n.marker=function(n,e){return r("marker",n,e)},n.mask=function(n,e){return r("mask",n,e)},n.metadata=function(n,e){return r("metadata",n,e)},n.path=function(n,e){return r("path",n,e)},n.pattern=function(n,e){return r("pattern",n,e)},n.polygon=function(n,e){return r("polygon",n,e)},n.polyline=function(n,e){return r("polyline",n,e)},n.radialGradient=function(n,e){return r("radialGradient",n,e)},n.rect=function(n,e){return r("rect",n,e)},n.script=function(n,e){return r("script",n,e)},n.stop=function(n,e){return r("stop",n,e)},n.style=function(n,e){return r("style",n,e)},n.svg=function(n,e){return r("svg",n,e)},n.switch_=function(n,e){return r("switch",n,e)},n.symbol=function(n,e){return r("symbol",n,e)},n.text=function(n,e){return r("text",n,e)},n.textPath=function(n,e){return r("textPath",n,e)},n.title=function(n,e){return r("title",n,e)},n.tspan=function(n,e){return r("tspan",n,e)},n.use=function(n,e){return r("use",n,e)},n.view=function(n,e){return r("view",n,e)}}(n=exports.s||(exports.s={}));
},{"../addChildren":45,"../assignProperties":46}],23:[function(require,module,exports) {
"use strict";exports.__esModule=!0;var e=require("./html/h");exports.h=e.h;var r=require("./svg/s");exports.s=r.s;
},{"./html/h":37,"./svg/s":38}],33:[function(require,module,exports) {
"use strict";function e(e){return Array.isArray(e)?e.map(function(e){return Object.assign({},e)}):Object.assign({},e)}Object.defineProperty(exports,"__esModule",{value:!0}),exports.clone=e;
},{}],15:[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("./clone"),r={};function n(n,t){return void 0===t&&(t={}),t.cache&&r.hasOwnProperty(n)?Promise.resolve(e.clone(r[n])):fetch(n).then(function(e){return e.json()}).then(function(o){return t.cache&&(r[n]=e.clone(o)),o})}exports.get=n;
},{"./clone":33}],11:[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),require("./header.scss");var e=require("@soil/dom");function h(){return e.h.nav({className:"header"},[e.h.h1({},[e.h.a({href:"/"},["Kiwibit"])]),e.h.ul({},[e.h.li({},[e.h.a({href:"food-details.html"},["Food details"])]),e.h.li({},[e.h.a({href:"top-foods.html"},["Top foods"])]),e.h.li({},[e.h.a({href:"label-builder.html"},["Label builder"])])])])}exports.header=h;
},{"./header.scss":13,"@soil/dom":23}],4:[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),require("./food-details.scss");var e=require("@soil/dom"),t=require("./common/get"),n=require("./common/header"),o=" ",d=e.h.select({style:{alignSelf:"flex-start"},onchange:function(){t.get(d.value,{cache:!0}).then(h)}},[e.h.option({disabled:!0,selected:!0},["Food category"]),e.h.option({value:"/beverages"},["Beverages"]),e.h.option({value:"/breakfast-cereals"},["Breakfast cereals"]),e.h.option({value:"/fats-and-oils"},["Fats and oils"]),e.h.option({value:"/fruits-and-juices"},["Fruits and juices"]),e.h.option({value:"/grains"},["Grains"]),e.h.option({value:"/legumes"},["Legumes"]),e.h.option({value:"/nuts-and-seeds"},["Nuts and seeds"]),e.h.option({value:"/soupes-and-sauces"},["Soupes and sauces"]),e.h.option({value:"/spices-and-herbs"},["Spices and herbs"]),e.h.option({value:"/vegetables"},["Vegetables"])]),a=e.h.ul({className:"food-list"});function h(t){a.innerHTML="",t.map(function(t){return e.h.li({},[e.h.span({tabIndex:0,style:{cursor:"pointer"},onclick:function(){return i(t.ndb_no)},onkeydown:function(e){"Enter"===e.key&&i(t.ndb_no)}},[t.long_desc])])}).forEach(function(e){return a.appendChild(e)})}function i(n){t.get("/foods/"+n,{cache:!0}).then(function(t){var n=e.h.dl({},[e.h.dt({},["Food group"]),e.h.dd({},[t.fdgrp_desc]),e.h.dt({},["Common name"]),e.h.dd({},[t.long_desc+(t.comname?" ("+t.comname+")":"")]),e.h.dt({},["Scientific name"]),e.h.dd({},[t.sciname||o]),e.h.dt({},["Inedible"]),e.h.dd({},[(t.refuse||0)+"%"]),e.h.dt({},["Inedible parts"]),e.h.dd({},[t.ref_desc||o]),e.h.dt({},["Manufacturer"]),e.h.dd({},[t.manufacname||o])]),d=e.h.table({},[e.h.thead({},[e.h.tr({},[e.h.th({},["Nutrient"]),e.h.th({},["Value"]),e.h.th({},["Minimum"]),e.h.th({},["Maximum"]),e.h.th({},[e.h.abbr({title:"Added for fortification or enrichment"},["Added"])])])]),e.h.tbody({},t.nutrition.map(function(t){return e.h.tr({},[e.h.td({},[t.nutrdesc]),e.h.td({},[t.nutr_val+" "+t.units]),e.h.td({},[t.min+" "+t.units]),e.h.td({},[t.max+" "+t.units]),e.h.td({},[t.add_nutr_mark?"Yes":"No"])])}))]),a=e.h.table({style:{marginBottom:"20px"}},[e.h.thead({},[e.h.tr({},[e.h.th({},["Title"]),e.h.th({},["Authors"]),e.h.th({},["Journal"]),e.h.th({},["Year"])])]),e.h.tbody({},t.sources.map(function(t){return e.h.tr({},[e.h.td({},[t.title]),e.h.td({},[t.authors]),e.h.td({},[t.journal]),e.h.td({},[t.year])])}))]),h=e.h.div({className:"overlay",onclick:function(){return s()}},[e.h.div({className:"padded modal",onclick:function(e){return e.stopPropagation()}},[e.h.h2({},["Details"]),n,e.h.div({style:{clear:"both"}}),e.h.h2({},["Nutrition facts"]),d,e.h.h2({},["Sources"]),a])]);function i(e){"Escape"===e.key&&s()}function s(){h.remove(),window.removeEventListener("keydown",i)}document.body.appendChild(h),window.addEventListener("keydown",i)})}document.body.appendChild(n.header()),document.body.appendChild(e.h.div({className:"padded"},[d,a])),d.focus();
},{"./food-details.scss":13,"@soil/dom":23,"./common/get":15,"./common/header":11}]},{},[4], null)
//# sourceMappingURL=../app/food-details.1658691f.map