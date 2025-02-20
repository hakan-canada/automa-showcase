import { Button } from '@/components/ui/button';
import { ShoppingCart, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
interface ProductActionsProps {
  productName: string;
  productUrl: string | null;
}
export const ProductActions = ({
  productName,
  productUrl
}: ProductActionsProps) => <div className="space-y-8">
    <Button className="w-full" size="lg" onClick={() => productUrl && window.open(productUrl, '_blank')} disabled={!productUrl}>
      <ShoppingCart className="mr-2 h-5 w-5" />
      Buy Now
    </Button>
    <Link to={`/quote?product=${encodeURIComponent(productName)}`} className="w-full">
      <Button variant="outline" size="lg" className="w-full px-0 py-0 my-[8px] mx-0">
        <FileText className="mr-2 h-5 w-5" />
        Request Quote
      </Button>
    </Link>
  </div>;
