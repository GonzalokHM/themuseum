import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>
        Contacto:
        <a
          href="https://www.linkedin.com/in/gonzalo-hernando-2973a2202/"
          className={styles.link}
        >
          LinkedIn
        </a>
        <span className={styles.contactInfo}> 📧 ghmdev@gmail.com</span>
      </p>
      <p>&copy; 2024 Museo Virtual Interactivo</p>
    </footer>
  );
};

export default Footer;
