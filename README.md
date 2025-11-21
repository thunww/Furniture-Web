"# Furniture-Web"
npx sequelize-cli db:drop
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

docker-compose down -v
docker image prune -a -f
docker-compose build
docker-compose up -d
docker ps

sudo systemctl stop nginx
sudo systemctl disable nginx
sudo systemctl status nginx
