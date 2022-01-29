import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../lib/firebase';
import CircularProgress from '@mui/material/CircularProgress';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from '../lib/firebase';
import axios from 'axios';

function ViewFiles(props) {

  const [books, setBooks] = useState(null)
  const [currentBook, setCurrentBook] = useState(null)

  useEffect(()=>{
    async function getBooks() {
    const dummyArr = []
    const q = query(collection(db, props.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      dummyArr.push(doc.data());
    });
    setBooks(dummyArr)
    }
    getBooks()
  },[])

  function openBook(name, page) {
    getDownloadURL(ref(storage, `${props.uid}/${name}`))
    .then((url) => {
      axios.post('https://pdflibserver.herokuapp.com/', {
        url: url
      })
      .then(function (response) {
        setCurrentBook(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  )}
  if (currentBook === null) {
    return <div>
      {books === null &&
        <div className='flex h-screen justify-center items-center'><CircularProgress style={{width: '60px', height: '60px'}} /></div>
      }
      {books !== null &&
        <div>
          {books.map((book)=>{
            return (
              <div key={book.name} className='m-auto sm:w-2/5 w-full'>
                <Accordion square={true}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                  <h1>{book.name}</h1>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Button onClick={()=>{openBook(book.name, book.page)}}style={{width:'5rem'}} variant='outlined' color='primary'>Open</Button>
                    <Button style={{width:'5rem', marginLeft:'10px'}} variant='outlined' color='error'>Delete</Button>
                  </AccordionDetails>
                </Accordion>
              </div>
            )
          })}
        </div>
      }
  </div>
  }
  else if (currentBook !== null) {
    const splittedBook = currentBook.data.split("\n\n")
    return (<div className='p-10'>
      {splittedBook.map((line)=>{
        return <div key={line}><h1>{` ${line} `}</h1></div>
      })}
    </div>)
  } else {
    return <h1>hey</h1>
  }
}

export default ViewFiles;
