import styles from '@/styles/app.module.css';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { NearContext } from '@/context';

export default function Home() {
  const { signedAccountId, wallet } = useContext(NearContext);
  const handleCLick = () => {
    if (signedAccountId) {
      router.push('/home')
    } else if (!signedAccountId){
      wallet.signIn();
    }
  }
  const router = useRouter();

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Decentralized</h1>
        <h2 className={styles.subtitle}>time management system</h2>
        <p className={styles.description}>
          Plan your everyday and boost productivity with TimeTactician!
        </p>
        <div className={styles.banner} onClick={handleCLick}>
          <p className={styles.bannerText}>
            Use TimeTactician from any browser to manage your tasks and save one day every week.
          </p>
        </div>
      </div>
    </main>
  );
}