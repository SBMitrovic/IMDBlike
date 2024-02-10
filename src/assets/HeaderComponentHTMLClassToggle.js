const navs = [];
        function classToggle() {
        
           navs = document.querySelectorAll('.Navbar__Items')
          
          navs.forEach(nav => nav.classList.toggle('.Navbar__ToggleShow'));
        } 
        document.querySelector('.Navbar__Link-toggle')
          .addEventListener('click', classToggle);
      