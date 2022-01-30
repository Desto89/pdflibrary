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
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SaveIcon from '@mui/icons-material/Save';

function ViewFiles(props) {

  const [books, setBooks] = useState(null)
  const [currentBook, setCurrentBook] = useState(null)
  const [loading, setLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(false) 

  const actions = [
    { icon: <VisibilityIcon />, name: 'Dark Mode', click: function() {darkMode ? setDarkMode(false) : setDarkMode(true)}},
    { icon: <SaveIcon />, name: 'Save', click: function() {props.changePage(null)}},
    { icon: <CloseIcon />, name: 'Exit', click: function() {props.changePage(null)}}
  ];

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
    setLoading(true)
    getDownloadURL(ref(storage, `${props.uid}/${name}`))
    .then((url) => {
      axios.post('https://pdflibserver.herokuapp.com/', {
        url: url
      })
      .then(function (response) {
        setCurrentBook(response);
        setLoading(false)
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
                  <AccordionDetails className='flex'>
                    <Button onClick={()=>{openBook(book.name, book.page)}}style={{width:'5rem'}} variant='outlined' color='primary'>Open</Button>
                    <Button style={{width:'5rem', marginLeft:'10px'}} variant='outlined' color='error'>Delete</Button>
                  </AccordionDetails>
                </Accordion>
              </div>
            )
          })}
          {loading &&
              <div className='mt-8 flex justify-center items-center'>
                  <div className='flex justify-center items-center'><CircularProgress style={{width: '30px', height: '30px'}} /></div>
                    <h1 className='ml-6 text-xl font-semibold'>Please wait...</h1>
              </div>
            }
          <div className='flex justify-center mt-8'>
            <Button onClick={()=>{props.changePage(null)}}style={{fontSize: '1.2rem', width: '150px', height: '60px', backgroundColor: '#007FFF'}} variant='contained'>Menu</Button>
          </div>
        </div>
      }
  </div>
  }
  else if (currentBook !== null) {
    const splittedBook = currentBook.data.split("\n\n")
    return (<div className={darkMode ? 'bg-black absolute text-4xl p-10' : 'absolute text-4xl p-10'}>
       <SpeedDial FabProps={{ size: "large", style: { backgroundColor: "blue" } }}
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'fixed', bottom: 25, left: 25 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction FabProps={{ size: "large", style: { color: 'white', backgroundColor: "blue" } }}
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.click}
          />
        ))}
      </SpeedDial>
      {splittedBook.map((line)=>{
        return <div key={line}><h1 className={darkMode ? 'text-white' : 'text-black'}>{line}</h1></div>
      })}
    </div>)
  }
}

export default ViewFiles;
