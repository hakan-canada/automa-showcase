
import { supabase } from '@/integrations/supabase/client';
import { create } from 'xmlbuilder2';

export async function generateSitemap() {
  const baseUrl = 'https://partssupplied.com';

  // Fetch all products
  const { data: products } = await supabase
    .from('products')
    .select('slug');

  // Fetch all categories
  const { data: categories } = await supabase
    .from('categories')
    .select('slug');

  const xml = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('urlset', { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' });

  // Add static pages
  ['', 'categories', 'brands', 'quote', 'contact'].forEach(path => {
    xml.ele('url')
      .ele('loc').txt(`${baseUrl}/${path}`).up()
      .ele('changefreq').txt('daily').up()
      .ele('priority').txt(path === '' ? '1.0' : '0.8').up();
  });

  // Add product pages
  products?.forEach(product => {
    xml.ele('url')
      .ele('loc').txt(`${baseUrl}/product/${product.slug}`).up()
      .ele('changefreq').txt('daily').up()
      .ele('priority').txt('0.9').up();
  });

  // Add category pages
  categories?.forEach(category => {
    xml.ele('url')
      .ele('loc').txt(`${baseUrl}/category/${category.slug}`).up()
      .ele('changefreq').txt('daily').up()
      .ele('priority').txt('0.8').up();
  });

  return xml.end({ prettyPrint: true });
}
