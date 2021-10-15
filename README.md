Install Docker or Docker Toolbox


# To start local development

Clone this project.

Open cmd and cd into the project directory.

For development run `docker compose -f docker-compose.yml -f docker-compose-dev.yml up --build`.

If you run the above command too many times, make sure to run `docker image ls` to see how many images you have.
If you want to prune images then run `docker image prune`

Goto the web browser and access localhost:4201

In development mode, frontend will restart whenever there is a file change, and backend will restart whenever /backend/uwsgi-watch.ini file is touched.

For production run `docker compose -f docker-compose.yml -f docker-compose-dev.yml up --build`
Which will disable watching for backend changes and switch frontend from the npm development server to nginx production server which will also no longer watch for changes.

# To push to docker-hub
docker compose -f docker-compose.yml -f docker-compose-prod.yml build
docker compose -f docker-compose.yml -f docker-compose-prod.yml push

# To run backend from external cmd
docker run -dp 5001:8080 arkareem/pdf-mobile-integration-backend