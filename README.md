Install Docker or Docker Toolbox




Below are the different actions that can be performed in docker compose, the ones labeled with (must clone) mean that you must clone the git repo first before running the commands since they rely on the source code being available. The only one that doesn't need the source code is the last action which can be run in an empty directory and should setup everything for you.

## To start development from source (must clone)

If you intend to implement any changes to the source code then you should start the container in development mode using the below command.

    docker-compose -f docker-compose-traefik.yml -f docker-compose-env.yml -f docker-compose-build-dev.yml up --build

Then Goto the web browser and access `localhost`

In development mode, any changes to the frontend code will automatically be detected and updated (because in development mode, the src is mounted to the container as a volume and the frontend server is running with npm which is polling file changes several times a second). The backend also has it's src mounted as a volume and is running the server using uwsgi-nginx and it will hot reload the backend if the file uwsgi-watch.ini is touched.

## Start production from source (must clone)

This is only needed if you want to make sure that the production build is running as intended.

    docker-compose -f docker-compose-traefik.yml -f docker-compose-env.yml -f docker-compose-build-prod.yml up --build

Then Goto the web browser and access `localhost`

In production mode, no changes to the source code will be reflected since no volumes are mounted. Additionally, neither the frontend nor the backend is watching for changes <sup>[1]</sup>. The frontend is also no longer running on the npm server, instead it is built in production mode and served in nginx as it is production level unlike the npm server.

[1] Currently the backend is still watching for uwsgi-watch.ini to be changed but that is to be fixed.

## Build production from source and push image to docker-hub (must clone)

This is to be used to build and push any changes to docker-hub. Production servers are watching for changes to images in docker-hub with certain tags and will be automatically updated using [Watchtower](https://github.com/containrrr/watchtower/).

- Login: 
        
      docker login

- build images in prod mode: 

      docker-compose -f docker-compose-build-prod.yml -f docker-compose-images.yml build

- Push the built images to docker-hub 

      docker-compose -f docker-compose-build-prod.yml -f docker-compose-images.yml push

- Or, all the above at once:

      docker login && docker-compose -f docker-compose-build-prod.yml -f docker-compose-images.yml build && docker-compose -f docker-compose-build-prod.yml -f docker-compose-images.yml push

Then view pushed images:

- https://hub.docker.com/repository/docker/arkareem/pdf-mobile-integration-frontend

- https://hub.docker.com/repository/docker/arkareem/pdf-mobile-integration-backend


## Start production from image (no clone needed)

These steps are used to run the web application on any machine with the prerequisite of the machine having `docker/docker-compose` ([get docker](https://docs.docker.com/get-docker/) / [get docker compose](https://docs.docker.com/compose/install/)) and the user has access to run docker commands.

- Get the sample secrets files then follow the instructions inside to setup any required secret environment variables

      curl -o .backend.env https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/.backend.env-sample
      curl -o .env https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/.env-sample

- Get the latest docker compose yml files
        
      curl -o docker-compose-images.yml https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose-images.yml
      curl -o docker-compose-traefik.yml https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose-traefik.yml
      curl -o docker-compose-env.yml https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose-env.yml
      curl -o docker-compose-watchtower.yml https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose-watchtower.yml

- Pull the images from the cloud: 
        
      docker-compose -f docker-compose-images.yml pull

- Finally, Start Traefik, run the images, and continuously watch for changes:

      docker-compose -f docker-compose-traefik.yml -f docker-compose-env.yml -f docker-compose-images.yml -f docker-compose-watchtower.yml up

- Or with a single command that will also take care of all the above (except the .env part which is the first command)

      curl -o docker-compose-images.yml https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose-images.yml && curl -o docker-compose-traefik.yml https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose-traefik.yml && curl -o docker-compose-env.yml https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose-env.yml && curl -o docker-compose-watchtower.yml https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose-watchtower.yml && sudo docker-compose -f docker-compose-images.yml pull && sudo docker-compose -f docker-compose-traefik.yml -f docker-compose-env.yml -f docker-compose-images.yml -f docker-compose-watchtower.yml up

the above command can be run in a new directory (with just the .env files) in either linux or windows<sup>[1]</sup> and will take care of all needed components to start the production server<sup>[2]</sup>

[1] Only works in CMD for windows not Powershell, because powershell does not support `&&`. If using Powershell, then simply run each command one at a time which will also work.

[2] all needed components except for needing docker installed of course

To see the webapp in action, go to the web browser and access {SERVER_URL}


# View and Prune local images

If you run too many build commands, you can run `docker image ls` to see how many images you have.
If you want to prune images then run `docker image prune`


# Bulding, Pushing, and Running images for Raspberrypi (linux/arm/v7)

The below commands are only concerning building/pushing/running the application for/on a raspberry pi arm7 32bit machine.

## To BUILD and PUSH:

      docker buildx bake -f docker-compose-build-prod-arm7.yml -f docker-compose-images-arm7.yml --set *.platform=linux/arm/v7 --set backend.tags=arkareem/pdf-mobile-integration-backend:arm7 --set frontend.tags=arkareem/pdf-mobile-integration-frontend:arm7 --push

## To PUSH:

      docker-compose -f docker-compose-images-arm7.yml push

## To RUN:

Make sure to have the `.env` files:

      curl -o .backend.env https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/.backend.env-sample
      curl -o .env https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/.env-sample

If you have then localy then scp the file:

      scp ./.backend.env pi@raspberrypi:~/docker-pdf-app/
      scp ./.env pi@raspberrypi:~/docker-pdf-app/

Pull and run:

      curl -o docker-compose-images-arm7.yml https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose-images-arm7.yml && curl -o docker-compose-traefik.yml https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose-traefik.yml && curl -o docker-compose-env.yml https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose-env.yml && curl -o docker-compose-watchtower.yml https://raw.githubusercontent.com/Ar-Kareem/pdf-mobile-integration/master/docker-compose-watchtower.yml && sudo docker-compose -f docker-compose-images-arm7.yml pull && sudo docker-compose -f docker-compose-traefik.yml -f docker-compose-env.yml -f docker-compose-images-arm7.yml -f docker-compose-watchtower.yml up