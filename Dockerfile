FROM kuzzleio/base
MAINTAINER Kuzzle <support@kuzzle.io>

WORKDIR /var/app

RUN apt-get update && apt-get install -y \
      build-essential \
      git \
      g++ \
      rbenv \
      python \
    && npm install -g \
      kuzzle-backoffice \
    && apt-get clean \
    && apt-get remove -y \
      build-essential \
      g++ \
      rbenv \
      python \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

CMD ["kuzzle-backoffice start"]
