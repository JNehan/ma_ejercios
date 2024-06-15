
document.addEventListener('DOMContentLoaded', () => {
    const navbarBurger = document.querySelector('.navbar-burger');

    if (navbarBurger) {
        navbarBurger.addEventListener('click', (event) => {
            navbarBurger.classList.toggle('is-active');

            const navbarMenu = document.querySelector('.navbar-menu');
            navbarMenu.classList.toggle('is-active')
        }, false);
    }

    const controlSquare = document.querySelectorAll('.control-square');
    if (controlSquare.length) {
        controlSquare.forEach(square => {
            square.addEventListener('click', (event) => {
                const isActive = document.querySelector('.control-square.is-active');
                if (isActive) {
                    isActive.classList.remove('is-active');
                }

                event.target.classList.add('is-active');
                console.log('deberia hacer algo, aun no se que...');
            })
        })
    }

    const openGallery = document.getElementById("openGallery");
    if (openGallery) {

        const lightbox = GLightbox({
            touchNavigation: true,
            loop: true,
            elements: [
                {
                    'href': '/assets/images/rest.png',
                    'type': 'image',
                },
                {
                    'href': '/assets/images/pool.png',
                    'type': 'image',
                },
                {
                    'href': '/assets/images/rooms.png',
                    'type': 'image',
                },
                {
                    'href': '/assets/images/bridge.png',
                    'type': 'image',
                },
                {
                    'href': '/assets/images/lobby.png',
                    'type': 'image',
                },
            ],
        });

        openGallery.addEventListener('click', () => {
            lightbox.open();
        });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const btnContact = document.getElementById('btnContact');
            btnContact.setAttribute('disabled', 'disabled');
            let isValid = true;

            const nombre = document.getElementById('nombre');
            const apellido = document.getElementById('apellido');
            const correo = document.getElementById('correo');

            let isInvalid = 'is-invalid';


            const nombreError = document.getElementById('nombreError');
            const nombreVal = nombre.value.trim();
            if (nombreVal === '') {
                nombre.classList.add(isInvalid);
                nombreError.textContent = 'El nombre es obligatorio.';
                btnContact.removeAttribute('disabled');
                return false;
            } else {
                nombre.classList.remove(isInvalid);
                nombreError.textContent = '';
            }


            const apellidoError = document.getElementById('apellidoError');
            const apellidoVal = apellido.value.trim();
            if (apellidoVal === '') {
                apellido.classList.add(isInvalid);
                apellidoError.textContent = 'El apellido es obligatorio.';
                btnContact.removeAttribute('disabled');
                return false;
            } else {
                apellido.classList.remove(isInvalid);
                apellidoError.textContent = '';
            }


            const correoError = document.getElementById('correoError');
            const correoVal = correo.value.trim();
            const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (correoVal === '') {
                correo.classList.add(isInvalid);
                correoError.textContent = 'El correo electrónico es obligatorio.';
                btnContact.removeAttribute('disabled');
                return false;
            } else if (!correoRegex.test(correoVal)) {
                correo.classList.add(isInvalid);
                correoError.textContent = 'El correo electrónico no es válido.';
                btnContact.removeAttribute('disabled');
                return false;
            } else {
                correo.classList.remove(isInvalid);
                correoError.textContent = '';
            }

            if (isValid) {

                const errorResponse = document.querySelector('.error-response');

                fetch("/server.php", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nombreVal, apellidoVal, correoVal })
                })
                    .then(response => response.json())
                    .then(data => {

                        if (data.success) {
                            errorResponse.style.display = 'none';
                            closeModal(document.getElementById('modalContact'));

                            setTimeout(() => {
                                openModal(document.getElementById('modalAlert'));
                            }, 1000);
                        } else {
                            errorResponse.style.display = 'block';
                        }

                    })
                    .catch(error => {
                        console.log(error);
                        errorResponse.style.display = 'block';
                    }).finally(() => {
                        btnContact.removeAttribute('disabled');
                    });

            }
        });
    }

    AOS.init();


    ///bulma open and close modal
    // Functions to open and close a modal
    function openModal($el) {
        $el.classList.add('is-active');
    }

    function closeModal($el) {
        $el.classList.remove('is-active');
    }

    function closeAllModals() {
        (document.querySelectorAll('.modal') || []).forEach(($modal) => {
            closeModal($modal);
        });
    }

    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-contact') || []).forEach(($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = document.getElementById(modal);

        $trigger.addEventListener('click', () => {
            openModal($target);
        });
    });

    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .box .delete, .modal-card-foot .button') || []).forEach(($close) => {
        const $target = $close.closest('.modal');

        $close.addEventListener('click', () => {
            closeModal($target);
        });
    });

    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
        if (event.key === "Escape") {
            closeAllModals();
        }
    });

});