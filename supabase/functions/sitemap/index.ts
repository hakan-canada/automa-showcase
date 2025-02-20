
import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { create } from 'https://esm.sh/xmlbuilder2@3.1.1';

const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;

async function generateSitemap() {
  const supabase = createClient(supabaseUrl, supabaseKey);
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const sitemap = await generateSitemap();
    
    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate sitemap' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
