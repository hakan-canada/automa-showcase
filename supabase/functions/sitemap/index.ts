
import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { create } from 'https://esm.sh/xmlbuilder2@3.1.1';

const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;

async function generateSitemap() {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const baseUrl = 'https://partssupplied.com';

  // Create XML sitemap
  const xml = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('urlset', { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' });

  // Add static pages
  ['', 'categories', 'brands', 'quote', 'contact'].forEach(path => {
    xml.ele('url')
      .ele('loc').txt(`${baseUrl}/${path}`).up()
      .ele('changefreq').txt('daily').up()
      .ele('priority').txt(path === '' ? '1.0' : '0.8').up();
  });

  // Fetch all categories
  const { data: categories } = await supabase
    .from('categories')
    .select('slug');

  // Add category pages
  categories?.forEach(category => {
    xml.ele('url')
      .ele('loc').txt(`${baseUrl}/category/${category.slug}`).up()
      .ele('changefreq').txt('daily').up()
      .ele('priority').txt('0.8').up();
  });

  // Count total products first
  const { count, error: countError } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true });

  if (countError) {
    console.error('Error counting products:', countError);
    return xml.end({ prettyPrint: true });
  }

  console.log(`Total products in database: ${count}`);

  // Paginate through all products using a larger page size
  const PAGE_SIZE = 2000; // Increased from 1000
  const totalPages = Math.ceil((count || 0) / PAGE_SIZE);
  console.log(`Will fetch ${totalPages} pages with ${PAGE_SIZE} products per page`);

  let productCount = 0;
  
  for (let page = 0; page < totalPages; page++) {
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    
    console.log(`Fetching products page ${page + 1}/${totalPages}, range: ${from}-${to}`);
    
    const { data: products, error } = await supabase
      .from('products')
      .select('slug')
      .range(from, to);
      
    if (error) {
      console.error(`Error fetching products page ${page + 1}:`, error);
      continue;
    }
    
    if (!products || products.length === 0) {
      console.log(`No products found on page ${page + 1}`);
      continue;
    }

    productCount += products.length;
    console.log(`Adding ${products.length} products from page ${page + 1} to sitemap`);
    
    // Add product pages
    products.forEach(product => {
      xml.ele('url')
        .ele('loc').txt(`${baseUrl}/product/${product.slug}`).up()
        .ele('changefreq').txt('daily').up()
        .ele('priority').txt('0.9').up();
    });
  }

  console.log(`Total products added to sitemap: ${productCount}`);
  return xml.end({ prettyPrint: true });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      }
    });
  }

  try {
    const sitemap = await generateSitemap();
    
    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate sitemap' }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
