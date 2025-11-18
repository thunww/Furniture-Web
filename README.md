"# Furniture-Web"
npx sequelize-cli db:drop
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
docker-compose down
docker-compose up -d --build
