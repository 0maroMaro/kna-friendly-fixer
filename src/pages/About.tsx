import { useState, useEffect } from "react";

const About = () => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    // Load content from localStorage or your backend
    const savedContent = localStorage.getItem("about-content");
    if (savedContent) {
      setContent(savedContent);
    } else {
      // Default content
      setContent(`
        <div class="max-w-4xl mx-auto py-12 px-4">
          <h1 class="text-4xl font-bold mb-8 text-center">About Us</h1>
          <div class="prose prose-lg mx-auto">
            <p>Welcome to our company. We are dedicated to providing excellent service and quality products to our customers.</p>
            <p>Our team has years of experience in the industry and we strive to exceed expectations in everything we do.</p>
          </div>
        </div>
      `);
    }
  }, []);

  return (
    <div 
      className="min-h-screen bg-background"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default About;