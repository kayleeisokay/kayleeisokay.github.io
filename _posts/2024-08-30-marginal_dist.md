---
layout: post
title: Marginal and Joint Distributions
categories: [Statistics]
excerpt: However in many real world cases we are often interested in the distribution of two or more random variables modeled together. For example we may ask what is the distribution of grades for two classes? 
---

# Marginal and Joint Distributions

## Section 1. Single Random Variable

In simple cases, we have only one random variable. In the example below, we have synthetic data representing grades for a single class. Using this distribution we can calculate statistics such as the mean or variance. The height of each bar represents the frequency of grades, so roughly 60 people got an A in the class.

<img src="/assets/img/math_grades_dist.png">

However in many real world cases we are often interested in the distribution of two or more random variables modeled together. For example we may ask what is the distribution of grades for two classes? 

The distribution of two or more random variables is called the joint distribution, often denoted as $f_{X, Y}(x, y)$ for random variables $X$ and $Y$. This definition can be generalized to $n$ amount of random variables, so a joint distribution can look like $f_{X, Y, Z}(x, y, z)$ or even $f_{A, B, C, D}(a, b, c, d)$. 

As one may know, random variables can be discrete or continuous. Nevertheless, the definition applies to both cases. First, we will look at the discrete case and follow with a continuous case.

## Section 2. Discrete Case 

### Table Representation of Joint Distribution

Let's say we are interested in the distribution of grades for not one but two classes, Math and English. Quantities such as the probability of getting A's in both classes or the probability of failing both classes are quantities that can be measured using a joint distribution. 

Let's do an example. Let $X$ be the random variable for Math grades and $Y$ be the random variable for English grades. The following graph depicts the distribution for English grades.

<img src="/assets/img/eng_grades_dist.png">

Both $X$ and $Y$ take on values in the set {A, B, C, D, F}. The table below represents the joint distribution of $X$ and $Y$, where the columns are grades for $Y$ and the rows are grades for $X$. Reading off the table we can say that the probability of getting A's in both classes is 0.03, while the probability of getting an A in math and a B in English is 0.13.

|X = Math, Y = English   | A      | B      | C      | D      | F      | 
|---|--------|--------|--------|--------|--------|
| A | 0.01   | 0.12   | 0.0367 | 0.0367 | 0.0133 |
| B | 0.05   | 0.15   | 0.05   | 0.03   | 0.0267 |
| C | 0.03   | 0.1667 | 0.04   | 0.05   | 0.02   |
| D | 0.0067 | 0.0667 | 0.03   | 0.0167 | 0.0133 |
| F | 0      | 0.02   | 0.0067 | 0.0067 | 0.0033 |

Note that all cell values in the table must sum to 1 because the joint distribution is a proper probability distribution. The tile plot below is a visualization of the joint distribution table.

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

We can rewrite the table of $f_{X,Y}(x,y)$ to include the marginal distributions.

| X = Math, Y = English  | A      | B      | C      | D      | F      | $p_X(x)$ | 
|---|--------|--------|--------|--------|--------|--------|
| A | 0.01   | 0.12   | 0.0367 | 0.0367 | 0.0133 | **0.2167** |
| B | 0.05   | 0.15   | 0.05   | 0.03   | 0.0267 | **0.3067** |
| C | 0.03   | 0.1667 | 0.04   | 0.05   | 0.02   | **0.3067** |
| D | 0.0067 | 0.0667 | 0.03   | 0.0167 | 0.0133 | **0.1334** |
| F | 0      | 0.02   | 0.0067 | 0.0067 | 0.0033 | **0.0367** |
| $p_Y(y)$   | **0.0967** | **0.5234** | **0.1634** | **0.1401** | **0.0766** |

As we can see the marginal distributions for $X$ and $Y$ are equivalent to the ones in the previous plots. This is because in this example $X$ and $Y$ are independent. When random variables are independent they factor as a product of the marginals, so $f_{X,Y}(x,y) = f_X(x) f_Y(y)$.

### Marginal Distributions of $n$ dimensions

I often only see examples of joint distributions and marginal distributions using two random variables, which is why I was really confused to see that a joint distribution can have more than two marginal distributions. However we can generalize to $n$ number of random variables. Let's do a three dimensional case to illustrate the logic but the reasoning can be extended to $n$ dimensions.

For the joint distribution $f_{X, Y, Z}(x, y, z)$ there are several marginal distributions: $p_X(x)$, $p_Y(y)$, $p_Z(z)$ and $p_{X,Y}(x,y)$, $p_{X,Z}(x,z)$, $p_{Y,Z}(y,z)$.

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

## Section 3. Continuous Case

Now let's look at joint and marginal distributions for continuous random variables. 

### Definitions

The intuition is similar to the discrete case except that we replace summation with integration. Recall that integration is essentially a summation with a limit applied. The joint distribution is again defined as

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

Here $D$ represents the support of $X$ and $Y$. Intuitively, for the continuous case we collapse the dimension by integrating out all dimensions except the one of interest.

### Example 1

#### a) Find Normalizing Constant

For our example, let's define our joint distribution as

$$
f_{X, Y}(x, y) = 4xy - y^3
$$

over the region $D = \{(x,y) \vert ~ 0 \leq x \leq 1, x^3 \leq y \leq \sqrt{x}  \}$ $.^{[1]}$

<img src="/assets/img/math_problem.png">

Intuitively this means that the random variable of $X$ takes values between 1 and 0, while $Y$ takes values between $x^3$ and $\sqrt{x}$. The pdf is defined by the surface 4xy - y^3 and the area under this surface represents probability. 

First we find the normalizing constant by solving for $C$. We do this by integrating the joint pdf over the support of $X$ and $Y$ and set the double integral to 1.

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

We find $C = \frac{156}{55}$.

#### b) Computing Marginals

There are two marginals of interest $f_X(x)$ and $f_Y(y)$. To find $f_X(x)$ we want to collapse the $Y$ dimension. We already did this as an intermediate step so we have

$$
f_X(x) = \frac{156}{55} \int_0^1 \frac{7}{4} x^2 - 2x^7 + \frac{1}{4}x^{12} dx.
$$

The plot of $f_X(x)$ is shown below.

<img src="/assets/img/margin_x.png">

For $f_Y(y)$ we flip the order of integration. To do so we need to redefine the bounds of the integral. The bounds of $X$ is then 

$$
y = \sqrt{x} \rightarrow x = y^2
$$

and

$$
y = x^3 \rightarrow x = y^{(1/3)}.
$$

For $Y$ it is $[0,1]$.

So then,

$$
f_Y(y) = \frac{156}{55} \int_0^1 \int_{y^2}^{y^{1/3}}  4xy - y^3 ~dx~dy
$$

$$
= \frac{156}{55} \int_0^1 2y^{5/3} - 2y^5 - y^{10/3} + y^5 dy
$$

This was sort of a nasty integral but at least we arrived at the marginal pdf for $Y$. The plot of the distribution is shown below.

<img src="/assets/img/margin_y.png">

### Example 2: Rejection Sampling

#### a) Compute Probabilities

Now that we have a proper joint pdf let's calculate a probability.

Ex 1: Find $P(0 \leq X \leq 0.5, 0 \leq Y \leq 0.5)$.

Answer:

The integral for the joint distribution turns out to be pretty intractable so we have to resort to an approximation technique like rejection sampling to solve this problem.

I won't go into detail here on rejection sampling but the idea is that we randomly sample a pair of points from the support of $X$ and $Y$ to get candidate points $(x^{c}, y^{c})$. We then randomly sample $u$ from a uniform distribution between 0 and 1 and accept candidate pairs $(x^{c},y^{c})$ where $u \leq f_{X,Y}(x^{c},y^{c})$.

Using this method we get the $P(0 \leq X \leq 0.5, 0 \leq Y \leq 0.5)$ to be around 0.29122.

### b) Plot of Joint Distribution

Now that we've done all the hard work, let's visualize our joint distribution.

<img src="/assets/img/joint_dist.png">

<img src="/assets/img/contour.png">

From both of the plots, we can see that most of the density is near the value of 1. All the points are clustered there and the height of the pdf is greatest around that point.

## Appendix
1. Link to code

## Sources
1. Adapted from [Paul's Online Notes](https://tutorial.math.lamar.edu/classes/calciii/digeneralregion.aspx)
2. [Rejection Sampling](https://www.youtube.com/watch?v=kYWHfgkRc9s)