import { Outlet } from "react-router-dom";
import AppNav from "./AppNav";
import Logo from "./Logo";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />

      <Outlet />

      <footer className={styles.footer}>
        <p className={styles.copuright}>
          @ Copyright {new Date().getFullYear()} by Mos
        </p>
      </footer>
    </div>
  );
};

export default Sidebar;
