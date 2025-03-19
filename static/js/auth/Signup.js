  document.addEventListener('DOMContentLoaded', function() {
            const signupForm = document.getElementById('signupForm');
            if (signupForm) {
                signupForm.addEventListener('submit', async (e) => {
                    e.preventDefault();

                    try {
                        // Show success modal
                        await showSuccessModal();

                        // Redirect to homepage after 2 seconds
                        setTimeout(() => {
                            window.location.href = '/Login/';
                        }, 2000);

                    } catch (error) {
                        console.error('Registration error:', error);
                        showErrorModal('Registration failed. Please try again.');
                    }
                });
            }
        });

        function showSuccessModal() {
            const modalHtml = `
                <div class="modal fade" id="successModal" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-body text-center p-4">
                                <i class="fas fa-check-circle text-success" style="font-size: 4rem;"></i>
                                <h3 class="mt-3">Registration Successful!</h3>
                                <p class="mb-0">Your account has been created successfully.</p>
                                <p class="text-muted">Redirecting to homepage...</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHtml);
            const successModal = new bootstrap.Modal(document.getElementById('successModal'));
            successModal.show();

            return new Promise(resolve => {
                setTimeout(() => {
                    successModal.hide();
                    document.getElementById('successModal').remove();
                    resolve();
                }, 2000);
            });
        }

        function showErrorModal(message) {
            const modalHtml = `
                <div class="modal fade" id="errorModal" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-body text-center p-4">
                                <i class="fas fa-times-circle text-danger" style="font-size: 4rem;"></i>
                                <h3 class="mt-3">Registration Failed</h3>
                                <p class="mb-0">${message}</p>
                            </div>
                            <div class="modal-footer justify-content-center">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHtml);
            const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
            errorModal.show();
        }

        // 登录状态管理
        function updateAuthUI() {
            const authSection = document.getElementById('auth-section');
            const isLoggedIn = sessionStorage.getItem('isLoggedIn');

            if (isLoggedIn) {
                authSection.innerHTML = `
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                            <i class="fas fa-user-circle fa-2x text-white"></i>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item" href="userprofile.html">Profile</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><button class="dropdown-item" onclick="logout()">Logout</button></li>
                        </ul>
                    </li>
                `;
            }
        }

        function logout() {
            sessionStorage.removeItem('isLoggedIn');
            window.location.href = 'Modern Login Page.html';
        }

        // 初始化检查登录状态
        document.addEventListener('DOMContentLoaded', () => {
            updateAuthUI();

            // 注册表单提交处理
            const signupForm = document.getElementById('signupForm');
            if (signupForm) {
                signupForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    sessionStorage.setItem('isLoggedIn', 'true');
                    // 保持原有注册逻辑不变
                    showSuccessModal();
                });
            }
        });