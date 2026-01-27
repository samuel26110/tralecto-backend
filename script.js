document.addEventListener('DOMContentLoaded', function() {
    
    // ======================================================
    // 1. CONFIGURACIÓN INICIAL Y SESIÓN
    // ======================================================
    
    // Generar ID de Sesión para el Chatbot (Para que recuerde la conversación)
    if (!localStorage.getItem('tralecto_chat_session')) {
        localStorage.setItem('tralecto_chat_session', 'sess_' + Math.random().toString(36).substr(2, 9));
    }
    const sessionId = localStorage.getItem('tralecto_chat_session');

    // Estado del idioma
    let currentLang = 'es';

    // ======================================================
    // 2. SISTEMA DE IDIOMAS (Tus traducciones originales)
    // ======================================================
    const langButton = document.getElementById('lang-button');
    const langOptions = document.getElementById('lang-options');
    const langLinks = document.querySelectorAll('.language-options-float a'); 

    const translations = {
        'es': {
            // == GENERALES / INDEX.HTML ==
            pageTitle: 'Tralecto: Su Brújula en el Desarrollo de Software',
            btnClientAccess: 'Acceso Clientes',
            btnDevRoute: 'Ruta de Desarrollo',
            navInicio: 'Inicio', navMision: 'Misión', navVideo: 'Video', navValores: 'Valores', navServicios: 'Servicios', navContacto: 'Contacto',
            heroTitle: 'Navegando con código experto.',
            heroSubtitle: 'Somos su socio estratégico en la transformación digital. Construimos soluciones de software sólidas y escalables.',
            btnServices: 'Ver Servicios', btnContact: 'Contáctenos',
            misionTitle: 'Nuestra Esencia',
            cardMisionTitle: 'Misión',
            cardMisionText: 'Convertir ideas ambiciosas en aplicaciones de alto rendimiento, proporcionando a nuestros clientes la herramienta digital precisa para el crecimiento y la eficiencia operativa.',
            cardVisionTitle: 'Visión',
            cardVisionText: 'Ser reconocidos como la brújula indispensable para empresas que buscan liderar su sector a través de la innovación tecnológica y soluciones de software diseñadas para el futuro.',
            videoTitle: 'Video Explicativo',
            valoresTitle: 'Valores Fundamentales',
            valIngenieriaTitle: 'Ingeniería Sólida', valIngenieriaText: 'Priorizamos la arquitectura limpia y el código mantenible.',
            valTransparenciaTitle: 'Transparencia Total', valTransparenciaText: 'Proceso de desarrollo abierto y comunicación constante.',
            valAdaptabilidadTitle: 'Adaptabilidad Ágil', valAdaptabilidadText: 'Nos ajustamos a las necesidades cambiantes del mercado.',
            valCompromisoTitle: 'Compromiso con el Éxito', valCompromisoText: 'Solo finalizamos cuando su solución está funcionando perfectamente.',
            serviciosTitle: 'Servicios que Ofrecemos',
            servMovilTitle: 'Desarrollo Móvil', servMovilText: 'Aplicaciones nativas e híbridas (iOS y Android) optimizadas para rendimiento y experiencia de usuario.',
            servWebTitle: 'Plataformas Web', servWebText: 'Creación de sistemas complejos, portales web y APIs escalables con frameworks modernos.',
            servjuegosTitle: 'Desarrollo de juegos', servjuegosText: 'Creamos juegos rpg 2D 3D a tu gustos y con las especificaciones que quieras..',
            contactTitle: 'Hablemos de su Proyecto',
            contactTagline: 'Complete el formulario y nos pondremos en contacto con usted en menos de 24 horas.',
            contactPhoneLabel: 'Teléfono:', contactEmailLabel: 'Correo Electrónico:',
            phName: 'Su Nombre', phEmail: 'Su Correo Electrónico', phMessage: '¿Cómo podemos ayudarle? (Detalle su proyecto)',
            btnSend: 'Enviar Consulta',
            footerText: '© 2025 Tralecto. Todos los derechos reservados.',
            
            // == LOGIN.HTML ==
            loginTitle: 'Acceso Clientes | Tralecto',
            loginPanelTitle: 'Su Portal de Desarrollo de Software',
            loginPanelText: 'Acceda a su área de cliente para hacer seguimiento a proyectos, revisar documentación técnica y comunicarse directamente con su equipo de desarrolladores.',
            loginTitleFeatures: 'Beneficios',
            loginFeature1: 'Seguimiento de Progreso', loginFeature2: 'Documentación', loginFeature3: 'Soporte Prioritario',
            loginSubtitle: 'Iniciar Sesión', phUser: 'Nombre de Usuario o Correo', phPass: 'Contraseña',
            btnLogin: 'Acceder', btnShowRegister: 'Crear una cuenta nueva',
            registerSubtitle: 'Registro', phRepeatPass: 'Repetir Contraseña',
            btnRegister: 'Registrarse', btnShowLogin: 'Ya tengo una cuenta',

            // == PROCESO.HTML ==
            processTitle: 'Ruta de Desarrollo de Software | Tralecto',
            processHeroTitle: 'Ruta de Desarrollo de Software',
            processTagline: 'Nuestro proceso está diseñado para minimizar riesgos y maximizar la entrega de valor, garantizando calidad en cada etapa.',
            processCardDefaultTitle: 'Seleccione un paso',
            processCardDefaultText: 'Haga clic en cualquiera de los círculos de la ruta para ver una descripción detallada de lo que sucede en esa fase de su proyecto.',
            step1Title: '1. Descubrimiento y Alcance', step1Detail: 'Definición de requisitos, análisis de viabilidad y delimitación del alcance del proyecto. Esto asegura que todos estamos alineados con el objetivo final.',
            step2Title: '2. Planificación y Diseño (UX/UI)', step2Detail: 'Creación de la arquitectura del software, flujos de usuario (UX) y maquetas visuales (UI). Es el plano que guía la construcción.',
            step3Title: '3. Desarrollo por Sprints', step3Detail: 'Codificación ágil y modular, entregando funcionalidades operativas en ciclos cortos. Máxima transparencia y adaptabilidad.',
            step4Title: '4. Aseguramiento de Calidad (QA)', step4Detail: 'Pruebas rigurosas de seguridad, rendimiento y funcionalidad. Detectamos y corregimos errores para un producto robusto.',
            step5Title: '5. Despliegue, Soporte y Monitoreo', step5Detail: 'Lanzamiento final en producción, capacitación del equipo y soporte constante para la estabilidad a largo plazo.',
            processHubTitle: 'Ciclo Ágil'
        },
        'en': {
            pageTitle: 'Tralecto: Your Compass in Software Development',
            btnClientAccess: 'Client Access',
            btnDevRoute: 'Development Route',
            navInicio: 'Home', navMision: 'Mission', navVideo: 'Video', navValores: 'Values', navServicios: 'Services', navContacto: 'Contact',
            heroTitle: 'Navigating with expert code.',
            heroSubtitle: 'We are your strategic partner in digital transformation. We build solid and scalable software solutions.',
            btnServices: 'View Services', btnContact: 'Contact Us',
            misionTitle: 'Our Essence',
            cardMisionTitle: 'Mission',
            cardMisionText: 'Transforming ambitious ideas into high-performance applications, providing our clients with the precise digital tool for growth and operational efficiency.',
            cardVisionTitle: 'Vision',
            cardVisionText: 'To be recognized as the indispensable compass for companies seeking to lead their sector through technological innovation and future-proof software solutions.',
            videoTitle: 'Explanation Video',
            valoresTitle: 'Core Values',
            valIngenieriaTitle: 'Solid Engineering', valIngenieriaText: 'We prioritize clean architecture and maintainable code.',
            valTransparenciaTitle: 'Total Transparency', valTransparenciaText: 'Open development process and constant communication.',
            valAdaptabilidadTitle: 'Agile Adaptability', valAdaptabilidadText: 'We adjust to the changing needs of the market.',
            valCompromisoTitle: 'Commitment to Success', valCompromisoText: 'We only finish when your solution is working perfectly.',
            serviciosTitle: 'Services We Offer',
            servMovilTitle: 'Mobile Development', servMovilText: 'Native and hybrid applications (iOS and Android) optimized for performance and user experience.',
            servWebTitle: 'Web Platforms', servWebText: 'Creation of complex systems, web portals, and scalable APIs with modern frameworks.',
            servjuegosTitle: 'Plays Consulting', servjuegosText: 'We create 2D and 3D RPG games to your liking and with the specifications you want..',
            contactTitle: 'Let\'s Talk About Your Project',
            contactTagline: 'Complete the form and we will contact you in less than 24 hours.',
            contactPhoneLabel: 'Phone:', contactEmailLabel: 'Email:',
            phName: 'Your Name', phEmail: 'Your Email', phMessage: 'How can we help you? (Detail your project)',
            btnSend: 'Send Inquiry',
            footerText: '© 2025 Tralecto. All rights reserved.',

            // == LOGIN.HTML ==
            loginTitle: 'Client Access | Tralecto',
            loginPanelTitle: 'Your Software Development Portal',
            loginPanelText: 'Access your client area to track projects, review technical documentation, and communicate directly with your development team.',
            loginTitleFeatures: 'Benefits',
            loginFeature1: 'Progress Tracking', loginFeature2: 'Documentation', loginFeature3: 'Priority Support',
            loginSubtitle: 'Sign In', phUser: 'Username or Email', phPass: 'Password',
            btnLogin: 'Access', btnShowRegister: 'Create a new account',
            registerSubtitle: 'Registration', phRepeatPass: 'Repeat Password',
            btnRegister: 'Register', btnShowLogin: 'I already have an account',

            // == PROCESO.HTML ==
            processTitle: 'Software Development Route | Tralecto',
            processHeroTitle: 'Software Development Route',
            processTagline: 'Our process is designed to minimize risks and maximize value delivery, ensuring quality at every stage.',
            processCardDefaultTitle: 'Select a step',
            processCardDefaultText: 'Click on any of the circles on the route to see a detailed description of what happens in that phase of your project.',
            step1Title: '1. Discovery and Scope', step1Detail: 'Definition of requirements, feasibility analysis, and project scope definition. This ensures we are all aligned with the final objective.',
            step2Title: '2. Planning and Design (UX/UI)', step2Detail: 'Creation of the software architecture, user flows (UX), and visual mockups (UI). It is the blueprint that guides construction.',
            step3Title: '3. Development by Sprints', step3Detail: 'Agile and modular coding, delivering operational features in short cycles. Maximum transparency and adaptability.',
            step4Title: '4. Quality Assurance (QA)', step4Detail: 'Rigorous security, performance, and functionality testing. We detect and correct errors for a robust product.',
            step5Title: '5. Deployment, Support, and Monitoring', step5Detail: 'Final production launch, team training, and constant support for long-term stability.',
            processHubTitle: 'Agile Cycle'
        },
        'pt': {
            // == GENERALES / INDEX.HTML ==
            pageTitle: 'Tralecto: Sua Bússola no Desenvolvimento de Software',
            btnClientAccess: 'Acesso Cliente',
            btnDevRoute: 'Rota de Desenvolvimento',
            navInicio: 'Início', navMision: 'Missão', navVideo: 'Vídeo', navValores: 'Valores', navServicios: 'Serviços', navContacto: 'Contato',
            heroTitle: 'Navegando com código especialista.',
            heroSubtitle: 'Somos seu parceiro estratégico na transformação digital. Construímos soluções de software sólidas e escaláveis.',
            btnServices: 'Ver Serviços', btnContact: 'Contate-nos',
            misionTitle: 'Nossa Essência',
            cardMisionTitle: 'Missão',
            cardMisionText: 'Converter ideias ambiciosas em aplicações de alto desempenho, fornecendo aos nossos clientes a ferramenta digital precisa para o crescimento e a eficiência operacional.',
            cardVisionTitle: 'Visão',
            cardVisionText: 'Ser reconhecidos como a bússola indispensável para empresas que buscam liderar seu setor através da inovação tecnológica e soluções de software projetadas para o futuro.',
            videoTitle: 'Vídeo Explicativo',
            valoresTitle: 'Valores Fundamentais',
            valIngenieriaTitle: 'Engenharia Sólida', valIngenieriaText: 'Priorizamos arquitetura limpa e código de fácil manutenção.',
            valTransparenciaTitle: 'Transparência Total', valTransparenciaText: 'Processo de desenvolvimento aberto e comunicação constante.',
            valAdaptabilidadTitle: 'Adaptabilidade Ágil', valAdaptabilidadText: 'Nós nos ajustamos às necessidades mutáveis do mercado.',
            valCompromisoTitle: 'Compromisso com o Sucesso', valCompromisoText: 'Só finalizamos quando sua solução estiver funcionando perfeitamente.',
            serviciosTitle: 'Serviços que Oferecemos',
            servMovilTitle: 'Desenvolvimento Móvel', servMovilText: 'Aplicativos nativos e híbridos (iOS e Android) otimizados para desempenho e experiência do usuário.',
            servWebTitle: 'Plataformas Web', servWebText: 'Criação de sistemas complexos, portais web e APIs escaláveis com frameworks modernos.',
            servjuegosTitle: 'desenvolvimento de jogos', servjuegosText: 'Criamos jogos de RPG em 2D e 3D de acordo com suas preferências e especificações..',
            contactTitle: 'Vamos Falar Sobre Seu Projeto',
            contactTagline: 'Preencha o formulário e entraremos em contato com você em menos de 24 horas.',
            contactPhoneLabel: 'Telefone:', contactEmailLabel: 'Email:',
            phName: 'Seu Nome', phEmail: 'Seu Email', phMessage: 'Como podemos ajudar? (Detalhe seu projeto)',
            btnSend: 'Enviar Consulta',
            footerText: '© 2025 Tralecto. Todos os direitos reservados.',
            // == LOGIN.HTML ==
            loginTitle: 'Acesso Cliente | Tralecto',
            loginPanelTitle: 'Seu Portal de Desenvolvimento de Software',
            loginPanelText: 'Acesse sua área de cliente para acompanhar projetos, revisar documentação técnica e se comunicar diretamente com sua equipe de desenvolvimento.',
            loginTitleFeatures: 'Benefícios',
            loginFeature1: 'Acompanhamento de Progresso', loginFeature2: 'Documentação', loginFeature3: 'Suporte Prioritário',
            loginSubtitle: 'Fazer Login', phUser: 'Nome de Usuário ou Email', phPass: 'Senha',
            btnLogin: 'Acessar', btnShowRegister: 'Criar uma nova conta',
            registerSubtitle: 'Registro', phRepeatPass: 'Repetir Senha',
            btnRegister: 'Registrar', btnShowLogin: 'Eu já tenho uma conta',
            // == PROCESO.HTML ==
            processTitle: 'Rota de Desenvolvimento de Software | Tralecto',
            processHeroTitle: 'Rota de Desenvolvimento de Software',
            processTagline: 'Nosso processo é projetado para minimizar riscos e maximizar a entrega de valor, garantindo qualidade em todas as etapas.',
            processCardDefaultTitle: 'Selecione uma etapa',
            processCardDefaultText: 'Clique em qualquer um dos círculos da rota para ver uma descrição detalhada do que acontece nessa fase do seu projeto.',
            step1Title: '1. Descoberta e Escopo', step1Detail: 'Definição de requisitos, análise de viabilidade e delimitação do escopo do projeto. Isso garante que todos estejamos alinhados com o objetivo final.',
            step2Title: '2. Planejamento e Design (UX/UI)', step2Detail: 'Criação da arquitetura do software, fluxos de usuário (UX) e modelos visuais (UI). É o plano que guia a construção.',
            step3Title: '3. Desenvolvimento por Sprints', step3Detail: 'Codificação ágil e modular, entregando funcionalidades operacionais em ciclos curtos. Máxima transparência e adaptabilidade.',
            step4Title: '4. Garantia de Qualidade (QA)', step4Detail: 'Testes rigorosos de segurança, desempenho e funcionalidade. Detectamos e corrigimos erros para um produto robusto.',
            step5Title: '5. Implantação, Suporte e Monitoramento', step5Detail: 'Lançamento final em produção, treinamento da equipe e suporte constante para estabilidade a longo prazo.',
            processHubTitle: 'Ciclo Ágil'
        },
        'zh': {
            // == GENERALES / INDEX.HTML ==
            pageTitle: 'Tralecto: 您的软件开发指南针',
            btnClientAccess: '客户登录',
            btnDevRoute: '开发路径',
            navInicio: '首页', navMision: '使命', navVideo: '视频', navValores: '价值观', navServicios: '服务', navContacto: '联系我们',
            heroTitle: '凭借专业代码领航。',
            heroSubtitle: '我们是您数字化转型的战略伙伴。我们构建稳健且可扩展的软件解决方案。',
            btnServices: '查看服务', btnContact: '联系我们',
            misionTitle: '我们的本质',
            cardMisionTitle: '使命',
            cardMisionText: '将雄心勃勃的创意转化为高性能应用，为客户提供精准的数字化工具，实现增长和运营效率。',
            cardVisionTitle: '愿景',
            cardVisionText: '被公认为企业通过技术创新和面向未来的软件解决方案引领行业的不可或缺的指南针。',
            videoTitle: '解释视频',
            valoresTitle: '核心价值观',
            valIngenieriaTitle: '扎实的工程', valIngenieriaText: '我们优先考虑清晰的架构和可维护的代码。',
            valTransparenciaTitle: '完全透明', valTransparenciaText: '开放的开发流程和持续的沟通。',
            valAdaptabilidadTitle: '敏捷适应性', valAdaptabilidadText: '我们适应不断变化的市场需求。',
            valCompromisoTitle: '对成功的承诺', valCompromisoText: '只有当您的解决方案完美运行时，我们才会结束。',
            serviciosTitle: '我们提供的服务',
            servMovilTitle: '移动开发', servMovilText: '为性能和用户体验优化的原生和混合应用（iOS和Android）。',
            servWebTitle: '网络平台', servWebText: '使用现代框架创建复杂的系统、门户网站和可扩展的API。',
            servjuegosTitle: '游戏开发', servjuegosText: '我们根据您的喜好和要求，制作 2D 和 3D 角色扮演游戏。。',
            contactTitle: '谈谈您的项目',
            contactTagline: '填写表格，我们将在24小时内与您联系。',
            contactPhoneLabel: '电话:', contactEmailLabel: '邮箱:',
            phName: '您的姓名', phEmail: '您的邮箱', phMessage: '我们如何帮助您？（详细说明您的项目）',
            btnSend: '发送咨询',
            footerText: '© 2025 Tralecto. 版权所有。',
            // == LOGIN.HTML ==
            loginTitle: '客户登录 | Tralecto',
            loginPanelTitle: '您的软件开发门户',
            loginPanelText: '进入您的客户区，跟踪项目、查阅技术文档并与您的开发团队直接沟通。',
            loginTitleFeatures: '优势',
            loginFeature1: '进度跟踪', loginFeature2: '文档', loginFeature3: '优先支持',
            loginSubtitle: '登录', phUser: '用户名或邮箱', phPass: '密码',
            btnLogin: '访问', btnShowRegister: '创建新账户',
            registerSubtitle: '注册', phRepeatPass: '重复密码',
            btnRegister: '注册', btnShowLogin: '我已有账户',
            // == PROCESO.HTML ==
            processTitle: '软件开发路径 | Tralecto',
            processHeroTitle: '软件开发路径',
            processTagline: '我们的流程旨在最大限度地降低风险并提高价值交付，确保每个阶段的质量。',
            processCardDefaultTitle: '选择一个步骤',
            processCardDefaultText: '点击路径上的任意圆圈，查看该项目阶段发生的事情的详细描述。',
            step1Title: '1. 发现与范围', step1Detail: '需求定义、可行性分析和项目范围划定。这确保了我们都与最终目标保持一致。',
            step2Title: '2. 规划与设计 (UX/UI)', step2Detail: '创建软件架构、用户流程 (UX) 和视觉模型 (UI)。这是指导构建的蓝图。',
            step3Title: '3. 迭代开发 (Sprints)', step3Detail: '敏捷和模块化编码，在短期周期内交付可操作功能。最大限度的透明度和适应性。',
            step4Title: '4. 质量保证 (QA)', step4Detail: '严格的安全、性能和功能测试。我们检测并纠正错误，以实现稳健的产品。',
            step5Title: '5. 部署、支持与监控', step5Detail: '最终投入生产、团队培训和持续支持，以实现长期稳定性。',
            processHubTitle: '敏捷周期'
        }
    };
    
    // ** 3.2. FUNCIÓN DE TRADUCCIÓN **
    function translatePage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang; 
        
        // 1. Traducir el TÍTULO de la página
        const titleElement = document.querySelector('title');
        if (titleElement) {
            const titleKey = titleElement.getAttribute('data-key');
            if (titleKey && translations[lang] && translations[lang][titleKey]) {
                titleElement.textContent = translations[lang][titleKey];
            }
        }

        // 2. Recorrer todos los demás elementos marcados con el atributo data-key
        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            
            if (translations[lang] && translations[lang][key]) {
                const translation = translations[lang][key];

                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    // Manejar placeholders para inputs y textareas
                    element.setAttribute('placeholder', translation);
                } else if (element.tagName !== 'TITLE') {
                    // Manejar texto normal (párrafos, títulos, botones)
                    element.textContent = translation;
                }
            }
        });
        
        // Si estamos en la página de proceso, actualiza la tarjeta de detalle a la traducción por defecto
        if (typeof updateProcessDetailCardDefault === 'function') {
            updateProcessDetailCardDefault();
        }
    }

    // Exportar la función getTranslation para scripts externos
    window.getTranslation = function(key) {
        return translations[currentLang] ? translations[currentLang][key] : '';
    };

    // Inicializar la página con el idioma por defecto
    translatePage('es');

    // Lógica visual del botón de idiomas
    if (langButton && langOptions) {
        langButton.addEventListener('click', function(e) {
            e.stopPropagation();
            langOptions.classList.toggle('show');
        });
        document.addEventListener('click', function(e) {
            if (!langOptions.contains(e.target) && !langButton.contains(e.target)) {
                langOptions.classList.remove('show');
            }
        });
        
        // Manejar la selección de idioma
        langLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const newLang = this.getAttribute('data-lang');
                translatePage(newLang);
                langOptions.classList.remove('show');
            });
        });
    }

    // ======================================================
    // 3. SISTEMA DE LOGIN Y REGISTRO (CONECTADO AL BACKEND)
    // ======================================================
    
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    const showRegisterBtn = document.getElementById('show-register');
    const showLoginBtn = document.getElementById('show-login');
    
    // Selectores de los formularios
    const loginForm = document.querySelector('#login-view .login-form');
    const registerForm = document.querySelector('#register-view .login-form');

    // --- ANIMACIÓN DE CAMBIO ENTRE VISTAS ---
    if (loginView && registerView && showRegisterBtn && showLoginBtn) {
        function toggleView(show, hide) {
            hide.style.opacity = '0';
            setTimeout(() => {
                hide.style.display = 'none';
                show.style.display = 'block';
                setTimeout(() => { show.style.opacity = '1'; }, 10);
            }, 300);
        }

        // Establecer estado inicial
        loginView.style.transition = 'opacity 0.3s ease-in-out';
        registerView.style.transition = 'opacity 0.3s ease-in-out';
        loginView.style.display = 'block';
        registerView.style.display = 'none';

        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleView(registerView, loginView);
        });

        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleView(loginView, registerView);
        });
    }

    // --- LÓGICA DE LOGIN (ENVIAR A API) ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = loginForm.querySelector('button');
            const inputs = loginForm.querySelectorAll('input');
            
            // Tu HTML Login tiene 2 inputs: [0]Usuario/Email, [1]Pass
            const email = inputs[0].value.trim();
            const password = inputs[1].value.trim();

            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
            btn.disabled = true;

            try {
                const res = await fetch('/api/auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'login', email, password })
                });
                const data = await res.json();

                if (data.success) {
                    localStorage.setItem('tralecto_uid', data.userId);
                    localStorage.setItem('tralecto_role', data.role);
                    localStorage.setItem('tralecto_name', data.name);
                    
                    // Redirección
                    if (data.role === 'admin') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'dashboard.html';
                    }
                } else {
                    alert("⚠️ " + (data.error || "Credenciales incorrectas"));
                    btn.textContent = 'Acceder';
                    btn.disabled = false;
                }
            } catch (error) {
                console.error(error);
                alert("❌ Error de conexión. Revisa tu internet.");
                btn.textContent = 'Acceder';
                btn.disabled = false;
            }
        });
    }

    // --- LÓGICA DE REGISTRO (ENVIAR A API) ---
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = registerForm.querySelector('button');
            const inputs = registerForm.querySelectorAll('input');

            // Tu HTML Registro tiene 3 inputs:
            // [0] = Usuario/Correo
            // [1] = Contraseña
            // [2] = Repetir Contraseña
            
            const email = inputs[0].value.trim();
            const password = inputs[1].value.trim();
            const repeatPass = inputs[2].value.trim();
            
            // Extraer nombre del correo (antes del @)
            const name = email.includes('@') ? email.split('@')[0] : email;

            if (password !== repeatPass) {
                alert("⛔ Las contraseñas no coinciden.");
                return;
            }

            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';
            btn.disabled = true;

            try {
                const res = await fetch('/api/auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        action: 'register', 
                        email: email, 
                        password: password, 
                        name: name 
                    })
                });
                const data = await res.json();

                if (data.success) {
                    localStorage.setItem('tralecto_uid', data.userId);
                    localStorage.setItem('tralecto_name', data.name);
                    alert("✅ ¡Cuenta creada! Bienvenido a Tralecto.");
                    window.location.href = 'dashboard.html';
                } else {
                    alert("⚠️ " + data.error);
                    btn.textContent = 'Registrarse';
                    btn.disabled = false;
                }
            } catch (error) {
                console.error(error);
                alert("❌ Error al registrarse.");
                btn.textContent = 'Registrarse';
                btn.disabled = false;
            }
        });
    }

    // ======================================================
    // 4. CHATBOT (LOGICA DE ENVÍO)
    // ======================================================
    const chatInput = document.getElementById('chatbot-input-field');
    const chatSend = document.getElementById('chatbot-send-btn');
    const chatMessages = document.getElementById('chatbot-messages');

    if (chatInput && chatSend && chatMessages) {
        async function sendChatMessage() {
            const text = chatInput.value.trim();
            if (!text) return;

            // 1. Mostrar mensaje usuario
            const userDiv = document.createElement('div');
            userDiv.className = 'message user';
            userDiv.innerText = text;
            chatMessages.appendChild(userDiv);
            chatInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // 2. Indicador escribiendo...
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'message bot';
            loadingDiv.innerText = '...';
            chatMessages.appendChild(loadingDiv);

            try {
                // 3. Enviar al backend
                const res = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: text, sessionId: sessionId })
                });
                const data = await res.json();
                
                // 4. Mostrar respuesta del bot
                loadingDiv.innerHTML = data.response; // Usamos innerHTML para formato (negritas, etc)
            } catch (error) {
                loadingDiv.innerText = "Error de conexión 🔌";
            }
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        chatSend.addEventListener('click', sendChatMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendChatMessage();
        });
    }

    // ======================================================
    // 5. LÓGICA AUXILIAR DE PROCESO.HTML (Si existe)
    // ======================================================
    window.updateProcessDetailCardDefault = function() {
        const detailCard = document.getElementById('process-detail');
        if (detailCard) {
            const defaultTitle = window.getTranslation('processCardDefaultTitle');
            const defaultDetail = window.getTranslation('processCardDefaultText');

            detailCard.innerHTML = `
                <h3 data-key="processCardDefaultTitle"><i class="fas fa-info-circle" style="color: var(--primary-color); margin-right: 10px;"></i>${defaultTitle}</h3>
                <p data-key="processCardDefaultText">${defaultDetail}</p>
            `;
        }
    };

});
