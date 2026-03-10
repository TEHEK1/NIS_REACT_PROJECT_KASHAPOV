import type { NFT, Creator } from '@/types';

const creators: Creator[] = [
  { address: '0x1a2B3c4D5e6F7890AbCdEf1234567890aBcDeF12', name: 'ArtVoyager', avatar: 'https://picsum.photos/seed/creator1/100/100', verified: true },
  { address: '0x2B3c4D5e6F7890AbCdEf1234567890aBcDeF1234', name: 'PixelMaster', avatar: 'https://picsum.photos/seed/creator2/100/100', verified: true },
  { address: '0x3c4D5e6F7890AbCdEf1234567890aBcDeF123456', name: 'NeonArtist', avatar: 'https://picsum.photos/seed/creator3/100/100', verified: false },
  { address: '0x4D5e6F7890AbCdEf1234567890aBcDeF12345678', name: 'CryptoCanvas', avatar: 'https://picsum.photos/seed/creator4/100/100', verified: true },
  { address: '0x5e6F7890AbCdEf1234567890aBcDeF1234567890', name: 'MetaBuilder', avatar: 'https://picsum.photos/seed/creator5/100/100', verified: true },
  { address: '0x6F7890AbCdEf1234567890aBcDeF12345678901a', name: 'DreamWeaver', avatar: 'https://picsum.photos/seed/creator6/100/100', verified: false },
];

const futureDate = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

const pastDate = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
};

export const nfts: NFT[] = [
  {
    id: 'ca-001', tokenId: 1, name: 'Cosmic Ape #1337', description: 'Легендарная космическая обезьяна с золотой шерстью и лазерными глазами. Один из самых редких представителей коллекции.',
    image: 'https://picsum.photos/seed/ca001/600/600', price: 12.5, currency: 'ETH', collectionId: 'cosmic-apes',
    creator: creators[0]!, ownerAddress: '0xABc123...def456', traits: [
      { traitType: 'Фон', value: 'Космос', rarity: 5 }, { traitType: 'Шерсть', value: 'Золотая', rarity: 2 },
      { traitType: 'Глаза', value: 'Лазерные', rarity: 1 }, { traitType: 'Одежда', value: 'Скафандр', rarity: 8 },
    ],
    createdAt: pastDate(45), likes: 342, isAuction: true, auctionEndsAt: futureDate(2),
  },
  {
    id: 'ca-002', tokenId: 42, name: 'Cosmic Ape #42', description: 'Зелёная обезьяна-философ из созвездия Андромеды. Всегда в раздумьях о смысле блокчейна.',
    image: 'https://picsum.photos/seed/ca002/600/600', price: 3.8, currency: 'ETH', collectionId: 'cosmic-apes',
    creator: creators[0]!, ownerAddress: '0xDEf789...abc123', traits: [
      { traitType: 'Фон', value: 'Туманность', rarity: 12 }, { traitType: 'Шерсть', value: 'Зелёная', rarity: 15 },
      { traitType: 'Глаза', value: 'Мудрые', rarity: 8 }, { traitType: 'Аксессуар', value: 'Монокль', rarity: 3 },
    ],
    createdAt: pastDate(30), likes: 189, isAuction: false,
  },
  {
    id: 'ca-003', tokenId: 777, name: 'Cosmic Ape #777', description: 'Счастливая обезьяна номер 777. Говорят, она приносит удачу своему владельцу в DeFi.',
    image: 'https://picsum.photos/seed/ca003/600/600', price: 7.2, currency: 'ETH', collectionId: 'cosmic-apes',
    creator: creators[3]!, ownerAddress: '0x123abc...789def', traits: [
      { traitType: 'Фон', value: 'Радуга', rarity: 3 }, { traitType: 'Шерсть', value: 'Радужная', rarity: 1 },
      { traitType: 'Глаза', value: 'Звёздные', rarity: 4 }, { traitType: 'Головной убор', value: 'Корона', rarity: 2 },
    ],
    createdAt: pastDate(15), likes: 567, isAuction: true, auctionEndsAt: futureDate(5),
  },
  {
    id: 'ca-004', tokenId: 2048, name: 'Cosmic Ape #2048', description: 'Кибернетическая обезьяна с имплантами будущего. Полностью подключена к метавселенной.',
    image: 'https://picsum.photos/seed/ca004/600/600', price: 5.1, currency: 'ETH', collectionId: 'cosmic-apes',
    creator: creators[0]!, ownerAddress: '0x456def...123abc', traits: [
      { traitType: 'Фон', value: 'Матрица', rarity: 7 }, { traitType: 'Шерсть', value: 'Хромовая', rarity: 4 },
      { traitType: 'Глаза', value: 'Кибернетические', rarity: 6 }, { traitType: 'Тело', value: 'Киборг', rarity: 3 },
    ],
    createdAt: pastDate(10), likes: 234, isAuction: false,
  },

  {
    id: 'pd-001', tokenId: 1, name: 'Pixel Sunset Valley', description: 'Закат в пиксельной долине — тёплые тона уходящего солнца освещают горы вдали. Ручная работа.',
    image: 'https://picsum.photos/seed/pd001/600/600', price: 1.2, currency: 'ETH', collectionId: 'pixel-dreams',
    creator: creators[1]!, ownerAddress: '0x789ghi...456jkl', traits: [
      { traitType: 'Время суток', value: 'Закат', rarity: 15 }, { traitType: 'Биом', value: 'Горы', rarity: 20 },
      { traitType: 'Погода', value: 'Ясно', rarity: 30 }, { traitType: 'Разрешение', value: '64x64', rarity: 25 },
    ],
    createdAt: pastDate(60), likes: 421, isAuction: false,
  },
  {
    id: 'pd-002', tokenId: 15, name: 'Neon City Nightscape', description: 'Ночной неоновый город — яркие огни рекламы отражаются в мокром асфальте киберпанк-мегаполиса.',
    image: 'https://picsum.photos/seed/pd002/600/600', price: 2.8, currency: 'ETH', collectionId: 'pixel-dreams',
    creator: creators[1]!, ownerAddress: '0xabc123...def789', traits: [
      { traitType: 'Время суток', value: 'Ночь', rarity: 10 }, { traitType: 'Биом', value: 'Город', rarity: 15 },
      { traitType: 'Стиль', value: 'Киберпанк', rarity: 8 }, { traitType: 'Разрешение', value: '128x128', rarity: 10 },
    ],
    createdAt: pastDate(25), likes: 312, isAuction: true, auctionEndsAt: futureDate(1),
  },
  {
    id: 'pd-003', tokenId: 33, name: 'Crystal Cavern', description: 'Пиксельная кристальная пещера, переливающаяся всеми цветами радуги. Внутри скрыты сокровища.',
    image: 'https://picsum.photos/seed/pd003/600/600', price: 0.95, currency: 'ETH', collectionId: 'pixel-dreams',
    creator: creators[5]!, ownerAddress: '0xdef456...ghi789', traits: [
      { traitType: 'Время суток', value: 'Вечность', rarity: 3 }, { traitType: 'Биом', value: 'Пещера', rarity: 12 },
      { traitType: 'Элемент', value: 'Кристалл', rarity: 7 }, { traitType: 'Разрешение', value: '64x64', rarity: 25 },
    ],
    createdAt: pastDate(40), likes: 198, isAuction: false,
  },
  {
    id: 'pd-004', tokenId: 50, name: 'Floating Islands', description: 'Парящие острова в облаках — мир фантазий, где гравитация подчиняется воображению.',
    image: 'https://picsum.photos/seed/pd004/600/600', price: 1.8, currency: 'ETH', collectionId: 'pixel-dreams',
    creator: creators[1]!, ownerAddress: '0xghi789...jkl012', traits: [
      { traitType: 'Время суток', value: 'День', rarity: 35 }, { traitType: 'Биом', value: 'Небо', rarity: 8 },
      { traitType: 'Элемент', value: 'Воздух', rarity: 18 }, { traitType: 'Разрешение', value: '128x128', rarity: 10 },
    ],
    createdAt: pastDate(8), likes: 276, isAuction: false,
  },

  {
    id: 'ad-001', tokenId: 1, name: 'Fractal Genesis #1', description: 'Первый токен коллекции — генеративная визуализация на основе множества Мандельброта с уникальной цветовой палитрой.',
    image: 'https://picsum.photos/seed/ad001/600/600', price: 4.2, currency: 'ETH', collectionId: 'abstract-dimensions',
    creator: creators[3]!, ownerAddress: '0xjkl012...mno345', traits: [
      { traitType: 'Алгоритм', value: 'Мандельброт', rarity: 15 }, { traitType: 'Палитра', value: 'Огненная', rarity: 12 },
      { traitType: 'Итерации', value: '10000', rarity: 5 }, { traitType: 'Сложность', value: 'Высокая', rarity: 10 },
    ],
    createdAt: pastDate(90), likes: 892, isAuction: false,
  },
  {
    id: 'ad-002', tokenId: 7, name: 'Chaos Theory #7', description: 'Визуализация аттрактора Лоренца — красота хаоса, застывшая в цифровом искусстве.',
    image: 'https://picsum.photos/seed/ad002/600/600', price: 2.1, currency: 'ETH', collectionId: 'abstract-dimensions',
    creator: creators[3]!, ownerAddress: '0xmno345...pqr678', traits: [
      { traitType: 'Алгоритм', value: 'Аттрактор Лоренца', rarity: 8 }, { traitType: 'Палитра', value: 'Ледяная', rarity: 18 },
      { traitType: 'Итерации', value: '50000', rarity: 2 }, { traitType: 'Сложность', value: 'Экстремальная', rarity: 3 },
    ],
    createdAt: pastDate(55), likes: 456, isAuction: true, auctionEndsAt: futureDate(3),
  },
  {
    id: 'ad-003', tokenId: 19, name: 'Neural Bloom #19', description: 'Цветение нейронной сети — генеративное искусство, созданное на основе визуализации процесса обучения ИИ.',
    image: 'https://picsum.photos/seed/ad003/600/600', price: 1.5, currency: 'ETH', collectionId: 'abstract-dimensions',
    creator: creators[2]!, ownerAddress: '0xpqr678...stu901', traits: [
      { traitType: 'Алгоритм', value: 'Нейросеть', rarity: 10 }, { traitType: 'Палитра', value: 'Неоновая', rarity: 14 },
      { traitType: 'Эпохи', value: '1000', rarity: 20 }, { traitType: 'Сложность', value: 'Средняя', rarity: 30 },
    ],
    createdAt: pastDate(20), likes: 334, isAuction: false,
  },
  {
    id: 'ad-004', tokenId: 42, name: 'Quantum Weave #42', description: 'Квантовое плетение — паттерны, вдохновлённые квантовой механикой и суперпозицией состояний.',
    image: 'https://picsum.photos/seed/ad004/600/600', price: 3.3, currency: 'ETH', collectionId: 'abstract-dimensions',
    creator: creators[3]!, ownerAddress: '0xstu901...vwx234', traits: [
      { traitType: 'Алгоритм', value: 'Квантовый', rarity: 3 }, { traitType: 'Палитра', value: 'Ультрафиолет', rarity: 6 },
      { traitType: 'Итерации', value: '100000', rarity: 1 }, { traitType: 'Сложность', value: 'Легендарная', rarity: 1 },
    ],
    createdAt: pastDate(5), likes: 723, isAuction: false,
  },

  {
    id: 'mr-001', tokenId: 1, name: 'Central Plaza', description: 'Центральная площадь Meta Realms — самая оживлённая локация метавселенной, окружённая торговыми центрами.',
    image: 'https://picsum.photos/seed/mr001/600/600', price: 25.0, currency: 'ETH', collectionId: 'meta-realms',
    creator: creators[4]!, ownerAddress: '0xvwx234...yz567', traits: [
      { traitType: 'Район', value: 'Центр', rarity: 2 }, { traitType: 'Размер', value: 'Большой', rarity: 10 },
      { traitType: 'Ресурсы', value: 'Максимум', rarity: 3 }, { traitType: 'Вид', value: 'Панорамный', rarity: 5 },
    ],
    createdAt: pastDate(120), likes: 1204, isAuction: true, auctionEndsAt: futureDate(7),
  },
  {
    id: 'mr-002', tokenId: 14, name: 'Seaside Villa Plot', description: 'Участок на берегу виртуального океана с видом на закат. Идеальное место для постройки виллы мечты.',
    image: 'https://picsum.photos/seed/mr002/600/600', price: 8.5, currency: 'ETH', collectionId: 'meta-realms',
    creator: creators[4]!, ownerAddress: '0xyz567...abc890', traits: [
      { traitType: 'Район', value: 'Побережье', rarity: 8 }, { traitType: 'Размер', value: 'Средний', rarity: 25 },
      { traitType: 'Ресурсы', value: 'Много', rarity: 15 }, { traitType: 'Вид', value: 'Океан', rarity: 7 },
    ],
    createdAt: pastDate(80), likes: 567, isAuction: false,
  },
  {
    id: 'mr-003', tokenId: 28, name: 'Mountain Fortress', description: 'Горная крепость высоко в облаках. Стратегическое расположение с доступом к редким ресурсам.',
    image: 'https://picsum.photos/seed/mr003/600/600', price: 15.0, currency: 'ETH', collectionId: 'meta-realms',
    creator: creators[4]!, ownerAddress: '0xabc890...def123', traits: [
      { traitType: 'Район', value: 'Горы', rarity: 6 }, { traitType: 'Размер', value: 'Огромный', rarity: 4 },
      { traitType: 'Ресурсы', value: 'Редкие', rarity: 5 }, { traitType: 'Вид', value: 'Горный', rarity: 12 },
    ],
    createdAt: pastDate(50), likes: 890, isAuction: false,
  },

  {
    id: 'ns-001', tokenId: 1, name: 'Neon Fox Spirit', description: 'Дух неоновой лисы — загадочное существо, обитающее на границе цифрового и реального миров.',
    image: 'https://picsum.photos/seed/ns001/600/600', price: 0.75, currency: 'ETH', collectionId: 'neon-spirits',
    creator: creators[2]!, ownerAddress: '0xdef123...ghi456', traits: [
      { traitType: 'Вид', value: 'Лиса', rarity: 12 }, { traitType: 'Аура', value: 'Пурпурная', rarity: 15 },
      { traitType: 'Сила', value: 'Иллюзия', rarity: 10 }, { traitType: 'Уровень', value: 'Мифический', rarity: 5 },
    ],
    createdAt: pastDate(35), likes: 445, isAuction: false,
  },
  {
    id: 'ns-002', tokenId: 8, name: 'Neon Dragon', description: 'Неоновый дракон — древнейший и мощнейший из духов. Его пламя светится всеми цветами неона.',
    image: 'https://picsum.photos/seed/ns002/600/600', price: 2.3, currency: 'ETH', collectionId: 'neon-spirits',
    creator: creators[2]!, ownerAddress: '0xghi456...jkl789', traits: [
      { traitType: 'Вид', value: 'Дракон', rarity: 3 }, { traitType: 'Аура', value: 'Радужная', rarity: 2 },
      { traitType: 'Сила', value: 'Огонь', rarity: 8 }, { traitType: 'Уровень', value: 'Легендарный', rarity: 1 },
    ],
    createdAt: pastDate(12), likes: 678, isAuction: true, auctionEndsAt: futureDate(4),
  },
  {
    id: 'ns-003', tokenId: 22, name: 'Neon Owl Sage', description: 'Сова-мудрец из неонового леса. Хранитель знаний метавселенной и проводник между мирами.',
    image: 'https://picsum.photos/seed/ns003/600/600', price: 0.55, currency: 'ETH', collectionId: 'neon-spirits',
    creator: creators[5]!, ownerAddress: '0xjkl789...mno012', traits: [
      { traitType: 'Вид', value: 'Сова', rarity: 10 }, { traitType: 'Аура', value: 'Синяя', rarity: 20 },
      { traitType: 'Сила', value: 'Мудрость', rarity: 12 }, { traitType: 'Уровень', value: 'Редкий', rarity: 15 },
    ],
    createdAt: pastDate(18), likes: 267, isAuction: false,
  },
  {
    id: 'ns-004', tokenId: 55, name: 'Neon Phoenix', description: 'Неоновый феникс — бессмертный дух, возрождающийся из цифрового пламени. Символ обновления.',
    image: 'https://picsum.photos/seed/ns004/600/600', price: 1.9, currency: 'ETH', collectionId: 'neon-spirits',
    creator: creators[2]!, ownerAddress: '0xmno012...pqr345', traits: [
      { traitType: 'Вид', value: 'Феникс', rarity: 2 }, { traitType: 'Аура', value: 'Огненная', rarity: 6 },
      { traitType: 'Сила', value: 'Возрождение', rarity: 1 }, { traitType: 'Уровень', value: 'Легендарный', rarity: 1 },
    ],
    createdAt: pastDate(3), likes: 534, isAuction: false,
  },
];
