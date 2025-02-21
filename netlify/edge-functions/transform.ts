
import { Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {
  try {
    const response = await context.next();
    
    // Only process HTML pages
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      return response;
    }

    // Clone the response before reading it
    const clonedResponse = response.clone();
    const page = await clonedResponse.text();

    // Get current URL path
    const url = new URL(request.url);
    const path = url.pathname;

    // Default meta tags
    let title = "Industrial Automation Parts From Top Manufacturers";
    let description = "Find quality industrial automation solutions and products from leading manufacturers at parts supplied.";
    let ogImage = "https://partssupplied.com/og-image.png";

    // Match product pages
    if (path.startsWith('/product/')) {
      // Extract the product name from the HTML (h1 heading within ProductHeader)
      const h1Match = page.match(/<h1[^>]*class="[^"]*font-bold[^"]*"[^>]*>(.*?)<\/h1>/);
      const h1Text = h1Match ? h1Match[1].trim() : '';

      // Extract product description from the paragraph with text-muted-foreground class
      const descMatch = page.match(/<p[^>]*class="[^"]*text-muted-foreground[^"]*"[^>]*>(.*?)<\/p>/);
      const productDesc = descMatch ? descMatch[1].trim() : '';

      // Extract product image from the img tag within the rounded-md class container
      const imgMatch = page.match(/<img[^>]*class="[^"]*max-w-full[^"]*"[^>]*src="([^"]*)"[^>]*>/);
      if (imgMatch && imgMatch[1]) {
        ogImage = imgMatch[1];
      }

      if (h1Text) {
        title = `Buy ${h1Text} | Parts Supplied`;
        description = `Discover ${h1Text} online. ${productDesc}`;
      }
    }
    // Match category pages
    else if (path.startsWith('/category/')) {
      const categorySlug = path.split('/').pop();
      // Extract category name from h1
      const h1Match = page.match(/<h1[^>]*class="[^"]*text-3xl[^"]*"[^>]*>(.*?)<\/h1>/);
      const categoryName = h1Match ? h1Match[1].trim() : categorySlug;

      title = `Shop ${categoryName} | Parts Supplied`;
      description = `Browse our selection of ${categoryName} products. We offer in stock items from top manufacturers with competitive pricing and fast shipping.`;
    }

    // Update meta tags in the HTML
    const updatedHtml = page
      .replace(/<title>.*?<\/title>/i, `<title>${title}</title>`)
      .replace(
        /<meta\s+name="description"\s+content=".*?"/i,
        `<meta name="description" content="${description}"`
      )
      .replace(
        /<meta\s+property="og:title"\s+content=".*?"/i,
        `<meta property="og:title" content="${title}"`
      )
      .replace(
        /<meta\s+property="og:description"\s+content=".*?"/i,
        `<meta property="og:description" content="${description}"`
      )
      .replace(
        /<meta\s+property="og:image"\s+content=".*?"/i,
        `<meta property="og:image" content="${ogImage}"`
      );

    // Create new response with updated HTML and original headers
    return new Response(updatedHtml, {
      status: response.status,
      statusText: response.statusText,
      headers: new Headers(response.headers)
    });
  } catch (error) {
    console.error('Edge function error:', error);
    return context.next();
  }
};
