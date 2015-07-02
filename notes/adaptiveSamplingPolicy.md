
Here are some thoughts on how a data analysis model can/should turn into an adaptive sampling policy for tracking.

If we have a generative model P(resp_i=1..N | params) for the (fully observed) response data, and we face the decision problem of whether to ask question resp_N+1, then a natural policy is to ask with probability proportional to the expected information gain (decrease in entropy) for the params from asking the question. (This is effectively an active learning setup.)

However, information gain is notoriously difficult to compute. I propose a cheaper heuristic: ask in proportion to the uncertainty (or entropy) of the posterior predictive P(r_N+1 | r_1..N). Intuitively this policy says to ask if you are less sure what the answer will be.

Under the assumption that the model is i.i.d. and fixed I think this policy gives a uniform sample probability, which replicates the default (flat hazard) behavior. 

If the model assumes resp_i are iid, but with an unknown prior, the sample rate will decrease as the prior over responses is learned. (Is that what we want?)

If the model is markov on resp_i then the sampling rate will adapt as the transition probabilities are learned. If fast transitions are expected, sampling will be more frequent.

More interesting model families:

-Hierarchical: smooth the model over question types or across people, etc.

-Change-point: attempt to detect when the distribution has changed (and respond by sampling more frequently).

-Context conditional: if there is an auxiliary data stream, such as phone motion or geolocation, then learning a switching model conditioned on context events could allow sampling when activities are likely to have changed.

# Relation to data analysis

Whatever model we are using for sampling decisions can also be used for data analysis: the posterior over parameters (and marginals thereof) will be good summaries. To the extent that there is an analysis of interest that isn’t captured by the current model… it probably should be…

# Discrete time vs continuous

How does the above decision of whether to ask at each time step relate to the decision of how long to wait? It would probably be better to transform the information seeking actions into how long to wait and which question to ask next. Doing this in the general case seems hard…

One fancy option may be to use continuous time models, but I think this is overkill. A simpler option would be to uniformly sample some proposed question+times and then evaluate their uncertainty or information gain, choosing from this fixed set. Is this equivalent to the full thing against some model class?


# Other notes

- Hypothesis driven sampling: if you mostly want to answer a particular question, then the sampling policy should ask the questions that gain the most information about these questions. For instance, if you encode this question via a data analysis model, such as the fixed effects of a regression model, then you want to gain information about the fixed effects. How does this relate to the global information gain (answer: marginal information gain) and to the posterior predictive heuristic (answer:??)?

- All of this assumes that the sampling policy doesn’t affect the measured quantity… I don’t know what to do if it does.

- Sometimes people will take some time to respond to a query, or will decline. This should be incorporated somehow… but how?

