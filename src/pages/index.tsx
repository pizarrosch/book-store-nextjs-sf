import Layout from "@/components/layout";
import Slider from "@/components/Slider/Slider";
import MainContent from "@/components/Main/MainContent";
import Login from "@/components/Login/Login";
import {useEffect, useState} from "react";
import {bookData} from "@/components/Main/Books";
import {createContext, Provider} from "react";

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
