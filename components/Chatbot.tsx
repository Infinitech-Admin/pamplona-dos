"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X, Send } from "lucide-react";
import Image from "next/image";

interface Message {
  type: "bot" | "user";
  text: string;
  quickReplies?: string[];
}

// ---------------------------------------------------------------
// Barangay Pamplona Dos data (keep in sync with contact/about pages)
// ---------------------------------------------------------------
// Verified:
//  - Phone (02) 8874-6224, email, address, hours -> your Contact page
//    (phone also listed on barangaydirectory.com)
//  - Punong Barangay Roberto D.H. Villalon, 2023-2026 term
//  - P.D. 1332 (Apr 3, 1978), 112.16 ha, 11,443 pop. (PSA 2024 POPCEN)
// TODO: confirm with the barangay hall -> office hours, fees, requirements,
//       mission/vision/values, health center schedule, police/BFP numbers
const BRGY = {
  name: "Barangay Pamplona Dos",
  city: "Las Piñas City, Metro Manila",
  address:
    "Barangay Hall, Aquarius St., Pamplona Park Subd., Pamplona Dos, Las Piñas City",
  phone: "(02) 8874-6224",
  email: "pamplonados.lp@gmail.com",
  hours: "Monday to Friday\n8:00 AM - 5:00 PM", // TODO: confirm
  captain: "Roberto D.H. Villalon",
  term: "2023–2026",
  population: "11,443",
  landArea: "112.16 hectares",
  founded: "April 3, 1978 (Presidential Decree No. 1332)",
};

const MAIN_MENU = [
  "About Us",
  "Our Mission",
  "Our Vision",
  "Services",
  "Contact Info",
  "Office Hours",
];

export default function Chatbot() {
  const pathname = usePathname();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showPromoMessage, setShowPromoMessage] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "bot",
      text: "Hi there! 👋 I'm your Pamplona Dos Barangay Assistant. How can I help you today?",
      quickReplies: MAIN_MENU,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Hide on dashboard, login, and register routes
  if (
    pathname?.startsWith("/dashboard") ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return null;
  }

  const handleSendMessage = (message?: string) => {
    const messageToSend = message || inputMessage;
    if (messageToSend.trim() === "") return;

    setMessages((prev) => [...prev, { type: "user", text: messageToSend }]);

    setTimeout(() => {
      const botResponse = getBotResponse(messageToSend);
      setMessages((prev) => [...prev, botResponse]);
    }, 800);

    setInputMessage("");
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const getBotResponse = (message: string): Message => {
    const m = message.toLowerCase();
    // whole-word match, so "hi" doesn't match "this" and "id" doesn't match "residency"
    const word = (w: string) => new RegExp(`\\b${w}\\b`).test(m);

    if (
      m.includes("about") ||
      m.includes("history") ||
      m.includes("captain") ||
      m.includes("official")
    ) {
      return {
        type: "bot",
        text: `🏘️ About ${BRGY.name}:\n\n${BRGY.name} is one of the 20 barangays of Las Piñas City, NCR. It was created on ${BRGY.founded}.\n\n• Land area: ${BRGY.landArea}\n• Population: ${BRGY.population} (PSA 2024 Census)\n• Punong Barangay: ${BRGY.captain}\n• Current term: ${BRGY.term}`,
        quickReplies: ["Our Mission", "Our Vision", "Visit Us", "Services"],
      };
    } else if (m.includes("mission")) {
      return {
        type: "bot",
        text: "🎯 Our Mission:\n\nTo provide efficient, responsive, and inclusive barangay services that promote the welfare and development of every resident of Pamplona Dos.\n\nWe are committed to delivering accessible, transparent, and quality services that address the needs of our community.",
        quickReplies: ["Our Vision", "Our Values", "Contact Info", "Services"],
      };
    } else if (m.includes("vision")) {
      return {
        type: "bot",
        text: "🌟 Our Vision:\n\nA progressive, peaceful, and united Barangay Pamplona Dos where every resident enjoys a high quality of life through collaborative governance and sustainable development.",
        quickReplies: ["Our Mission", "Our Values", "Contact Info", "Services"],
      };
    } else if (m.includes("values")) {
      return {
        type: "bot",
        text: "💎 Our Values:\n\n• Malasakit - We care deeply for our residents\n• Transparency - We operate with honesty and openness\n• Unity - We work together as one community\n• Service Excellence - We deliver the best for our barangay",
        quickReplies: ["Our Mission", "Our Vision", "Visit Us", "Contact Info"],
      };
    } else if (
      m.includes("visit") ||
      m.includes("address") ||
      m.includes("location") ||
      m.includes("where")
    ) {
      return {
        type: "bot",
        text: `📍 Visit Us:\n\n${BRGY.name} Hall\nAquarius St., Pamplona Park Subd.\nPamplona Dos, ${BRGY.city}\nPhilippines\n\nWe welcome all residents to visit us for any barangay concerns, assistance, or inquiries.`,
        quickReplies: ["Office Hours", "Contact Info", "Services", "About Us"],
      };
    } else if (
      word("hello") ||
      word("hi") ||
      word("hey") ||
      m.includes("kumusta")
    ) {
      return {
        type: "bot",
        text: "Hello! 👋 Kumusta! How can I help you with Barangay Pamplona Dos services today?",
        quickReplies: MAIN_MENU,
      };
    } else if (m.includes("clearance")) {
      return {
        type: "bot",
        text: "📋 Barangay Clearance:\n\nRequirements:\n• Valid ID\n• Cedula\n• Recent Photo (1x1)\n• Processing Fee\n\nVisit the Barangay Hall during office hours. Please call ahead to confirm current requirements and fees.",
        quickReplies: ["Office Hours", "Contact Info", "Services", "Cedula"],
      };
    } else if (m.includes("cedula") || m.includes("community tax")) {
      return {
        type: "bot",
        text: "📄 Cedula (Community Tax Certificate):\n\nRequirements:\n• Valid ID\n• Proof of income (for employed)\n• Real property declaration (if applicable)\n• Payment of tax\n\nPlease call the Barangay Hall to confirm if it is issued on-site.",
        quickReplies: ["Office Hours", "Contact Info", "Services", "Clearance"],
      };
    } else if (m.includes("business")) {
      return {
        type: "bot",
        text: "🏢 Business Permit:\n\nThe barangay provides clearance/endorsement for your city business permit application.\n\nRequirements:\n• Valid ID\n• Business registration documents\n• Proof of business location\n• Barangay Clearance\n\nPlease call the Barangay Hall to confirm current requirements.",
        quickReplies: ["Office Hours", "Contact Info", "Services", "Clearance"],
      };
    } else if (m.includes("residency") || m.includes("residence")) {
      return {
        type: "bot",
        text: "🏠 Certificate of Residency:\n\nRequirements:\n• Valid ID\n• Proof of residency (utility bills, rental contract, etc.)\n• Barangay Clearance\n• Processing Fee\n\nPlease call the Barangay Hall to confirm current requirements.",
        quickReplies: ["Office Hours", "Contact Info", "Services", "Clearance"],
      };
    } else if (m.includes("good moral") || m.includes("moral")) {
      return {
        type: "bot",
        text: "✅ Good Moral Certificate:\n\nRequirements:\n• Valid ID\n• Barangay Clearance\n• Purpose of certificate (employment, school, etc.)\n• Processing Fee\n\nVisit the Barangay Hall for processing.",
        quickReplies: ["Office Hours", "Contact Info", "Services", "Clearance"],
      };
    } else if (m.includes("indigency")) {
      return {
        type: "bot",
        text: "📄 Certificate of Indigency:\n\nRequirements:\n• Valid ID\n• Proof of residency\n• Purpose of certificate (medical, educational, legal aid, etc.)\n\nSubject to barangay assessment and verification. Visit the Barangay Hall for processing.",
        quickReplies: ["Office Hours", "Contact Info", "Services", "Clearance"],
      };
    } else if (
      m.includes("blotter") ||
      m.includes("incident") ||
      m.includes("report")
    ) {
      return {
        type: "bot",
        text: `📝 Barangay Blotter:\n\nYou can file a blotter report for incidents such as theft, disturbances, or minor disputes within the barangay.\n\nVisit the Barangay Hall and bring a valid ID and any evidence or witnesses, if available.\n\nFor emergencies, call 911 or our hall at ${BRGY.phone}.`,
        quickReplies: ["Emergency", "Mediation", "Contact Info", "Services"],
      };
    } else if (
      m.includes("mediation") ||
      m.includes("lupon") ||
      m.includes("dispute")
    ) {
      return {
        type: "bot",
        text: "⚖️ Mediation (Lupong Tagapamayapa):\n\nWe help resolve disputes between neighbors, families, or community members through mediation and conciliation.\n\nVisit the Barangay Hall to file a complaint or request mediation. Bring relevant documents.",
        quickReplies: ["Office Hours", "Contact Info", "Services"],
      };
    } else if (m.includes("health") || m.includes("medical")) {
      return {
        type: "bot",
        text: `🏥 Health Services:\n\nFor health programs and schedules (consultations, immunization, prenatal care), please contact the Barangay Hall at ${BRGY.phone} or visit during office hours.`,
        quickReplies: ["Office Hours", "Contact Info", "Services"],
      };
    } else if (m.includes("senior") || m.includes("pwd")) {
      return {
        type: "bot",
        text: "👴👵♿ Senior Citizen & PWD Assistance:\n\nThe barangay can assist with referrals and requirements for Senior Citizen and PWD IDs and benefits.\n\nVisit during office hours with your documents (birth certificate; medical certificate for PWD).",
        quickReplies: ["Office Hours", "Contact Info", "Services"],
      };
    } else if (word("id") || m.includes("barangay id")) {
      return {
        type: "bot",
        text: "🪪 Barangay ID:\n\nPlease visit the Barangay Hall for ID processing during office hours. Bring a valid ID and proof of residency.",
        quickReplies: ["Office Hours", "Contact Info", "Services", "Clearance"],
      };
    } else if (m.includes("service")) {
      return {
        type: "bot",
        text: "🏛️ Barangay Services:\n\n• Barangay Clearance\n• Cedula (Community Tax Certificate)\n• Business Permit Clearance\n• Certificate of Indigency\n• Certificate of Residency\n• Good Moral Certificate\n• Barangay Blotter\n• Mediation (Lupong Tagapamayapa)\n• Senior Citizen & PWD Assistance\n\nWhat specific service do you need?",
        quickReplies: ["Clearance", "Cedula", "Business Permit", "Indigency"],
      };
    } else if (
      m.includes("contact") ||
      m.includes("phone") ||
      m.includes("email") ||
      m.includes("call")
    ) {
      return {
        type: "bot",
        text: `📞 Contact Us:\n\n• Phone: ${BRGY.phone}\n• Email: ${BRGY.email}\n• Office: Aquarius St., Pamplona Park Subd., Pamplona Dos, Las Piñas City\n\nFeel free to reach out through any of these channels!`,
        quickReplies: ["Office Hours", "Visit Us", "Services", "Our Mission"],
      };
    } else if (
      m.includes("hour") ||
      m.includes("open") ||
      m.includes("schedule")
    ) {
      return {
        type: "bot",
        text: `🕐 Office Hours:\n\n${BRGY.hours}\n\n⚠️ For emergencies, call 911 or the Barangay Hall at ${BRGY.phone}.\n\nNeed help with a specific service?`,
        quickReplies: ["Services", "Contact Info", "Visit Us"],
      };
    } else if (m.includes("emergency") || m.includes("hotline")) {
      return {
        type: "bot",
        text: `🚨 Emergency Contacts:\n\nNational Emergency Hotline: 911\nBarangay Hall: ${BRGY.phone}\n\nFor barangay concerns, contact our hall during office hours.`,
        quickReplies: ["Contact Info", "Services", "Office Hours"],
      };
    } else if (m.includes("thank") || m.includes("salamat")) {
      return {
        type: "bot",
        text: "Walang anuman! You're welcome! 😊 Feel free to ask if you need any other assistance. Mabuhay ang Pamplona Dos!",
        quickReplies: ["Our Mission", "Services", "Contact Info"],
      };
    }

    return {
      type: "bot",
      text: `Thank you for your message! For detailed information, please visit ${BRGY.name} Hall during office hours or call us at ${BRGY.phone}. We're here to serve you!`,
      quickReplies: ["About Us", "Services", "Contact Info", "Office Hours"],
    };
  };

  return (
    <>
      {/* Floating Promo Message */}
      {showPromoMessage && !isChatOpen && (
        <div className="fixed bottom-24 right-6 bg-white rounded-2xl shadow-2xl z-50 p-4 max-w-xs border-2 border-brand-gold-500 animate-bounce-slow">
          <button
            onClick={() => setShowPromoMessage(false)}
            className="absolute -top-2 -right-2 bg-brand-gold-500 text-white rounded-full p-1 hover:bg-brand-red-600 transition-colors shadow-lg"
            aria-label="Close message"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-start gap-3">
            <div className="bg-brand-gold-100 p-2 rounded-full flex-shrink-0">
              <Image
                src="/pamplona_dos.png"
                alt="Pamplona Dos Logo"
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
                priority
              />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-sm mb-1">
                We're Live! 💬
              </p>
              <p className="text-gray-600 text-xs">
                Chat with us now for quick assistance in Pamplona Dos!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chatbot Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-brand-gold-500 from-brand-gold-600 to-brand-gold-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 group"
        aria-label="Open Chatbot"
      >
        {isChatOpen ? (
          <X className="w-7 h-7" />
        ) : (
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1.5">
            <Image
              src="/pamplona_dos.png"
              alt="Pamplona Dos Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain animate-pulse"
              priority
            />
          </div>
        )}
        <span className="absolute -top-1 -right-1 bg-brand-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
          1
        </span>
      </button>

      {/* Chatbot Window */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[550px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-brand-gold-600 to-brand-gold-500 text-white p-4 flex items-center gap-3">
            <div className="bg-white p-2 rounded-full">
              <Image
                src="/pamplona_dos.png"
                alt="Pamplona Dos Logo"
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
                priority
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">Pamplona Dos Assistant</h3>
              <p className="text-xs text-brand-gold-100">
                Barangay Pamplona Dos, Las Piñas City
              </p>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="hover:bg-brand-gold-700 p-1 rounded transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div key={index}>
                <div
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl break-words ${
                      message.type === "user"
                        ? "bg-brand-gold-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 shadow-sm rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line break-words overflow-wrap-anywhere">
                      {message.text}
                    </p>
                  </div>
                </div>

                {/* Quick Reply Buttons */}
                {message.type === "bot" && message.quickReplies && (
                  <div className="mt-3 flex flex-wrap gap-2 justify-start">
                    {message.quickReplies.map((reply, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickReply(reply)}
                        className="px-4 py-2 text-xs bg-white border-2 border-brand-gold-500 text-brand-gold-600 rounded-full hover:bg-brand-gold-500 hover:text-white transition-colors duration-200 shadow-sm"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-gold-500 focus:border-transparent text-sm"
              />
              <button
                onClick={() => handleSendMessage()}
                className="bg-brand-gold-600 text-white p-2 rounded-full hover:bg-brand-gold-700 transition-colors"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Responsive Styles */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        @media (max-width: 640px) {
          .fixed.bottom-24.right-6.w-96 {
            width: calc(100vw - 2rem);
            right: 1rem;
            left: 1rem;
            bottom: 5rem;
            height: calc(100vh - 10rem);
            max-height: 550px;
          }
          .fixed.bottom-24.right-6.max-w-xs {
            right: 1rem;
            left: 1rem;
            max-width: calc(100vw - 2rem);
            bottom: 6rem;
          }
          .fixed.bottom-6.right-6 {
            bottom: 1rem;
            right: 1rem;
          }
        }
      `}</style>
    </>
  );
}
