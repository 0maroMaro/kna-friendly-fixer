import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/shared/PageLayout";
import ReactMarkdown from "react-markdown";

interface Page {
  id: string;
  slug: string;
  title: string;
  content: string;
  is_published: boolean;
}

const PageView = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPage(slug);
    }
  }, [slug]);

  const fetchPage = async (pageSlug: string) => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', pageSlug)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      setPage(data);
    } catch (error) {
      console.error('Error fetching page:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white/70">Loading page...</div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!page) {
    return (
      <PageLayout>
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-white mb-4">Page Not Found</h1>
              <p className="text-xl text-white/70">The page you're looking for doesn't exist.</p>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-lg p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-white to-red-600 bg-clip-text text-transparent">
              {page.title}
            </h1>
            <div className="prose prose-lg max-w-none text-white/90 leading-relaxed text-lg">
              <ReactMarkdown 
                components={{
                  img: ({ src, alt }) => (
                    <img 
                      src={src} 
                      alt={alt} 
                      className="rounded-lg shadow-lg max-w-full h-auto"
                    />
                  ),
                  p: ({ children }) => (
                    <p className="mb-4 text-white/90">{children}</p>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold mb-4 text-white">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-bold mb-3 text-white">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-bold mb-2 text-white">{children}</h3>
                  )
                }}
              >
                {page.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PageView;