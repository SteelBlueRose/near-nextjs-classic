import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import '@/styles/globals.css';
import { NearContext } from '@/context';
import { Navigation } from '@/components/navigation';
import { Wallet } from '@/wallets/near';
import { NetworkId, TodoListContract } from '@/config';

const wallet = new Wallet({ createAccessKeyFor: TodoListContract, networkId: NetworkId });

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
    </NearContext.Provider>
  );
}
