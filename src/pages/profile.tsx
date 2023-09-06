import profileImage from '../../public/assets/profile-image.png';
import Layout from "@/components/layout";
import Image from "next/image";
import s from '../styles/profile.module.scss';
import {useState} from "react";
import {useSelector} from "react-redux";

export default function Profile() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const userData: any = useSelector(state => state.userCredentials);

    return (
        <Layout>
            <div className={s.root}>
                <div className={s.userDataContainer}>
                    <div>
                        <h2 style={{textTransform: 'uppercase'}}>Profile</h2>
                        <Image src={profileImage} alt='profileImage' width={235} height={235}/>
                    </div>
                    <div className={s.contactData}>
                        <div>
                            <span className={s.infoSuperscript}>Your name</span>
                            <h2 className={s.name}>{userData.name}</h2>
                            <span className={s.infoSuperscript}>Your email</span>
                            <h2 className={s.email}>{userData.email}</h2>
                        </div>
                        <div>
                            <button className={s.editButton}>Edit profile</button>
                        </div>
                    </div>
                </div>
                <div className={s.description}>
                    <span className={s.infoSuperscript}>About me</span>
                    <p className={s.paragraph}>
                        Charles Dickens was an English writer and social critic. During his lifetime, his works enjoyed
                        unprecedented popularity. He is now considered a literary genius because he created some of the
                        world's best-known fictional characters and is regarded as the greatest novelist of the
                        Victorian era. His novels and short stories enjoy lasting popularity.
                    </p>
                </div>
            </div>
        </Layout>
    )
}