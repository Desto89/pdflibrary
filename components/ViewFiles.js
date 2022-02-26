import { useEffect, useState } from 'react';
import { collection, query, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from '../lib/firebase';
import CircularProgress from '@mui/material/CircularProgress';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { ref, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from '../lib/firebase';
import axios from 'axios';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SaveIcon from '@mui/icons-material/Save';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { makeStyles } from "@material-ui/styles";


function ViewFiles(props) {

  const [books, setBooks] = useState(null)
  const [currentBookName, setCurrentBookName] = useState(null)
  const [currentBook, setCurrentBook] = useState(null)
  const [loading, setLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [savedPage, setSavedPage] = useState(0)
  const [customScale, setCustomScale] = useState(6)

  function changeScale(direction) {
    if (direction === 'up' && customScale < 9) {
      setCustomScale( customScale += 1)
    } else if (direction === 'down' && customScale > 4) {
        setCustomScale(customScale -= 1)
    }
  }

  const useStyles = makeStyles((theme) => ({
    tooltip: {
      ["@media (max-width:700px)"]: { fontSize: '80px' },
      ["@media (min-width:700px)"]: { fontSize: '30px' }
    }
  }));
  
  const classes = useStyles();

  const actions = [
    { icon: <ArrowDownwardIcon />, name: 'Scale Down', click: function() {changeScale('down')}},
    { icon: <ArrowUpwardIcon />, name: 'Scale Up', click: function() {changeScale('up')}},
    { icon: <VisibilityIcon />, name: 'Dark Mode', click: function() {darkMode ? setDarkMode(false) : setDarkMode(true)}},
    { icon: <SaveIcon />, name: 'Save', click: function() {alert('To save progress just click on text. App with scroll to current paragraph when you open this book next time.')}},
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

  useEffect(()=>{
    if (currentBook) {
      try {
        document.getElementById(savedPage ? savedPage : 0).scrollIntoView()
      } catch {}
      
    }
  },[currentBook])

  function deleteBook(book, uid, index) {
    setLoading(true)
    const deleteRef = ref(storage, `${uid}/${book}`)
    deleteObject(deleteRef).then(() => {
      deleteDoc(doc(db, uid, book));
      const dummyArr = books
      dummyArr.splice(index, 1)
      setBooks(dummyArr)
      setLoading(false)
    }).catch((error) => {
      console.log(error)
    });
  }

  function openBook(name,page) {
    setSavedPage(page)
    setLoading(true)
    setCurrentBookName(name)
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

  async function saveProgress(page) {
    const pageRef = doc(db, props.uid, currentBookName);
    await updateDoc(pageRef, {
      page: page
    });
    alert('Progress saved.')
  }

  if (currentBook === null) {
    return <div>
      {books === null &&
        <div className='flex h-screen justify-center items-center'><CircularProgress style={{width: '60px', height: '60px'}} /></div>
      }
      {books !== null &&
        <div>
          {books.map((book, index)=>{
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
                    <Button onClick={()=>{openBook(book.name, book.page)}} style={{width:'5rem'}} variant='outlined' color='primary'>Open</Button>
                    <Button onClick={()=>{deleteBook(book.name, props.uid, index)}} style={{width:'5rem', marginLeft:'10px'}} variant='outlined' color='error'>Delete</Button>
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
    return (
    <div className={darkMode ? 'bg-black absolute' : 'absolute'}>       
       <SpeedDial FabProps={{style: { backgroundColor: "blue" } }}
        ariaLabel="SpeedDial"
        sx={{ transform: {xs: 'scale(4)', md: 'scale(1.5)'}, position: 'fixed', bottom: {xs: 600, md: 150}, right: {xs: 150, md: 100 }}}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction FabProps={{style: { color: 'white', backgroundColor: "blue" } }}
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.click}
            TooltipClasses={classes}
          />
        ))}
      </SpeedDial>
      {splittedBook.map((line, index)=>{
        return <h1 id={index} onClick={()=>{saveProgress(index)}} key={index} style={{width: `${customScale}0%`}} className={darkMode ? 'md:p-6 md:w-8/12 p-12 md:m-auto ml-16 text-8xl md:text-2xl text-white' : 'md:p-6 md:w-8/12 p-12 md:m-auto ml-16 text-8xl md:text-2xl text-black'}>{line}</h1>
      })}
    </div>)
  }
}

export default ViewFiles;
