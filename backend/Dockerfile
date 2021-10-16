# syntax=docker/dockerfile:1


# Defining environment
ARG APP_ENV=dev
ARG BUILD_PLATFORM=base


# use https://hub.docker.com/r/tiangolo/uwsgi-nginx-flask/ as a parent image. 
# Documentation: https://github.com/tiangolo/uwsgi-nginx-flask-docker
FROM tiangolo/uwsgi-nginx-flask:python3.8 as base
    RUN echo "Building backend on base image"

# use arm7 version of above to work on raspberry pi, see: https://github.com/tiangolo/uwsgi-nginx-flask-docker/issues/200
FROM guysoft/uwsgi-nginx-flask:python3.8 as base-arm7
    RUN echo "Building backend on arm7 build of image"

# pick whichever platform is specified
FROM ${BUILD_PLATFORM} as final

# Set the working directory to /app
WORKDIR /app

# Copy the python requirements into the container at /app
COPY ./requirements.txt /app/requirements.txt

RUN pip3 install -r requirements.txt

# copy backend source code and uswsgi.ini
COPY . /app/backend

# point to our uswsgi.ini
ENV UWSGI_INI /app/backend/uwsgi.ini
ENV UWSGI_INI /app/backend/uwsgi-watch.ini
ENV LISTEN_PORT 8080
EXPOSE 8080

# set working dir correctly because uwsgi.ini is looking for ./app/main.py
WORKDIR /app/backend
