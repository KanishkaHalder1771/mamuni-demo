import React, { Component, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import './App.scss';
import AppRoutes from './AppRoutes';
import Navbar from './shared/Navbar';
import Sidebar from './shared/Sidebar';
import SettingsPanel from './shared/SettingsPanel';
import Footer from './shared/Footer';
import { withTranslation } from "react-i18next";
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import ClientReports from './Client/Clientreports';

const App = () => {

  let navbarComponent = <Navbar />;
  let sidebarComponent = <Sidebar />;
  let SettingsPanelComponent = <SettingsPanel />;
  let footerComponent = <Footer />;

  const [userid, setuserid] = useState(null);
  const [photo, setphoto] = useState(null);
  const [uidd, setuid] = useState(null);
  const [email, setemail] = useState(null);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        setuid(uid);
        setphoto(user.photoURL);
        setuserid(user.uid);
        setemail(user.email);
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  }, []);



  return (
    <>
      {email === "test@gmail.com" ? (
        <div className="container-scroller">
          {userid != null && <Navbar photo={photo} />}
          <div className="container-fluid page-body-wrapper">
            {userid != null && sidebarComponent}
            <div className="main-panel">
              {(userid != null) && SettingsPanelComponent}
              <div className="content-wrapper">
                <AppRoutes />
                {userid != null && footerComponent}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container-scroller">
          {userid != null && <Navbar photo={photo} />}
          <div className="container-fluid page-body-wrapper">
            {userid != null && sidebarComponent}
            <div className="main-panel">
              {(userid != null) && ClientReports}
              <div className="content-wrapper">
                <AppRoutes />
                {userid != null && footerComponent}
              </div>
            </div>
          </div>
        </div>
      )
      }
    </>
  );
}





export default withTranslation()(withRouter(App));
