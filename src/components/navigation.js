import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, useContext, useRef } from 'react';
import { NearContext } from '@/context';
import { useNear } from '@/hooks/useNear';
import CurrentDateTime from '@/components/CurrentDateTime';
import MainLogo from '/public/timetactician-milk-soft.svg';
import SettingsForm from '@/components/SettingsForm';
import styles from '@/styles/Navigation.module.css';

export const Navigation = () => {
  const { signedAccountId, wallet } = useContext(NearContext);
  const { workingHours, saveWorkingHours, shouldShowSettingsForm } = useNear(signedAccountId);
  const [label, setLabel] = useState('Loading...');
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLoginLogout = () => {
    if (signedAccountId) {
      setShowDropdown(!showDropdown);
    } else {
      wallet.signIn();
    }
  };

  const handleLogout = () => {
    wallet.signOut();
    router.reload();
  };

  const handleSettings = () => {
    setIsSettingsOpen(true);
    setShowDropdown(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (!wallet) return;

    if (signedAccountId) {
      setLabel(`${signedAccountId}`);
      router.push('/home');
    } else {
      setLabel('Login');
      router.push('/');
    }
  }, [signedAccountId, wallet]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (shouldShowSettingsForm) {
      setIsSettingsOpen(true);
    }
  }, [shouldShowSettingsForm]);

  return (
    <nav className={`navbar navbar-expand-lg bg-primary ${styles.navbar}`}>
      <div className="container-fluid">
        <div className={styles['navbar-left']}>
          <Link href="/" passHref>
            <Image priority src={MainLogo} alt="TimeTactician" width="220" height="40" className="d-inline-block align-text-top" />
          </Link>
        </div>
        <div className={styles['navbar-center']}>
          <CurrentDateTime />
        </div>
        <div className={styles['navbar-right']}>
          <button className={`btn btn-primary ${styles['planner-button']}`} onClick={() => router.push('/planner')}>Planner</button>
          <button className="btn btn-primary" onClick={handleLoginLogout}>
            {signedAccountId ? signedAccountId : 'Login'}
          </button>
          {showDropdown && (
            <div className={styles.dropdownMenu} ref={dropdownRef}>
              <button onClick={handleSettings}>Settings</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
          <SettingsForm 
            isOpen={isSettingsOpen} 
            onClose={() => setIsSettingsOpen(false)}
            saveWorkingHours={saveWorkingHours}
            initialWorkingHours={workingHours}
          />
        </div>
      </div>
    </nav>
  );
};
