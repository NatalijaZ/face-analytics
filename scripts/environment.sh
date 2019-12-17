read -p "Enter project name: " PROJECT_NAME

sed -i "s/typescript-runtime-template/$PROJECT_NAME/" package.json
sed -i "s/typescript-runtime-template/$PROJECT_NAME/" config/env.example
sed -i "s/typescript-runtime-template/$PROJECT_NAME/" docker-compose.yml
sed -i "s/typescript-runtime-template/$PROJECT_NAME/" README.md

# Copy env file
cp config/.env.example .env

npm i
