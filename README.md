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
- Get the latest docker compose yml files
        
        curl -o docker-compose-images.yml https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose-images.yml
        curl -o docker-compose-ports.yml https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose-ports.yml
        curl -o docker-compose-watchtower.yml https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose-watchtower.yml

- Pull the images from the cloud: 
        
        docker-compose -f docker-compose-images.yml pull

- Finally, Run the images and open the ports (without watching for changes): 

        docker-compose -f docker-compose-ports.yml -f docker-compose-images.yml up

- Or, Run the images and open the ports while watching for changes:

        docker-compose -f docker-compose-ports.yml -f docker-compose-images.yml -f docker-compose-watchtower.yml up

Or with a single command that will also take care of downloading the needed `.yml` files 

        curl -o docker-compose-images.yml https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose-images.yml && curl -o docker-compose-ports.yml https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose-ports.yml && curl -o docker-compose-watchtower.yml https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose-watchtower.yml && docker-compose -f docker-compose-images.yml pull && docker-compose -f docker-compose-ports.yml -f docker-compose-images.yml -f docker-compose-watchtower.yml up

(the above command can be run in an empty directory and will take care of all needed components to start the production server [except for needing docker installed of course])

Afterwards Goto the web browser and access {SERVER_URL}:4201


# View and Prune local images

If you run too many build commands, you can run `docker image ls` to see how many images you have.
If you want to prune images then run `docker image prune`

