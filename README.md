Install Docker or Docker Toolbox




Below are the different actions that can be performed in docker compose, the ones labeled with (must clone) mean that you must clone the git repo first before running the commands since they rely on the source code being available. The only one that doesn't need the source code is the last action which can be run in an empty directory and should setup everything for you.

## To start development from source (must clone)

    docker-compose -f docker-compose-build.yml -f docker-compose-ports.yml -f docker-compose-env.yml -f docker-compose-dev.yml up --build
    
Then Goto the web browser and access localhost:4201


## Start production from source (must clone)

    docker-compose -f docker-compose-build.yml -f docker-compose-ports.yml -f docker-compose-env.yml -f docker-compose-prod.yml up --build

Then Goto the web browser and access localhost:4201

## Build production from source and push image to docker-hub (must clone)

- Login: 
        
      docker login

- build images in prod mode: 

      docker-compose -f docker-compose-build.yml -f docker-compose-prod.yml -f docker-compose-images.yml build

- Push the built images to docker-hub 

      docker-compose -f docker-compose-build.yml -f docker-compose-images.yml push

- Or, all the above at once:

      docker login && docker-compose -f docker-compose-build.yml -f docker-compose-prod.yml -f docker-compose-images.yml build && docker-compose -f docker-compose-build.yml -f docker-compose-images.yml push

Then view pushed images:

- https://hub.docker.com/repository/docker/arkareem/pdf-mobile-integration-frontend

- https://hub.docker.com/repository/docker/arkareem/pdf-mobile-integration-backend


## Start production from image (no clone needed)
- Get the sample secrets file then follow the instructions inside to setup any required secret environment variables

      curl -o .backend.env https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/.backend.env-sample

- Get the latest docker compose yml files
        
      curl -o docker-compose-images.yml https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose-images.yml
      curl -o docker-compose-ports.yml https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose-ports.yml
      curl -o docker-compose-env.yml https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose-env.yml
      curl -o docker-compose-watchtower.yml https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose-watchtower.yml

- Pull the images from the cloud: 
        
      docker-compose -f docker-compose-images.yml pull

- Finally, Open the ports, run the images, and continuously watch for changes:

      docker-compose -f docker-compose-ports.yml -f docker-compose-env.yml -f docker-compose-images.yml -f docker-compose-watchtower.yml up

- Or with a single command that will also take care of all the above (except the .env part which is the first command)

      curl -o docker-compose-images.yml https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose-images.yml && curl -o docker-compose-ports.yml https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose-ports.yml && curl -o docker-compose-env.yml https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose-env.yml && curl -o docker-compose-watchtower.yml https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose-watchtower.yml && sudo docker-compose -f docker-compose-images.yml pull && sudo docker-compose -f docker-compose-ports.yml -f docker-compose-env.yml -f docker-compose-images.yml -f docker-compose-watchtower.yml up

the above command can be run in a new directory (with just the .env file) in either linux or windows<sup>[1]</sup> and will take care of all needed components to start the production server<sup>[2]</sup>

[1] Only works in CMD for windows not Powershell, because powershell does not support `&&`

[2] all needed components except for needing docker installed of course

To see the webapp in action, go to the web browser and access {SERVER_URL}:4201


# View and Prune local images

If you run too many build commands, you can run `docker image ls` to see how many images you have.
If you want to prune images then run `docker image prune`


# Bulding, Pushing, and Running images for Raspberrypi (linux/arm/v7)

## To BUILD and PUSH:

      docker buildx bake -f docker-compose-build.yml -f docker-compose-build-arm7.yml -f docker-compose-images-arm7.yml --set *.platform=linux/arm/v7 --set backend.tags=arkareem/pdf-mobile-integration-backend:arm7 --set frontend.tags=arkareem/pdf-mobile-integration-frontend:arm7 --push

## To PUSH:

      docker-compose -f docker-compose-build.yml -f docker-compose-images-arm7.yml push

## To RUN:

Make sure to have the `.env` file:

      curl -o .backend.env https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/.backend.env-sample

If you have it localy then scp the file:

      scp ./.backend.env pi@raspberrypi:~/docker-pdf-app/

Pull and run:

      curl -o docker-compose-images-arm7.yml https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose-images-arm7.yml && curl -o docker-compose-ports.yml https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose-ports.yml && curl -o docker-compose-env.yml https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose-env.yml && curl -o docker-compose-watchtower.yml https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose-watchtower.yml && sudo docker-compose -f docker-compose-images-arm7.yml pull && sudo docker-compose -f docker-compose-ports.yml -f docker-compose-env.yml -f docker-compose-images-arm7.yml -f docker-compose-watchtower.yml up