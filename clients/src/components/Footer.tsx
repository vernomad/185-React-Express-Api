import { Tooltip } from './page/Tooltip';
import { useUser } from '../useUser';
import LogoutHacker from './LogoutHacker';

export default function Footer() {
const {user} = useUser()
    return (
        <footer className="">
           {user && user.id === "hack" && (
           <LogoutHacker />
          )}
          <div className="social-row">
           
            <a
              href="https://github.com/vernomad"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon-base "
                data-tooltip-offset={20}
                data-tooltip-content="My GitHub profile"
                data-tooltip-id="footer-tooltip"
                aria-label="My GitHub profile"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                <path d="M9 18c-4.51 2-5-2-7-2"></path>
              </svg>
            </a>
            <a
              href="https://twitter.com/vernomad"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon-base"
                data-tooltip-offset={20}
                data-tooltip-content="My Twitter profile"
                data-tooltip-id="footer-tooltip"
                aria-label="My Twitter profile"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
            <a
              href="https://aedin.com/in/vernomad"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon-base"
                data-tooltip-offset={20}
                data-tooltip-content="My aedin profile"
                data-tooltip-id="footer-tooltip"
                aria-label="My aedin profile"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect width="4" height="12" x="2" y="9"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >

 <svg 
      version="1.0" 
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg" 
      // xmlnsXa="http://www.w3.org/1999/xa" 
      viewBox="0 0 100 100" 
      xmlSpace="preserve"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="6"
      strokeMiterlimit="10"
      className="icon-base"
      data-tooltip-offset={20}
      data-tooltip-content="Visit us on Facebook"
      data-tooltip-id="footer-tooltip"
      aria-label="Our Facebook profile"
      >
      <g>
        <path fill="none" stroke="currentColor" strokeWidth="6" strokeMiterlimit="10" d="M38,95V43.2H27.1v-8.3H38V32c0-8.4,2.4-16.1,9-21
        c5.3-4,12.4-5.6,19-5.6c5,0,9.3,0.9,12,1.7l-1.9,8.4c-2.1-0.7-5-1.4-9-1.4C55,14.2,52,22.4,52,31.6v3.2h18.8v8.3H52V95H38z"/>
      </g>
    </svg>

            </a>
          </div>
          <div className="copyright-row">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className=""
              aria-label="Copyright"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M15 9.354a4 4 0 1 0 0 5.292"></path>
            </svg>
            <a
              href="https://www.digital.govt.nz/standards-and-guidance/design-and-ux/usability/copyright-statements-for-websites/"
              rel="noreferrer"
              id="a_copyright"
              target="_blank"
            >
              <span className="text-xs xs:text-sm ">
                2023 | 185R |{" "}
              </span>{" "}
            </a>
            <a
              href="https://toobeone.one"
              rel="noreferrer"
              id="a_web_developer"
              target="_blank"
              data-tooltip-id="footer-tooltip"
              data-tooltip-content="https://VA-Design"
              data-tooltip-offset={20}
            >
              <span className="">
                Design\V/A\
              </span>
            </a>
          </div>
         
          <Tooltip id="footer-tooltip" className="footer-tooltip" data-tooltip-place="top" offset={10} />
        </footer>
    );
}
