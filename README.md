# QSoundBase

Telegram Mini App — музыкальный сервис с собственным каталогом.

## Запуск локально
```bash
npm install
npm run dev
```

## Сборка
```bash
npm run build
```

## Cloudflare Pages
- Build command: `npm run build`
- Build output directory: `dist`

## Сейчас
Первый UI/MVP: адаптивный интерфейс, поиск по демо-каталогу, переключение страниц, избранное и UI-плеер. Треки пока демонстрационные без аудио URL.

## Следующие этапы
1. Подключить Telegram Mini App SDK и проверку initData на сервере.
2. Cloudflare R2 для аудиофайлов и обложек.
3. Cloudflare Worker API для каталога и админ-загрузки.
4. Firebase/Firestore для плейлистов, истории и лайков.
5. Реальные права доступа администратора и загрузка музыки с разрешением на распространение.
