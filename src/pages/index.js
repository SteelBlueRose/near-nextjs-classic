import home_styles from '@/styles/Home.module.css';
import banner_styles from '@/styles/Banner.module.css';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { NearContext } from '@/context';

export default function Home() {
  const { signedAccountId, wallet } = useContext(NearContext);
  const handleCLick = () => {
    if (signedAccountId) {
      router.push('/home');
    } else if (!signedAccountId) {
      wallet.signIn();
    }
  };
  const router = useRouter();

  return (
    <main className={home_styles.main}>
      <div className={home_styles.container}>
        <h1 className={home_styles.title}>Decentralized</h1>
        <h2 className={home_styles.subtitle}>time management system</h2>
        <p className={home_styles.description}>
          Plan your everyday and boost productivity with TimeTactician!
        </p>
        <div className={banner_styles.banner} onClick={handleCLick}>
          <p className={banner_styles.bannerText}>
            Use TimeTactician from any browser to manage your tasks and save one day every week.
          </p>
        </div>
      </div>
    </main>
  );
}
