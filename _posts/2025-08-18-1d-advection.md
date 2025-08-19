---
layout: post
title: 1D Advection
tags: applied math
categories: medium-read
description: Advection is a mechanism by which a quantity is transported by a fluid flow.
---

## Motivation

Lately, I've been interested in the mathematics of fluid dynamics because of a [blog post](https://theoceancleanup.com/updates/forecasting-ocean-plastic-around-the-globe-a-deep-dive-into-modeling-the-garbage-patches/) by the Ocean Cleanup, detailing their ocean modeling approach. I don't have much of a physics background but a lot of could be understood with the language of mathematics. In AM115 at Harvard, we covered advection briefly in the context of car traffic. I thought it was pretty cool to apply it to ocean currents and the movement of pollutants in water.

## Advection

Advection is the mechanism by which a quantity is transported by a fluid flow. For example, in the case of ocean currents, advection describes how pollutants or nutrients are carried by the movement of water. We'll consider the 1D case, where the fluid flow is unidirectional along a single spatial dimension. Let 

$$\phi(x, t)$$

be the density of plastic in the water at position $x$ and time $t$. Time and position are the two independent variables and density is the dependent variable.

Let's suppose the density of plastic moves along the channel (set to 1 meter) with uniform speed of $U$. We want to understand how the density is carried by the fluid. If we fix our attention at a single, fixed point in space, say the grid point $x_i$, the density there will vary over time, due to the fact that the fluid is moving past it. The rate at which the density moves across a given surface is called the flux.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/flux.gif" class="img-fluid rounded z-depth-1" 
        caption="Figure 1. Flux" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
    </div>
</div>

To model this we have to discretize in time and in space. Let  denote time step  and position . In our example, position ranges from $[0, L]$. We split the interval into $N$ equal length steps, $x_{i+1} - x_i =: \delta x := \frac{L}{N}$. We do the same for time. To solve the PDE, we integrate with respect to time. Taking a forward step in time and in space we get:

$$
\phi_i^{n+1} \approx \phi(t_n + \delta t, x_i); \quad \phi_{i+1}^{n} \approx \phi(t_n , x_i + \delta x)
$$.

With some thinking we can find a way to express the RHS. Using the intuition given in the flux plot, we rationalize that only plastic density within distance $U \delta t$ will cross into the cell (over the course of a time step, particles moves into the cell). A proportion $(U \delta t) /  \delta x$  crosses the boundary. We multiply this by $\phi_i^n$ to get that amount of $\phi_i^n (U \delta t) / \delta x$ that leaves cell $i$ and into cell $i+1$. From here we get 

$$
\phi_i^{n+1} = \phi_i^n + (\phi_{i-1}^n - \phi_{i}^n) ~U \delta t/ \delta x
$$.

The new density at the next time step is the starting density plus the amount entering and minus the amount leaving. If we rearrange the equation we see something interesting,
$$
\frac{\phi_i^{n+1} - \phi_i^n}{\delta t}  = -U \frac{\phi_{i-1}^n - \phi_{i}^n} {\delta x} \rightarrow \frac{\partial \phi}{\partial t} = -U \frac{\partial \phi}{\partial x}.
$$
When $\delta x \rightarrow 0$ and $\delta t \rightarrow 0$, we get the 1d advection partial differential equation.

## Numerical Approximation


The system models $\phi$ as a gaussian density, $e^{-\frac{(x - 0.5)^2}{0.03}}$. There is no normalizing constant. The advection speed is -1.0 m/s. The density moves to the left. We use an upwind numerical scheme. One can think of this systems as a density of plastic in a circular pipe (torus). The plastic flows around the pipe. Due to numerical diffusion, the plastic gradually spreads out over time. There are many ways numerical schemes. We first try the upwind scheme (explicit method).

### Upwind Scheme

The upwind scheme is given by 

$$
\phi_i^{n+1} = \phi_i^n - U \frac{\delta t}{\delta x} (\phi_i^n - \phi_{i-1}^n) ^{[2]}
$$.

Courant's number is defined as $C = \frac{U \delta t}{\delta x}$, where $U$ is the advection speed, $\delta t$ is the time step, and $\delta x$ is the spatial step. Some numerical schemes require that $C \leq 1$ for stability, like explicit finite differences, so it's good to check.

$$
\frac{\phi_i^{n+1} - \phi_i^n}{\delta t} = -U \frac{\phi_{i}^n - \phi_{i-1}^n}{\delta x}
$$.

From Figure 2, we see that the upwind scheme introduces numerical diffusion, which is not what we want. We expect the density to remain the same over time. However, we see the density spreading out. To fix this, we'll use the Lax-Wendroff scheme.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/advection_upwind.gif" class="img-fluid rounded z-depth-1" 
        caption="Figure 2. Upwind Scheme" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
    </div>
</div>

## Lax-Wendroff Scheme

The Lax–Wendroff method belongs to the class of conservative schemes. The Lax-Wendroff outset is a Taylor approximation of $\phi_i^{n+1}$. Derivation can be found in Source 2, Page 73. 

$$
\phi_i^{n+1} = \phi_i^n - \frac{1}{2} U \frac{\delta t}{\delta x} (\phi_i^n - \phi_{i-1}^n) + \frac{1}{2} U^2 \frac{\delta t^2}{\delta x^2} (\phi_{i+1}^n - 2\phi_i^n + \phi_{i-1}^n) ^{[2]}.
$$

From Figure 3, we see that the Lax-Wendroff scheme reduces numerical diffusion compared to the upwind scheme. The density profile remains sharper over time, which is the desired behavior.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/advection_lax.gif" class="img-fluid rounded z-depth-1" 
        caption="Figure 3. Lax-Wendroff Scheme" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
    </div>
</div>

To add one final touch of realism to the model, we can introduce a diffusion term in order to capture the notion that plastic density can spread out over time. 

We introduce $\alpha = \frac{D \delta t}{\delta x^2}$. It is derived from the diffusion equation.
$$
\frac{\partial \phi}{\partial t} = D \frac{\partial^2 \phi}{\partial x^2}
$$.

If we rewrite the PDE as finite differences, using $\delta t$ as the time step and $\delta x$ as the space step, we get

$$
\frac{\phi_i^{n+1} - \phi_i^n}{\delta t} = D \cdot \frac{\phi_{i+1}^n - 2\phi_i^n + \phi_{i-1}^n}{\delta x^2}
$$.

Rearranging terms, we get

$$
\phi_i^{n+1} = \phi_i^n + D \frac{\delta t}{\delta x^2} \left( \phi_{i+1}^n - 2\phi_i^n + \phi_{i-1}^n \right)
$$.

The term in front of the second derivative is $\alpha$. 

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/advection_diffusion.gif" class="img-fluid rounded z-depth-1" 
        caption="Figure 4. Lax-Wendroff with Diffusion" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
    </div>
</div>

Figure 4, shows the affect of diffusion on the density profile over time. The introduction of the diffusion term allows the plastic density to spread out more naturally, simulating the physical process more accurately. This is not a result of numerical diffusion and the strength of the diffusion term can be controlled by adjusting the value of $D$.

## Sources
1. https://www.youtube.com/watch?v=uf4g_U8Ok3c&list=WL&index=1
2. https://leifh.folk.ntnu.no/teaching/tkt4140/._main070.html