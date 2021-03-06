# Описание gulp-сборки

## 1. Запуск сборки

Папка **src** - исходные файлы.

Папка **docs** - скомпилированная вёрстка.

Запуск сборки:
  1. Выполнить команду **npm i** для установки всех пакетов
  2. Выполнить:
  + **gulp dev** - режим разработки, старт сервера
  + **gulp prod** - пересобрать всё без старта сервера
  + **gulp scripts** - пересобрать JS (с минификацией)
  + **gulp styles** - пересобрать CSS (с минификацией)
  + **gulp img** - пересобрать изображений

## 2. JS
**Скрипты**
  + линтер,
  + глобальное подключение файла в файл,
  + минификация (опционально),
  + конкатенация (опционально).

## 3. HTML
**Используется шаблонизатор PUG:**
  + PUG синтаксис,
  + форматирование табами на выходе.

~~минификация HTML~~ (отключено)

~~collapseWhitespace: true - удаляем все переносы~~ (отключено)

~~removeComments: true - удаляем комментарии~~ (отключено)

## 4. CSS
**Используется препроцессор SCSS**
  + глобальное подключение файла в файл,
  + SASS синтаксис,
  + автопрефиксер,
  + минификация,
  + конкатенация файлов (опционально).

## 5. IMG
**JPG, PNG, SVG**
  + исходные изображения находятся в **[src/img/src/]**,
  + PNG, JPG, SVG - сжимаем,
  + все изображения из **[src/img/content]** конвертируются в **WebP**,
  + обработанные изображения помещаются в **[src/img/dest/]**,
  + все изображения из **[src/img/dest/]** копируются в **[docs/img/]**

**SVG-спрайт**
  + все изображения **[src/img/]** с префиксом **[icon-*.svg]** инлайнятся
  + создается файл (спрайт) - sprite.svg
  + подключается в разметку на странице

### Алгоритм работы сборки

**Последовательно**
  1. очищаем папку docs
  2. сжимаем картинки
  3. создаем webp из других форматов
  4. создаем спрайт из svg иконок
  5. копируем все изображения в docs
  
**Параллельно**

  + операции с css
  + операции с html
  + копирование папки libs в docs
  + копирование папки fonts в docs

### Краткое описание используемых модулей

**Общее**
  + browser-sync - синхронизация изменений,
  + gulp-newer - запуск задач только для изменившихся файлов,
  + del - удалить файлы,
  + gulp-notify - нотификация ошибок,
  + gulp-plumber - предотвращение прерывания потока в случае ошибки,
  + gulp-concat - конкатенация (объединение файлов),
  + gulp-ext-replace - изменить расширение файла (.ext),
  + gulp-rename - переименовать файл.

**JS**
  + gulp-uglify-es - минификация JS,
  + gulp-eslint - JS линтер,
  + gulp-rigger - глобальное включение одного js файла в другой (//= ).

**CSS**
  + gulp-sass - SASS => CSS,
  + gulp-sass-glob - глобальное включение одного sass файла в другой (@import),
  + gulp-autoprefixer - автопрефиксер для CSS,
  + gulp-shorthand - сокращение CSS правил (font: 700 32px/36px "Open Sans"),
  + gulp-clean-css - минификация CSS.

**HTML**
  + gulp-pug - PUG => HTML,
  + gulp-pretty-html - форматирование HTML (табы).

**Изображения**
  + gulp-imagemin - оптимизация изображений (jpeg, png, svg, webp),
  + gulp-svgstore - создание SVG-спрайта.