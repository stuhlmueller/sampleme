// thinking through VI for (mixed effects / hierarchical) regression models.

var a0 = 1;
var b0 = 1;
//var mu0 = 0;
//var lambda0 = 1;

//moodMeasures is an array of objects {time: , measure: }
//coffeeEvents is an array of objects {time: , dose: }


var target = function(coffeeEvents, moodMeasures) {
    
    var shape = gamma(0.01,0.01)
    var scale = gamma(0.01,0.01)
    
    var coffeeKernel = function(coffeeEvent, time) {
        //some functional form that depends on random params dose and dose time... assuming gamma for now.
        //fix: no effect before event...
        return coffeeEvent.dose * gammaERP.score([shape, scale], time-coffeeEvent.time)
    }
    
    //coffeeResponse is the coffee events convolved with the coffee response kernel, evaluated at a given time.
    var coffeeResponse = function(time) {
        //do we want a non-linear aggregation of effects?
        return sum(map(function(e){return coffeeKernel(e,time)}, coffeeEvents))
    }
    
    //the mood is a linear regression with kernel responses from the indep vars, unknown coeffcients.
    var coffeeCoef = gaussian(0, 1)
    var intercept = gaussian(0, 1)
    var tau = gamma(a0, 1 / b0)
    
    var observeMood = function(obs){
        var predictedMood = coffeeCoef*coffeeResponse(obs.time) + intercept
        factor(gussianERP.score([predictedMood,1 / Math.sqrt(tau)], obs.measured))
    }
    
    map(observeMood, moodMeasures)

}


//
//var guide = function(params) {
//	var tau = gamma(param(params, a0), param(params, 1 / b0));
//	var mu = gaussian(param(params, mu0), param(params, 1 / Math.sqrt(lambda0*tau)));
//	return mu;
//}
//
//
//return infer(target, guide, undefined, {
//	verbosity: 2,
//	nSamples: 100,
//	nSteps: 5000,
//	convergeEps: 0.1,
//	initLearnRate: 0.5
//});