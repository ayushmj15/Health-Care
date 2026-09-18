import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/lib/maps";

/**
 * Call + WhatsApp buttons for a doctor or hospital contact.
 * Renders nothing when no phone number is available.
 */
export function ContactButtons({
  phone,
  whatsapp,
  message,
  size = "sm",
  className,
}: {
  phone?: string | null;
  whatsapp?: string | null;
  message?: string;
  size?: "sm" | "icon";
  className?: string;
}) {
  const wa = whatsapp ?? phone;
  if (!phone && !wa) return null;
  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className ?? ""}`}>
      {phone && (
        <Button size={size} variant="outline" asChild className="h-8 px-2.5 text-xs">
          <a href={`tel:${phone.replace(/\D/g, "")}`} aria-label={`Call ${phone}`}>
            <Phone className="h-3.5 w-3.5" />
            {size !== "icon" && "Call"}
          </a>
        </Button>
      )}
      {wa && (
        <Button size={size} variant="outline" asChild className="h-8 px-2.5 text-xs text-emerald-600 hover:text-emerald-600">
          <a
            href={whatsappUrl(wa, message)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp ${wa}`}
          >
            <MessageCircle className="h-3.5 w-3.5" />
            {size !== "icon" && "WhatsApp"}
          </a>
        </Button>
      )}
    </div>
  );
}