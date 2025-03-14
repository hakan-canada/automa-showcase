
import { createClient } from '@supabase/supabase-js';
import { create } from 'xmlbuilder2';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SUPABASE_URL = "https://ykcgooinlzlhtonueasz.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrY2dvb2lubHpsaHRvbnVlYXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyODg4MjMsImV4cCI6MjA1NDg2NDgyM30.IthQpwAUGv_Ku5lOf6g9YyUqlm-xDCdweLY1U3AVJaQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function generateSitemap() {
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

  const sitemapXML = xml.end({ prettyPrint: true });

  // Write to the dist directory for production builds
  const distDir = join(process.cwd(), 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Write the sitemap to dist/sitemap.xml
  fs.writeFileSync(join(distDir, 'sitemap.xml'), sitemapXML);
  console.log('Sitemap generated successfully in dist/sitemap.xml!');
}

generateSitemap().catch(console.error);
