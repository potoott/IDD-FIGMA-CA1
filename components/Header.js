export class Header {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.options = {
            logo: options.logo || 'Home',
            navItems: options.navItems || ['About', 'Contact', 'Apple Store'],
            onNavClick: options.onNavClick || null
        };
        this.element = null;
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with id "${this.containerId}" not found`);
            return;
        }

        const header = document.createElement('header');
        header.className = 'header-component';
        
        header.innerHTML = `
            <div class="left">
                <div class="logo">
                    <p>${this.options.logo}</p>
                </div>
            </div>
            <div class="right">
                ${this.options.navItems.map(item => `
                    <div class="nav-item" data-nav="${item}">
                        <p>${item}</p>
                    </div>
                `).join('')}
            </div>
        `;

        container.appendChild(header);
        this.element = header;
        this.attachEventListeners();
        this.initScrollEffect();
    }

    attachEventListeners() {
        const navItems = this.element.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const navName = item.dataset.nav;
                if (this.options.onNavClick) {
                    this.options.onNavClick(navName);
                }
            });
        });
    }

    initScrollEffect() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.element.classList.add('scrolled');
            } else {
                this.element.classList.remove('scrolled');
            }
        });
    }

    animate() {
        // GSAP animation
        gsap.from(this.element, {
            y: -100,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    }

    destroy() {
        if (this.element) {
            this.element.remove();
        }
    }
}