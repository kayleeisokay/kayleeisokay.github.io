---
layout: post
title: Conjugate Distributions
categories: [Statistics]
---

## Bayes Theorem

From Bayes Theorem we have the following:

$$
f(\theta | X) =  \frac{f(X|\theta) f(\theta)}{\int f(X, \theta) d\theta}.
$$

With regards to notation, $X$ is a random variable and $x$ is a realization of $X$. For example if we observe the data to be 1, 4, then $X_1 = 1$ and $X_2 = 4$. The subscripts denote the observation number. Next $\theta$ represents a parameter of a distribution. For example $Poisson(\lambda)$, $\lambda$ is the parameter.

To simplify the expression, we can drop the normalization constant in the denominator because we are only concerned with proportionality.$\text{}^{[1]}$ The normalization constant ensures the final result integrates to 1 but it does not change the shape of the distribution, which means it will not affect our inference. Now we get 

$$
f(\theta | X) \propto f(X|\theta) f(\theta).
$$

1. $f(\theta \vert X)$ is the **posterior**. This is the distribution of $\theta$ *after* observing data. 

2. $f(X \vert \theta)$ is the **likelihood function**. This is a function is the joint probability distribution constructed by evaluating $f(X \vert \theta)$ at each data point $X=x$. 

3. $f(\theta)$ is the **prior**. This is the distribution of $\theta$ *before* observing data. 

## Conjugate Distributions

Now we will talk about a special pairing of distributions called conjugate distributions. This means for a given prior distribution and likelihood function, the resulting posterior distribution will be in the same probability distribution family as the prior. In simple terms, prior and posterior are the same distribution after incoporating new information.

Conjugate distributions make Bayesian updates easy because all we need to do is update the parameters, as we'll see in the code example.

## Code Example

### Code

For this code example, we'll use the London Bike Sharing dataset from [Kaggle](https://www.kaggle.com/datasets/hmavrodiev/london-bike-sharing-dataset). We'll subset the data for `2015-01-04`. The frequency of the data is hourly. Let us denote $X$ as the count of bike shares per hour.

~~~ r
df <- read.csv("data/london_merged.csv")
df <- df[1:24, ]

hist(
  df$cnt,
  xlab = "Number of Bike Shares",
  main= "Distribution of Bike Shares per Hour",
  col = "lightblue"  
)
~~~

<img src="/assets/img/bike_hist.png">

From the histogram we see that the distribution of X is strictly positive and is discrete (integers) which makes it a good candidate for a Poisson model. Let's assume the prior is $\Lambda \sim Gamma(1000, 2)$. 

From [Wikipedia](https://en.wikipedia.org/wiki/Conjugate_prior) we glean the updating rules which are 

$$
\alpha + \sum_{i=1}^n x_i 
$$

and 

$$
\beta + n.
$$

We apply the updating rules to get the posterior distribution for $\Lambda$.

~~~ r
a <- 1000
b <- 2

a_new <- a + sum(df$cnt)
b_new <- b + nrow(df)
~~~

We find that the posterior distribution to be

$$
\Lambda | X \sim Gamma(10234, 26).
$$

Now we graph the prior and posterior distributions.

~~~ r
#Graphing Parameters
x <- 1:10000 / 10 
ylim <- c(0, .12)
xlim <- c(350, 550)
cex.axis <- 0.8

# Prior
y1 <- dgamma(x = x, shape = a, rate = b)
plot(x, y1, 
     type='l', 
     ylim=ylim, xlim=xlim, 
     col=4, 
     cex.axis=cex.axis, 
     main=TeX("Prior and Posterior Distribution of $\\Lambda$"), 
     xlab="", ylab="", xaxt = "n", yaxt = "n",lwd = 2
)

#Allows multiple plots on one
par(new=TRUE)

# Posterior
y2 <- dgamma(x = x, shape = a_new, rate = b_new)
plot(x, y2, 
     type="l",
     ylim=ylim, xlim=xlim,  
     col=3, 
     cex.axis=cex.axis, 
     xlab=TeX("$\\Lambda$"), ylab="",
     lwd = 2
)

#Add Legend
legend(
  "topright",
  legend = c('Prior', 'Posterior'), 
  col = c(4,3), 
  lty = 1, 
  cex = cex.axis 
)
~~~

<img src="/assets/img/bike_post_prior.png">

### Prediction

There are two common ways to generate an estimate for the paramter $\Theta$. First we will do the Expected A Posteriori method (EAP).

#### EAP

The EAP method means we simply take the expected value of our posterior distribution. In our case we have

$$
\hat{\Lambda} = E[\Lambda | X] = \frac{\alpha_{new}}{\beta_{new}} = \frac{10234}{26} = 393.62
$$

We take this estimate and use it as the parameter for the Poisson distribution to get

$$
Poisson(\hat{\Lambda}) = Poisson(393.62). 
$$

From here we can make a prediction, the expected number of bike share per hour given the new data is 393.62 because the expected value of a Poisson distribution with parameter $\lambda$ is simply $\lambda$.

#### MAP

Another way to obtain an estimate of $\Lambda$ is using the Maximum A Posteriori (MAP) method. This is done by 

$$
argmax_x ~ Gamma(10234, 26) \rightarrow argmax_x ~ \frac{26^{10234}}{\Gamma(10234)} x^{10233}e^{-26x}
$$

Essentially we take the derivative with respect to $x$ and set it equal to zero. Luckily for us there is closed-form solution, namely $\frac{\alpha - 1}{\beta}$. Using this formula we get the MAP estimate to be

$$
\hat{\Lambda} = \frac{\alpha_{new} - 1}{\beta_{new}} = 393.5769,
$$

which is very similar to the EAP estimate. Using this esimate we can make a prediction just like before

$$
Poisson(\hat{\Lambda}) = Poisson(393.5769). 
$$

Given the data we observed, our expected number of bike shares per hour will be 393.5769, using the MAP method.

## Appendix: Likelihood Function

### Toy Exercise

**Which $\theta$ is more likely, $\theta = 5$ or $\theta = 10$ for the observed data $X = [12, 2, 23]$? Assume that the data is Poisson distributed.**

Recall that the likelihood function is the joint probability distribution constructed by evaluating $f(X \vert \theta)$ at each data point $X=x$. This means we need to multiply the pmfs together, where the pmf is defined as

$$
g(k;\lambda) = P(X = k) =  \frac{\lambda^k e^{\lambda}}{k!}.
$$

To compute the likelihood for $\theta = 5$ we have

$$
g(12;5) * g(2;5) * g(23;5).
$$

For the likelihood using $\theta = 10$ we have

$$
g(12;10) * g(2;10) * g(23;10).
$$

Luckily we have R so the computation is pretty simple.

~~~ r
> dpois(12, 5) * dpois(2, 5) * dpois(23, 5) 
[1] 8.986934e-13

> dpois(12, 10) * dpois(2, 10) * dpois(23, 10)
[1] 3.778367e-08
~~~

Fom the output above, we see that the likelihood for $\theta = 10$ is greater than the likelihood value for $\theta = 5$. 


## Footnotes
1.. The denominator can be seen as the marginal distribution $f_X(x)$. When we integrate $\int_{\theta} f(X, \theta) d\theta$ over the entire support of $\theta$ we essentially "collapse" the $\theta$ dimension, yielding the distribution for only $X$. I might make a post on this later.

2.. When $\theta$ is fixed then $f(X \vert \theta)$ is a pdf when $X$ is fixed then it is a likelihood function. This honestly took me a bit to realize 🫠.

## Helpful Links
1. [https://en.wikipedia.org/wiki/Conjugate_prior](https://en.wikipedia.org/wiki/Conjugate_prior)
2. [https://www.kaggle.com/datasets/hmavrodiev/london-bike-sharing-dataset](https://www.kaggle.com/datasets/hmavrodiev/london-bike-sharing-dataset)
3. [https://en.wikipedia.org/wiki/Likelihood_function](https://en.wikipedia.org/wiki/Likelihood_function)
