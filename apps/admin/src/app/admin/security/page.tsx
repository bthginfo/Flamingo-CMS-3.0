import { SecurityForm } from './security-form';

export default function SecurityPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Passwort & Zugang</h1>
      <p className="text-zinc-500 text-sm mb-8">Ändern Sie Ihr Admin-Passwort.</p>
      <SecurityForm />
    </div>
  );
}
