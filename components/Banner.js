export class Banner {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.options = {
            title: options.title || 'Product Title',
            subtext: options.subtext || 'Product description',
            backgroundColor: options.backgroundColor || 'rgb(255, 255, 255)'
        };
        this.element = null;
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with id "${this.containerId}" not found`);
            return;
        }

        const banner = document.createElement('div');
        banner.className = 'banner-component';
        banner.style.backgroundColor = this.options.backgroundColor;
        
        banner.innerHTML = `
            <div class="title">
                <h1>${this.options.title}</h1>
            </div>
            <div class="subtext">
                <p>${this.options.subtext}</p>
            </div>
        `;

        container.appendChild(banner);
        this.element = banner;
    }

    animate() {
        const title = this.element.querySelector('.title h1');
        const subtext = this.element.querySelector('.subtext p');

        gsap.from(title, {
            x: -100,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: this.element,
                start: "top 80%"
            }
        });

        gsap.from(subtext, {
            x: -100,
            opacity: 0,
            duration: 1,
            delay: 0.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: this.element,
                start: "top 80%"
            }
        });
    }

    updateContent(title, subtext) {
        if (this.element) {
            this.element.querySelector('.title h1').textContent = title;
            this.element.querySelector('.subtext p').textContent = subtext;
        }
    }

    destroy() {
        if (this.element) {
            this.element.remove();
        }
    }
}