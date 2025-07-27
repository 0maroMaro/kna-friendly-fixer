import { useState, useEffect } from "react";

const PrivacyPolicy = () => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    // Load content from localStorage or your backend
    const savedContent = localStorage.getItem("privacy-policy-content");
    if (savedContent) {
      setContent(savedContent);
    } else {
      // Default content
      setContent(`
        <div class="max-w-4xl mx-auto py-12 px-4">
          <h1 class="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
          <div class="prose prose-lg mx-auto space-y-6">
            <section>
              <h2 class="text-2xl font-semibold mb-4">Information We Collect</h2>
              <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us.</p>
            </section>
            <section>
              <h2 class="text-2xl font-semibold mb-4">How We Use Your Information</h2>
              <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
            </section>
            <section>
              <h2 class="text-2xl font-semibold mb-4">Information Sharing</h2>
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
            </section>
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

export default PrivacyPolicy;