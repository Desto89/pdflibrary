import Button from '@mui/material/Button';
import Link from 'next/link';

function About(props) {

  return <div>
      <h1 className='font-normal font-medium text-center font-bold mt-14 text-4xl'>PDF Library</h1>
      <div className='font-normal font-medium text-center md:text-3xl p-16 sm:text-base'>
          <h2>PDF Library is a web app for storing your pdf files in cloud so
              you can access them on any device as long as you have internet connection.
              Also there is option to save progress when reading
              so that you won&apos;t need to scroll through entire book again.
              Currently app will only read text from your files so any pictures etc.
              won&apos;t appear.
            </h2>
            <h2 className='mt-14'>On desktop books will render just fine but on smaller devices you need to scale text
                using &quot;Up&quot; and &quot;Down&quot; buttons to fit screen. 
            </h2>
            <h2 className='mt-14'>If you like this app, you can check my other projects on my GitHub.</h2>
            <div className='flex justify-center mt-14'>
                <Link href='https://github.com/Desto89' passHref><Button style={{fontSize: '1.2rem', width: '150px', height: '60px', backgroundColor: 'black', margin: '10px'}} variant='contained'>Github</Button></Link>
                <Button onClick={()=>{props.changePage(null)}}style={{fontSize: '1.2rem', width: '150px', height: '60px', backgroundColor: '#007FFF', margin: '10px'}} variant='contained'>Menu</Button>
            </div>
      </div>
  </div>;
}

export default About;
