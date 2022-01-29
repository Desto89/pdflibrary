import { useState } from 'react';
import { storage } from '../lib/firebase';
import { uploadBytes, ref } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { db } from '../lib/firebase';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

function AddFile(props) {

  const [ready, setReady] = useState(false)
  const [data, setData] = useState()
  const [name, setName] = useState()
  const [loading, setLoading] = useState(false)

  function sendFile() {
    setLoading(true)
    const storageRef = ref(storage, `${props.uid}/${name}`);
    uploadBytes(storageRef, data).then(async (snapshot) => {
      await setDoc(doc(db, props.uid, name), {
        name: name,
        page: 0
      }).then(()=>{
        props.changePage(null)
      });
    });
  }
  
  function checkFile(e) {
    if (e.target.files[0]) {
      setData(e.target.files[0])
      setName(e.target.files[0].name)
    } else {
      setData(null)
    }   
}


  return <div className='flex flex-col justify-center items-center h-screen'>
      <label htmlFor="contained-button-file">
        <input onChange={(e)=>{checkFile(e)}}className='hidden' accept="application/pdf" id="contained-button-file" multiple type="file" />
        <Button style={{margin: '2rem', fontSize:'1rem', width: '11rem', height: '3rem'}} variant="contained" component="span">
          Upload File
        </Button>
      </label>
      {data &&
        <div onClick={()=>{sendFile()}} className='flex justify-center items-center flex-col border-black border-2 rounded-2xl p-6 m-3'>
            <h1 className='mt-10 text-center font-bold mb-3'>{name}</h1>
            {loading === false &&
              <Button onClick={()=>{sendFile()}}style={{fontSize: '1.2rem', width: '150px', height: '60px', backgroundColor: '#007FFF'}} variant='contained'>Send File</Button>
            }
            {loading === true &&
              <div className='flex justify-center items-center'><CircularProgress style={{width: '60px', height: '60px'}} /></div>
            }
        </div>
      }
      <Button onClick={()=>{props.changePage(null)}}style={{margin: '2rem', fontSize: '1.2rem', width: '150px', height: '60px', backgroundColor: '#007FFF'}} variant='contained'>Menu</Button>
  </div>;
}

export default AddFile;
