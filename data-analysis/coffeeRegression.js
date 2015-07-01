// thinking through VI for (mixed effects / hierarchical) regression models.

var a0 = 1;
var b0 = 1;
//var mu0 = 0;
//var lambda0 = 1;

//moodMeasures is an array of objects {time: , measure: }

var moodMeasures = [
{time: 0, measure: 0},
{time: 1, measure: 0.2},
{time: 2, measure: 3},
{time: 3, measure: 3},
{time: 4, measure: 1}
]
//coffeeEvents is an array of objects {time: , dose: }
var coffeeEvents = [
{time: 0, dose: 1.5},
{time: 1, dose: 0.2},
{time: 2, dose: 0.1},
{time: 3, dose: 0.1},
{time: 4, dose: 0}
]

var target = function(coffeeEvents, moodMeasures) {
    
    // var shape = gamma(0.05,0.05)
    // var scale = gamma(0.05,0.05)
    var shape = 1
    var scale = 1
    
    var coffeeKernel = function(coffeeEvent, time) {
        //some functional form that depends on random params dose and dose time... assuming gamma for now.
        //fix: no effect before event...
        return time<=coffeeEvent.time ? 0 : 
                    coffeeEvent.dose * gammaERP.score([shape, scale], time-coffeeEvent.time)
    }
    
    //coffeeResponse is the coffee events convolved with the coffee response kernel, evaluated at a given time.
    var coffeeResponse = function(time) {
        //do we want a non-linear aggregation of effects?
        return reduce(function(e,memo){
            console.log(coffeeKernel(e, time))
                return  memo + coffeeKernel(e,time)
            }, 0, coffeeEvents)
    }
    
    //the mood is a linear regression with kernel responses from the indep vars, unknown coeffcients.
    var coffeeCoef = gaussian(0, 1)
    var intercept = gaussian(0, 1)
    var tau = gamma(a0, 1 / b0)
    
    console.log(coffeeCoef, intercept, tau)
    var observeMood = function(obs){
        var predictedMood = coffeeCoef*coffeeResponse(obs.time) + intercept
        console.log(coffeeResponse(obs.time))
        factor(gaussianERP.score([predictedMood,1 / Math.sqrt(tau)], obs.measured))
    }

    map(observeMood, moodMeasures)
    console.log('after factor')


    return [shape, scale, coffeeCoef, intercept, tau]
}

MH(function(){return target(coffeeEvents, moodMeasures)},100)




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