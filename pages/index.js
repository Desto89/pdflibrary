import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';
import About from '../components/About';
import { useState } from 'react';
import { auth } from '../lib/firebase';
import { signInWithRedirect, GoogleAuthProvider, signOut} from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Home() {

  const [currentPage, setCurrentPage] = useState(null)
  const [user, loading, error] = useAuthState(auth);

  function changePage(page){
    setCurrentPage(page)
  }

const provider = new GoogleAuthProvider

  function login() {
    signInWithRedirect(auth, provider)
      .then((result) => {
        const user1 = result.user;
        console.log(user1)
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
    });
  }

  function signOutUser() {
    console.log('hey')
    signOut(auth).then(() => {
    }).catch((error) => {
      console.log(error)
    });
  }
    if (!user) {
      return (
        <div className={styles.loginPage}>
          <h1>PDF Library</h1>
          <div onClick={()=>{login()}} className={styles.loginBtn}>
            <h2>Login with Google</h2>
          </div>
        </div>
      )
    } else {
    if (currentPage === null) {
      return (
        <div className={styles.main}>
          <Head>
            <title>PDF Library</title>
            <meta name="Library for your pdfs." content="pdfs" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
        <h1>Hello, {user.displayName.split(' ')[0]}</h1>
        <div className={styles.menu}>
          <div className={styles.menuIcons}>
            <div style={{backgroundColor: '#4229cf'}} className={styles.menuItem}>
              <div className={styles.icon}>
                <VisibilityIcon style={{fontSize: 100}} />
              </div>
              <div className={styles.menuName}>
                <h1>View PDF's</h1>
              </div>
            </div>
            <div style={{backgroundColor: '#1c9c7a'}} className={styles.menuItem}>
              <div className={styles.icon}>
                <AddIcon style={{fontSize: 100}} />
              </div>
              <div className={styles.menuName}>
                <h1>Add PDF</h1>
              </div>
            </div>
          </div>
          <div className={styles.menuIcons}>
            <div onClick={()=>{setCurrentPage('about')}} style={{backgroundColor: '#843ca3'}} className={styles.menuItem}>
              <div className={styles.icon}>
                <InfoIcon style={{fontSize: 100}} />
              </div>
              <div className={styles.menuName}>
                <h1>About</h1>
              </div>
            </div>
            <div onClick={()=>{signOutUser()}} style={{backgroundColor: '#ad2121'}} className={styles.menuItem}>
              <div className={styles.icon}>
                <LogoutIcon style={{fontSize: 100}} />
              </div>
              <div className={styles.menuName}>
                <h1>Logout</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } else if (currentPage === 'about') {
      return (
        <div className={styles.about}>
          <About changePage={changePage}/>
        </div>
    )
  }
}
}
