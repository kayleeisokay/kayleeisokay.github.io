---
layout: post
title: Neural Operators
tags: applied-math, ai
categories: long-read
description: An introduction to neural operators, a class of deep learning models designed to learn mappings between infinite-dimensional function spaces.
---

## Personal Note - Motivations

This is a short project that I did as part of a research group. The biggest takeaway from this project is that there exists other classes of problems outside of discrete token prediction (e.g., language models) or data-fitting on finite-dimensional vector spaces (e.g., tabular data, images, audio, etc). It's nice to see AI being applied to science instead of just business applications.

## Introduction

The problem that we are trying to solve with neural operators is to find mappings between infinite dimensional function spaces. Specifically, we train a neural network to learn some operator
$$
\mathcal{G}_\theta: \mathcal{X} \to \mathcal{Y}, 
$$
where $\mathcal{X}$ and $\mathcal{Y}$ are infinite-dimensional function spaces. An operator is a function that takes functions as inputs and returns functions as outputs. A simple example is the derivative operator $\frac{d}{dx}$,
$$
\frac{d}{dx} (x^2 + 3x + 2) = 2x + 3.
$$
Contrast this with vanilla, neural networks which learn mappings from vector space to vector space:
$$
\mathcal{N}_\theta: \mathbb{R}^m \to \mathbb{R}^n.
$$

Why use a neural network instead of a numerical solver? Solving ODEs and PDEs can be done with numerical solvers but it has to start over for each new set of initial conditions or boundary conditions. In this post, we look at a specific neural operator, DeepONet. The idea of DeepONet is to train the model once and reuse the model to find solution functions for initial conditions that the model hasn't seen before. Also unlike numerical methods, DeepONet is able to predict at any resolution (agnostic to sensor points).

## DeepONet Architecture

### Objective
To illustrate the goal, consider the ODE
$$
\frac{d}{dx}x(t) = f(x(t), u(t), t).
$$
This ODE describes some system where the position changes with time. The function $f$ represents how that change occurs. This can be the physics that governs the system. The function $u(t)$ is a forcing function or control function that influences the system. For example, if this ODE describes a car driving down a road, then $u(t)$ could be the acceleration or braking input from the driver.

The neural network finds the $\mathcal{G}(u)$ that satisfies:
$$
\mathcal{G}(u)(t) = x(t | u(t))
$$

$$
= x(0) + \int_0^t f(\mathcal{G}(u)(\tau), u(\tau), \tau) d\tau
$$

### Input and Output
The first input into the DeepONet model is $u$, which can represent the initial condition, forcing term, or parameter field. We sample $u$ at various sensor points, $u(x_1), u(x_2), ..., u(x_m)$. The second input is $y \in \mathbb{R}^d$, the points where you want to evaluate the output function. The number of sensor points and the dimension of $y$ do not need to match. Additionally, the sampling strategy is by default uniform over the domain; however, this is a hyperparameter and can be adjusted. For example, you can choose to sample more finely at certain intervals in the domain. The output of DeepONet is 
$$
\mathcal{G}(u)(y) \in \mathbb{R}.
$$
This is the operator $\mathcal{G}$ applied to the function $u$ evaluated at $y$.

The motivation for a forcing function is that in a given ODE or PDE, such as the ODE below,
$$
\frac{d^2s}{dx^2} + s(x) = u(x), 
$$
the forcing function $u(x)$ specifies how the system is driven (like an external load, temperature source, etc.). The solution $s(x)$ is the system’s response.

### Branches
DeepONet has two branches, named branch net and trunk net. Each of the branches are feedforward networks. The branch net encodes the input, forcing function  $u$, typically by evaluating it at a few sensor points $x_1, ..., x_m$. The trunk net encodes the evaluation coordinate $x$, where we want $s(x)$. It learns where we're evaluating the solution. The branches are combined with an inner product of each branch's output:
$$
\mathcal{G}(u)(y) = s(x) \approx \sum_{k=1}^p b_k(u)t_k(x).
$$
The output of branch net is a vector,
$$
\boldsymbol{b}(u) = [b_1(u), b_2(u), ..., b_p(u)],
$$
where $p$ is the dimension of the latent space. The output of the trunk net is 
$$
\boldsymbol{t}(x) = [t_1(u), t_2(u), ..., t_p(u)].
$$

The motivation for splitting into two branches is because of the universal approximation theorem for operators:
$$
\bigg|G(u)(y) - \sum^p_{k-1}\sum^n_{i=1} c_i^k\sigma\bigg(\sum_{j=1}^m \xi^k_{ij}u(x_j) + \theta_i^k\bigg) \sigma(w_k \cdot y + \zeta_k)\bigg|< \epsilon
$$
This formulation proves that DeepONet can approximate any continuous operator to arbitrary precision. Let's break this formula into separate terms to understand it better. The first is the branch net term:
$$
\sigma\bigg(\sum_{j=1}^m \xi^k_{ij}u(x_j) + \theta_i^k\bigg).
$$

- $m$ is the number of sensor points used to discretize input function $u(x)$.
- $\xi^k_{ij}$ are the weights of the branch network.
- $\theta_i^k$ are the biases of the branch network.
- This is a linear layer followed by an activation $\sigma$.

The second is the trunk net term:
$$
\sigma(w_k \cdot y + \zeta_k)
$$
- $w_k$: weights of the trunk network.
- $\zeta_k$: biases of the trunk network.
- $y$: output location.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/deeponet.png" class="img-fluid rounded z-depth-1" 
        caption="Figure 1. DeepONet Architecture" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
    </div>
</div>

Finally, the outer summation has the final combination weights $c_i^k$, $p$ is the branch network output dimension, and $n$ is the branch network hidden layer width.

## Experiments

We explore three different experiments: linear ODE, non-linear ODE, and diffusion-reaction PDE. In each experiment, we generate training data by solving the equations with finite difference methods. We randomly sample forcing functions $u(x)$ from a Gaussian random field with a squared exponential kernel. We compare the results of DeepONet with a FFN that directly maps from discretized $u(x)$ to discretized $s(x)$. The FFN has the same number of parameters as DeepONet for a fair comparison.

### Linear Case
We consider a linear problem by choosing 

$$
g(s(x), u(x), x) = u(x)
$$

, which is equivalent to learning the antiderivative operator

$$
G: u(x) \mapsto s(x) = \int_0^x u(\tau) d\tau.
$$

Here, $g$ is some operator that acts on $s, u$ and $x$. $u(x)$ is the input function to the neural network or the forcing term in the equation. $s(x)$ is the solution we are trying to find with the network. 

In this formulation $u(x)$ is known. We want to learn the operator $G$. The relationship between $s(x)$ and $u(x)$ is such that when you apply $g$ to $(s, u, x)$ you get back $u(x)$

The differential equation is 

$$
\frac{ds}{dx} = u(x).
$$

So, the neural network will attempt to learn the antiderivative operator for this equation.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/deeponet_exp1.png" class="img-fluid rounded z-depth-1" 
        caption="Figure 1. Linear ODE Experiment" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
    </div>
</div>


### Non-Linear Case
For the non-linear case, we have

$$
g(s(x), u(x), x) = -s^2(x) + u(x)
$$

or equivalently,

$$
\frac{ds}{dx} = -s^2(x) + u(x).
$$
This is a Ricatti-type equation with forcing. $-s^2(x)$: Nonlinear decay term (the rate of change decreases with the square of $s$). $u(x)$ is the external forcing/control term. The solution $s(x)$ depends nonlinearly on both its current value and the input $u(x)$.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/deeponet_exp2.png" class="img-fluid rounded z-depth-1" 
        caption="Figure 1. Non-Linear ODE Experiment" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
    </div>
</div>

### Diffusion Reaction System
$$
\frac{\partial y}{\partial t} - D \frac{\partial^2 y}{\partial x^2} + k y^2 - v = 0,
$$

where $D$ = 0.01 and $k$ = 0.01.

$D$ is diffusion coefficient. $k y^2$ is a nonlinear reaction term. The function $u(x)$ only depends on space. We use Dirichlet boundary conditions: 

$$
s(0, t) = s(1, t) = 0.
$$

This means we fix solution at the edges. The PDE evolves inside the domain, but the boundaries are pinned. Imagine heat in a rod where both ends are held at 0°C — no matter what happens inside, the ends stay cold.

For our training data generation, we use finite differences to approximate the second derivative:

$$
\frac{\partial^2s}{\partial x^2} \approx \frac{s_{i-1} - 2s_i + s_{i+1}}{dx^2}
$$

We use an implicit Euler method to time step. 

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/deeponet_exp3a.png" class="img-fluid rounded z-depth-1" 
        caption="Figure 1. Diffusion Reaction System Experiment" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
    </div>
</div>

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/deeponet_exp3b.png" class="img-fluid rounded z-depth-1" 
        caption="Figure 1. Diffusion Reaction System Experiment" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
    </div>
</div>


