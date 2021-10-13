# syntax=docker/dockerfile:1

# Use an official Python runtime as a parent image
FROM node:14

# Set the working directory to /app
WORKDIR /app/frontend/

# Copy src to image
COPY ./app/ /app/frontend/

# Install any needed packages specified in requirements.txt
RUN npm install


# expose the frontend port to outside the image
EXPOSE 4200

# tell frontend server (proxy.conf.js) where to find backend server
ENV FRONTEND_TARGET http://localhost:80

# start the application
CMD npm start