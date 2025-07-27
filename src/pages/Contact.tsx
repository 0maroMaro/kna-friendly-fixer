import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Contact = () => {
  const [content, setContent] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  useEffect(() => {
    // Load content from localStorage or your backend
    const savedContent = localStorage.getItem("contact-content");
    if (savedContent) {
      setContent(savedContent);
    } else {
      // Default content
      setContent(`
        <div class="max-w-4xl mx-auto py-12 px-4">
          <h1 class="text-4xl font-bold mb-8 text-center">Contact Us</h1>
          <div class="grid md:grid-cols-2 gap-12">
            <div>
              <h2 class="text-2xl font-semibold mb-4">Get in Touch</h2>
              <p class="mb-6 text-gray-600">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
              <div class="space-y-4">
                <div>
                  <h3 class="font-medium">Email</h3>
                  <p class="text-gray-600">contact@company.com</p>
                </div>
                <div>
                  <h3 class="font-medium">Phone</h3>
                  <p class="text-gray-600">+1 (555) 123-4567</p>
                </div>
                <div>
                  <h3 class="font-medium">Address</h3>
                  <p class="text-gray-600">123 Business St<br />City, State 12345</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your contact form submission logic here
    console.log("Contact form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-background">
      <div 
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div></div>
          <div>
            <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <Input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <Textarea
                placeholder="Your Message"
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
              <Button 
                type="submit" 
                className="w-full border-gray-300 text-gray-700 bg-white hover:bg-gray-100 hover:text-gray-900"
                variant="outline"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;