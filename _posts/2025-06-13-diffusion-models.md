---
layout: post
title: Diffusion Models
tags: ai, machine-learning
categories: short-read
description: Part 1 of a series on diffusion models
---

## Personal Motivation

This post isn't meant to be informative but rather more of a post to satisfy my curiosity about diffusion models. It's been a while since I was amazed by some topic. Learning has been admittedly drab for the past decade. Stanford really killed my passion for learning. I'm slowly getting it back as I work through my master's degree. 

## Why Care About Diffusion Models?

In many data science problems, we run into the issue of not having enough data. Examples of this include class imbalance, missing time series data, or not enough observations to generate sufficient power in a statistical test. In the simplest case, we have a vector of data points that are i.i.d. with a closed-form distribution (e.g., Gaussian or exponential). 

$$
x_i \sim \mathcal{N}(\mu, \sigma^2)
$$

In this case, we simply draw more samples from the distribution to increase the number of observations. Even if there isn't an analytical form of the distribution, methods like Gibbs sampler or Metropolis-Hastings can be used to generate more samples.

However, in many modern-day problems, the data isn't i.i.d., and we don't have any analytical expression for the distribution. What if the input data are images representing human facial emotions? This motivates the need for generative models in order to generate more data for problems with more complex input data. Diffusion models are one such type of generative model. Others include GANs (generative adversarial networks) and VAEs (variational autoencoders), which will not be covered in this post.

## The Diffusion Model Framework

One can think of a diffusion model in two steps: a forward diffusion process and a reverse process to undo the forward diffusion. Let's first cover the forward diffusion process.

### Forward Diffusion Process

The goal of the forward diffusion process is to gradually at Gaussian noise to an image until we arrive at an isotropic Gaussian noise distribution. An isotropic Gaussian noise distribution is one where the covariance matrix can be written as a multiple of the identity matrix:

$$
\Sigma = \sigma^2 I
$$

, for some constant $\sigma^2 > 0$. For those in economics (like me), this is analogous to the homoskedasticity assumption in OLS regression. For the case of images, one can think of it as each pixel having the same variance.

To start, we sample a data point (tensor) $x_0$ from the true data distribution $q(x)$. The forward process is a Markov chain with $T$ discrete time steps $t = 0, 1, \ldots, T^{[1]}$: 

$$
q(x_t | x_{t-1}) = \mathcal{N}(x_t; \mu = \sqrt{1 - \beta_t} x_{t-1}, \Sigma_t = \beta_t I)
$$

By the Markov property, the next data point $x_t$ only depends on the previous data point $x_{t-1}$. The parameter $\beta_t$ is a hyperparameter known as the variance schedule, which controls the amount of noise added at each time step. The schedule is typically chosen such that $\beta_t$ increases with $t$. Common choices for $\beta_t$ include linear schedules, cosine schedules, or exponential schedules.

At each time step $t$, we add Gaussian noise to the data point $x_{t-1}$ to get the next data point $x_t$:

$$
x_0 \rightarrow x_1 \rightarrow x_2 \rightarrow \ldots \rightarrow x_T
$$

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/cosine_schedule.png" class="img-fluid rounded z-depth-1" 
        caption="Figure 1. Cosine Schedule" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
    </div>
</div>

- Linear schedule (top)

- Cosine schedule (bottom)

The current setup has one issue: how can we compute $q(x_T \vert x_0)$? In order to compute, we have to run the forward process for all $t$ time steps, which is computationally expensive. We reparameterize the equation to circumvent these issues. Let

$$
\alpha_t = 1 - \beta_t
$$

$$
\bar{\alpha}_t = \prod_{s=1}^t \alpha_s
$$

Then we can rewrite the forward process as:

$$
q(x_t \vert x_0) = \mathcal{N}(x_t; \sqrt{\bar{\alpha}_t} x_0, (1 - \bar{\alpha}_t) I).
$$

With this expression, we can "jump" to any time step $t$ and retrieve the image $x_t$ given the original image $x_0$.

In Part II, we'll cover the reverse diffusion process.

## Footnotes
1. (This assumption will be relaxed later when we re-express diffusion models as a stochastic differential equation)

## Sources

Ho, J., Jain, A., & Abbeel, P. (2020). Denoising diffusion probabilistic models. arXiv (Cornell University). https://doi.org/10.48550/arxiv.2006.11239

Nichol, A., & Dhariwal, P. (2021, February 18). Improved denoising diffusion probabilistic models. arXiv.org. https://arxiv.org/abs/2102.09672
