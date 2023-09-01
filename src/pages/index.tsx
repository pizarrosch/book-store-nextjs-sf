import { Inter } from 'next/font/google'
import Navigation from "@/components/Navigation/Navigation";
import Layout from "@/components/layout";
import Slider from "@/components/Slider/Slider";
import MainContent from "@/components/Main/MainContent";
import Login from "@/components/Login/Login";

const inter = Inter({ subsets: ['latin'] })

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
