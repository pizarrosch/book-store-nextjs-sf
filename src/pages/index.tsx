import Layout from "@/components/layout";
import Slider from "@/components/Slider/Slider";
import MainContent from "@/components/Main/MainContent";
import Login from "@/components/Login/Login";
import {useState} from "react";

export default function Home() {

    const [showLogin, setShowLogin] = useState(false);

    function handleShowLogin() {
        if (!showLogin) {
            setShowLogin(true)
        } else {
            setShowLogin(false);
        }
    }

  return (
    <div>
        <Layout handleShowLogin={handleShowLogin}>
            {showLogin && <Login/>}
            <Slider />
            <MainContent />
        </Layout>
    </div>
  )
}
