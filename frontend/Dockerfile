# syntax=docker/dockerfile:1


# Defining environment
ARG APP_ENV=dev


# set base for both development and production
FROM node:14 as base
    # Set the working directory to /app
    WORKDIR /app/frontend/
    # copy package.json and package-lock.json for npm install
    COPY ./app/package*.json /app/frontend/
    # Install any needed packages specified in package.json
    RUN npm install
    # After installing, Copy src to image
    COPY ./app/ /app/frontend/


# development mode ends here by just starting npm server
FROM base as dev-final
    # Set the working directory to /app
    WORKDIR /app/frontend/
    # Copy image from base
    COPY --from=base /app/frontend/ /app/frontend/
    # expose the frontend port to outside the image
    EXPOSE 4200
    # tell frontend server (proxy.conf.js which npm start takes) where to find backend server
    ENV FRONTEND_TARGET http://backend:8080
    # start the application
    CMD npm start


# in production, need to build src by npm build to deploy to ngix
FROM base as prod-build
    RUN echo "running prod-build..."
    # Set the working directory to /app
    WORKDIR /app/frontend/
    # Copy image from base
    COPY --from=base /app/frontend/ /app/frontend/
    # build the application
    RUN npm run build -- --prod


# take the built production code and deploy
FROM nginx:1.21 as prod-final
    COPY ./nginx.my.conf /etc/nginx/conf.d/default.conf
    ENV NGINX_PORT=4200
    EXPOSE 4200
    COPY --from=prod-build /app/frontend/dist/pdf-mobile-integration /app/frontend/build



# so that buildkit will mark either dev-final or prod-final as required and skip the other part (depending on the env variable)
FROM ${APP_ENV}-final as final