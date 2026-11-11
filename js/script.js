// ==========================================
// Matrix ARM64 Background Effect
// ==========================================
(function initMatrixBackground() {
    const canvas = document.getElementById('matrix-bg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // ARM64 assembly mnemonics, registers, directives, and hex values
    const arm64Chars = [
        'ldr', 'str', 'mov', 'add', 'sub', 'cmp', 'tst', 'orr', 'and', 'eor',
        'b.eq', 'b.ne', 'b.gt', 'b.lt', 'b.ge', 'b.le', 'b.lo', 'b.hs', 'bl', 'blr', 'ret',
        'cbz', 'cbnz', 'tbz', 'tbnz', 'movk', 'movz', 'movn', 'ubfx', 'sbfx', 'uxtb',
        'ldrsw', 'ldrb', 'strb', 'ldrh', 'strh', 'ldp', 'stp', 'ldrb', 'strb',
        'mrs', 'msr', 'isb', 'dsb', 'dmb', 'nop', 'brk', 'svc', 'hvc', 'sve',
        'x0', 'x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'x7', 'x8', 'x9', 'x10', 'x11',
        'x12', 'x13', 'x14', 'x15', 'x16', 'x17', 'x18', 'x19', 'x20', 'x21', 'x22', 'x23',
        'x24', 'x25', 'x26', 'x27', 'x28', 'x29', 'x30', 'sp', 'xzr', 'wzr',
        'w0', 'w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9', 'w10',
        'v0', 'v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'v9', 'v10',
        'f0', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7',
        '.globl', '.text', '.data', '.bss', '.align', '.word', '.quad', '.ascii', '.size',
        '0x00', '0x01', '0x08', '0x10', '0x18', '0x20', '0x40', '0x80', '0xFF',
        '0x100', '0x200', '0x400', '0x800', '0xFFF', '0x1000', '0xFFFF',
        '#0', '#1', '#8', '#16', '#32', '#64', '#128', '#255',
        '[x0]', '[x1]', '[x2]', '[sp]', '[sp,#-16]', '[sp,#16]',
        '!', '{x0, x1}', '{v0.2d, v1.2d}',
        'LDR', 'STR', 'MOV', 'ADD', 'SUB', 'CMP', 'B.EQ', 'B.NE', 'BL', 'RET',
        '00', '01', '10', '11', '0F', 'F0', 'FF', '00', '10', '20', '30', '40', '50', '60', '70', '80', '90', 'A0', 'B0', 'C0', 'D0', 'E0', 'F0'
    ];

    // Build a character pool mixing mnemonics with individual hex chars
    const hexChars = '0123456789ABCDEF';
    const pool = [];

    // Add mnemonics as multi-char tokens
    arm64Chars.forEach(token => {
        if (token.length > 1) {
            pool.push(token);
        }
    });

    // Add individual hex digits for filler
    for (let i = 0; i < 40; i++) {
        pool.push(hexChars[Math.floor(Math.random() * hexChars.length)]);
    }

    let columns = [];
    const fontSize = 14;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const colCount = Math.floor(canvas.width / fontSize);
        columns = [];
        for (let i = 0; i < colCount; i++) {
            columns[i] = {
                y: Math.random() * canvas.height / fontSize,
                speed: 0.3 + Math.random() * 0.7,
                trail: 15 + Math.floor(Math.random() * 25),
                char: pool[Math.floor(Math.random() * pool.length)]
            };
        }
    }

    function getRandomChar() {
        return pool[Math.floor(Math.random() * pool.length)];
    }

    function draw() {
        ctx.fillStyle = 'rgba(5, 5, 16, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;

        for (let i = 0; i < columns.length; i++) {
            const col = columns[i];
            const x = i * fontSize;
            const y = col.y * fontSize;

            // Randomly change the character
            if (Math.random() > 0.95) {
                col.char = getRandomChar();
            }

            // Draw head character with glow
            const gradient = ctx.createLinearGradient(x, y - col.trail * fontSize, x, y);
            gradient.addColorStop(0, 'rgba(0, 212, 255, 0)');
            gradient.addColorStop(0.7, 'rgba(0, 212, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(196, 113, 245, 0.9)');

            ctx.fillStyle = gradient;
            ctx.fillText(col.char, x, y);

            // Draw trail characters
            for (let j = 1; j < col.trail; j++) {
                const trailY = y - j * fontSize;
                if (trailY < 0) break;

                const alpha = (1 - j / col.trail) * 0.4;
                ctx.fillStyle = `rgba(0, 212, 255, ${alpha})`;

                // Occasionally flip trail characters
                if (Math.random() > 0.98) {
                    col.char = getRandomChar();
                }
                ctx.fillText(col.char, x, trailY);
            }

            // Move column down
            col.y += col.speed;

            // Reset when off screen
            if (col.y * fontSize > canvas.height + col.trail * fontSize) {
                if (Math.random() > 0.975) {
                    col.y = -col.trail;
                    col.speed = 0.3 + Math.random() * 0.7;
                    col.trail = 15 + Math.floor(Math.random() * 25);
                    col.char = getRandomChar();
                }
            }
        }

        requestAnimationFrame(draw);
    }

    resize();
    draw();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resize, 200);
    });
})();

// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(5, 5, 16, 0.98)';
        navbar.style.boxShadow = '0 5px 20px rgba(196, 113, 245, 0.1)';
        navbar.style.borderBottomColor = 'rgba(196, 113, 245, 0.2)';
    } else {
        navbar.style.background = 'rgba(5, 5, 16, 0.85)';
        navbar.style.boxShadow = 'none';
        navbar.style.borderBottomColor = 'rgba(196, 113, 245, 0.1)';
    }
});

// Animated Counter for Stats
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const animateValue = (element, start, end, duration) => {
    let current = start;
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current;
        if (current === end) {
            clearInterval(timer);
        }
    }, stepTime);
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateValue(entry.target, 0, target, 2000);
            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.stat-number').forEach(stat => {
    statsObserver.observe(stat);
});


// Animate Elements on Scroll
const fadeElements = document.querySelectorAll('.bento-item, .project-card, .contact-item');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            fadeObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

fadeElements.forEach(el => {
    el.style.opacity = '0';
    fadeObserver.observe(el);
});

// 3D Tilt Effect for Bento Items
const tiltItems = document.querySelectorAll('.bento-tilt');

tiltItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        
        item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
});

// ==========================================
// Interactive Terminal
// ==========================================
const terminalInput = document.getElementById('terminalInput');
const terminalBody = document.getElementById('terminalBody');

const terminalCommands = {
    help: {
        description: 'Show available commands',
        execute: () => {
            return `<span class="category-highlight">Available commands:</span>
  <span class="terminal-command">about</span>      - Learn about Adam
  <span class="terminal-command">skills</span>     - View technical skills
  <span class="terminal-command">languages</span>  - Programming languages
  <span class="terminal-command">engines</span>    - Game engines
  <span class="terminal-command">tools</span>      - Build tools & IDEs
  <span class="terminal-command">graphics</span>   - Graphics APIs
  <span class="terminal-command">arch</span>       - CPU architectures
  <span class="terminal-command">os</span>         - Operating systems
  <span class="terminal-command">datastruct</span> - Custom STD library
  <span class="terminal-command">projects</span>   - View projects
  <span class="terminal-command">contact</span>    - Get contact info
  <span class="terminal-command">languages_spk</span> - Spoken languages
  <span class="terminal-command">clear</span>      - Clear terminal
  <span class="terminal-command">whoami</span>     - Current user
  <span class="terminal-command">date</span>       - Current date/time
  <span class="terminal-command">uptime</span>     - Session uptime
  <span class="terminal-command">neofetch</span>   - System info
  <span class="terminal-command">easter</span>     - ???`;
        }
    },
    about: {
        description: 'About Adam',
        execute: () => {
            return `<span class="category-highlight">Adam Puche Lioubavina</span>
  Game Programmer based in Valencia, Spain
  
  Passionate about developing game mechanics and efficient
  programming systems with C/C++ and C#.
  
  Currently working as a WordPress developer while developing
  skills in game programming with Unity and Unreal Engine 5.
  
  Experience in teamwork and leadership as a basketball coach.`;
        }
    },
    skills: {
        description: 'All skills',
        execute: () => {
            return `<span class="category-highlight">Technical Skills Overview:</span>

  <span class="category-highlight">Languages:</span>    C, C++, C#, Python, HTML, Lua
  <span class="category-highlight">Engines:</span>      Unity, Unreal Engine 5
  <span class="category-highlight">Build Tools:</span>  CMake, Premake5, Git, Perforce
  <span class="category-highlight">IDEs:</span>         Rider, CLion, WebStorm, PyCharm, Visual Studio
  <span class="category-highlight">Graphics:</span>     Vulkan, OpenGL
  <span class="category-highlight">Architecture:</span> ARM64, ARM32
  <span class="category-highlight">OS:</span>         Windows, macOS, Linux
  <span class="category-highlight">Custom STD:</span>   Vectors, Strings, Smart Pointers, Containers, Algorithms`;
        }
    },
    languages: {
        description: 'Programming languages',
        execute: () => {
            return `<span class="category-highlight">Programming Languages:</span>
  <span class="skill-highlight">C</span>       - Systems programming, low-level control
  <span class="skill-highlight">C++</span>     - Game development, performance-critical code
  <span class="skill-highlight">C#</span>      - Unity scripting, game logic
  <span class="skill-highlight">Python</span>  - Production scripting & automation
  <span class="skill-highlight">HTML</span>    - Web development
  <span class="skill-highlight">Lua</span>     - Scripting and configuration`;
        }
    },
    engines: {
        description: 'Game engines',
        execute: () => {
            return `<span class="category-highlight">Game Engines:</span>
  <span class="skill-highlight">Unity</span>        - 2D/3D game development, C# scripting
  <span class="skill-highlight">Unreal Engine 5</span> - AAA game development, Blueprints, C++`;
        }
    },
    tools: {
        description: 'Build tools and IDEs',
        execute: () => {
            return `<span class="category-highlight">Build & Tools:</span>
  <span class="skill-highlight">CMake</span>        - Cross-platform build system
  <span class="skill-highlight">Premake5</span>     - Build script generator
  <span class="skill-highlight">Git</span>          - Distributed version control
  <span class="skill-highlight">Perforce</span>     - Scalable version control for game dev

  <span class="category-highlight">JetBrains IDEs:</span>
  <span class="skill-highlight">Rider</span>        - .NET/Unity IDE
  <span class="skill-highlight">CLion</span>        - C/C++ IDE
  <span class="skill-highlight">WebStorm</span>     - JavaScript IDE
  <span class="skill-highlight">PyCharm</span>      - Python IDE`;
        }
    },
    graphics: {
        description: 'Graphics APIs',
        execute: () => {
            return `<span class="category-highlight">Graphics & GPU:</span>
  <span class="skill-highlight">Vulkan</span>     - Low-overhead cross-platform graphics API
  <span class="skill-highlight">OpenGL</span>     - Cross-platform graphics rendering`;
        }
    },
    os: {
        description: 'Operating systems',
        execute: () => {
            return `<span class="category-highlight">Operating Systems:</span>
  <span class="skill-highlight">Windows</span>  - Development & deployment
  <span class="skill-highlight">macOS</span>    - Development & deployment
  <span class="skill-highlight">Linux</span>    - Development & deployment`;
        }
    },
    arch: {
        description: 'CPU architectures',
        execute: () => {
            return `<span class="category-highlight">CPU Architectures:</span>
  <span class="skill-highlight">ARM64</span>      - 64-bit ARM (AArch64)
  <span class="skill-highlight">ARM32</span>      - 32-bit ARM (AArch32)`;
        }
    },
    datastruct: {
        description: 'Custom STD library',
        execute: () => {
            return `<span class="category-highlight">Custom STD Library:</span>
  <span class="skill-highlight">Vectors</span>        - Custom dynamic array implementation
  <span class="skill-highlight">Strings</span>        - Custom string class with memory management
  <span class="skill-highlight">Smart Pointers</span> - Unique_ptr, shared_ptr implementation
  <span class="skill-highlight">Containers</span>     - Custom container classes
  <span class="skill-highlight">Algorithms</span>     - Sorting, searching, iteration
  <span class="skill-highlight">Memory Mgmt</span>    - Allocators & pool management`;
        }
    },
    projects: {
        description: 'View projects',
        execute: () => {
            return `<span class="category-highlight">Projects:</span>

  <span class="skill-highlight">Space Invaders</span>
  Recreation of the legendary arcade game in the ESAT graphics library.
  Technologies: C++, ESAT_rev248, 2D graphics

  <span class="skill-highlight">OpenGL Navigation System</span>
  Custom navigation and rendering system built from scratch with an OpenGL-based EDK.
  Technologies: C++, OpenGL, Custom EDK, 3D rendering

  <span class="skill-highlight">Infinite Runner 2.5D</span>
  Endless runner game with 2.5D perspective and pixel art aesthetics set in a forest environment.
  Technologies: C#, Unity, 2.5D, Pixel Art

  <span class="skill-highlight">Tikki Takka Mesh</span>
  Roguelite 3D game with fixed camera, developed in 3 days at Global Game Jam Valencia 2026.
  Technologies: C#, Unity, Roguelite, 3D
   
  Scroll down to the Projects section for more details!`;
        }
    },
    contact: {
        description: 'Contact info',
        execute: () => {
            return `<span class="category-highlight">Contact Information:</span>
  Location: Valencia, Spain
  Status: Available for freelance and job opportunities
  
  Use the contact form below to send a message!`;
        }
    },
    languages_spk: {
        description: 'Spoken languages',
        execute: () => {
            return `<span class="category-highlight">Spoken Languages:</span>
  <span class="skill-highlight">🇪🇸 Spanish</span>   - Native
  <span class="skill-highlight">🇬🇧 English</span>   - B2 (Upper Intermediate)
  <span class="skill-highlight">🇷🇺 Russian</span>   - B1 (Intermediate)
  <span class="skill-highlight">🇯🇵 Japanese</span>  - A1 (Beginner)`;
        }
    },
    clear: {
        description: 'Clear terminal',
        execute: () => {
            // Clear all lines except the input line
            const lines = terminalBody.querySelectorAll('.terminal-line, .terminal-output, .terminal-error');
            lines.forEach(line => line.remove());
            return null;
        }
    },
    whoami: {
        description: 'Current user',
        execute: () => {
            return 'adam@portfolio';
        }
    },
    date: {
        description: 'Current date',
        execute: () => {
            return new Date().toString();
        }
    },
    uptime: {
        description: 'Session uptime',
        execute: () => {
            const uptime = Math.floor((Date.now() - pageLoadTime) / 1000);
            const minutes = Math.floor(uptime / 60);
            const seconds = uptime % 60;
            return `up ${minutes} minutes, ${seconds} seconds`;
        }
    },
    neofetch: {
        description: 'System info',
        execute: () => {
            return `<span class="category-highlight">        \\   |   /         </span>  <span class="skill-highlight">adam@portfolio</span>
<span class="category-highlight">         \\  |  /          </span>  ----
<span class="category-highlight">          \\ | /           </span>  <span class="skill-highlight">OS:</span> Portfolio OS v1.0
<span class="category-highlight">           |              </span>  <span class="skill-highlight">Host:</span> Adam P. Lioubavina
<span class="category-highlight">          / | \\           </span>  <span class="skill-highlight">Kernel:</span> Cyberpunk 5.0
<span class="category-highlight">         /  |  \\          </span>  <span class="skill-highlight">Uptime:</span> ${Math.floor((Date.now() - pageLoadTime) / 60000)} mins
<span class="category-highlight">        /   |   \\         </span>  <span class="skill-highlight">Shell:</span> terminal v1.0
                               <span class="skill-highlight">Resolution:</span> ${window.innerWidth}x${window.innerHeight}
                               <span class="skill-highlight">Theme:</span> Cyberpunk Elegant
                               <span class="skill-highlight">Languages:</span> C, C++, C#, Python, Lua
                               <span class="skill-highlight">Engines:</span> Unity, UE5
                               <span class="skill-highlight">OS:</span> Windows, macOS, Linux
                               <span class="skill-highlight">Custom STD:</span> Vectors, Strings, Smart Pointers, Containers`;
        }
    },
    easter: {
        description: 'Easter egg',
        execute: () => {
            return `<span class="category-highlight">🥚 Easter Egg Found! 🥚</span>

  You discovered the hidden command!
  
  "The best error you can get is the one that won't even compile."
  — Adam Puche Lioubavina
  
  Thanks for exploring my portfolio! 🎮`;
        }
    }
};

const pageLoadTime = Date.now();

function processCommand(input) {
    const trimmed = input.trim().toLowerCase();
    
    if (!trimmed) return null;
    
    const cmd = terminalCommands[trimmed];
    if (cmd) {
        return cmd.execute();
    }
    
    return `<span class="terminal-error">Command not found: ${input}</span>
Type <span class="terminal-command">help</span> for available commands.`;
}

function addTerminalLine(html, className = 'terminal-line') {
    const line = document.createElement('div');
    line.className = `terminal-line ${className}`;
    line.innerHTML = html;
    
    // Insert before the input line
    const inputLine = terminalBody.querySelector('.terminal-input-line');
    terminalBody.insertBefore(line, inputLine);
    
    // Auto scroll to bottom
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const input = terminalInput.value;
            terminalInput.value = '';
            
            // Show the command entered
            addTerminalLine(`<span class="terminal-prompt">adam@portfolio:~$</span> ${input}`);
            
            // Process and show output
            const output = processCommand(input);
            if (output) {
                addTerminalLine(output, 'terminal-output');
            }
        }
    });
    
    // Focus terminal on click
    document.getElementById('terminal').addEventListener('click', () => {
        terminalInput.focus();
    });
}

// ==========================================
// Typing Effect for Hero Subtitle
// ==========================================
const typedTextElement = document.getElementById('typed-text');

if (typedTextElement) {
    const phrases = [
        'Videogame programmer in C/C++, C#, Python',
        'Unity & Unreal Engine 5 developer',
        'Vulkan & OpenGL graphics programming',
        'ARM64 & ARM32 architecture',
        'Cross-platform: Windows, macOS, Linux',
        'Passionate about game mechanics',
        'Custom STD library: Vectors, Strings, Smart Pointers'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;
    
    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typedTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40;
        } else {
            typedTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 80;
        }
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Pause before next phrase
        }
        
        setTimeout(typeEffect, typeSpeed);
    }
    
    // Start typing after a delay
    setTimeout(typeEffect, 1000);
}

// ==========================================
// Button Ripple Effect
// ==========================================
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.className = 'btn-ripple';
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// ==========================================
// Contact Form Handler
// ==========================================
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    
    try {
        button.textContent = 'Sending...';
        button.disabled = true;
        
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            alert('Thank you for your message! I will contact you soon.');
            form.reset();
        } else {
            alert('There was an error sending the message. Please try again.');
        }
    } catch (error) {
        alert('There was an error sending the message. Please try again.');
    } finally {
        button.textContent = originalText;
        button.disabled = false;
    }
});

// ==========================================
// Video Modal (supports multiple modals)
// ==========================================
function openVideoModal(event, modalId, videoId) {
    event.preventDefault();
    const modal = document.getElementById(modalId);
    const videoPlayer = document.getElementById(videoId);
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Play video when modal opens
    videoPlayer.play();
}

function closeVideoModal(modalId, videoId) {
    const modal = document.getElementById(modalId);
    const videoPlayer = document.getElementById(videoId);
    
    modal.classList.remove('active');
    
    // Pause and reset video
    videoPlayer.pause();
    videoPlayer.currentTime = 0;
    
    document.body.style.overflow = 'auto';
}

// Close all modals on outside click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            // Find the close button and trigger it
            const closeBtn = this.querySelector('.close-modal');
            if (closeBtn) closeBtn.click();
        }
    });
});

// Close all modals on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            const closeBtn = modal.querySelector('.close-modal');
            if (closeBtn) closeBtn.click();
        });
    }
});
