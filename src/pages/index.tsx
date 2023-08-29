import { Inter } from 'next/font/google'
import Navigation from "@/components/Navigation/Navigation";
import Layout from "@/components/layout";
import Slider from "@/components/Slider/Slider";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div>
        <Layout>
            <Slider />
        </Layout>
    </div>
  )
}
