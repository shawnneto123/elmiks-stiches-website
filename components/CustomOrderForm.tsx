"use client";

import { useState, FormEvent } from "react";
import { getNextWhatsAppNumber } from "@/lib/whatsapp/roundRobin";

interface FormData {
  full_name: string;
  phone_number: string;
  measurements: string;
  fabric_choice: string;
  event_date: string;
  notes: string;
}

interface FormErrors {
  full_name?: string;
  phone_number?: string;
}

const INITIAL_FORM: FormData = {
  full_name: "",
  phone_number: "",
  measurements: "",
  fabric_choice: "",
  event_date: "",
  notes: "",
};

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.full_name.trim()) {
    errors.full_name = "Full name is required.";
  }

  if (!data.phone_number.trim()) {
    errors.phone_number = "Phone number is required.";
  } else {
    // Accept Nigerian numbers: 080.., 070.., 081.., 090.., 091.. or +234..
    const cleaned = data.phone_number.replace(/[\s\-()]/g, "");
    const isValid = /^(0[789][01]\d{8}|\+?234[789][01]\d{8})$/.test(cleaned);
    if (!isValid) {
      errors.phone_number = "Enter a valid Nigerian phone number (e.g. 08012345678).";
    }
  }

  return errors;
}

function buildCustomOrderMessage(data: FormData): string {
  const lines = [
    "Hello Elmik Stitches, I'd like to request a custom outfit:",
    "",
    `*Name:* ${data.full_name}`,
    `*Phone:* ${data.phone_number}`,
  ];

  if (data.measurements.trim()) {
    lines.push(`*Measurements:* ${data.measurements}`);
  }
  if (data.fabric_choice.trim()) {
    lines.push(`*Fabric Preference:* ${data.fabric_choice}`);
  }
  if (data.event_date) {
    lines.push(`*Event Date:* ${data.event_date}`);
  }
  if (data.notes.trim()) {
    lines.push("", `*Additional Notes:*`, data.notes);
  }

  lines.push("", "Please confirm availability and next steps.");

  return encodeURIComponent(lines.join("\n"));
}

export function CustomOrderForm() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation error on change
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Option (a) per PRD Section 5.1: route directly to WhatsApp
      const number = await getNextWhatsAppNumber();
      const message = buildCustomOrderMessage(formData);
      const url = `https://wa.me/${number}?text=${message}`;
      
      setIsSuccess(true);
      window.open(url, "_blank", "noopener,noreferrer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    "w-full max-w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-colors";

  return (
    <form className="space-y-5 w-full min-w-0 max-w-full" onSubmit={handleSubmit} noValidate>
      {/* Success Feedback Banner */}
      {isSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium flex items-center gap-2">
          <svg
            className="w-5 h-5 text-emerald-600 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>
            Custom order request prepared! Opening WhatsApp consultation now...
          </span>
        </div>
      )}

      {/* Full Name */}
      <div>
        <label htmlFor="co-full-name" className="block text-xs font-semibold text-neutral-700 mb-1.5">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="co-full-name"
          type="text"
          name="full_name"
          value={formData.full_name}
          onChange={(e) => updateField("full_name", e.target.value)}
          placeholder="Your full name"
          className={`${inputClasses} ${errors.full_name ? "border-red-400 ring-1 ring-red-400" : "border-neutral-200"}`}
        />
        {errors.full_name && (
          <p className="text-xs text-red-600 mt-1">{errors.full_name}</p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label htmlFor="co-phone" className="block text-xs font-semibold text-neutral-700 mb-1.5">
          Phone Number (WhatsApp) <span className="text-red-500">*</span>
        </label>
        <input
          id="co-phone"
          type="tel"
          name="phone_number"
          value={formData.phone_number}
          onChange={(e) => updateField("phone_number", e.target.value)}
          placeholder="e.g. 08012345678"
          className={`${inputClasses} ${errors.phone_number ? "border-red-400 ring-1 ring-red-400" : "border-neutral-200"}`}
        />
        {errors.phone_number && (
          <p className="text-xs text-red-600 mt-1">{errors.phone_number}</p>
        )}
      </div>

      {/* Measurements */}
      <div>
        <label htmlFor="co-measurements" className="block text-xs font-semibold text-neutral-700 mb-1.5">
          Body Measurements (Optional)
        </label>
        <textarea
          id="co-measurements"
          name="measurements"
          rows={3}
          value={formData.measurements}
          onChange={(e) => updateField("measurements", e.target.value)}
          placeholder="Bust, waist, hips, length, or general dress size..."
          className={`${inputClasses} border-neutral-200`}
        />
      </div>

      {/* Fabric Choice */}
      <div>
        <label htmlFor="co-fabric" className="block text-xs font-semibold text-neutral-700 mb-1.5">
          Fabric Preference (Optional)
        </label>
        <input
          id="co-fabric"
          type="text"
          name="fabric_choice"
          value={formData.fabric_choice}
          onChange={(e) => updateField("fabric_choice", e.target.value)}
          placeholder="e.g. Silk, Linen, Velvet, Lace, Mikado..."
          className={`${inputClasses} border-neutral-200`}
        />
      </div>

      {/* Event Date */}
      <div>
        <label htmlFor="co-event-date" className="block text-xs font-semibold text-neutral-700 mb-1.5">
          Event Date (Optional)
        </label>
        <input
          id="co-event-date"
          type="date"
          name="event_date"
          value={formData.event_date}
          onChange={(e) => updateField("event_date", e.target.value)}
          className={`${inputClasses} border-neutral-200`}
        />
      </div>

      {/* Additional Notes */}
      <div>
        <label htmlFor="co-notes" className="block text-xs font-semibold text-neutral-700 mb-1.5">
          Additional Notes &amp; Inspiration
        </label>
        <textarea
          id="co-notes"
          name="notes"
          rows={4}
          value={formData.notes}
          onChange={(e) => updateField("notes", e.target.value)}
          placeholder="Describe your desired outfit, silhouette preferences, or color combinations..."
          className={`${inputClasses} border-neutral-200`}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-brand-accent hover:bg-brand-accent-hover text-white py-3.5 text-sm font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-center"
      >
        {isSubmitting ? "Connecting to WhatsApp..." : "Submit Custom Request via WhatsApp"}
      </button>

      <p className="text-[11px] text-neutral-400 text-center leading-relaxed">
        Your details will be formatted into a message sent directly to our WhatsApp styling concierge.
      </p>
    </form>
  );
}
