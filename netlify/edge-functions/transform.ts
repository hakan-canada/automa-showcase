
import { Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {
  const response = await context.next();
  const page = await response.text();

  // Only process HTML pages
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }

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
    // You could fetch actual product data here if needed
    title = `${productSlug} | Parts Supplied`;
    description = `Details about ${productSlug} - Industrial Automation Parts`;
  }

  // Update meta tags in the HTML
  const updatedHtml = page
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta\s+name="description"\s+content=".*?"/,
      `<meta name="description" content="${description}"`
    )
    .replace(
      /<meta\s+property="og:title"\s+content=".*?"/,
      `<meta property="og:title" content="${title}"`
    )
    .replace(
      /<meta\s+property="og:description"\s+content=".*?"/,
      `<meta property="og:description" content="${description}"`
    )
    .replace(
      /<meta\s+property="og:image"\s+content=".*?"/,
      `<meta property="og:image" content="${ogImage}"`
    );

  return new Response(updatedHtml, {
    headers: response.headers,
  });
};
