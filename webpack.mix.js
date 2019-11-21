const mix = require('laravel-mix');

mix.js('resources/js/app.js', 'public/js')
   .js('resources/js/admin/app_admin.js', 'public/js')
    .disableNotifications()
    .browserSync('dev.photography');

