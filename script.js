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