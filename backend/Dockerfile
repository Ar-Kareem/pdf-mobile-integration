# syntax=docker/dockerfile:1

# use https://hub.docker.com/r/tiangolo/uwsgi-nginx-flask/ as a parent image. 
# Documentation: https://github.com/tiangolo/uwsgi-nginx-flask-docker
FROM tiangolo/uwsgi-nginx-flask:python3.8

# Set the working directory to /app
WORKDIR /app

# Copy the python requirements into the container at /app
COPY ./requirements.txt /app/requirements.txt

RUN pip3 install -r requirements.txt

# copy backend source code and uswsgi.ini
COPY . /app/backend

# point to our uswsgi.ini
ENV UWSGI_INI /app/backend/uwsgi.ini
ENV LISTEN_PORT 80
EXPOSE 80

# set working dir correctly because uwsgi.ini is looking for ./app/main.py
WORKDIR /app/backend
