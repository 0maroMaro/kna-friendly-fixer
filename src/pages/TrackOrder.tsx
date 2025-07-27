import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TrackOrder = () => {
  const [content, setContent] = useState<string>("");
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    // Load content from localStorage or your backend
    const savedContent = localStorage.getItem("track-order-content");
    if (savedContent) {
      setContent(savedContent);
    } else {
      // Default content
      setContent(`
        <div class="max-w-4xl mx-auto py-12 px-4">
          <h1 class="text-4xl font-bold mb-8 text-center">Track Your Order</h1>
          <div class="max-w-md mx-auto">
            <p class="mb-6 text-center text-gray-600">Enter your order number to track your package</p>
          </div>
        </div>
      `);
    }
  }, []);

  const handleTrackOrder = () => {
    // Add your order tracking logic here
    console.log("Tracking order:", orderNumber);
  };

  return (
    <div className="min-h-screen bg-background">
      <div 
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <div className="max-w-md mx-auto px-4 pb-12">
        <div className="space-y-4">
          <Input
            placeholder="Enter order number"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
          />
          <Button onClick={handleTrackOrder} className="w-full">
            Track Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;