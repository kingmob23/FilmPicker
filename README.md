# FilmPicker

## Описание

FilmPicker — это веб-приложение, предназначенное для помощи группам пользователей в выборе фильма для совместного просмотра, основываясь на их индивидуальных предпочтениях.

## Запуск
poetry run uvicorn backend.main:app --reload
(from next-app) npm run dev

---

## (Пере)запуск на сервере
systemctl stop myapp.service
pm2 stop my-next-app

pm2 status
pm2 logs my-next-app

systemctl status myapp
journalctl -u myapp.service -f

cat /etc/nginx/sites-available/default
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log

cd /var/www/FilmPicker/frontend/next-app
pm2 start npm --name "my-next-app" -- start


## Колаборация
приветсвуется =)

## Лицензия
*for_punks_only*

