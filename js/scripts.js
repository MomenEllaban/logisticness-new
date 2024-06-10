const app = firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

function joinUsFormHandler(e) {
  e.preventDefault();
  [...e.target.querySelectorAll("button")].forEach((btn) => {
    btn.disabled = true;
    btn.type === "submit" && btn.classList.add("submitting");
  });
  const enableFormBtns = () => {
    [...e.target.querySelectorAll("button")].forEach((btn) => {
      btn.disabled = false;
      btn.type === "submit" && btn.classList.remove("submitting");
    });
  };
  const formData = new FormData(e.target);
  const file = formData.get("resume");

  storage
    .ref()
    .child("PDFcv")
    .child(file.name)
    .put(file)
    .on(
      "state_changed",
      (snapshot) => {
        uploadedFileName = snapshot.ref.name;
      },
      (error) => {
        console.log(error);
        enableFormBtns();
      },
      () => {
        storage
          .ref("PDFcv")
          .child(uploadedFileName)
          .getDownloadURL()
          .then((url) => {
            // sent to email
            (function () {
              emailjs.init({
                publicKey: emailJSKeys.publicKey,
              });
            })();
            emailjs
              .send(emailJSKeys.serviceKey, emailJSKeys.templateKey, {
                name: formData.get("name"),
                email: formData.get("email"),
                phone: formData.get("phone"),
                url,
              })
              .then((res) => {
                enableFormBtns();
                e.target.reset();
                e.target.querySelector('#message').innerHTML = "Send Successfully";
                setTimeout(() => {
                  e.target.querySelector('#message').innerHTML = "&nbsp;";
                }, 2000);
              })
              .catch();
          });
      }
    );
}

function toggleNavbarStyle() {
  if (scrollY > 170) {
    document.querySelector(".navbar").classList.remove("navbar-transparent");
    document.querySelector('.navbar-brand .logo_body').classList.remove('hidden')
    document.querySelector('.navbar-brand .logo_home').classList.add('hidden')
  } else {
    document.querySelector(".navbar").classList.add("navbar-transparent");
    document.querySelector('.navbar-brand .logo_body').classList.add('hidden')
    document.querySelector('.navbar-brand .logo_home').classList.remove('hidden')
  }
}

function applyStyles() {
    setTimeout(() => {
      const navbCollapse = document.querySelector('.navbar-collapse.collapse');
      if (navbCollapse) {
        if (window.matchMedia('(max-width: 991px)').matches && navbCollapse.classList.contains('show')) {
          navbCollapse.closest('.navbar').classList.add('nav-colored');
        } else {
          navbCollapse.closest('.navbar').classList.remove('nav-colored');
        }
      }
    }, 380);
}

function activeSectionOnScroll() {
  const navbarListItems = document.querySelectorAll("ul#custom-nav-links > li.nav-item> .nav-link");
  let currentSection;
  document.querySelectorAll('section').forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= (sectionTop - sectionHeight / 3)) currentSection = section;
  });
  if (currentSection != undefined) {
    navbarListItems.forEach((item) => {
      item.classList.remove("active");
      if (currentSection.id === item.href.split('#')[1]) {
        item.classList.add("active");
      }
      if (currentSection.id === '') {
        navbarListItems[0].classList.add("active");
      }
    });
  } else {
    navbarListItems.forEach((item) => item.classList.remove("active"));
  }
}

function showToTopArrow() {
  document.querySelector(".back-to-top").className = `back-to-top ${window.scrollY > 300 ? "show" : ""}`;
}

/////////////////////////////////////////////////////////////////////////////
////////////////////////// START EVENT LISTENERS ////////////////////////////
/////////////////////////////////////////////////////////////////////////////

addEventListener("load", () => {
  applyStyles();
  activeSectionOnScroll();
  showToTopArrow();
  addEventListener('resize', applyStyles);
  
  toggleNavbarStyle();

  addEventListener("scroll", () => {
    toggleNavbarStyle();
    showToTopArrow();
    activeSectionOnScroll();
  });
  document.querySelectorAll("ul#custom-nav-links > li.nav-item> .nav-link").forEach(e => {
    e.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 991px)').matches) {
        e.closest('.navbar').querySelector('.navbar-toggler').click()
      }
    })
  })
  // move to the next section arrow on the header
  document
    .querySelector("#scroll-down")
    .addEventListener("click", () =>
      window.scrollBy(0, window.innerHeight - window.scrollY - 58)
    );

  try {
    setTimeout(() => {
      document.querySelector('.loader-overlay').style.opacity = 0;  
    }, 1000);

    setTimeout(() => {
        document.querySelector('.loader-overlay').style.display = 'none';
    }, 2000);
  } catch (error) { }
});