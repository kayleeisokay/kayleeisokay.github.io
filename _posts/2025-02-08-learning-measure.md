---
layout: post
title: Learning Measure Theory
categories: medium-read
tags: statistics
description: Measure theory is the basis for modern probability and statistics. I read a bit on it and wanted to share what I learned.
related_posts: false
---

## Introduction

I'd like to motivate this post with a meme I found on r/mathmemes.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/random_variable.png" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
    </div>
</div>

When I first read it, it actually didn't make sense to me. All prior statistics classes never went in-depth on the definition of a random variable. My hope for this most is to write a bit about probability space to show why this joke is funny and true. 

First, we introduce each piece of a probability measure space (there are three) and culminate with the definition of a random variable.

## Sample Space

The easiest of the three is the sample space, which is just an arbitrary non-empty set $\Omega$. One can think of the sample space as the set of all possible outcomes. 

### Examples
- If we are modeling a single die roll, $\Omega = \{1, 2, 3, 4, 5, 6\}$. 
- If we are modeling a coin flip, $\Omega = \{H, T\}$.
- If we are modeling the grade on an exam, $\Omega = \{x \in \mathbb{R} ~ \vert ~ 0 \leq x \leq 100\}$.

## Sigma Algebra

Next, we introduce the sigma algebra $\mathcal{F}$. The sigma algebra is a set of subsets of $\Omega$, mathematically $\mathcal{F} \subseteq 2^{\Omega} = \mathcal{P}(\Omega)$. The latter term is the power set of $\Omega$, e.g., the set of all possible subsets of $\Omega$, which includes the empty set. 

### Examples
- For a single coin toss, $\mathcal{F} = \{\emptyset, \{H\}, \{T\}, \{H, T\}\}$. Since $\mathcal{F}$ is the power set of $\Omega$, satisfying $\mathcal{F} \subseteq 2^{\Omega}$, it can serve as a sigma algebra for a probability space.
- For a single die roll the sigma algebra is also the power set of $\Omega$, which is $\{\emptyset, \{1\}, \{2\}, \{3\}, \{4\}, \{5\}, \{6\}, \{1, 2\}, \{1, 3\}, \ldots, \{1, 2, 3, 4, 5, 6\}\}$.
    - *Note: Often times sigma algebra is $\mathcal{P}(\Omega)$, however this doesn't need to be the case. It just needs to be a subset of the $\mathcal{P}(\Omega)$ so it can even be a smaller set.*

For $\mathcal{F}$ to be a sigma algebra, it must satisfy three properties:
1. $\Omega \in \mathcal{F}$. When this property is satisfied, we say that $\mathcal{F}$ contains the sample space.
    - For example, the set $\{\emptyset, \{H\}, \{T\}\}$ would violate this property for the coin flip example.
2. If $A \in \mathcal{F}$, then $A^c \in \mathcal{F}$. We refer to this property as being closed under complements. In some books, they write $A^c$ as $\Omega \setminus A$, but both are equivalent. 
    - A quick check confirms that the sigma algebras we defined in the prior examples satisfy this property. 
    - A counterexample would be the set $B = \{\{H\}, \{T\}, \{H, T\}\}$ because the complement of $\{H, T\}$ (e.g. the empty set $\emptyset$) is not in the set $B$.
3. If $A_i \in \mathcal{F}$ for $i = 1, 2, \ldots$, then $\cup_{i=1}^{\infty} A_i \in \mathcal{F}$. We refer to this property as being closed under countable unions. This means that the union of all elements in the sigma algebra is also in the sigma algebra.
    - A quick check shows that the sigma algebras we defined in the example above satisfy this property. For the coin flip example, the union of $\{H\} \cup \{T\} \cup \{H, T\} \cup \emptyset$ = $\{H, T\}$ which is in the sigma algebra. 
    - A counterexample is the set $C = \{A \subseteq \mathbb{N} ~ \vert ~ A \text{~is finite} \}$, where $A_n = \{n\}$, then $\cup_{i=1}^{\infty} A_i = \mathbb{N}$, which is infinite, so $\mathbb{N}$ is not in $C$. This shows that the set $C$ is not closed under countable union. 


## Probability Measure

The probability measure is a function $P: \mathcal{F} \rightarrow [0, 1]$. It assigns a probability to each event in $\mathcal{F}$. For the coin toss example, we assign probability $\frac{1}{2}$ to event ${H}$ using the uniform distribution probability measure. In the die example, all events have probability $\frac{\vert A \vert}{6}$, where $A \in \mathcal{F}$. Again, the uniform probability measure is used.

The probability measure satisfies the following properties:

1. If $\{A_i\}_{i=1}^{\infty} \in \mathcal{F}$ for $i = 1, 2, \dots$ and $A_i \cap A_j = \emptyset$ for $i \neq j$, then:

$$
P\left(\bigcup_{i=1}^{\infty} A_i\right) = \sum_{i=1}^{\infty} P(A_i)
$$

- This property is called countable additivity.
- For a collection of events, if each event is pairwise disjoint. The probability of their union is the sum of their probabilities.

2. $P(\Omega) = 1$. The probability of the sample space is 1.

## Probability Measure Space

Now that we have all the components, the probability measure space is defined as the triple ($\Omega, \mathcal{F}, P$). There are other measure spaces like the Lebesgue measure space or the counting measure space. The probability measure space is just a special case of a measure space.

## Random Variable

Finally, we arrive at the punchline. Let's define a random variable. 

A random variable is a function $X: \Omega \rightarrow S$. If $S$ is countable, we refer to $X$ as a discrete random variable. If $S$ is uncountable (e.g. $\mathbb{R}$), we refer to $X$ as a continuous random variable. 

Now we have to define additional terms to make use of a random variable. We write $P(X = x):= P(\{X = x\})$, which is shorthand for the probability of the event where $X = x$. Note that $x \in S$ and $\{X = x\}$ is the event that $X = x$. We can write this as $\{X = x\} = \{\omega \in \Omega \vert X(\omega) = x\} \in A$. This means that $\forall x \in S$, the event $\{X = x\}$ is in the sigma algebra $\mathcal{F}$. It's a little bit confusing, but the next example should clarify things.

### Example:

Let's have a random variable that is the number of heads after three coin flips. The sample space is $\Omega = \{HHH, HHT, HTH, HTT, THH, THT, TTH, TTT\}$. The random variable $X$ is the number of heads. For example
- $X(HHH) = 3$
- $X(HHT) = 2$
- $X(HTT) = 1$

Notice that the function $X$ takes in elements of $\Omega$. Also notice that $S$ is $\{0, 1, 2, 3\}$, which is countable. Therefore, $X$ is a discrete random variable. We now use our probability measure $P$ to compute probabilities of events like $P(X = 2)$. Let $P$ be uniform probability measure so then $P[A] = \frac{\vert A \vert}{8}$ for all $A \in \Omega$.

The event $\{X = x\}$ consists of all sample points $\omega$ for which $X(\omega) = x$. If $X = 1$, we have the set $\{HTT, THT, TTH\}$. If we want to compute the probability that the number of heads is 1, we can write

$$
P(X = 1) = P({HTT, THT, TTH}) = P(HTT) + P(THT) + P(TTH) = 1/8 + 1/8 + 1/8 = 3/8.
$$

### Aside: 

Different probability distributions have different probability measures. For Poisson, the probability measure is 

$$
P(X = k) = \frac{\lambda^k e^{-\lambda}}{k!}.
$$

For the normal distribution, the probability measure is

$$
P(X = x) = \frac{1}{\sqrt{2\pi \sigma^2}} e^{-\frac{(x - \mu)^2}{2\sigma^2}}.
$$

## Conclusion

As we can see, a random variable is neither random nor a variable. It is a function that maps elements of the sample space to elements of a measurable set $S$. The probability measure is a function that assigns probabilities to events in the sigma algebra $\mathcal{F}$. The sigma algebra is a set of subsets of the sample space that satisfy special properties.


