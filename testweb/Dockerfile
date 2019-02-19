### STAGE 1: Build ###

FROM node as vue-built

COPY . .
RUN npm i

RUN npm run build

### STAGE 2: Setup ###

FROM debian

RUN apt update \
   && apt install -y apache2

## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=vue-built /dist /var/www/html

## copy favicons
# COPY --from=vue-built /ng-app/favicon/* /usr/share/nginx/html/

CMD ["apachectl", "-D", "FOREGROUND"]
