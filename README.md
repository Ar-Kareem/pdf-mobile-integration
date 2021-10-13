Install Docker or Docker Toolbox


# To start local development

Open cmd and cd into the project directory.

Run `docker compose up --build`.

If you run the above command too many times, make sure to run `docker image ls` to see how many images you have.
If you want to prune images then run `docker image prune`

Goto the web browser and access localhost:5000.

If you want to rebuild the build folder for react run:

`docker compose restart frontend`

If you want to restart server due to changes in backend run:

`docker compose restart backend`

# To push to docker-hub
docker compose build
docker compose push

# To run backend from external cmd
docker run -dp 5000:80 arkareem/pdf-mobile-integration-backend