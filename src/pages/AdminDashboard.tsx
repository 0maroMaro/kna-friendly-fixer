import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Page {
  id: string;
  slug: string;
  title: string;
  content: string;
  is_published: boolean;
}

const AdminDashboard = () => {
  const [selectedPage, setSelectedPage] = useState("about-us");
  const [content, setContent] = useState("");
  const [pageTitle, setPageTitle] = useState("");
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const pageConfig = {
    "about-us": "About Us",
    "contact": "Contact Us", 
    "faq": "FAQ",
    "track-order": "Track Order",
    "privacy": "Privacy Policy"
  };

  useEffect(() => {
    loadPages();
  }, []);

  useEffect(() => {
    if (selectedPage && pages.length > 0) {
      loadPageContent(selectedPage);
    }
  }, [selectedPage, pages]);

  const loadPages = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .in('slug', Object.keys(pageConfig));

      if (error) throw error;

      setPages(data || []);
      
      // Create missing pages
      const existingSlugs = data?.map(p => p.slug) || [];
      const missingSlugs = Object.keys(pageConfig).filter(slug => !existingSlugs.includes(slug));
      
      for (const slug of missingSlugs) {
        await createPage(slug, pageConfig[slug as keyof typeof pageConfig]);
      }
      
      if (missingSlugs.length > 0) {
        loadPages(); // Reload to get the newly created pages
      }
    } catch (error) {
      console.error('Error loading pages:', error);
      toast({
        title: "Error",
        description: "Failed to load pages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createPage = async (slug: string, title: string) => {
    try {
      const { error } = await supabase
        .from('pages')
        .insert({
          slug,
          title,
          content: `<div class="container mx-auto px-6 py-12">
            <h1 class="text-4xl font-bold text-white mb-8">${title}</h1>
            <p class="text-white/70 text-lg">Edit this page content in the admin dashboard.</p>
          </div>`,
          is_published: true
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating page:', error);
    }
  };

  const loadPageContent = (pageSlug: string) => {
    const page = pages.find(p => p.slug === pageSlug);
    if (page) {
      setContent(page.content);
      setPageTitle(page.title);
      setSelectedPage(pageSlug);
    }
  };

  const uploadImageToSupabase = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `page-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

      if (uploadError) {
        // If uploads bucket doesn't exist, try to create it or use public folder fallback
        console.warn('Upload to Supabase storage failed, using fallback:', uploadError);
        return URL.createObjectURL(file); // Fallback to blob URL
      }

      const { data } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading to Supabase:', error);
      return URL.createObjectURL(file); // Fallback to blob URL
    }
  };

  const savePageContent = async () => {
    if (!selectedPage) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('pages')
        .update({
          title: pageTitle,
          content: content,
          is_published: true
        })
        .eq('slug', selectedPage);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Page content saved successfully!"
      });

      // Update local state
      setPages(prev => prev.map(p => 
        p.slug === selectedPage 
          ? { ...p, title: pageTitle, content: content }
          : p
      ));
    } catch (error) {
      console.error('Error saving page:', error);
      toast({
        title: "Error",
        description: "Failed to save page content",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      for (const file of files) {
        try {
          const imageUrl = await uploadImageToSupabase(file);
          if (imageUrl) {
            const imageHtml = `<img src="${imageUrl}" alt="${file.name}" class="max-w-full h-auto my-4 rounded-lg" />`;
            setContent(prev => prev + '\n' + imageHtml);
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          toast({
            title: "Error",
            description: `Failed to upload ${file.name}`,
            variant: "destructive"
          });
        }
      }
    }
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = item.getAsFile();
        
        if (file) {
          try {
            const imageUrl = await uploadImageToSupabase(file);
            if (imageUrl) {
              const imageHtml = `<img src="${imageUrl}" alt="Pasted image" class="max-w-full h-auto my-4 rounded-lg" />`;
              setContent(prev => prev + '\n' + imageHtml);
              
              toast({
                title: "Success",
                description: "Image pasted successfully!"
              });
            }
          } catch (error) {
            console.error('Error processing pasted image:', error);
            toast({
              title: "Error",
              description: "Failed to process pasted image",
              variant: "destructive"
            });
          }
        }
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    
    for (const file of files) {
      try {
        const imageUrl = await uploadImageToSupabase(file);
        if (imageUrl) {
          const imageHtml = `<img src="${imageUrl}" alt="${file.name}" class="max-w-full h-auto my-4 rounded-lg" />`;
          setContent(prev => prev + '\n' + imageHtml);
        }
      } catch (error) {
        console.error('Error uploading dropped image:', error);
      }
    }
  };

  const insertImagePlaceholder = () => {
    const imageHtml = `<img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8" alt="Image placeholder" class="max-w-full h-auto my-4 rounded-lg" />`;
    setContent(prev => prev + '\n' + imageHtml);
  };

  const insertTextBlock = (type: 'heading' | 'paragraph' | 'button') => {
    let html = '';
    switch (type) {
      case 'heading':
        html = '<h2 class="text-3xl font-bold text-white mb-6">Your Heading Here</h2>';
        break;
      case 'paragraph':
        html = '<p class="text-white/70 mb-4">Your paragraph text here. You can edit this content directly.</p>';
        break;
      case 'button':
        html = '<button class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors">Call to Action</button>';
        break;
    }
    setContent(prev => prev + '\n' + html);
  };

  const signOut = () => {
    // Add your sign out logic here
    console.log("Signing out...");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button 
            variant="outline" 
            onClick={signOut} 
            size="sm" 
            className="border-gray-300 text-gray-700 bg-white hover:bg-gray-100 hover:text-gray-900"
          >
            Sign Out
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Page Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedPage} onValueChange={setSelectedPage} className="space-y-6">
              <TabsList className="grid grid-cols-5 w-full">
                {Object.entries(pageConfig).map(([key, label]) => (
                  <TabsTrigger 
                    key={key} 
                    value={key}
                  >
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.keys(pageConfig).map(pageKey => (
                <TabsContent key={pageKey} value={pageKey} className="space-y-4">
                  <div className="space-y-4 mb-4">
                    <Input
                      placeholder="Page Title"
                      value={pageTitle}
                      onChange={(e) => setPageTitle(e.target.value)}
                      className="text-lg font-semibold"
                    />
                    
                    <div className="flex gap-2">
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="flex-1"
                      />
                      <Button 
                        onClick={insertImagePlaceholder}
                        variant="outline"
                        className="border-gray-300 text-gray-700 bg-white hover:bg-gray-100 hover:text-gray-900"
                      >
                        Placeholder
                      </Button>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => insertTextBlock('heading')}
                        variant="outline"
                        className="border-gray-300 text-gray-700 bg-white hover:bg-gray-100 hover:text-gray-900"
                        size="sm"
                      >
                        + Heading
                      </Button>
                      <Button 
                        onClick={() => insertTextBlock('paragraph')}
                        variant="outline"
                        className="border-gray-300 text-gray-700 bg-white hover:bg-gray-100 hover:text-gray-900"
                        size="sm"
                      >
                        + Paragraph
                      </Button>
                      <Button 
                        onClick={() => insertTextBlock('button')}
                        variant="outline"
                        className="border-gray-300 text-gray-700 bg-white hover:bg-gray-100 hover:text-gray-900"
                        size="sm"
                      >
                        + Button
                      </Button>
                    </div>
                  </div>

                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="relative"
                  >
                    <Textarea
                      placeholder={`Enter HTML content for ${pageConfig[pageKey as keyof typeof pageConfig]}... (Tip: Ctrl+V to paste images, or drag & drop them here)`}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      onPaste={handlePaste}
                      className="min-h-[400px] font-mono text-sm"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      onClick={savePageContent}
                      disabled={saving}
                      className="border-gray-300 text-gray-700 bg-white hover:bg-gray-100 hover:text-gray-900"
                      variant="outline"
                    >
                      {saving ? "Saving..." : "Save Content"}
                    </Button>
                  </div>

                  {content && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">Preview</h3>
                      <div 
                        className="border rounded-lg p-6 bg-black text-white min-h-[200px]"
                        dangerouslySetInnerHTML={{ __html: content }}
                      />
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;