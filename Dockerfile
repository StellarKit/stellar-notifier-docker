FROM node:stretch

RUN  git clone --depth 1 https://github.com/StellarKit/stellar-notifier.git
RUN cd stellar-notifier && npm i

WORKDIR /stellar-notifier

CMD ["npm", "run", "start"]
