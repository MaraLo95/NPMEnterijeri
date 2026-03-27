import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>Nameštaj po meri Enterijeri</h3>
            <p>
              Kada je u pitanju opremanje doma, kancelarije ili poslovnog prostora, 
              NPM Enterijeri je najbolji način da dobijete savršeno rešenje koje odgovara 
              vašem stilu, potrebama i dimenzijama prostora.
            </p>
          </div>

          <div className="footer-social">
            <a href="https://www.facebook.com/npm.enterijeri" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="https://www.instagram.com/npm.enterijeri/" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-instagram"></i>
            </a>
          </div>

          <div className="footer-bottom">
            <p className="copyright">
              <strong>Nameštaj po meri</strong> &copy; {currentYear}. Sva prava zadržana.
            </p>
            <p className="location">Čukarica, Beograd</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer




