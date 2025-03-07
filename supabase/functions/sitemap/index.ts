
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

  // Count total products first for logging purposes
  const { count, error: countError } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true });

  if (countError) {
    console.error('Error counting products:', countError);
    return xml.end({ prettyPrint: true });
  }

  console.log(`Total products in database: ${count}`);

  // Use cursor-based pagination to fetch all products
  const PAGE_SIZE = 1000; // More conservative page size
  let lastId = 0;
  let productCount = 0;
  let batchNumber = 0;
  let hasMoreProducts = true;

  while (hasMoreProducts) {
    batchNumber++;
    console.log(`Fetching batch ${batchNumber}, products after ID ${lastId}`);
    
    const { data: products, error } = await supabase
      .from('products')
      .select('id, slug')
      .gt('id', lastId)
      .order('id', { ascending: true })
      .limit(PAGE_SIZE);
      
    if (error) {
      console.error(`Error fetching products batch ${batchNumber}:`, error);
      break;
    }
    
    if (!products || products.length === 0) {
      console.log(`No more products found after ID ${lastId}`);
      hasMoreProducts = false;
      continue;
    }

    const batchSize = products.length;
    productCount += batchSize;
    console.log(`Processing batch ${batchNumber}: ${batchSize} products (total so far: ${productCount}/${count})`);
    
    // Update lastId for next iteration
    lastId = products[products.length - 1].id;
    
    // Add product pages to sitemap
    products.forEach(product => {
      xml.ele('url')
        .ele('loc').txt(`${baseUrl}/product/${product.slug}`).up()
        .ele('changefreq').txt('daily').up()
        .ele('priority').txt('0.9').up();
    });
    
    // Check if we got fewer products than requested, which means we've reached the end
    if (batchSize < PAGE_SIZE) {
      console.log(`Received ${batchSize} products (less than page size ${PAGE_SIZE}), finishing`);
      hasMoreProducts = false;
    }
  }

  console.log(`Completed sitemap generation. Total products added: ${productCount}`);
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
    console.log("Starting sitemap generation...");
    const startTime = Date.now();
    const sitemap = await generateSitemap();
    const endTime = Date.now();
    console.log(`Sitemap generation completed in ${(endTime - startTime) / 1000} seconds`);
    
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
