
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface ProductHeaderProps {
  name: string;
  categories?: {
    name: string;
    slug: string;
  } | null;
  brands?: {
    name: string;
    slug: string;
  } | null;
}

export const ProductHeader = ({ name, categories, brands }: ProductHeaderProps) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="flex-grow">
      <div className="flex items-center gap-2 mb-4">
        <h1 className="text-3xl font-bold">{name}</h1>
        <Badge variant="secondary" className="bg-green-500 text-white">In Stock</Badge>
      </div>
      <div className="flex gap-2">
        {categories && (
          <Link to={`/category/${categories.slug}`}>
            <Badge variant="secondary">{categories.name}</Badge>
          </Link>
        )}
        {brands && (
          <Link to={`/brand/${brands.slug}`}>
            <Badge>{brands.name}</Badge>
          </Link>
        )}
      </div>
    </div>
  </div>
);
