import { MessageCircle } from "lucide-react";

export default function WhatsAppFloatingButton() {
  return (
    <a
      href="https://wa.me/1234567890" // Replace with your WhatsApp number
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300"
    >
      <MessageCircle size={28} />
    </a>
  );
}
