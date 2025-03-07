import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileShowBrands, setMobileShowBrands] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleMobileBrands = () => setMobileShowBrands(!mobileShowBrands);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };
  const {
    data: brands
  } = useQuery({
    queryKey: ['nav-brands'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('brands').select('*').order('name');
      if (error) throw error;
      return data;
    }
  });
  return <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center min-h-[80px]">
          <Link to="/" className="flex items-center">
            <img src="https://ykcgooinlzlhtonueasz.supabase.co/storage/v1/object/public/images//partssuppliedlogo.png" alt="PartsSupplied Logo" className="h-24 w-auto" // Increased from h-12 to h-16
          />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <form onSubmit={handleSearch} className="relative w-96">
              <Input type="search" placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-4 pr-10" />
              <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            <Link to="/categories" className="hover:text-primary transition-colors">
              Categories
            </Link>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Brands</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[200px] p-2">
                      {brands?.map(brand => <Link key={brand.id} to={`/brand/${brand.slug}`} className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          {brand.name}
                        </Link>)}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link to="/quote" className="hover:text-primary transition-colors">
              Get Quote
            </Link>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {isOpen && <div className="md:hidden py-4 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <Input type="search" placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-4 pr-10" />
              <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0">
                <Search className="h-4 w-4" />
              </Button>
            </form>
            <div className="flex flex-col space-y-2">
              <Link to="/categories" className="hover:text-primary transition-colors py-2">
                Categories
              </Link>
              
              {/* Mobile brands dropdown */}
              <div className="relative">
                <button onClick={toggleMobileBrands} className="flex items-center justify-between w-full py-2 hover:text-primary transition-colors px-[99px]">
                  Brands
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${mobileShowBrands ? 'rotate-180' : ''}`} />
                </button>
                
                {mobileShowBrands && brands && <div className="bg-background border rounded-md mt-1 py-2 shadow-md">
                    {brands.map(brand => <Link key={brand.id} to={`/brand/${brand.slug}`} className="block px-4 py-2 hover:bg-accent hover:text-accent-foreground" onClick={() => {
                setMobileShowBrands(false);
                setIsOpen(false);
              }}>
                        {brand.name}
                      </Link>)}
                  </div>}
              </div>
              
              <Link to="/quote" className="hover:text-primary transition-colors py-2">
                Get Quote
              </Link>
            </div>
          </div>}
      </div>
    </nav>;
};
export default Navbar;