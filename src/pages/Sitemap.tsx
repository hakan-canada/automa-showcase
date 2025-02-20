
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Sitemap = () => {
  useEffect(() => {
    const redirectToSitemap = async () => {
      const { data: { url } } = await supabase.functions.invoke('sitemap');
      window.location.href = url;
    };
    redirectToSitemap();
  }, []);

  return null;
};

export default Sitemap;
