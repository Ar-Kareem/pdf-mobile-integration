Install Docker or Docker Toolbox




Below are the different actions that can be performed in docker compose, most must clone the git repo first since they need the source code. The only one that doesn't need the source code is the last which can be run in an empty directory.

## To start development from source (must clone)

    docker-compose -f docker-compose-build.yml -f docker-compose-ports.yml -f docker-compose-dev.yml up --build
    
Then Goto the web browser and access localhost:4201


## Start production from source (must clone)

    docker-compose -f docker-compose-build.yml -f docker-compose-ports.yml -f docker-compose-prod.yml up --build

Then Goto the web browser and access localhost:4201

## Build production from source and push image to docker-hub (must clone)

- build images in prod mode: 

        docker-compose -f docker-compose-build.yml -f docker-compose-prod.yml -f docker-compose-images.yml build

- Login: 
        
        docker login

- Push the built images to docker-hub 

        docker-compose -f docker-compose-build.yml -f docker-compose-images.yml push

Then view pushed images:

- https://hub.docker.com/repository/docker/arkareem/pdf-mobile-integration-frontend

- https://hub.docker.com/repository/docker/arkareem/pdf-mobile-integration-backend


## Start production from image (no clone needed)
- Pull the images from the cloud: 
        
        docker-compose -f docker-compose-images.yml pull

- Run the images and open the ports: 

        docker-compose -f docker-compose-ports.yml -f docker-compose-images.yml up

Then Goto the web browser and access localhost:4201


# View and Prune local images

If you run too many build commands, you can run `docker image ls` to see how many images you have.
If you want to prune images then run `docker image prune`


# To run without cloning project (WIP)
`wget https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose.yml && wget https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose-prod.yml`

`docker run -dp 5001:8080 arkareem/pdf-mobile-integration-backend`
