import { collections } from '@/data/collections';
import { CollectionCard } from '@/components/CollectionCard';
import { useTheme } from '@/context/ThemeContext';

export default function CollectionsPage() {
  const { isDark } = useTheme();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2">Коллекции</h1>
        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
          Исследуйте лучшие коллекции цифрового искусства
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection, index) => (
          <div
            key={collection.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
          >
            <CollectionCard collection={collection} />
          </div>
        ))}
      </div>
    </div>
  );
}
