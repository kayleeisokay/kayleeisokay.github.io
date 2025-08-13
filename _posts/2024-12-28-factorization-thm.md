---
layout: post
title: Factorization Theorem
categories: short-read
tags: statistics
description: What is a statistic? 
categories: short-read
related_posts: false
---

## Definition of a Statistic

For years, I used statistics without actually knowing what a statistic was. Years later, I finally encountered the definition in my Bayesian statistics class. A statistic is a function that is only dependent on the data and not the parameters ($\theta$) of the model or distribution. A normal distribution would have $\theta = (\mu, \sigma)$, while for OLS the parameters of the model are the $\mathbb{\beta}$'s. For example, the maximum of a data set is a statistic

$$
s(x) = \max(x_1, x_2, \ldots, x_n).
$$

A counterexample would be 

$$
s(x, \theta) = \frac{\sum_{i=1}^n x_i}{\theta}
$$

, since the statistics are dependent on the parameter $\theta$. Note that the examples above are for the one-dimensional case, but the definition extends to the multivariate case as well.

## Definition of a Sufficient Statistic

There is a special type of statistic called the sufficient statistic. Intuitively, a sufficient statistic captures all the information about the data that is relevant to the parameters of the model. We sa a statistic $T$ is sufficient if the conditional distribution of the data $X$ given $T$ is independent of $\theta$:

$$
P(X \vert T, \theta) = P(X \vert T).
$$

In practice, to determine if a statistic is sufficient, we can use the factorization theorem.

## Factorization Theorem

The factorization theorem states that a statistic $T$ is sufficient for $\theta$ if the joint distribution of the data $X$ can be factored into two functions. The first is just a function of the data $X$, and the second is a function of the sufficient statistic $T$ and the parameter $\theta$. 

Formally, let $X$ be a random variable, where $x_1, x_2, \ldots, x_n$ are the realizations of X. Let $f(x_1, x_2, \ldots, x_n ; \theta)$ be the joint distribution of the data. The statistic $T = r(x_1, x_2, \ldots, x_n)$ is sufficient iff the joint density can be factored into two functions:

$$
f(x_1, x_2, \ldots, x_n ; \theta) = g(r(x_1, x_2, \ldots, x_n), \theta) h(x_1, x_2, \ldots, x_n).
$$

The function $h$ can depend on the data but cannot depend on the parameter $\theta$. As for $g$, it can depend on the parameter $\theta$ and the data only through $r(x_1, x_2, \ldots, x_n)$.

### Example

Let $X$ be a uniformly distributed random variable on the interval $[0, \theta]$. The joint distribution of $X$ is 

$$
f(X ; \theta) = \frac{1}{\theta^n} \mathbb{1}_{\{0 \leq x_1, x_2, \ldots, x_n \leq \theta\}}.
$$

The second term is the indicator variable, ensuring the data lies within the interval. It expresses the same logic as the piecewise function, which is probably more common.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/piecewise_uniform.png" class="img-fluid rounded z-depth-1" 
        caption="Figure 1. Piecewise Uniform Distribution" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
    </div>
</div>

Now we can do some mathematical manipulation by noting that the p.d.f is non-zero only if the max is less than $\theta$.

$$
= \frac{1}{\theta^n} \mathbb{1}_{\{max(x_1, x_2, \ldots x_n) \leq \theta \} }
$$

From the above, we can see that the maximum of the data is a sufficient statistic for $\theta$. Here $h(x) = 1$ and $g(r, \theta) = \frac{1}{\theta^n} \mathbb{1}_{\{max(x_1, x_2, ..., x_n) \leq \theta\}}$. $r = max(x_1, x_2, \ldots, x_n)$.
