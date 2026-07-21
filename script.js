window.addEventListener('load', () => {
    const preloader = document.getElementById('loading-screen');
    if (preloader) {
        preloader.classList.add('opacity-0');
        setTimeout(() => preloader.remove(), 700);
    }

    initTypingEffect();
    initScrollRevealObserver();
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        
        if (targetId === '#top' || targetId === '#') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

const navbar = document.getElementById('navbar');
const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = menuBtn?.querySelector('i');

window.addEventListener('scroll', () => {
    if (!navbar) return;
    const isScrolled = window.scrollY > 50;
    navbar.classList.toggle('py-2.5', isScrolled);
    navbar.classList.toggle('bg-black/80', isScrolled);
    navbar.classList.toggle('shadow-blue-500/5', isScrolled);
    navbar.classList.toggle('py-4', !isScrolled);
});

if (menuBtn && mobileMenu) {
    const toggleMenu = (open) => {
        if (open) {
            mobileMenu.classList.remove('hidden');
            if (menuIcon) menuIcon.className = 'fa-solid fa-xmark';
            requestAnimationFrame(() => {
                mobileMenu.classList.remove('scale-95', 'opacity-0');
            });
        } else {
            mobileMenu.classList.add('scale-95', 'opacity-0');
            if (menuIcon) menuIcon.className = 'fa-solid fa-bars';
            setTimeout(() => mobileMenu.classList.add('hidden'), 300);
        }
    };

    menuBtn.addEventListener('click', () => {
        const isClosed = mobileMenu.classList.contains('hidden');
        toggleMenu(isClosed);
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });
}

const navList = document.getElementById('nav-list');
const navLinks = document.querySelectorAll('.nav-link-pill');
const indicator = document.getElementById('nav-indicator');

if (navList && indicator) {
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const linkRect = link.getBoundingClientRect();
            const parentRect = navList.getBoundingClientRect();
            const targetLeft = linkRect.left - parentRect.left;

            indicator.style.width = `${linkRect.width}px`;
            indicator.style.transform = `translateX(${targetLeft}px)`;
            indicator.style.opacity = '1';
        });
    });

    navList.addEventListener('mouseleave', () => {
        indicator.style.opacity = '0';
    });
}

document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        closeImageModal();
    }
});

function initTypingEffect() {
    const targetSpan = document.getElementById('typing-element');
    if (!targetSpan) return;

    const stringsArray = [
        "Aspiring Frontend Developer",
        "Aspiring Backend Developer",
        "Aspiring UI/UX Designer"
    ];

    let stringIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function processTypeLoop() {
        const currentFullString = stringsArray[stringIdx];

        if (isDeleting) {
            targetSpan.textContent = currentFullString.substring(0, charIdx - 1);
            charIdx--;
            typeSpeed = 40;
        } else {
            targetSpan.textContent = currentFullString.substring(0, charIdx + 1);
            charIdx++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIdx === currentFullString.length) {
            isDeleting = true;
            typeSpeed = 1800;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            stringIdx = (stringIdx + 1) % stringsArray.length;
            typeSpeed = 400;
        }

        setTimeout(processTypeLoop, typeSpeed);
    }

    processTypeLoop();
}

function initScrollRevealObserver() {
    const elementsToReveal = document.querySelectorAll('.reveal');

    const targetRevealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    });

    elementsToReveal.forEach(element => targetRevealObserver.observe(element));
}

function openImageModal(imageSrc, caption) {
    const modal = document.getElementById('imageLightboxModal');
    const targetImage = document.getElementById('lightboxTargetImage');
    const targetCaption = document.getElementById('lightboxCaption');

    if (!modal || !targetImage || !targetCaption) return;

        targetImage.src = imageSrc;
        targetCaption.textContent = caption;

        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
        }, 10);
}

function closeImageModal(event) {
    if (event) {
        event.stopPropagation();
    }

    const modal = document.getElementById('imageLightboxModal');
    if (!modal) return;

    modal.classList.add('opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300); // Matches transition duration
}

(() => {
    const cursorDot = document.getElementById('customCursor');
    const cursorFollower = document.getElementById('customCursorFollower');

    if (!cursorDot || !cursorFollower || !window.matchMedia('(pointer: fine)').matches) return;

    window.addEventListener('mousemove', (e) => {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
        cursorFollower.style.left = `${e.clientX}px`;
        cursorFollower.style.top = `${e.clientY}px`;
    });

    const refreshHoverTargets = () => {
        document.querySelectorAll('a, button, input, textarea, [role="button"], .cursor-pointer').forEach(element => {
            if (element.dataset.cursorBound) return;
            element.dataset.cursorBound = "true";

            element.addEventListener('mouseenter', () => {
                cursorDot.classList.add('cursor-active');
                cursorFollower.classList.add('cursor-active');
            });

            element.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('cursor-active');
                cursorFollower.classList.remove('cursor-active');
            });
        });
    };

    refreshHoverTargets();
    new MutationObserver(() => refreshHoverTargets()).observe(document.body, { childList: true, subtree: true });
})();