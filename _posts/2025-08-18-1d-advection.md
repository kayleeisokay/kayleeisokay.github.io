---
layout: post
title: 1D Advection
tags: applied-math
categories: medium-read
description: Advection is a mechanism by which a quantity is transported by a fluid flow.
---

## Personal Note - Motivations

Lately, I've been interested in the mathematics of fluid dynamics because of a [blog post](https://theoceancleanup.com/updates/forecasting-ocean-plastic-around-the-globe-a-deep-dive-into-modeling-the-garbage-patches/) by the Ocean Cleanup, which details their ocean modeling approach. I’ve been interested in scientific modeling for a long time, but didn’t have the background to understand it. After taking AM115, I feel like I understand it now since we covered advection briefly, using car traffic as a case. I wanted to take what I learned and apply it to study the movement of plastic pollution in water. I find myself particularly driven when self-studying for these topics. The fear of having to go back to working in the private sector as a data scientist gives me all the motivation I need.

## Advection

Advection is the mechanism by which a quantity is transported by a fluid flow. Advection, for example, can model the flow of pollutants via the movement of water. In this post, we’ll consider the 1D case, where the fluid flow is unidirectional along a single spatial dimension. We’ll model a single quantity of interest, plastic density. Let it be denoted as 

$$\phi(x, t)$$

, where $x$ and $t$ are independent variables for space and time, respectively.

Let's suppose the density of plastic moves along a channel of fixed length $L_x$ and uniform speed of $U$. $L_x = 1$ m and $U=1$ m/s in this post, but these can be changed to any arbitrary length or velocity. 

To understand how density is carried by the fluid, fix a single point in space, say the grid point $x_i$. The plastic density at $x_i$ will vary over time, due to the fact that the fluid is moving past it.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/flux.gif" class="img-fluid rounded z-depth-1" 
        caption="Figure 1. Flux" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
    </div>
</div>

Like with other PDEs, we need a way to approximate $\phi_0(x)$, which is a function that gives us the plastic density for each position $x$. To do so, we discretize in space. In our example, the position ranges from $[0, 1]$. We split the interval into $N$ equal length steps, $x_{i+1} - x_i =: \delta x := \frac{L}{N}$. Note, not shown, but we do the same for time. 


Next, let $\phi^{n}_i$ be the approximate average value of $\phi(t_n, x_i)$. Taking a forward step in time and in space, we get:

$$
\phi_i^{n+1} \approx \phi(t_n + \delta t, x_i); \quad \phi_{i+1}^{n} \approx \phi(t_n , x_i + \delta x)
$$.


With some thinking, we can figure out a way to express the RHS. Using the intuition given in Figure 1, we intuit that only plastic density within a distance $U \delta t$ will cross into the cell (gray shaded box). Phrased another way, over a time step, a certain number of particles move into the cell. A proportion $(U \delta t) /  \delta x$  crosses the cell boundary. We multiply this by $\phi_i^n$ to get the total density $\phi_i^n (U \delta t) / \delta x$ that leaves cell $i$ and total density and enters the cell $i+1$ ($\phi_{i-1}^n (U \delta t) / \delta x$). Substituting these values in, we get

$$
\phi_i^{n+1} = \phi_i^n + (\phi_{i-1}^n - \phi_{i}^n) ~U \delta t/ \delta x
$$.

The new density at the next time step is the starting density plus the density entering, minus the density leaving. Rearranging the equation, we see something interesting,

$$
\frac{\phi_i^{n+1} - \phi_i^n}{\delta t}  = -U \frac{\phi_{i-1}^n - \phi_{i}^n} {\delta x}.
$$

When $\delta x \rightarrow 0$ and $\delta t \rightarrow 0$, we get the 1D advection partial differential equation:

$$
\frac{\partial \phi}{\partial t} = -U \frac{\partial \phi}{\partial x}.
$$

## Numerical Approximation

Now that we know how to time step, we need to give $\phi$ a functional form. We’ll model $\phi$ as a Gaussian density, $e^{-\frac{(x-0.5)^2}{0.03}}$, centered at 0.5 with standard deviation of 0.03. There is no normalizing constant. The advection speed is set to 1.0 m/s. Since it is positive, the plastic density moves to the right. For our first attempt, we use an upwind numerical scheme and use a periodic boundary conditions. In the code, we set the boundary conditions as shown in the code snippet below. `ip` is for the $i+1$ index and `im` is for the $i-1$ index. One can think of this system as modeling the density of plastic moving around in a circular pipe or torus. 

```matlab
ip = [2:nx 1];      
im = [nx 1:nx-1];
```


### Upwind Scheme

The upwind scheme is given by 

$$
\phi_i^{n+1} = \phi_i^n - U \frac{\delta t}{\delta x} (\phi_i^n - \phi_{i-1}^n) ^{[2]}
$$.

The coefficient in front of the second term has a special name, Courant's number, $C = \frac{U \delta t}{\delta x}$. Some numerical schemes require that $C <> 1$ for stability, like explicit finite differences. The upwind scheme is an explicit method, so we must check $C < 1$.

From Figure 2, we see that the upwind scheme introduces numerical diffusion, which is an unwanted side effect. We expect the density to remain the same over time. To address this, we will use the Lax-Wendroff scheme.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/advection_upwind.gif" class="img-fluid rounded z-depth-1" 
        caption="Figure 2. Upwind Scheme" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
    </div>
</div>


## Lax-Wendroff Scheme

The Lax–Wendroff method belongs to the class of conservative schemes. The Lax-Wendroff outset is a Taylor approximation of $\phi_i^{n+1}$ around the point $(i, n)$. Derivation can be found in Source 2, Page 73. 

$$
\phi_i^{n+1} = \phi_i^n - \frac{1}{2} U \frac{\delta t}{\delta x} (\phi_i^n - \phi_{i-1}^n) + \frac{1}{2} U^2 \frac{\delta t^2}{\delta x^2} (\phi_{i+1}^n - 2\phi_i^n + \phi_{i-1}^n) ^{[2]}.
$$

From Figure 3, we see that the Lax-Wendroff scheme reduces numerical diffusion compared to the upwind scheme. The density keeps its shape over time, which is the desired behavior.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/advection_lax.gif" class="img-fluid rounded z-depth-1" 
        caption="Figure 3. Lax-Wendroff Scheme" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
    </div>
</div>

### Diffusion Term

To add one final touch of realism to the model, we can add a diffusion term in order to capture the notion that plastic density can spread out over time. The diffusion equation is given by:

$$
\frac{\partial \phi}{\partial t} = D \frac{\partial^2 \phi}{\partial x^2}
$$.

If we rewrite the PDE as finite differences, using $\delta t$ as the time step and $\delta x$ as the space step, we get

$$
\frac{\phi_i^{n+1} - \phi_i^n}{\delta t} = D \cdot \frac{\phi_{i+1}^n - 2\phi_i^n + \phi_{i-1}^n}{\delta x^2}
$$.

Rearranging terms, 

$$
\phi_i^{n+1} = \phi_i^n + D \frac{\delta t}{\delta x^2} \left( \phi_{i+1}^n - 2\phi_i^n + \phi_{i-1}^n \right)
$$.

Let $\alpha = \frac{D \delta t}{\delta x^2}$, the term in front of the second derivative. In the code, we first use the Lax-Wendroff scheme without the diffusion term, and then we do a second step with the diffusion term. 

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/advection_diffusion.gif" class="img-fluid rounded z-depth-1" 
        caption="Figure 4. Lax-Wendroff with Diffusion" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
    </div>
</div>

Figure 4 shows the effect of diffusion on the density profile over time. The introduction of the diffusion term allows the plastic density to spread out more naturally, simulating the physical process more accurately. This is not a result of numerical diffusion, and the strength of the diffusion term can be controlled by adjusting the value of $D$ (units of $m^2/s$).

## Sources
1. [https://www.youtube.com/watch?v=uf4g_U8Ok3c&list=WL&index=1](https://www.youtube.com/watch?v=uf4g_U8Ok3c&list=WL&index=1)
2. [https://leifh.folk.ntnu.no/teaching/tkt4140/._main070.html](https://leifh.folk.ntnu.no/teaching/tkt4140/._main070.html)