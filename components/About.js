import styles from '../styles/About.module.scss'
import Link from 'next/link';

function About(props) {

  return <div className={styles.about}>
      <h1>PDF Library</h1>
      <p>by Desto</p>
      <div className={styles.aboutDesc}>
          <h2>Hi, PDF Library is a web app for storing your pdf files in cloud so
              you can access them on any device as long as you have internet connection.
              Currently app will only read text from your files so any pictures etc.
              won't appear.
            </h2>
            <h2>I made this mainly for myself because I was tired when I had to store
                all my books on diferent devices. Also there is option to save progress when reading
                so that you won't need to scroll through entire book again.
            </h2>
            <h2>If you like this app, you can check my other projects on my GitHub.</h2>
            <div className={styles.buttons}>
                <Link href='https://github.com/Desto89'><div className={styles.btn}><h1>Github</h1></div></Link>
                <div onClick={()=>{props.changePage(null)}} className={styles.btn}><h1>Menu</h1></div>
            </div>
      </div>
  </div>;
}

export default About;
