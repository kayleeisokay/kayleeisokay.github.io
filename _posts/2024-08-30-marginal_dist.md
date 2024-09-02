---
layout: post
title: Marginal Distributions
categories: [Statistics]
---

# Marginal and Joint Distributions

## Distribution of Single Random Variable

In the simplest example we have only one random variable. Here for example we have synthetic data that represents the grades for a single class. With this distribution we can calculate statistics such as the mean or variance. The graph below is an example of a distribution with just one random variable using synthetic data for class grades.

<img src="/assets/img/grades_dist.png">

However in many real world cases we are often interested in the distribution of two or more random variables modeled together. For example what is the distribution of grades for two classes? 

The distribution of two or more random variables together is called the joint distribution, often denoted as $f_{X, Y}(x, y)$ for a random variables $X$ and $Y$. This can be generalized to $n$ amount of random variables, so a joint distribution can look like $f_{X, Y, Z}(x, y, z)$. 

Random variables can be discrete or continuous. We will first take a look at the discrete case.

## Discrete Case 

### Table Representation of Joint Distribution

Let's say we are interested in not just the distribution of grades for a single class but the distribution of grades for two classes. We want to know the probability of getting A's in both classes, failing both or getting one A and one B. These types of questions can be answered with a joint distribution. 

Let's do an example. Let $X$ be the random variable for Math grades and $Y$ be the random variable for English grades. Both $X$ and $Y$ take on values in the set {A, B, C, D, F}. Reading off the table we can say that the probability of getting A's in both classes is 0.03, while the probability of getting an A in math and a B in English is 0.13.

|X = Math, Y = English   | A    | B    | C    | D    | F    |
|---|------|------|------|------|------|
| A | 0.03 | 0.13 | 0.04 | 0.01 | 0    |
| B | 0.04 | 0.17 | 0.04 | 0.03 | 0.03 |
| C | 0.04 | 0.18 | 0.06 | 0.02 | 0.01 |
| D | 0.01 | 0.08 | 0.02 | 0.02 | 0    |
| F | 0    | 0.02 | 0.01 | 0    | 0    |

Note that the values in the table must sum to 1 because the joint distribution is a proper probability distribution.

<img src="/assets/img/tile_plot.png">

### Marginal Distributions of Grades

To get the marginal distributions, e.g. the distribution of Math grades or the distribution of English grades we can collapse all dimensions other than the dimension of interest. In mathetical notation it is

$$
p_X(x_i) = \sum_j p(x_i, y_j)
$$

and 

$$
p_Y(y_j) = \sum_i p(x_i, y_j).
$$

We can rewrite the table to include the marginal distributions.

|X = Math, Y = English   | A    | B    | C    | D    | F    | $p_Y(y)$ |
|---|------|------|------|------|------| ------ |
| A | 0.03 | 0.13 | 0.04 | 0.01 | 0    | **0.21** | 
| B | 0.04 | 0.17 | 0.04 | 0.03 | 0.03 | **0.31** |
| C | 0.04 | 0.18 | 0.06 | 0.02 | 0.01 | **0.31** |
| D | 0.01 | 0.08 | 0.02 | 0.02 | 0    | **0.13** |
| F | 0    | 0.02 | 0.01 | 0    | 0    | **0.03** |
| $p_X(x)$ | **0.12**    | **0.58** | **0.17** | **0.08**    | **0.04**    |

### Marginal Distributions of $n$ dimensions

I often only see examples of joint distributions and marginal distributions using two random variables. However it can generalize to $n$ number of random variables. Let's do a three dimensional case to illustrate the logic but it can be applied to $n$ dimensions.

There are several marginal distributions in this case: $p_X(x)$, $p_Y(y)$, $p_Z(z)$ and $p_{X,Y}(x,y)$, $p_{X,Z}(x,z)$, $p_{Y,Z}(y,z)$.

Let's expand on the previous example of $X$ and $Y$ and now introduce a third random variable $Z$ which has a binary outcome of {Freshman, Sophomore}. The table below represents the joint distribution, e.g. $f_{X, Y, Z}(x, y, z)$ of the three random variables. 

~~~r
, ,  = Freshman

   
         A      B      C      D      F
  A 0.0100 0.0533 0.0333 0.0133 0.0000
  B 0.0200 0.0967 0.0100 0.0300 0.0100
  C 0.0233 0.0967 0.0367 0.0133 0.0067
  D 0.0067 0.0500 0.0133 0.0133 0.0000
  F 0.0000 0.0067 0.0067 0.0000 0.0000

, ,  = Sophomore

   
         A      B      C      D      F
  A 0.0200 0.0767 0.0100 0.0000 0.0000
  B 0.0200 0.0733 0.0300 0.0000 0.0167
  C 0.0167 0.0800 0.0200 0.0067 0.0067
  D 0.0033 0.0300 0.0100 0.0033 0.0033
  F 0.0033 0.0133 0.0033 0.0033 0.0000
~~~

Reading off the table, the probability of getting A's in both classes as a Freshman is 0.01 percent. The probability of getting an A in math and a B in English as a Sophomore is 0.0767 percent. 

Again, $f_{X, Y, Z}(x, y, z)$  is a proper distribution so all cells sum to 1. We now compute the marginal distribution $p_X(x)$. Applying the same logic we have to "collapse" the $Y$ and $Z$ dimensions.

~~~r
pxy <- rowSums(threed_table, dims = 2)
px <- colSums(pxy)
px
     A      B      C      D      F 
0.1233 0.5767 0.1733 0.0832 0.0434 
~~~

The result matches the previous. Now let's compute the marginal distribution $p_{Y,Z}(y,z)$. Here we just need to collapse the $X$ dimension.

~~~r
t(colSums(threed_table))
                A      B      C      D      F
Freshman  0.0600 0.3034 0.1000 0.0699 0.0167
Sophomore 0.0633 0.2733 0.0733 0.0133 0.0267
~~~

I hope this makes marginal distributions a bit more clear because I know when I was an undergrad, I had a bit of trouble wrapping my head around this.

## Continuous Case

Now let's look at joint and marginal distributions for continuous random variables. 

### Definitions

The intuition is similar to the discrete case except that we replace summation with integration. Recall that integration is essentially a summation with a limit applied because now we're dealing with continous random variables. The joint distribution is again defined as

$$
f_{X, Y}(x, y)
$$

with the pdf of the joint distribution defined as

$$
P((X,Y) \in D) = \int \int_D f_{X, Y}(x, y) dydx
$$

For the marginals they are defined as 

$$
f_X(x) = \int_y f_{X, Y}(x, y) dy
$$

and

$$
f_Y(y) = \int_x f_{X, Y}(x, y) dx.
$$

We collapse the dimension by integrating out all dimensions except the one of interest.

### Example

#### Find Normalizing Constant

For our example, let's define our joint distribution as

$$
f_{X, Y}(x, y) = 4xy - y^3
$$

over the region $D = \{(x,y) \vert ~ 0 \leq x \leq 1, x^3 \leq y \leq \sqrt{x}  \}$ $.^{[1]}$

First we find the normalizing constant by solving for $C$. We do this by integrating over the support of $X$ and $Y$.

$$
C * \int_0^1 \int_{x^3}^{\sqrt{x}}  4xy - y^3 ~dy~dx = 1
$$

$$
C * \int_0^1 (2xy^2 - \frac{y^4}{3}) \Big|^{\sqrt{x}}_{x^3} = 1
$$

$$
C * \int_0^1 \frac{7}{4} x^2 - 2x^7 + \frac{1}{4}x^{12} dx = 1
$$

$$
C (\frac{7}{12}x^3 - \frac{1}{4}x^8 + \frac{1}{52} x^{13}) \Big|^1_0 = \frac{55}{156}
$$

Therefore $C = \frac{156}{55}$.

#### Computing Marginals

There are two marginals of interest $f_X(x)$ and $f_Y(y)$. To find $f_X(x)$ we want to collapse the $Y$ dimension. We already did this as an intermediate step so we have

$$
f_X(x) = \frac{156}{55} \int_0^1 \frac{7}{4} x^2 - 2x^7 + \frac{1}{4}x^{12} dx.
$$

The plot of $f_X(x)$ is shown below.

<img src="/assets/img/margin_x.png">

For $f_Y(y)$ we flip the order of integration, so then

$$
f_Y(y) = \frac{156}{55} \int_0^1 \int_{y^2}^{y^{1/3}}  4xy - y^3 ~dx~dy
$$

$$
= \frac{156}{55} \int_0^1 2y^{5/3} - 2y^5 - y^{10/3} + y^5 dy
$$

Sort of a nasty integral but at least we arrived at the marginals. The plot of the marginal is shown below.

<img src="/assets/img/margin_y.png">

### Rejection Sampling

#### Compute Probabilities

Now that we have a proper joint pdf let's calculate a probability.

Ex 1: Find $P(0 \leq X \leq 0.5, 0 \leq Y \leq 0.5)$.

Answer:

The integral for the joint distribution turns out to be pretty intractable so we have to resort to an approximation technique like rejection sampling to solve this problem.

I won't go into detail here on rejection sampling but the idea is that we randomly sample from the support of $X$ and $Y$ to get candidate points $x^{c}$ and $y^{c}$. We then randomly sample $u$ from a uniform distribution between 0 and 1 and accept samples $(x^{c},y^{c})$ where $u \leq f_{X,Y}(x^{c},y^{c})$.

Using this method we get the $P(0 \leq X \leq 0.5, 0 \leq Y \leq 0.5)$ to be around 0.29122.

### Plot of Joint Distribution

<img src="/assets/img/joint_dist.png">

## Appendix
1. Link to code

## Sources
1. Adapted from [Paul's Online Notes](https://tutorial.math.lamar.edu/classes/calciii/digeneralregion.aspx)
2. [Rejection Sampling](https://www.youtube.com/watch?v=kYWHfgkRc9s)