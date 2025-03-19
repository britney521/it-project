 const loginLink = document.querySelector('.navbar .nav-item:nth-last-child(3) .nav-link');
     loginLink.addEventListener('click', () => {
       window.location.href = 'Modern Login Page.html';
     });


       // 从localStorage获取登录状态
              const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
              const authSection = document.getElementById('authSection');

              if(isLoggedIn) {
                authSection.innerHTML = `
                  <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                    <img src="img/avatar.jpg" alt="用户头像" class="rounded-circle" width="32" height="32">
                  </a>
                  <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="#">Profile</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><button class="dropdown-item" onclick="logout()">log out</button></li>
                  </ul>
                `;
              } else {
                authSection.outerHTML = `
                  <li class="nav-item"><a class="nav-link" href="Modern Login Page.html">Login</a></li>
                  <li class="nav-item"><a class="nav-link btn btn-primary text-white" href="signup.html">Sign Up</a></li>
                `;
              }

              function logout() {
                localStorage.removeItem('isLoggedIn');
                window.location.reload();
              }