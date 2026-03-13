import Layout from '@/components/Layout/Layout';
import MainContent from '@/components/Main/MainContent';
import Slider from '@/components/Slider/Slider';

export default function Home() {
  return (
    <div>
      <Layout>
        <Slider />
        <MainContent />
      </Layout>
    </div>
  );
}
