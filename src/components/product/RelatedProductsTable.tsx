import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RelatedProduct {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  url: string | null;
  categories: {
    name: string;
    slug: string;
  } | null;
  brands: {
    name: string;
    slug: string;
  } | null;
}

export const RelatedProductsTable = ({ products }: { products: RelatedProduct[] }) => (
  <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Image</TableHead>
          <TableHead className="min-w-[200px]">Product Details</TableHead>
          <TableHead className="hidden md:table-cell">Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <Link to={`/product/${product.slug}`}>
                <div className="w-[80px] h-[80px] bg-muted rounded-md flex items-center justify-center">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="max-w-full max-h-full object-cover rounded-md"
                  />
                </div>
              </Link>
            </TableCell>
            <TableCell>
              <div className="space-y-2">
                <h2 className="font-medium hover:underline">
                  <Link to={`/product/${product.slug}`}>
                    {product.name}
                  </Link>
                </h2>
                {product.brands && (
                  <Badge variant="secondary" className="text-xs">
                    {product.brands.name}
                  </Badge>
                )}
                <div className="md:hidden">
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                    {product.description}
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell max-w-xl">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);
