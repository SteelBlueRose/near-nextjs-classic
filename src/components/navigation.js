import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import { NearContext } from '@/context';
import CurrentDateTime from '@/components/CurrentDateTime';
import MainLogo from '/public/timetactician-milk-soft.svg';
import styles from '@/styles/Navigation.module.css'; // Імпорт нових стилів

export const Navigation = () => {
  const { signedAccountId, wallet } = useContext(NearContext);
  const [label, setLabel] = useState('Loading...');
  const router = useRouter();

  const handleCLick = () => {
    if (signedAccountId) {
      wallet.signOut();
      setLabel(`Logout ${signedAccountId}`);
    } else if (!signedAccountId){
      wallet.signIn();
      setLabel('Login');
      router.push('/');
    }
  }

  useEffect(() => {
    if (!wallet) return;

    if (signedAccountId) {
      setLabel(`Logout ${signedAccountId}`);
      router.push('/home');
    } else {
      setLabel('Login');
      router.push('/');
    }
  }, [signedAccountId, wallet]);

  return (
    <nav className={`navbar navbar-expand-lg bg-primary ${styles.navbar}`}>
      <div className="container-fluid">
        <Link href="/" passHref>
          <Image priority src={MainLogo} alt="TimeTactician" width="220" height="40" className="d-inline-block align-text-top" />
        </Link>
        <div className={styles['navbar-center']}>
          <CurrentDateTime />
        </div>
        <div className={`navbar-nav ${styles['navbar-nav']}`}>
          <button className="btn btn-dark fw-bold" onClick={handleCLick}> {label} </button>
        </div>
      </div>
    </nav>
  );
};
