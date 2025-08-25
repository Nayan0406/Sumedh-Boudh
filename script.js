// Dynamically load products into the service cards grid on service.html
document.addEventListener('DOMContentLoaded', function() {
    const cardsGrid = document.querySelector('.cards-grid .row');
    if (cardsGrid) {
        fetch('http://localhost:5000/product')
            .then(res => res.json())
            .then(products => {
                cardsGrid.innerHTML = '';
                if (!Array.isArray(products) || products.length === 0) {
                    cardsGrid.innerHTML = '<div style="width:100%;text-align:center;padding:32px 0;color:#888;">No products found.</div>';
                    return;
                }
                products.forEach(product => {
                    const card = document.createElement('div');
                    card.className = 'service-blocks';
                    card.innerHTML = `
                        <div class="card-icon">
                            <img src="https://sumedh-boudh-backend.vercel.app${product.image}" class="card-img-top" style="max-height:180px;object-fit:cover;">
                            <div class="card-body">
                                <h3 class="card-title">${product.title}</h3>
                                <p class="card-text">${product.content}</p>
                            </div>
                        </div>
                    `;
                    cardsGrid.appendChild(card);
                });
            })
            .catch(err => {
                cardsGrid.innerHTML = '<div style="width:100%;text-align:center;padding:32px 0;color:#e53e3e;">Error loading products.</div>';
            });
    }
});
// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navCenter = document.querySelector('.nav-center');
    // Navbar scroll background effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    mobileMenuBtn.addEventListener('click', function() {
        // Toggle mobile menu active state
        this.classList.toggle('active');
        navCenter.classList.toggle('active');
        
        // Animate hamburger icon to X
        const spans = this.querySelectorAll('span');
        if (this.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'rotate(0) translate(0)';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'rotate(0) translate(0)';
        }
    });
    
    // Search functionality toggle (if needed)
    const searchIcon = document.querySelector('.search-icon');
    const searchBox = document.querySelector('.search-box');
    
    if (searchIcon && searchBox) {
        searchIcon.addEventListener('click', function() {
            searchBox.classList.toggle('active');
            if (searchBox.classList.contains('active')) {
                searchBox.querySelector('input').focus();
            }
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-center a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                mobileMenuBtn.classList.remove('active');
                navCenter.classList.remove('active');
                const spans = mobileMenuBtn.querySelectorAll('span');
                spans[0].style.transform = 'rotate(0) translate(0)';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'rotate(0) translate(0)';
            }
        });
    });
});