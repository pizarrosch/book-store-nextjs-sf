import {useRouter} from 'next/navigation';
import {useState} from 'react';
import Login from '@/components/Login/Login';
import MainContent from '@/components/Main/MainContent';
import Slider from '@/components/Slider/Slider';
import Layout from '@/components/layout';
import {useAppSelector} from '@/pages/hooks';

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const credentials = useAppSelector((state) => state.userCredentials);
  const router = useRouter();

  function handleShowLogin() {
    if (!showLogin) {
      if (credentials.email && credentials.name) {
        router.push('/profile');
        setShowLogin(false);
      } else {
        setShowLogin(true);
      }
    } else {
      setShowLogin(false);
    }
  }

  return (
    <div>
      <Layout handleShowLogin={handleShowLogin}>
        {showLogin && <Login setShowLogin={setShowLogin} />}
        <Slider />
        <MainContent />
      </Layout>
    </div>
  );
}
