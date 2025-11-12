# Laravel + Angular Starter

## Requirements
- PHP 8.2+, Composer
- Node 20.19+, Angular CLI
- MySQL/Postgres (local or Docker)

## Run (dev)
### Backend
cd server
cp .env.example .env
php artisan key:generate
# set DB_... then:
php artisan migrate:fresh --seed
php artisan serve --host=127.0.0.1 --port=8000

### Frontend
cd client
npm i
ng serve --proxy-config proxy.conf.json
