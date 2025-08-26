---
layout: post
title: Diffusion Models - Differential Equations
tags: applied-math
categories: long-read
description: The forward and reverse processes of a diffusion model are governed by stochastic differential equations.
---

## Personal Note - Motivations

In many posts that I see online, diffusion models are only talked about in the context of how to use a diffusion model and how the model is optimized (variational inference). The forward process is often described as a Markov Chain, which is true but this skips the step of why a Markov chain is used to begin with. The underlying reason is that the forward and reverse process of a diffusion model are governed by stochastic differential equations (SDEs). Markov chains are one method to numerically solve an SDE. In this post, I will discuss the SDEs that govern such processes and hopefully the reader, like me, will appreciate how neat they are.

## Variance-Preserving SDE

As most know, a diffusion model has a forward and reverse process. The forward process takes an image and gradually adds noise to each pixel until the entire image is noise. A neural network is then trained to take the corrupted image and denoise it, effectively learning the reverse process. After training, one is left with a generative model. Given a corrupted image, the model can generate a new image. 

Thinking about this process, one can start to formulate how to describe it mathematically. What is the unit of observation and which dimensions do we need to keep track of? It is clear that we need a time dimension $t$ because we're trying to model a process over time. We could use an entire image as a unit of observation and treat the problem as the evolution of a density but an easier method is to use each pixel has a unit of observation. There is also a space dimension to track, which is the 3D space of RGB values or just a single vector for grayscale images. For all examples below, we will use grayscale images.

To recap, we will use an SDE to model the trajectory of a pixel $x_t$ over time $t$. The space is the 1D space of pixel intensity values. The general form Ito SDE is given by 

\begin{equation}
\frac{d x_t}{d t} = f(x_t, t)dt + g(x_t, t)dW_t
\end{equation}

where $W_t$ is standard Brownian motion, meaning the noise term $\epsilon \sim \mathcal{N}(0, dt)$. The drift term $f(x_t, t)$ is the deterministic part, while the diffusion term $g(x_t, t)$ is the stochastic part. \footnote{One may have seen this equation in time series. It's essentially the same concept.}

Variance preserving means the variance of the pixels stays roughly constant even as noise is added, $Var[X_t] \approx Var[X_0]$. This is important in the context of deep learning because it keeps training stable. The SDE for the variance-preserving case is given by

\begin{equation}
\frac{d x_t}{d t} = -\frac{1}{2} \beta(t) x_t dt + \sqrt{\beta(t)} d W_t
\end{equation}

, where

\begin{equation}
f(t, x_t) = -\frac{1}{2} \beta(t) x_t; \quad g(t, x_t) = \sqrt{\beta(t)}.
\end{equation}

Note that $g(t, x_t)$ is independent of the state and only depends on time. The parameter $\beta(t)$ is the variance schedule. It is a hyperparameter that controls the amount of noise added at each step. This equation is known as the Ornstein–Uhlenbeck process. The derivation is not shown. For the rest of this blog, we'll use a constant $\beta(t) = \beta$, so we'll drop the $t$:

\begin{equation}
\frac{d x_t}{d t} = -\frac{1}{2} \beta x_t dt + \sqrt{\beta} d W_t.
\end{equation}

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/sde_paths.gif" class="img-fluid rounded z-depth-1" 
        caption="Figure 1. Pixel Trajectories in Intensity Space" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
    </div>
</div>

Figure 1 shows the trajectories of two pixels over time, each starting at the intensity value of 0. To keep in mind, for simplicity, the initial condition is fixed in this example but this does not have to be the case.

### Numerical Integration

In practice, we cannot solve SDEs analytically, so we resort to numerical methods. The basic idea is to discretize time and approximate the solution at each time step. This known as the Euler-Maruyama method, which in practice is implemented via Markov Chain Monte Carlo (MCMC) methods. Mathematically we can express it as the following recursive relation:


\begin{equation}
x_{t+\Delta t} = x_t + f(t, x_t) \Delta t + g(t) \epsilon \sqrt{\Delta t}  \quad \text{where } \epsilon \sim \mathcal{N}(0, 1)
\end{equation}

The time step $t+\Delta t$ is only dependent on the previous state and $\epsilon$ does not depend on time because we're adding constant noise. $f(t, x_t)dt \approx f(t, x_t) \Delta t$. In the equation above, we approximated $g(t) dW_t$.

$$
g(t) dW_t = g(t) (\mu t + \sigma B(t)) = g(t) \sigma B(t) \approx g(t) \epsilon \sqrt{\Delta t}  \quad \epsilon \sim \mathcal{N}(0, I)
$$

The first step, we plug in the definition of change in Brownian motion. The second step we drop the $\mu$ term because the mean of our Brownian motion is 0. The third step we set variance to the $\Delta t$, the time step and use the fact that $B(t) \sim \mathcal{N}(0, \Delta t)$ both from the definition of Brownian motion.

### Solution to the SDE Equation

At this point, we have an equation that governs the trajectories of pixels over intensity space over time. When solving an SDE, we talk about whether a distribution of paths solve the SDE. A solution of an SDE is a probability distribution of $\\{X_t \\}_{t=0}^T$, namely the joint distribution over all $X_t$ for $t \in [0, T]$. The SDE is linear with additive noise, so the solution must be Gaussian for all $t$.

The solution is given by:

\begin{equation}
X_t = e^{-\frac{1}{2} \beta t} X_0 + \int_0^t e^{-\frac{1}{2} \beta (t-s)} \sqrt{\beta} dW_s
\end{equation}

The first term is the mean contribution and the second term is the variance contribution. Let's compute the variance of $X_t$: 

$$
Var[X_t] = e^{- \beta t} Var[X_0] + Var\left[\int_0^t e^{- 0.5 \beta (t-s)} \sqrt{\beta} dW_s\right]
$$

From ito integral we know that 

$$
Var[\int_0^t f(s) dW_s] = \int_0^t f^2(s) ds
$$

so then,

$$
\int_0^t \beta e^{-\beta (t-s)} ds = 1 - e^{-\beta t}
$$

The variance of $X_t$ is given by

$$
Var[X_t] = e^{- \beta t} Var[X_0] + (1 - e^{-\beta t}).
$$

The expected value is computed by

$$
E[X_t] = e^{-\frac{1}{2} \beta t} E[X_0] + \int_0^t e^{-\frac{1}{2} \beta (t-s)} \sqrt{\beta} E[dW_s]
$$

but since $E[dW_s] = 0$, we have

$$
E[X_t] = e^{-\frac{1}{2} \beta t} X_0.
$$

The SDE solution shows us that for initial condition $X_0 = x_0$,the conditional distribution $X_t \vert X_0 = x_0$ is Gaussian. In distributional form, we have

\begin{equation}
X_t \vert X_0 = x_0 \sim \mathcal{N}\left( e^{-\frac{1}{2} \beta t} x_0, 1- e^{-\beta t} \right)
\end{equation}

or equivalently as a pdf

\begin{equation}
p(x, t \vert x_0, 0) =  \frac{1}{\sqrt{2 \pi (1 - e^{-\beta t})}} \exp\left(-\frac{(x - e^{-\frac{1}{2} \beta t} x_0)^2}{2(1 - e^{-\beta t})}\right).
\end{equation}

$Var[X_0] = \sigma^0 = 0$ because we start with a fixed initial condition. Equations (7) and (8) are solutions to the SDE.

## Fokker-Planck Equation

The joint distribution over all $X_t$ for $t \in [0, T]$ is nice to have but for diffusion probabilistic models, we consider a weaker notion. We are only interested in the marginal probability distributions $\\{p_t\\}_{t=0}^T$, such that $X_t \sim p_t$ for each $t$. Fixing $t$, we are interested in how the density $p_t(x_t)$ evolves over time. For example, if we simulated a bunch of trajectories and took a slice at $t=0.4$, as shown in Figure 2, what would the density look like?

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/fokker_intuition.png" class="img-fluid rounded z-depth-1" 
        caption="Figure 2. Fokker-Planck Equation Intuition" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
    </div>
</div>

For VPE-SDE fixed $\beta(t) = \beta$ SDE, The corresponding Fokker - Planck PDE is:

$$
\partial_t p_t(x) = -\partial_x \left( f(t, x) p_t(x) \right) + \frac{g^2(t)}{2} \partial_{xx}(p_t(x)).
$$ 

The FPE PDE is the equation that governs the change in the unconditional density over time. The solution to this PDE is the unconditional density after marginalizing over the initial condition $X_0$. The solution to the FPE with initial condition $p(x_0, 0)$ is

\begin{equation}
p_t(x) = \int p_t(x, t | x_0, 0) p(x_0) dx_0.
\end{equation}

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/fokker_planck_evolution.gif" class="img-fluid rounded z-depth-1" 
        caption="Figure 3. Fokker-Planck Equation Evolution" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
    </div>
</div>

## Probability Flow ODE

For any Itô SDE with drift f(x,t) and diffusion g(t), you can define a deterministic ODE whose solution has the same marginal distributions as the SDE.

\begin{equation}
\frac{d x}{d t} = f_{ODE}(x, t) - \frac{1}{2} g^2(t)\nabla_x \log p_t(x)
\end{equation}

$\nabla_x \log p_t(x)$ is the score function which is learned by the neural network. The term pushes particles to higher density regions of $p_t(x)$, which deterministically reproduces the distribution evolution. This ODE is deterministic, no stochastic term. This is the reason we are able to jump timesteps in the reverse process (paper by Song et al.).

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/reverse_trajectories.png" class="img-fluid rounded z-depth-1" 
        caption="Figure 4. Reverse Trajectories" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/reverse_distribution.png" class="img-fluid rounded z-depth-1" 
        caption="Figure 5. Recovered Distribution" %}
    </div>
</div>

In Figures 4 and 5 we start by sampling from a Gaussian noise distribution and then reverse the process to get back the original distribution, which is a bi-modal Gaussian mixture. The process is analogous to the diffusion process for an image where we start with a sampled noisy image and reverse the process to recover the original distribution, the denoised image. 

## Sources

2.1. Gaussian mixture models. (n.d.). Scikit-learn. https://scikit-learn.org/stable/modules/mixture.html

Ryu, E. K. & Seoul National University. (2021). Diffusion Models Chapter 1: Reverse-Time SDE. In Generative AI and Foundation Models. https://ernestryu.com/courses/FM/diffusion1.pdf

Ryu, E. K. & Seoul National University. (2021). Diffusion Models Chapter 2: Training via Score Matching. In Generative AI and Foundation Models. https://ernestryu.com/courses/FM/diffusion2.pdf

Sigman, K. (n.d.). IEOR 4700: Notes on Brownian Motion. https://www.columbia.edu/~ks20/FE-Notes/4700-07-Notes-BM.pdf

Song, Y., Sohl-Dickstein, J., Kingma, D. P., Kumar, A., Ermon, S., & Poole, B. (2020). Score-Based Generative Modeling through Stochastic Differential Equations. arXiv (Cornell University). https://doi.org/10.48550/arxiv.2011.13456

## Appendix

### Brownian Motion

A stochastic process $\textbf{B} = \{B(t): t \geq 0\}$ possessing continuous sample paths is called standard Brownian motion if 

1. $B(0) = 0$.
2. $\textbf{B}$ has both stationary and independent increments.
3. $\textbf{B}(t) - \textbf{B}(s) \sim \mathcal{N}(0, t-s)$ for all $0 \leq s < t$. mean is 0 and variance is $t-s$.

- For variance $\sigma^2$ and drift $\mu$, $y(t) = \mu t + \sigma B(t)$, the definition is the same except:
$$
y(t) - y(s) \sim \mathcal{N}(\mu(t-s), \sigma^2(t-s))
$$

### Gaussian Mixture

The mixture distribution is defined as:
$$
p(x) = w_1 \mathcal{N}(x | \mu_1, \sigma_1^2) + w_2 \mathcal{N}(x | \mu_2, \sigma_2^2)
$$

The weights $w_1$ and $w_2$ control how likely you are to sample from each component when you draw from the mixture.