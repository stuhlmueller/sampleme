// Example: runWebPPLCode("flip(.5)", function(s, x){console.log(x)})
runWebPPLCode = function(code, callback){
 var compiled = webppl.compile(code, true);
  eval.call(window, compiled)({}, callback, '');
}
