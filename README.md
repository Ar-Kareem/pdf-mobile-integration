Install Docker or Docker Toolbox




Below are the different actions that can be performed in docker compose, most must clone the git repo first since they need the source code. The only one that doesn't need the source code is the last which can be run in an empty directory.

1- To start development from source (must clone)
`docker-compose -f docker-compose-build.yml -f docker-compose-ports.yml -f docker-compose-dev.yml up --build`

2- Start production from source (must clone)
`docker-compose -f docker-compose-build.yml -f docker-compose-ports.yml -f docker-compose-prod.yml up --build`

3- Build production from source and push image to docker-hub (must clone)
    - build images in prod: `docker-compose -f docker-compose-build.yml -f docker-compose-prod.yml -f docker-compose-images.yml build`
    - Login first: `docker login`
    - Push the images to docker-hub: `docker-compose -f docker-compose-build.yml -f docker-compose-images.yml push`

5- Start production from image (no clone needed)
    - Pull the images from the cloud: `docker-compose -f docker-compose-images.yml pull`
    - Run the images and open the ports: `docker-compose -f docker-compose-ports.yml -f docker-compose-images.yml up`



# To start local development

Clone this project.

Open cmd and cd into the project directory.

For development run `docker-compose -f docker-compose.yml -f docker-compose-dev.yml up --build`.

If you run the above command too many times, make sure to run `docker image ls` to see how many images you have.
If you want to prune images then run `docker image prune`

Goto the web browser and access localhost:4201

In development mode, frontend will restart whenever there is a file change, and backend will restart whenever /backend/uwsgi-watch.ini file is touched.

For production run `docker-compose -f docker-compose.yml -f docker-compose-dev.yml up --build`
Which will disable watching for backend changes and switch frontend from the npm development server to nginx production server which will also no longer watch for changes.

# To push to docker-hub
`docker-compose -f docker-compose.yml -f docker-compose-prod.yml build`
`docker-compose -f docker-compose.yml -f docker-compose-prod.yml push`

# To run without cloning project
`wget https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose.yml && wget https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose-prod.yml`
`docker-compose -f docker-compose.yml -f docker-compose-prod.yml pull`
`docker-compose -f docker-compose.yml -f docker-compose-prod.yml up`

docker run -dp 5001:8080 arkareem/pdf-mobile-integration-backend