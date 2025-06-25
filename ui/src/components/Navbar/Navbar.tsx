import {Link} from "react-router-dom";
import {useState} from "react";
import styles from './Navbar.module.css';
import logo from '../../assets/f5connect.png'


interface NavItem {
    label: string;
    href: string;
}

const NavItems: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Groups', href: '/groups' },
    { label: 'Profile', href: '/profile' },
    { label: 'Login | Signup', href: '/login_signup' }
];

const Navbar = () => {
    const [isMenuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen((prev) => !(prev));
    };

    return (
        <header className={styles.header}>
            <Link to={'/'} className={styles.logo}>
                <img src={logo} alt={"F5 Connect logo"} className={styles.logoImg} />
            </Link>
            <button onClick={toggleMenu} className={styles.menuBtn}>
                <svg xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="34px" fill="#434343">
                    <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
                </svg>
            </button>
            <nav className={styles.navbar}>
                <div className={styles.sidebarContainer}>
                    <ul className={`${styles.sidebar} ${isMenuOpen ? styles.show:''}`}>
                        <button onClick={toggleMenu} className={styles.menuBtn}>
                            <a href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="34px" fill="#434343">
                                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                                </svg>
                            </a>
                        </button>
                        {NavItems.map( item => (
                            <li key={item.href}>
                                <Link to={item.href} onClick={() => setMenuOpen(false)}>{item.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <ul className={styles.navmain}>
                    {NavItems.map( item => (
                        <li key={item.href}>
                            <Link to={item.href}>{item.label}</Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    )
}

export default Navbar;