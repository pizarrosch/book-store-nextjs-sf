import profileImage from '../../public/assets/profile-image.png';
import Layout from "@/components/layout";
import Image from "next/image";
import s from '../styles/profile.module.scss';

export default function Profile() {
    return (
        <Layout>
            <div className={s.root}>
                <div>
                    <div>
                        <h2>Profile</h2>
                        <Image src={profileImage} alt='profileImage' width={235} height={235}/>
                    </div>
                    <div>
                        <span>Your name</span>
                        <h2>Zaur Shomakhov</h2>
                        <span>Your email</span>
                        <h2>bayernsch89@work.com</h2>
                    </div>
                    <button>Edit profile</button>
                </div>
            </div>
        </Layout>
    )
}