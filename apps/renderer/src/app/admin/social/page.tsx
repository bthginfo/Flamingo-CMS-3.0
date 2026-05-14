import { getContactSettings } from '../settings-actions';
import { SocialForm } from './social-form';

export default async function SocialPage() {
  const { socialLinks } = await getContactSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Social Media</h1>
      <p className="text-zinc-500 text-sm mb-8">Verlinken Sie Ihre Social-Media-Profile.</p>
      <SocialForm initial={socialLinks} />
    </div>
  );
}
