
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

    // Define meta tags based on the path
    let title = "Industrial Automation Parts From Top Manufacturers";
    let description = "Find quality industrial automation solutions and products from leading manufacturers at parts supplied.";
    let ogImage = "https://partssupplied.com/og-image.png";
    
    // Match product pages
    if (path.startsWith('/product/')) {
      const productSlug = path.split('/').pop();
      title = `${productSlug} | Parts Supplied`;
      description = `Details about ${productSlug} - Industrial Automation Parts`;
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
