// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "projects by categories in reversed chronological order",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-cv",
          title: "cv",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "post-neural-operators",
        
          title: "Neural Operators",
        
        description: "An introduction to neural operators, a class of deep learning models designed to learn mappings between infinite-dimensional function spaces.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/neural-operators/";
          
        },
      },{id: "post-diffusion-models-differential-equations",
        
          title: "Diffusion Models - Differential Equations",
        
        description: "The forward and reverse processes of a diffusion model are governed by stochastic differential equations.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/diffusion-sde/";
          
        },
      },{id: "post-1d-advection",
        
          title: "1D Advection",
        
        description: "Advection is a mechanism by which a quantity is transported by a fluid flow.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/1d-advection/";
          
        },
      },{id: "post-diffusion-models",
        
          title: "Diffusion Models",
        
        description: "Part 1 of a series on diffusion models",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/diffusion-models/";
          
        },
      },{id: "post-learning-measure-theory",
        
          title: "Learning Measure Theory",
        
        description: "Measure theory is the basis for modern probability and statistics. I read a bit on it and wanted to share what I learned.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/learning-measure/";
          
        },
      },{id: "post-factorization-theorem",
        
          title: "Factorization Theorem",
        
        description: "What is a statistic?",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/factorization-thm/";
          
        },
      },{id: "post-csci-103-final-project-google-slides",
        
          title: 'CSCI-103 Final Project - Google Slides <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "Store Sales in Ecuador Group 6 - Team Sixth Sense",
        section: "Posts",
        handler: () => {
          
            window.open("https://docs.google.com/presentation/d/1pxoXm3ex-QRM-S3FwwAo5v-xM0m6dZsJ2CQxt_sk6dE/edit?slide=id.p#slide=id.p", "_blank");
          
        },
      },{id: "post-rejection-sampling",
        
          title: "Rejection Sampling",
        
        description: "Rejection sampling is a computational strategy to sample from any arbitrary distribution. This proves useful especially for complex density functions that can&#39;t be calculated analytically.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/sampling/";
          
        },
      },{id: "post-marginal-and-joint-distributions",
        
          title: "Marginal and Joint Distributions",
        
        description: "In many real-world cases, we are often interested in the distribution of two or more random variables modeled together. For example, we can ask what the distribution of grades is for two classes.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/marginal_dist/";
          
        },
      },{id: "post-conjugate-distributions",
        
          title: "Conjugate Distributions",
        
        description: "Conjugate distributions are special pairs of distributions that simplify computation.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/conjugate-priors/";
          
        },
      },{id: "post-just-a-moment",
        
          title: 'Just a moment... <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://crystaldatasy.medium.com/ml-classification-model-to-predict-kickstarter-campaign-success-128c8358f0d3", "_blank");
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-a-simple-inline-announcement",
          title: 'A simple inline announcement.',
          description: "",
          section: "News",},{id: "news-a-long-announcement-with-details",
          title: 'A long announcement with details',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_2/";
            },},{id: "news-a-simple-inline-announcement-with-markdown-emoji-sparkles-smile",
          title: 'A simple inline announcement with Markdown emoji! :sparkles: :smile:',
          description: "",
          section: "News",},{id: "projects-project-1",
          title: 'project 1',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_project/";
            },},{id: "projects-project-2",
          title: 'project 2',
          description: "a project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_project/";
            },},{id: "projects-project-3-with-very-long-name",
          title: 'project 3 with very long name',
          description: "a project that redirects to another website",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_project/";
            },},{id: "projects-project-4",
          title: 'project 4',
          description: "another without an image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/4_project/";
            },},{id: "projects-project-5",
          title: 'project 5',
          description: "a project with a background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/5_project/";
            },},{id: "projects-project-6",
          title: 'project 6',
          description: "a project with no image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/6_project/";
            },},{id: "projects-project-7",
          title: 'project 7',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/7_project/";
            },},{id: "projects-project-8",
          title: 'project 8',
          description: "an other project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/8_project/";
            },},{id: "projects-project-9",
          title: 'project 9',
          description: "another project with an image 🎉",
          section: "Projects",handler: () => {
              window.location.href = "/projects/9_project/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%6B%76%6F@%73%65%61%73.%68%61%72%76%61%72%64.%65%64%75", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/kayleeisokay", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/kayv0", "_blank");
        },
      },{
        id: 'social-medium',
        title: 'Medium',
        section: 'Socials',
        handler: () => {
          window.open("https://medium.com/@kayleeisokay", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
