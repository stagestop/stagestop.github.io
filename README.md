Stage Stop Gun Shop Website
===========================

## Local development with Docker

This repo includes a Docker-based Jekyll development setup. Ruby dependencies are managed by Bundler via `Gemfile` and `Gemfile.lock`, and deployment is intended to run through the GitHub Actions Pages workflow.

Start the site:

```sh
docker compose up --build
```

Then open:

```text
http://localhost:4000
```

The project directory is bind-mounted into the container at `/site`, so changes made on your host machine are immediately visible to Jekyll and remain tracked by Git as normal.

Generated Jekyll output is shadow-mounted with Docker named volumes:

- `/site/_site`
- `/site/.jekyll-cache`

That keeps generated development artifacts out of your working tree while still allowing live rebuilds inside the container.

If you change Ruby dependencies, update the lockfile and rebuild the image:

```sh
bundle lock
docker compose build
```

Stop the dev server:

```sh
docker compose down
```

Remove the generated Docker volumes if you want a completely clean rebuild:

```sh
docker compose down --volumes
```
