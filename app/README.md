# NFT Gallery — On-chain галерея NFT

Веб-приложение для просмотра реальных NFT-коллекций на Ethereum. Все данные (имена, изображения, свойства, владельцы, история трансферов) загружаются напрямую из блокчейна через Web3.js — никаких моков и фейковых данных.

## Список технологий

| Технология | Версия | Назначение |
|---|---|---|
| **React** | 19.x | UI-библиотека, компонентная архитектура |
| **TypeScript** | 5.7 | Статическая типизация |
| **Vite** | 6.x | Сборщик и dev-сервер |
| **Tailwind CSS** | 3.4 | Utility-first CSS фреймворк |
| **Web3.js** | 4.x | Чтение данных из смарт-контрактов Ethereum |
| **React Router** | 7.x | Клиентская маршрутизация (SPA) |
| **Vitest** | 4.x | Фреймворк для тестирования |
| **Testing Library** | 16.x | Тестирование React-компонентов |
| **GitHub Actions** | — | CI/CD пайплайн |

## Памятка по запуску

### Требования
- Node.js >= 18
- npm >= 9
- Расширение MetaMask в браузере (опционально — приложение работает и без него через публичный RPC)

### Установка и запуск

```bash
cd app
npm install
npm run dev
```

Приложение будет доступно по адресу: **http://localhost:3000**

### Тесты

```bash
npm test            # запуск всех тестов
npm run test:watch  # запуск в watch-режиме
```

### Сборка

```bash
npm run build
npm run preview
```

## Основные возможности

- **On-chain NFT данные** — метаданные (имя, описание, изображение, свойства) читаются из `tokenURI()` смарт-контрактов, включая резолв IPFS (`ipfs://`) и Arweave (`ar://`) ссылок
- **Динамический каталог контрактов** — пользователь может добавлять любые ERC-721 контракты по адресу; валидация через вызов `name()` на контракте
- **Infinite scroll** — автоподгрузка NFT при скролле через IntersectionObserver; количество токенов определяется из `totalSupply()`
- **Реальная история трансферов** — события `Transfer` из блокчейна с ссылками на Etherscan
- **Подключение кошелька** — интеграция MetaMask через Web3.js; fallback на публичный RPC для просмотра без кошелька
- **Страница адреса** — реальный баланс ETH и количество транзакций для любого Ethereum-адреса
- **Галерея с фильтрами** — поиск, фильтрация по коллекции, сортировка по имени/tokenId
- **Избранное** — сохранение понравившихся NFT (localStorage)
- **Тёмная/светлая тема** — переключение с сохранением
- **Адаптивный дизайн** — mobile-first, glassmorphism, анимации
- **Ленивая загрузка** — code splitting страниц через React.lazy + Suspense
- **Кэширование** — метаданные NFT кэшируются в localStorage + memory (TTL 1 час)
- **Тестирование** — 62 теста: unit (утилиты), хуки, компоненты
- **CI/CD** — GitHub Actions: lint → test → build на каждый push/PR

## Скриншот стартовой страницы

> *Вставьте скриншот после запуска приложения*
>
> Для создания скриншота: откройте http://localhost:3000 и сделайте скриншот главной страницы (Gallery).

## Структура проекта

```
src/
├── main.tsx             # Точка входа
├── App.tsx              # Корневой компонент (провайдеры)
├── router.tsx           # Маршрутизация
├── index.css            # Глобальные стили + Tailwind
├── types/               # TypeScript типы (NFT, Trait, TransferEvent...)
├── config/              # ContractStore — динамический каталог контрактов (localStorage)
├── services/
│   ├── web3.ts          # Web3Service — RPC, контракты, события, fallback
│   └── nftService.ts    # NftService — tokenURI, IPFS-резолв, кэширование
├── utils/               # Утилиты (форматирование, градиенты)
├── context/             # React Context (Theme, Wallet, Toast)
├── hooks/               # Кастомные хуки
│   ├── useContracts.ts      # Подписка на каталог контрактов (useSyncExternalStore)
│   ├── useContractInfo.ts   # name()/symbol()/totalSupply() из блокчейна
│   ├── useAllNfts.ts        # Загрузка NFT со всех коллекций
│   ├── useCollectionNfts.ts # Загрузка NFT одной коллекции + infinite scroll
│   ├── useNftDetail.ts      # Загрузка одного NFT
│   ├── useTransferHistory.ts# История Transfer-событий
│   ├── useFavorites.ts      # Избранное (localStorage)
│   └── ...
├── components/          # UI-компоненты
├── pages/               # Страницы приложения
└── test/                # Тестовые утилиты и setup
```

## Тестирование

Проект использует **Vitest** + **React Testing Library**. Тесты покрывают три уровня:

| Уровень | Файлы | Количество |
|---|---|---|
| Unit (утилиты) | `format.test.ts`, `gradient.test.ts` | 22 |
| Хуки | `useFavorites.test.ts`, `useGalleryFilters.test.ts` | 17 |
| Компоненты | `NFTCard`, `SearchBar`, `ThemeToggle`, `NFTGrid`, `TraitBadge`, `StatsCard` | 23 |
| **Итого** | **10 файлов** | **62 теста** |

## CI/CD

GitHub Actions запускает три задачи на каждый push и pull request:

1. **Lint** — проверка кода через ESLint
2. **Test** — запуск всех 62 тестов через Vitest
3. **Build** — сборка production-бандла (зависит от lint и test)
