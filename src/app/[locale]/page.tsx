import { useLocale } from 'next-intl';

export default function HomePage() {
  const locale = useLocale();

  return (
    <div>
      <h1>Welcome to Home ({locale})</h1>
    </div>
  );
}