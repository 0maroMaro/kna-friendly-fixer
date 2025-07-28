import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminDashboard = () => {
  const [selectedPage, setSelectedPage] = useState("about");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const pages = {
    "about-us": "About Us",
    contact: "Contact Us", 
    faq: "FAQ",
    "track-order": "Track Order",
    privacy: "Privacy Policy"
  };

  const loadPageContent = (page: string) => {
    const savedContent = localStorage.getItem(`${page}-content`) || "";
    setContent(savedContent);
    setSelectedPage(page);
  };

  const savePageContent = () => {
    localStorage.setItem(`${selectedPage}-content`, content);
    alert("Content saved successfully!");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages(prev => [...prev, ...newImages]);
      
      // Upload images and get URLs
      for (const file of newImages) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          
          // Create object URL for immediate preview
          const imageUrl = URL.createObjectURL(file);
          const imageHtml = `<img src="${imageUrl}" alt="${file.name}" class="max-w-full h-auto my-4 rounded-lg" />`;
          setContent(prev => prev + '\n' + imageHtml);
          
          // Store the uploaded image URL for later use
          setUploadedImages(prev => [...prev, imageUrl]);
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Error uploading image: ' + file.name);
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
            // Create object URL for immediate preview
            const imageUrl = URL.createObjectURL(file);
            const imageHtml = `<img src="${imageUrl}" alt="Pasted image" class="max-w-full h-auto my-4 rounded-lg" />`;
            setContent(prev => prev + '\n' + imageHtml);
            
            // Store the uploaded image URL for later use
            setUploadedImages(prev => [...prev, imageUrl]);
            setImages(prev => [...prev, file]);
          } catch (error) {
            console.error('Error processing pasted image:', error);
            alert('Error processing pasted image');
          }
        }
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
            <Tabs defaultValue="about-us" className="space-y-6">
              <TabsList className="grid grid-cols-5 w-full">
                {Object.entries(pages).map(([key, label]) => (
                  <TabsTrigger 
                    key={key} 
                    value={key}
                    onClick={() => loadPageContent(key)}
                  >
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.keys(pages).map(pageKey => (
                <TabsContent key={pageKey} value={pageKey} className="space-y-4">
                  <div className="space-y-4 mb-4">
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

                  <Textarea
                    placeholder={`Enter HTML content for ${pages[pageKey as keyof typeof pages]}... (Tip: Ctrl+V to paste images)`}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onPaste={handlePaste}
                    className="min-h-[400px] font-mono text-sm"
                  />

                  <div className="flex gap-4">
                    <Button 
                      onClick={savePageContent}
                      className="border-gray-300 text-gray-700 bg-white hover:bg-gray-100 hover:text-gray-900"
                      variant="outline"
                    >
                      Save Content
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