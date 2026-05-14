import { getContactSettings } from '../settings-actions';
import { ContactForm } from './contact-form';

export default async function ContactPage() {
  const { contact, openingHours } = await getContactSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Kontakt & Öffnungszeiten</h1>
      <p className="text-zinc-500 text-sm mb-8">Kontaktdaten und Geschäftszeiten für Ihre Website und den Footer.</p>
      <ContactForm initialContact={contact} initialHours={openingHours} />
    </div>
  );
}
