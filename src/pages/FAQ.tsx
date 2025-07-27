import { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    // Load content from localStorage or your backend
    const savedContent = localStorage.getItem("faq-content");
    if (savedContent) {
      setContent(savedContent);
    } else {
      // Default content
      setContent(`
        <div class="max-w-4xl mx-auto py-12 px-4">
          <h1 class="text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
          <div class="space-y-4">
            <div class="border rounded-lg">
              <h3 class="font-medium p-4 border-b cursor-pointer">How do I place an order?</h3>
              <div class="p-4">You can place an order by browsing our products and clicking the "Add to Cart" button.</div>
            </div>
            <div class="border rounded-lg">
              <h3 class="font-medium p-4 border-b cursor-pointer">What is your return policy?</h3>
              <div class="p-4">We offer a 30-day return policy for all unused items in original packaging.</div>
            </div>
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

export default FAQ;