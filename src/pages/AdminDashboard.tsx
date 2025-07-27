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

  const pages = {
    about: "About Us",
    contact: "Contact Us", 
    faq: "FAQ",
    "track-order": "Track Order",
    "privacy-policy": "Privacy Policy"
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages(prev => [...prev, ...newImages]);
      
      // Insert image placeholders into content
      newImages.forEach(file => {
        const imageUrl = URL.createObjectURL(file);
        const imageHtml = `<img src="${imageUrl}" alt="${file.name}" class="max-w-full h-auto my-4" />`;
        setContent(prev => prev + imageHtml);
      });
    }
  };

  const insertImagePlaceholder = () => {
    const imageHtml = `<img src="/api/placeholder/400/300" alt="Image placeholder" class="max-w-full h-auto my-4" />`;
    setContent(prev => prev + imageHtml);
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
            <Tabs defaultValue="about" className="space-y-6">
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
                  <div className="flex gap-4 mb-4">
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
                      Insert Placeholder
                    </Button>
                  </div>

                  <Textarea
                    placeholder={`Enter HTML content for ${pages[pageKey as keyof typeof pages]}...`}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
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
                        className="border rounded-lg p-4 bg-white"
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