# syntax=docker/dockerfile:1

# use https://hub.docker.com/r/tiangolo/uwsgi-nginx-flask/ as a parent image
FROM tiangolo/uwsgi-nginx-flask:python3.8

# Set the working directory to /app
WORKDIR /app

# Copy the python requirements into the container at /app
COPY ./requirements.txt /app/requirements.txt

RUN pip3 install -r requirements.txt

# Copy source code to image
# COPY ./src /app/src
