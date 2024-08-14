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

Here $X$ is just a random variable and we will use $x$ to denote a realization of $X$. For example if we observe data 1, 4, then we can write $X_1 = 1$, $X_2 = 4$. Here $\theta$ represents a parameter of a distribution. For example $Poisson(\lambda)$, $\lambda$ is the parameter.

To simpifly the expression, we can drop the normalization constant in the denominator because we are only concerned about proportionality. The normalization constant ensures the result we get integrates to 1 but it does not change the shape of the distribution, which means it does not affect our inference. Now we get 

$$
f(\theta | X) \propto f(X|\theta) f(\theta).
$$

1. $f(\theta \vert X)$ is the **posterior**. This is the distribution of $\theta$ *after* observing data. 

2. $f(X \vert \theta)$ is the **likelihood function**. This is function is constructed by the joint probability distribution evaluated at each data point $X=x$. Trust me this will make more sense when we do an example. As an undergrad this went over my $\text{head}^1$. 

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

From the histogram we see that the distribution of X is strictly positive and is discrete (integers) which makes it a good candidate for a Poisson model. Let's assume the prior is $\Lambda \sim Gamma(1000, 2)$. We apply the updating rules to get the posterior distribution for $\Lambda$.

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

## Footnotes
1.. When $\theta$ is fixed then $f(X | \theta)$ is a pdf when $X$ is fixed then it is a likelihood function. This honestly took me a bit to realize regrettably 🫠.

## Helpful Links
1. https://en.wikipedia.org/wiki/Conjugate_prior
2. https://www.kaggle.com/datasets/hmavrodiev/london-bike-sharing-dataset
3. https://en.wikipedia.org/wiki/Likelihood_function
