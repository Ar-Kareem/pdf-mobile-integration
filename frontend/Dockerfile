# syntax=docker/dockerfile:1


# Defining environment
ARG APP_ENV=null


# set base for both development and production
FROM node:14 as base
    # Set the working directory to /app
    WORKDIR /app/frontend/
    # copy package.json and package-lock.json for npm install
    COPY ./app/package*.json /app/frontend/
    # recreate package-lock.json from package.json (only needed to run when changing package.json, must enter container and run: npm i --package-lock-only)
    # RUN npm install
    # Install any needed packages specified in package-lock.json
    RUN npm ci


# development mode ends here by just starting npm server
FROM base as dev-final
    RUN echo "CRITICAL: Image is using development server"
    # Set the working directory to /app
    WORKDIR /app/frontend/
    # expose the frontend port to outside the image
    EXPOSE 8080
    # tell frontend server (proxy.conf.js which npm start takes) where to find backend server
    # Update: I have absolutely no idea how frontend proxy conf is contacting backend since that is all managed by traefik now but it somehow works
    ENV FRONTEND_TARGET http://backend:8080
    # start the application
    CMD npm start -- --port 8080 --poll 200 --host 0.0.0.0 --disable-host-check true
    # CMD while :; do echo '.'; sleep 5 ; done


# in production, need to build src by npm build to deploy to ngix
FROM base as prod-build
    # RUN echo "running prod-build..."
    # Set the working directory to /app
    WORKDIR /app/frontend/
    # After installing, Copy src to image
    COPY ./app/ /app/frontend/
    # build the application
    RUN npm run build -- --prod


# take the built production code and deploy
FROM nginx:1.21 as prod-final
    COPY ./nginx.my.conf /etc/nginx/conf.d/default.conf
    ENV NGINX_PORT=8080
    EXPOSE 8080
    COPY --from=prod-build /app/frontend/dist/pdf-mobile-integration /app/frontend/build



# so that buildkit will mark either dev-final or prod-final as required and skip the other part (depending on the env variable)
FROM ${APP_ENV}-final as final