import '@/css/global.css';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import ClientQueryProvider from '@/providers/ClientQueryProvider';
import { AppConfig } from '@/utils/AppConfig';

export default function RootLayout(props: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!AppConfig.locales.includes(props.params.locale)) notFound();

  const messages = useMessages();

  return (
    <html lang={props.params.locale}>
      <body>
        <NextIntlClientProvider locale={props.params.locale} messages={messages}>
          <ClientQueryProvider>{props.children}</ClientQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export const runtime = 'edge';