Install Docker or Docker Toolbox


# To start local development

Open cmd and cd into the project directory.

For development run `docker compose -f docker-compose-dev.yml up --build`.

If you run the above command too many times, make sure to run `docker image ls` to see how many images you have.
If you want to prune images then run `docker image prune`

Goto the web browser and access localhost:5000.

In development mode, frontend will restart whenever there is a file change, and backend will restart whenever /backend/uwsgi-watch.ini file is touched.

For production run `docker compose up --build `

# To push to docker-hub
docker compose build
docker compose push

# To run backend from external cmd
docker run -dp 5000:80 arkareem/pdf-mobile-integration-backend