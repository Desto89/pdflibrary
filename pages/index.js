import Head from 'next/head'
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';
import About from '../components/About';
import { useState } from 'react';
import { auth } from '../lib/firebase';
import { signInWithRedirect, GoogleAuthProvider, signOut} from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import AddFile from '../components/AddFile'
import ViewFiles from '../components/ViewFiles';
import CircularProgress from '@mui/material/CircularProgress';



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
    if (!user && !loading) {
      return (
        <div className='flex flex-col text-center h-screen justify-center items-center'>
          <h1 className='font-Regular text-7xl font-bold'>PDF Library</h1>
          <div onClick={()=>{login()}} className='font-normal bg-blue-500 mt-6 rounded-2xl p-4 text-3xl text-white cursor-pointer'>
            <h2>Login with Google</h2>
          </div>
        </div>
      )
    } else if (loading) {
      return <div className='flex h-screen justify-center items-center'><CircularProgress style={{width: '100px', height: '100px'}} /></div>
    } else {
    if (currentPage === null) {
      return (
        <div>
          <Head>
            <title>PDF Library</title>
            <meta name="Library for your pdfs." content="pdfs" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
        <h1 className='font-Regular text-5xl font-bold text-center mt-20'>Hello, {user.displayName.split(' ')[0]}</h1>
        <div className='mt-14'>
          <div className='flex justify-center'>
            <div onClick={()=>{setCurrentPage('viewFiles')}} style={{backgroundColor: '#4229cf'}} className='p-8 rounded-2xl m-4 cursor-pointer shadow-xl hover:brightness-75'>
              <div className='text-white'>
                <VisibilityIcon style={{fontSize: 100}} />
              </div>
              <div className='text-white text-center font-medium text-xl'>
                <h1>View PDF&apos;s</h1>
              </div>
            </div>
            <div onClick={()=>{setCurrentPage('addFile')}} style={{backgroundColor: '#1c9c7a'}} className='p-8 rounded-2xl m-4 cursor-pointer shadow-xl hover:bg-blend-darken hover:brightness-75'>
              <div className='text-white'>
                <AddIcon style={{fontSize: 100}} />
              </div>
              <div className='text-white text-center font-medium text-xl'>
                <h1>Add PDF</h1>
              </div>
            </div>
          </div>
          <div className='flex justify-center'>
            <div onClick={()=>{setCurrentPage('about')}} style={{backgroundColor: '#843ca3'}} className='p-8 rounded-2xl m-4 cursor-pointer shadow-xl hover:brightness-75'>
              <div className='text-white'>
                <InfoIcon style={{fontSize: 100}} />
              </div>
              <div className='text-white text-center font-medium text-xl'>
                <h1>About</h1>
              </div>
            </div>
            <div onClick={()=>{signOutUser()}} style={{backgroundColor: '#ad2121'}} className='p-8 rounded-2xl m-4 cursor-pointer shadow-xl hover:brightness-75'>
              <div className='text-white'>
                <LogoutIcon style={{fontSize: 100}} />
              </div>
              <div className='text-white text-center font-medium text-xl'>
                <h1>Logout</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } else if (currentPage === 'about') {
      return (
        <div className=''>
          <About changePage={changePage}/>
        </div>
    )
  } else if (currentPage === 'addFile') {
    return (
      <div className=''>
          <AddFile changePage={changePage} uid={user.uid} />
      </div>
    )
  } else if (currentPage === 'viewFiles') {
      return (
        <div className=''>
          <ViewFiles changePage={changePage} uid={user.uid} />
        </div>
      )
  }
}
}
