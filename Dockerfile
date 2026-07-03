FROM ruby:3.2-slim

# Jekyll 3.x matches this repo's older _config.yml style, including `gems:`.
RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential git \
    && gem install jekyll -v 3.9.5 \
    && gem install jekyll-paginate -v 1.1.0 \
    && gem install kramdown-parser-gfm -v 1.1.0 \
    && gem install webrick -v 1.8.2 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /site

EXPOSE 4000
EXPOSE 35729

CMD ["jekyll", "serve", "--host", "0.0.0.0", "--port", "4000", "--livereload", "--force_polling"]
