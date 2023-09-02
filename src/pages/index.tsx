import Layout from "@/components/layout";
import Slider from "@/components/Slider/Slider";
import MainContent from "@/components/Main/MainContent";
import Login from "@/components/Login/Login";

export default function Home() {

  return (
    <div>
        <Layout>
            <Login />
            <Slider />
            <MainContent />
        </Layout>
    </div>
  )
}
