# Bailey Tucker: Instructional Design Portfolio

Static portfolio site: a self-paced eLearning course, the instructional design document behind it, and write-ups on the design process. Hosted on GitHub Pages with a custom domain from Route 53.

See [AGENTS.md](AGENTS.md) for the file layout and editing rules (Claude Code reads it through `CLAUDE.md`, Gemini CLI through `GEMINI.md`).

## Publish with GitHub Pages

1. On GitHub, open the repo's **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
3. The site appears at `https://tucamsam.github.io/bailey-professional-site/` within a few minutes.

The repo must be public for Pages on a free GitHub account.

## Connect the Route 53 domain

1. **Verify the domain first.** In your GitHub account's **Settings → Pages** (the account settings, not the repo's), click **Add a domain**. GitHub shows a TXT record. Add it in Route 53, then click **Verify**. This stops anyone else from claiming the domain on GitHub.
2. In the Route 53 hosted zone for the domain, create these records. Each row is one record with all its values on separate lines:

   | Record name | Type | Value |
   | --- | --- | --- |
   | *(blank, the apex)* | A | `185.199.108.153`<br>`185.199.109.153`<br>`185.199.110.153`<br>`185.199.111.153` |
   | *(blank, the apex)* | AAAA | `2606:50c0:8000::153`<br>`2606:50c0:8001::153`<br>`2606:50c0:8002::153`<br>`2606:50c0:8003::153` |
   | `www` | CNAME | `tucamsam.github.io` |

3. In the repo's **Settings → Pages → Custom domain**, enter the apex domain (for example `example.com`) and save. GitHub commits a `CNAME` file to `main`, so run `git pull` before your next push.
4. Once GitHub shows the DNS check passed, tick **Enforce HTTPS**. The certificate can take up to 24 hours.

If the domain was registered in Route 53, it already has a hosted zone. Use that one. Don't create a second zone, because its name servers won't match the domain's.

## Updating

Edit files, commit, and push to `main`. Pages redeploys automatically.
