import { Card, CardContent } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Card>
        <CardContent className="p-4 text-sm text-black/60">
          Add profile settings here (name, avatar, etc.).
        </CardContent>
      </Card>
    </div>
  );
}
