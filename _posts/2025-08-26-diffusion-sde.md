---
layout: post
title: Diffusion Models - Differential Equations
tags: applied-math
categories: long-read
description: The forward and reverse processes of a diffusion model are governed by stochastic differential equations.
---

## Personal Note - Motivations

In many posts that I see online, diffusion models are only talked about in the context of how to use a diffusion model and how the model is optimized (e.g., variational inference). The forward process is often described as a Markov Chain, which is true, but doesn’t explain why a Markov chain is used to begin with. The forward and reverse processes of a diffusion model are governed by stochastic differential equations (SDEs), and Markov chains are used to numerically solve the SDE. In this post, I discuss the SDEs that govern both processes, and hopefully, the reader will appreciate how neat they are.

## Variance-Preserving SDE

A diffusion model involves both forward and reverse processes. The forward process takes an image and gradually adds noise to each data point until the entire distribution is noise. In the context of images, noise is added to each pixel channel until the entire image is white noise. For the reverse process, a neural network is then trained, taking the noisy image as input, generating noise predictions, and using them to denoise the image. After training, one is left with a generative model. Given a noisy image, the model can reverse the process to generate a new image. 

The reverse and forward processes can each be expressed as a continuous mathematical model. We use a pixel as a unit of observation and model its trajectory in intensity space over time. For a grayscale image, intensity is a scalar, ranging from 0 to 255. For RGB images, the space dimension has three components, one for each of the three channels. One can think of a point moving randomly in 3D space, as shown in Figure 1. For the remaining examples in this blog post, we will use grayscale images.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/3d_random_walk.gif" class="img-fluid rounded z-depth-1" 
        caption="Figure 1. Random Walk in RGB Space" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
    </div>
</div>

We use an SDE to model the trajectory of a pixel $x_t$ over time $t$. The space is the 1D space of grayscale pixel intensity values. The general form of the Ito SDE is given by

\begin{equation}
d x_t = f(x_t, t)dt + g(x_t, t)dW_t
\end{equation}

, where $W_t$ is Brownian motion with noise term $\epsilon \sim \mathcal{N}(0, dt)$. The drift term $f(x_t, t)$ is the deterministic part, while the diffusion term $g(x_t, t)$ is the stochastic part. Next, we use the variance preserving (VP) form of the SDE $[3]$. Variance preserving means the variance of the pixels stays roughly constant even as noise is added, $Var[X_t] \approx Var[X_0]$. This is important in the context of deep learning because it keeps training stable. The SDE for the VP case is given by

\begin{equation}
d x_t = -\frac{1}{2} \beta(t) x_t dt + \sqrt{\beta(t)} d W_t
\end{equation}

, where

$$
f(t, x_t) = -\frac{1}{2} \beta(t) x_t; \quad g(t, x_t) = \sqrt{\beta(t)}.
$$

Note that $g(t, x_t)$ is independent of the state and only depends on time. The parameter $\beta(t)$ is the variance schedule. It is a hyperparameter that controls the amount of noise added at each step. This equation is known as the Ornstein–Uhlenbeck process (derivation is not shown). For the rest of this blog, we'll use a constant $\beta(t) = \beta$, so we can drop the $t$:

\begin{equation}
d x_t = -\frac{1}{2} \beta x_t dt + \sqrt{\beta} d W_t.
\end{equation}

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/sde_paths.gif" class="img-fluid rounded z-depth-1" 
        caption="Figure 2. Pixel Trajectories in Intensity Space" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
    </div>
</div>

Equation (3) gives us the final VP SDE for the forward process. Figure 2 shows the trajectories of two pixels over time, each starting at the intensity value of 0. Pixels were normalized to be between -1 and 1. To keep in mind, for simplicity, the initial condition is fixed in this example, but this does not have to be the case.

### Numerical Integration

In practice, we often cannot solve SDEs analytically, so we resort to numerical methods. The idea is to discretize time and space and approximate the solution. This is known as the Euler-Maruyama method, which in practice is implemented via Markov Chain Monte Carlo (MCMC) methods. Mathematically, we can express it as the following recursive relation:

\begin{equation}
x_{t+\Delta t} = x_t + f(t, x_t) \Delta t + g(t) \epsilon \sqrt{\Delta t}  \quad \text{where } \epsilon \sim \mathcal{N}(0, 1)
\end{equation}

By the Markov assumption, the time step $t+\Delta t$ is only dependent on the previous timestep $t$, and $\epsilon$ does not depend on time because we're adding constant noise. For the drift term, we use the approximation that $f(t, x_t)dt \approx f(t, x_t) \Delta t$. For $g(t) dW_t$, we approximate it by $g(t) \epsilon \sqrt{\Delta t}$. To arrive at this approximation, we do the following manipulation:

$$
g(t) dW_t = g(t) (\mu t + \sigma B(t)) = g(t) \sigma B(t) \approx g(t) \epsilon \sqrt{\Delta t}  \quad \epsilon \sim \mathcal{N}(0, I).
$$

In the first step, we plug in the definition of change in Brownian motion. In the second step, we drop the $\mu$ term because the mean of our Brownian motion is 0. In the third step, we set variance to the $\Delta t$, the time step, and use the fact that $B(t) \sim \mathcal{N}(0, \Delta t)$, both from the definition of Brownian motion.

### Solution to the SDE Equation

At this point, we have an equation that governs the trajectories of pixels over intensity space over time. When solving an SDE, we talk about whether a distribution of paths solves the SDE. A solution of an SDE is a probability distribution of $\\{X_t \\}_{t=0}^T$, namely the joint distribution over all $X_t$ for $t \in [0, T]$. The SDE is linear with additive noise, so the solution must be Gaussian for all $t$.

The solution $[2]$ is given by:

\begin{equation}
X_t = e^{-\frac{1}{2} \beta t} X_0 + \int_0^t e^{-\frac{1}{2} \beta (t-s)} \sqrt{\beta} dW_s.
\end{equation}

The first term is the mean contribution and the second term is the variance contribution. Let's compute the variance of $X_t$, assuming $X_0$ is independent of $W_t$:

\begin{equation}
Var[X_t] = e^{- \beta t} Var[X_0] + Var\left[\int_0^t e^{- 0.5 \beta (t-s)} \sqrt{\beta} dW_s\right]
\end{equation}

Focusing on the second term $I = \int_0^t h(s) dW_s$, from Itô isometry $[6]$ and because $E[I]= 0$, we know that $Var[I] = E[I^2]$. So then,

$$
Var[I] = E[I^2] = \int_0^t f^2(s) ds 
$$

$$
= \int_0^t \beta e^{-\beta (t-s)} ds = 1 - e^{-\beta t}
$$

Substituting back, we find that

\begin{equation}
Var[X_t] = e^{- \beta t} Var[X_0] + (1 - e^{-\beta t})
\end{equation}

Next, we compute the expected value:

$$
E[X_t] = e^{-\frac{1}{2} \beta t} E[X_0] + \int_0^t e^{-\frac{1}{2} \beta (t-s)} \sqrt{\beta} E[dW_s]
$$

but since $E[dW_s] = 0$, we have

\begin{equation}
E[X_t] = e^{-\frac{1}{2} \beta t} X_0.
\end{equation}

The SDE solution shows us that for initial condition $X_0 = x_0$,the conditional distribution $X_t \vert X_0 = x_0$ is Gaussian. In distributional form, we have

\begin{equation}
X_t \vert X_0 = x_0 \sim \mathcal{N}\left( e^{-\frac{1}{2} \beta t} x_0, 1- e^{-\beta t} \right)
\end{equation}

or equivalently as a pdf

\begin{equation}
p(x, t \vert x_0, 0) =  \frac{1}{\sqrt{2 \pi (1 - e^{-\beta t})}} \exp\left(-\frac{(x - e^{-\frac{1}{2} \beta t} x_0)^2}{2(1 - e^{-\beta t})}\right).
\end{equation}

Equations (9) or (10) are solutions to the SDE.

## Fokker-Planck Equation

The joint distribution over all $X_t$ for $t \in [0, T]$ (e.g., the distribution of pixel trajectories) is nice but for diffusion probabilistic models, we consider a weaker notion. We are only interested in the marginal probability distributions $\\{p_t\\}_{t=0}^T$, such that $X_t \sim p_t$ for each $t$. Fixing $t$, we are interested in how the density $p_t(x_t)$ evolves. For example, if we simulated a bunch of trajectories and took a slice at $t=0.4$, as shown in Figure 2, what would the density look like?

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/fokker_intuition.png" class="img-fluid rounded z-depth-1" 
        caption="Figure 3. Fokker-Planck Equation Intuition" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
    </div>
</div>

For VPE-SDE fixed $\beta(t) = \beta$ SDE, The corresponding Fokker - Planck PDE is:

\begin{equation}
\partial_t p_t(x) = -\partial_x \left( f(t, x) p_t(x) \right) + \frac{g^2(t)}{2} \partial_{xx}(p_t(x)).
\end{equation}

The FPE PDE is the equation that governs the change in the unconditional density over time. The solution to this PDE is the unconditional density after marginalizing over the initial condition $X_0$. The solution to the FPE with initial condition $p(x_0, 0)$ is

\begin{equation}
p_t(x) = \int p_t(x, t | x_0, 0) p(x_0) dx_0.
\end{equation}

Figure 4 illustrates the evolution of the marginal distribution over time. The example shown here is using Equation (2), which is a VP SDE with $\beta(t) = \beta$. The density starts with a mean of 2 and a standard deviation of 0.5, but as noise is added to the system, it converges to a standard normal distribution.

- $\mu_t = e^{-\frac{1}{2} \beta t} \cdot 2 \rightarrow 0$ as $t \rightarrow \infty$
- $Var(X_t) = 0.25e^{-\beta t}  + (1 - e^{-\beta t}) \rightarrow 1$ as $t \rightarrow \infty$

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/fokker_planck_evolution.gif" class="img-fluid rounded z-depth-1" 
        caption="Figure 4. Fokker-Planck Equation Evolution" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
    </div>
</div>

## Probability Flow ODE

For all diffusion processes, there exists a corresponding deterministic process whose trajectories share the same marginal probability densities $\\{p_t(x)\\}_{t=0}^T$ as the SDE. This deterministic process satisfies the ODE: <a href="https://openreview.net/forum?id=PxTIG12RRHS">[5]</a>

\begin{equation}
\frac{d x}{d t} = f(x, t) - \frac{1}{2} g^2(t)\nabla_x \log p_t(x)
\end{equation}

$\nabla_{x} \log p_t(x)$ is the score function, which is learned by the neural network. Intuitively, one can think of the term $\nabla_{x} \log p_t(x)$ as a guiding force that pushes particles to higher density regions of $p_t(x)$, which deterministically reproduces the distribution evolution.

To make it less abstract, we'll walk through a quick example of the reverse process. Assume the true underlying distribution is a Gaussian mixture with means $\mu_1 = -2$ and $\mu_2=2$,  $\sigma_1 = \sigma_2 = 0.30$, and equal weights $w_1 = w_2$. We'll start with a noise sample from $\mathcal{N}(0, 1)$ and reverse the process to get back the Gaussian mixture. Remember $x$ is a scalar. Plugging in $f(x, t)$ and $g(x, t)$ from Equation (3), we get the following probability flow ODE:

\begin{equation}
\frac{d x}{d t} = -\frac{1}{2} \beta x - \frac{1}{2} \beta \nabla_{x} \log p_t(x).
\end{equation}

For a mixture of Gaussians, we have

$$
p(x) = \sum^k_{j = 1} w_j \mathcal{N}(x | \mu_j, \sigma^2).
$$

The score is then,

$$
\nabla_x \log p(x) = \sum_{j=1}^k r_j(x) (-x - \mu_j) / \sigma^2
$$

where

$$
r_j(x) = \frac{w_j \mathcal{N}(x | \mu_j, \sigma^2)}{\sum_{i=1}^k w_i \mathcal{N}(x | \mu_i, \sigma^2)}.
$$

The score is a weighted average of each of the component scores. The responsibility $r_j(x)$ is the posterior probability that $x$ came from component $j$. The term $(x-\mu_j) / \sigma^2$ is the derivative of the Gaussian log-density with respect to $x$.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/reverse_trajectories.png" class="img-fluid rounded z-depth-1" 
        caption="Figure 5. Reverse Trajectories" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/reverse_distribution.png" class="img-fluid rounded z-depth-1" 
        caption="Figure 6. Recovered Distribution" %}
    </div>
</div>

In Figures 5 and 6, we show the trajectories and final distribution of the probability flow ODE. We start by sampling a point from a Gaussian noise distribution $\mathcal{N}(0, 1)$ and then reverse the process to get back the original distribution, the bi-modal Gaussian mixture with means $\mu_1 = -2$ and $\mu_2=2$,  $\sigma_1 = \sigma_2 = 0.30$ and equal weights $w_1 = w_2$. For this example, we know a priori the analytical stationary distribution, shown in orange. Figure 6 shows that the trajectories of the ODE closely match the true distribution. The process is analogous to the diffusion process for an image, where we start with a sampled noisy image and reverse the process to recover the original distribution, the denoised image.

## Sources

1. 2.1. Gaussian mixture models. (n.d.). Scikit-learn. https://scikit-learn.org/stable/modules/mixture.html

2. Ryu, E. K. & Seoul National University. (2021). Diffusion Models Chapter 1: Reverse-Time SDE. In Generative AI and Foundation Models. https://ernestryu.com/courses/FM/diffusion1.pdf

3. Ryu, E. K. & Seoul National University. (2021). Diffusion Models Chapter 2: Training via Score Matching. In Generative AI and Foundation Models. https://ernestryu.com/courses/FM/diffusion2.pdf

4. Sigman, K. (n.d.). IEOR 4700: Notes on Brownian Motion. https://www.columbia.edu/~ks20/FE-Notes/4700-07-Notes-BM.pdf

5. Song, Y., Sohl-Dickstein, J., Kingma, D. P., Kumar, A., Ermon, S., & Poole, B. (n.d.). Score-Based Generative Modeling through Stochastic Differential Equations. OpenReview. https://openreview.net/forum?id=PxTIG12RRHS

6. The Itô isometry —Andrew Tulloch. (n.d.). https://tullo.ch/articles/the-ito-isometry/

## Appendix

### Brownian Motion

A stochastic process $\textbf{B} = \{B(t): t \geq 0\}$ possessing continuous sample paths is called standard Brownian motion if 

1. $B(0) = 0$.
2. $\textbf{B}$ has both stationary and independent increments.
3. $B(t) - B(s) \sim \mathcal{N}(0, t-s)$ for all $0 \leq s < t$. mean is 0 and variance is $t-s$.

For variance $\sigma^2$ and drift $\mu$, $y(t) = \mu t + \sigma B(t)$, the definition is the same except:
$$
y(t) - y(s) \sim \mathcal{N}(\mu(t-s), \sigma^2(t-s))
$$

### Gaussian Mixture

The Gaussian mixture we used in the example was bimodal, which can be expressed as:
$$
p(x) = w_1 \mathcal{N}(x | \mu_1, \sigma_1^2) + w_2 \mathcal{N}(x | \mu_2, \sigma_2^2)
$$

The weights $w_1$ and $w_2$ control how likely you are to sample from each component when you draw from the mixture. A more general form is:
$$
p(x) = \sum_{i=1}^k w_i \mathcal{N}(x | \boldsymbol{\mu_i}, \boldsymbol{\Sigma_i^2}).
$$
where $k$ is the number of components in the mixture and $\boldsymbol{\mu_i}$ and $\boldsymbol{\Sigma_i^2}$ are the mean and covariance of the $i$-th component, respectively. The parameters can be scalars, as in the 1D case, or vectors/matrices for the multivariate case.