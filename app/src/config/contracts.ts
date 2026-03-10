import type { CollectionConfig } from '@/types';

export const COLLECTIONS: CollectionConfig[] = [
  {
    contractAddress: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
    name: 'Bored Ape Yacht Club',
    slug: 'bayc',
    description: 'Коллекция из 10,000 уникальных Bored Ape NFT на блокчейне Ethereum. Каждый Ape генерируется из более чем 170 возможных свойств.',
    tokenIds: [1, 2, 3, 7, 10, 42],
    verified: true,
  },
  {
    contractAddress: '0xED5AF388653567Af2F388E6224dC7C4b3241C544',
    name: 'Azuki',
    slug: 'azuki',
    description: 'Azuki — коллекция из 10,000 аватаров в стиле аниме, открывающая доступ к The Garden — пространству для Web3-сообщества.',
    tokenIds: [1, 2, 5, 8, 15, 100],
    verified: true,
  },
  {
    contractAddress: '0xBd3531dA5CF5857e7CfAA92426877b022e612cf8',
    name: 'Pudgy Penguins',
    slug: 'pudgy-penguins',
    description: 'Pudgy Penguins — 8,888 уникальных пингвинов, объединяющих сообщество вокруг добрых дел и позитивных вайбов в Web3.',
    tokenIds: [1, 2, 3, 10, 50, 100],
    verified: true,
  },
  {
    contractAddress: '0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e',
    name: 'Doodles',
    slug: 'doodles',
    description: 'Doodles — коллекция из 10,000 NFT, дизайн которых вдохновлён уличным искусством и поп-культурой. Созданы художником Burnt Toast.',
    tokenIds: [1, 2, 5, 10, 42, 100],
    verified: true,
  },
  {
    contractAddress: '0x1A92f7381B9F03921564a437210bB9396471050C',
    name: 'Cool Cats',
    slug: 'cool-cats',
    description: 'Cool Cats — 9,999 случайно сгенерированных NFT-котов на блокчейне Ethereum. Каждый кот уникально стилизован.',
    tokenIds: [1, 2, 3, 5, 10, 50],
    verified: true,
  },
];

export function getCollectionBySlug(slug: string): CollectionConfig | undefined {
  return COLLECTIONS.find(c => c.slug === slug);
}

export function getCollectionByAddress(address: string): CollectionConfig | undefined {
  return COLLECTIONS.find(c => c.contractAddress.toLowerCase() === address.toLowerCase());
}
