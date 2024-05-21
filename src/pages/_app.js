import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import '@/styles/globals.css';
import { NearContext } from '@/context';
import { Navigation } from '@/components/navigation';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Wallet } from '@/wallets/near';
import { NetworkId, HelloNearContract } from '@/config';

const wallet = new Wallet({ createAccessKeyFor: HelloNearContract, networkId: NetworkId });

export default function MyApp({ Component, pageProps }) {
  const [signedAccountId, setSignedAccountId] = useState('');
  const router = useRouter();
  useEffect(() => { 
    wallet.startUp(setSignedAccountId) 
    if (signedAccountId) {
      router.push('/home');
    } else {
      router.push('/');
    }
  }, []);

  return (
    <NearContext.Provider value={{ wallet, signedAccountId }}>
      <Navigation />
      <Component {...pageProps} />
      <SpeedInsights />
    </NearContext.Provider>
  );
}
