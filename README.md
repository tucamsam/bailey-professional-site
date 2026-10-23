# Bailey's Professional Portfolio

A responsive, static portfolio site built with HTML and CSS. No build step or
dependencies are required.

## Personalize the site

Edit `index.html` to add your introduction, location, project details, and email
address. Replace the example project copy and `hello@example.com` before
publishing.

## Deploy with GitHub Pages

The workflow in `.github/workflows/pages.yml` deploys the repository root to
GitHub Pages when changes are pushed to `main` (or when manually triggered).
In the repository settings, select **Pages** and set the build and deployment
source to **GitHub Actions**.

## Use a Route 53 custom domain

The custom domain was not provided, so there is no `CNAME` file yet. After
choosing a domain:

1. Set the custom domain under **Settings → Pages** in the repository.
2. Add the domain to a `CNAME` file in the repository root, with only the
   hostname on the first line (for example, `www.example.com`).
3. In Route 53, create the DNS records GitHub Pages specifies for your chosen
   hostname. For an apex domain, use GitHub's recommended A/AAAA records; for a
   subdomain, create a CNAME pointing to `tucamsam.github.io`.
4. Wait for DNS to propagate, then enable **Enforce HTTPS** in Pages settings.
