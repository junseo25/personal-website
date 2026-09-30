# Jun Seo Lee - Personal Website

The source code for my personal website, featuring my professional experience, education, extracurricular involvement, awards, publications, and contact information.

[View the live website](https://junseo-lee.com)

## Features

- Responsive, single-page layout for desktop and mobile devices
- Section-based navigation with shareable URL hashes
- Light and dark themes with saved visitor preferences
- Downloadable resume and supporting professional documents
- Dedicated sections for experience, involvement, awards, and media contributions
- Reduced-motion support for visitors who prefer limited animation

## Built With

- Semantic HTML5
- CSS3 with custom properties and responsive layouts
- Vanilla JavaScript
- GitHub Pages

The site has no framework, package dependencies, or build step.

## Project Structure

```text
.
|-- public/
|   |-- docs/                  # Certificates and recommendation letters
|   |-- images/
|   |   `-- contributions/     # Publication and media images
|   |-- favicon.svg
|   |-- headshot.jpg
|   `-- resume.pdf
|-- wip/                       # Work-in-progress redesign (served at /wip/)
|   |-- index.html
|   `-- style.css
|-- CNAME                      # Custom domain configuration
|-- index.html                 # Site content and page structure
|-- script.js                  # Navigation, theme, and animation behavior
|-- style.css                  # Typography, colors, and responsive styling
`-- README.md
```

## Local Development

Clone the repository and open `index.html` in a browser:

```bash
git clone https://github.com/junseo25/personal-website.git
cd personal-website
```

Because the site is built with plain HTML, CSS, and JavaScript, no installation or compilation is required. A local static server or editor extension with live reload can also be used during development.

## Updating the Site

- Edit page content and links in `index.html`.
- Adjust the design tokens and responsive styles in `style.css`.
- Update interactive behavior in `script.js`.
- Store resumes, documents, icons, and images in `public/`, then reference them with paths beginning with `public/`.

## Work-in-Progress Designs

The `wip/` folder is a sandbox for trying new designs without touching the live page. It has its own `index.html` and `style.css`, but it loads the same `script.js` and assets from `public/`, so keep the elements that `script.js` looks for (`header.top`, `.bar`, `.bar-name`, `.tabs a`, `.panel`, `#themeToggle`, `.cue-line`, `#year`). Open `wip/index.html` through a local server (for example `python3 -m http.server`) and visit `/wip/`.

Content in `wip/index.html` is a copy of the live content, so update both files when your experience changes. When a design is ready, move its markup and styles into the root `index.html` and `style.css`. The page is marked `noindex`, but it is public at `/wip/` once it's on the Pages branch.

## Deployment

The site is hosted with GitHub Pages and served from the custom domain [junseo-lee.com](https://junseo-lee.com). Updates are published when changes are pushed to the repository's configured Pages branch.

The `CNAME` file must remain in the repository root so GitHub Pages can retain the custom domain configuration.

## Author

Jun Seo Lee

- [GitHub](https://github.com/junseo25)
- [LinkedIn](https://www.linkedin.com/in/lee-jun-seo/)
