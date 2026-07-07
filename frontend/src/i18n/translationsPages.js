// Translations for Login/Register/Dashboard/Admin toasts + FAQ/About/Contact pages.
// Merged into the main translations object (see translations.js).

export const pageTranslations = {
  fr: {
    common: {
      backHome: "Retour à l'accueil", loading: "Chargement...", copy: "Copier", copied: "Copié dans le presse-papiers !",
      yes: "Oui", no: "Non", day: "jour", vip: "VIP", admin: "Admin", balance: "Solde", invested: "Investi", user: "Utilisateur",
      noDeposits: "Aucun dépôt", noWithdrawals: "Aucun retrait", noUsers: "Aucun utilisateur", withdrawAddress: "Adresse de retrait :",
      createAccount: "Créer un compte", contactBtn: "Nous contacter"
    },
    toast: {
      depositSubmitted: "Demande de dépôt soumise ! En attente de validation admin.", depositError: "Erreur lors du dépôt",
      withdrawSubmitted: "Demande de retrait soumise !", withdrawError: "Erreur lors du retrait",
      investCreated: "Investissement créé ! Niveau VIP :", investError: "Erreur lors de l'investissement",
      investStopped: "Investissement arrêté et capital retourné !", stopConfirm: "Êtes-vous sûr de vouloir arrêter cet investissement ?",
      loginSuccess: "Connexion réussie !", adminLoginSuccess: "Connexion admin réussie !", loginError: "Erreur de connexion",
      registerSuccess: "🎉 Compte créé avec succès ! Bonus de 6$ offert ! Bienvenue sur CashGold.", registerError: "Erreur lors de l'inscription",
      passwordMismatch: "Les mots de passe ne correspondent pas", passwordTooShort: "Le mot de passe doit contenir au moins 8 caractères (lettres et chiffres)",
      depositApproved: "Dépôt approuvé !", depositRejected: "Dépôt rejeté", rejectConfirm: "Êtes-vous sûr de vouloir rejeter ce dépôt ?",
      withdrawCompleted: "Retrait complété !", userSuspended: "Utilisateur suspendu", suspendConfirm: "Êtes-vous sûr de vouloir suspendre cet utilisateur ?",
      userActivated: "Utilisateur activé", accessDenied: "Accès refusé. Droits administrateur requis.", addressCopied: "Adresse copiée !",
      error: "Erreur", contactSent: "Message envoyé ! Nous vous répondrons bientôt."
    },
    faqPage: {
      title: "Questions", titleGold: "Fréquentes", subtitle: "Trouvez les réponses aux questions les plus courantes",
      notFoundTitle: "Vous n'avez pas trouvé de réponse ?", notFoundSubtitle: "Notre équipe de support est là pour vous aider", contactBtn: "Nous contacter",
      faqs: [
        { q: "Comment commencer à investir sur CashGold ?", a: "C'est simple ! Créez un compte gratuit, effectuez un dépôt minimum de $10 en USDT TRC20, et commencez à investir. Une fois votre dépôt validé par notre équipe, vous pouvez créer votre premier investissement et commencer à gagner 5% par jour." },
        { q: "Quel est le rendement quotidien ?", a: "Tous les niveaux VIP offrent un rendement garanti de 5% par jour sur votre montant investi. Ce rendement est calculé automatiquement et ajouté à votre solde disponible." },
        { q: "Quel est l'investissement minimum ?", a: "L'investissement minimum est de $10, ce qui correspond au niveau VIP 1. Vous pouvez investir plus pour accéder à des niveaux VIP supérieurs." },
        { q: "Quels sont les différents niveaux VIP ?", a: "Il existe 5 niveaux VIP : VIP 1 ($10-$99), VIP 2 ($100-$499), VIP 3 ($500-$999), VIP 4 ($1,000-$4,999), et VIP 5 ($5,000+). Tous offrent le même rendement de 5% par jour." },
        { q: "Comment puis-je déposer des fonds ?", a: "Nous acceptons les dépôts en USDT TRC20. Une fois connecté, allez dans l'onglet 'Déposer', copiez l'adresse de dépôt, envoyez vos USDT depuis votre portefeuille, puis soumettez le montant et le hash de transaction (optionnel) sur la plateforme. Votre dépôt sera validé par un administrateur." },
        { q: "Combien de temps prend la validation d'un dépôt ?", a: "Les dépôts sont validés manuellement par notre équipe dans un délai maximum de 12 heures. Nous nous efforçons de traiter toutes les demandes le plus rapidement possible." },
        { q: "Comment retirer mes gains ?", a: "Allez dans l'onglet 'Retirer' de votre tableau de bord, entrez le montant souhaité (minimum $10) et votre adresse de portefeuille USDT TRC20. Les retraits sont traités entre 30 minutes et 24 heures." },
        { q: "Y a-t-il des frais de retrait ?", a: "Non, nous ne facturons pas de frais de retrait. Le montant que vous demandez est celui que vous recevrez dans votre portefeuille." },
        { q: "Puis-je arrêter un investissement ?", a: "Oui, vous pouvez arrêter un investissement actif à tout moment. Votre capital investi ainsi que les profits générés seront immédiatement retournés à votre solde disponible." },
        { q: "Comment fonctionne le programme de parrainage ?", a: "Vous recevez un lien de parrainage unique. Partagez-le avec vos amis ! Lorsqu'ils s'inscrivent et effectuent un dépôt, vous recevez 5% de leur montant déposé en bonus immédiat." },
        { q: "Mes fonds sont-ils en sécurité ?", a: "Absolument. Nous utilisons un cryptage SSL de niveau bancaire et des protocoles de sécurité avancés pour protéger vos fonds et données personnelles." },
        { q: "Puis-je avoir plusieurs comptes ?", a: "Non, chaque utilisateur ne peut avoir qu'un seul compte sur la plateforme. Les comptes multiples sont interdits et peuvent entraîner une suspension." },
        { q: "Comment contacter le support ?", a: "Notre équipe de support est disponible 24/7. Vous pouvez nous contacter via le formulaire de contact ou par email à support@cashgold.com. Nous répondons généralement dans les 24 heures." }
      ]
    },
    aboutPage: {
      title: "À propos de", titleGold: "CashGold",
      missionTitle: "Notre Mission", missionText: "CashGold est né de la vision de démocratiser l'accès aux opportunités d'investissement de haute qualité. Notre mission est de fournir à chacun, indépendamment de son expérience financière ou de son capital de départ, la possibilité de faire fructifier son argent de manière sécurisée et transparente.",
      visionTitle: "Notre Vision", visionText: "Nous aspirons à devenir la plateforme d'investissement en ligne de référence, reconnue pour sa fiabilité, sa transparence et ses rendements constants. Notre engagement est de construire une communauté d'investisseurs prospères qui atteignent leurs objectifs financiers grâce à nos services.",
      whyTitle: "Pourquoi CashGold ?",
      whyItems: [
        { bold: "Rendements garantis", text: "5% de profit quotidien sur tous vos investissements" },
        { bold: "Investissement accessible", text: "Commencez avec seulement $10" },
        { bold: "Sécurité maximale", text: "Protection SSL et cryptage bancaire" },
        { bold: "Retraits rapides", text: "Accédez à vos fonds quand vous le souhaitez" },
        { bold: "Support 24/7", text: "Notre équipe est toujours là pour vous aider" }
      ],
      valuesTitle: "Nos Valeurs",
      values: [
        { title: "Transparence", text: "Communication claire et honnête avec nos investisseurs" },
        { title: "Sécurité", text: "Protection maximale de vos fonds et données" },
        { title: "Innovation", text: "Technologies de pointe pour une expérience optimale" }
      ],
      ctaTitle: "Prêt à commencer votre voyage avec", ctaTitleGold: "CashGold", ctaBtn: "Créer un compte"
    },
    contactPage: {
      title: "Contactez", titleGold: "CashGold", subtitle: "Notre équipe est là pour répondre à toutes vos questions",
      formTitle: "Envoyez-nous un message", name: "Nom complet", namePlaceholder: "Votre nom", email: "Email", emailPlaceholder: "votre@email.com",
      subject: "Sujet", subjectPlaceholder: "Sujet de votre message", message: "Message", messagePlaceholder: "Votre message...", sendBtn: "Envoyer le message",
      emailTitle: "Email", emailResponse: "Réponse sous 24h", hoursTitle: "Horaires", hoursValue: "Support 24/7", hoursSub: "Toujours disponibles pour vous",
      locationTitle: "Localisation", locationValue: "Service en ligne mondial", locationSub: "Accessible de partout",
      helpTitle: "Besoin d'aide immédiate ?", helpText: "Consultez notre page FAQ pour des réponses rapides aux questions courantes.", viewFaqBtn: "Voir la FAQ"
    }
  },

  en: {
    common: {
      backHome: "Back to Home", loading: "Loading...", copy: "Copy", copied: "Copied to clipboard!",
      yes: "Yes", no: "No", day: "day", vip: "VIP", admin: "Admin", balance: "Balance", invested: "Invested", user: "User",
      noDeposits: "No deposits", noWithdrawals: "No withdrawals", noUsers: "No users", withdrawAddress: "Withdrawal address:",
      createAccount: "Create Account", contactBtn: "Contact Us"
    },
    toast: {
      depositSubmitted: "Deposit request submitted! Awaiting admin approval.", depositError: "Deposit error",
      withdrawSubmitted: "Withdrawal request submitted!", withdrawError: "Withdrawal error",
      investCreated: "Investment created! VIP Level:", investError: "Investment error",
      investStopped: "Investment stopped and capital returned!", stopConfirm: "Are you sure you want to stop this investment?",
      loginSuccess: "Login successful!", adminLoginSuccess: "Admin login successful!", loginError: "Login error",
      registerSuccess: "🎉 Account created! $6 bonus added! Welcome to CashGold.", registerError: "Registration error",
      passwordMismatch: "Passwords do not match", passwordTooShort: "Password must be at least 8 characters (letters and numbers)",
      depositApproved: "Deposit approved!", depositRejected: "Deposit rejected", rejectConfirm: "Are you sure you want to reject this deposit?",
      withdrawCompleted: "Withdrawal completed!", userSuspended: "User suspended", suspendConfirm: "Are you sure you want to suspend this user?",
      userActivated: "User activated", accessDenied: "Access denied. Admin rights required.", addressCopied: "Address copied!",
      error: "Error", contactSent: "Message sent! We'll get back to you soon."
    },
    faqPage: {
      title: "Frequently Asked", titleGold: "Questions", subtitle: "Find answers to the most common questions",
      notFoundTitle: "Didn't find an answer?", notFoundSubtitle: "Our support team is here to help", contactBtn: "Contact Us",
      faqs: [
        { q: "How do I start investing on CashGold?", a: "It's simple! Create a free account, make a minimum $10 deposit in USDT TRC20, and start investing. Once your deposit is validated by our team, you can create your first investment and start earning 5% per day." },
        { q: "What is the daily return?", a: "All VIP levels offer a guaranteed 5% daily return on your invested amount. This return is calculated automatically and added to your available balance." },
        { q: "What is the minimum investment?", a: "The minimum investment is $10, corresponding to VIP level 1. You can invest more to access higher VIP levels." },
        { q: "What are the different VIP levels?", a: "There are 5 VIP levels: VIP 1 ($10-$99), VIP 2 ($100-$499), VIP 3 ($500-$999), VIP 4 ($1,000-$4,999), and VIP 5 ($5,000+). All offer the same 5% daily return." },
        { q: "How can I deposit funds?", a: "We accept deposits in USDT TRC20. Once logged in, go to the 'Deposit' tab, copy the deposit address, send your USDT from your wallet, then submit the amount and transaction hash (optional). Your deposit will be validated by an administrator." },
        { q: "How long does deposit validation take?", a: "Deposits are validated manually by our team within a maximum of 12 hours. We strive to process all requests as quickly as possible." },
        { q: "How do I withdraw my earnings?", a: "Go to the 'Withdraw' tab in your dashboard, enter the desired amount (minimum $10) and your USDT TRC20 wallet address. Withdrawals are processed within 30 minutes to 24 hours." },
        { q: "Are there withdrawal fees?", a: "No, we do not charge withdrawal fees. The amount you request is the amount you will receive in your wallet." },
        { q: "Can I stop an investment?", a: "Yes, you can stop an active investment at any time. Your invested capital and generated profits are immediately returned to your available balance." },
        { q: "How does the referral program work?", a: "You get a unique referral link. Share it with your friends! When they sign up and make a deposit, you receive 5% of their deposit as an instant bonus." },
        { q: "Are my funds safe?", a: "Absolutely. We use bank-level SSL encryption and advanced security protocols to protect your funds and personal data." },
        { q: "Can I have multiple accounts?", a: "No, each user may have only one account on the platform. Multiple accounts are prohibited and may result in suspension." },
        { q: "How do I contact support?", a: "Our support team is available 24/7. You can reach us via the contact form or by email at support@cashgold.com. We usually respond within 24 hours." }
      ]
    },
    aboutPage: {
      title: "About", titleGold: "CashGold",
      missionTitle: "Our Mission", missionText: "CashGold was born from the vision of democratizing access to high-quality investment opportunities. Our mission is to give everyone, regardless of their financial experience or starting capital, the ability to grow their money securely and transparently.",
      visionTitle: "Our Vision", visionText: "We aspire to become the reference online investment platform, recognized for its reliability, transparency and consistent returns. Our commitment is to build a community of prosperous investors who achieve their financial goals through our services.",
      whyTitle: "Why CashGold?",
      whyItems: [
        { bold: "Guaranteed returns", text: "5% daily profit on all your investments" },
        { bold: "Accessible investment", text: "Start with just $10" },
        { bold: "Maximum security", text: "SSL protection and bank-level encryption" },
        { bold: "Fast withdrawals", text: "Access your funds whenever you want" },
        { bold: "24/7 Support", text: "Our team is always here to help you" }
      ],
      valuesTitle: "Our Values",
      values: [
        { title: "Transparency", text: "Clear and honest communication with our investors" },
        { title: "Security", text: "Maximum protection of your funds and data" },
        { title: "Innovation", text: "Cutting-edge technology for an optimal experience" }
      ],
      ctaTitle: "Ready to start your journey with", ctaTitleGold: "CashGold", ctaBtn: "Create Account"
    },
    contactPage: {
      title: "Contact", titleGold: "CashGold", subtitle: "Our team is here to answer all your questions",
      formTitle: "Send us a message", name: "Full Name", namePlaceholder: "Your name", email: "Email", emailPlaceholder: "your@email.com",
      subject: "Subject", subjectPlaceholder: "Subject of your message", message: "Message", messagePlaceholder: "Your message...", sendBtn: "Send Message",
      emailTitle: "Email", emailResponse: "Response within 24h", hoursTitle: "Hours", hoursValue: "24/7 Support", hoursSub: "Always available for you",
      locationTitle: "Location", locationValue: "Global online service", locationSub: "Accessible from anywhere",
      helpTitle: "Need immediate help?", helpText: "Check our FAQ page for quick answers to common questions.", viewFaqBtn: "View FAQ"
    }
  },

  es: {
    common: {
      backHome: "Volver al Inicio", loading: "Cargando...", copy: "Copiar", copied: "¡Copiado al portapapeles!",
      yes: "Sí", no: "No", day: "día", vip: "VIP", admin: "Admin", balance: "Saldo", invested: "Invertido", user: "Usuario",
      noDeposits: "Sin depósitos", noWithdrawals: "Sin retiros", noUsers: "Sin usuarios", withdrawAddress: "Dirección de retiro:",
      createAccount: "Crear Cuenta", contactBtn: "Contáctenos"
    },
    toast: {
      depositSubmitted: "¡Solicitud de depósito enviada! Esperando aprobación del administrador.", depositError: "Error en el depósito",
      withdrawSubmitted: "¡Solicitud de retiro enviada!", withdrawError: "Error en el retiro",
      investCreated: "¡Inversión creada! Nivel VIP:", investError: "Error en la inversión",
      investStopped: "¡Inversión detenida y capital devuelto!", stopConfirm: "¿Está seguro de que desea detener esta inversión?",
      loginSuccess: "¡Inicio de sesión exitoso!", adminLoginSuccess: "¡Inicio de sesión admin exitoso!", loginError: "Error de conexión",
      registerSuccess: "🎉 ¡Cuenta creada! ¡Bono de $6 añadido! Bienvenido a CashGold.", registerError: "Error en el registro",
      passwordMismatch: "Las contraseñas no coinciden", passwordTooShort: "La contraseña debe tener al menos 8 caracteres (letras y números)",
      depositApproved: "¡Depósito aprobado!", depositRejected: "Depósito rechazado", rejectConfirm: "¿Está seguro de que desea rechazar este depósito?",
      withdrawCompleted: "¡Retiro completado!", userSuspended: "Usuario suspendido", suspendConfirm: "¿Está seguro de que desea suspender a este usuario?",
      userActivated: "Usuario activado", accessDenied: "Acceso denegado. Se requieren derechos de administrador.", addressCopied: "¡Dirección copiada!",
      error: "Error", contactSent: "¡Mensaje enviado! Le responderemos pronto."
    },
    faqPage: {
      title: "Preguntas", titleGold: "Frecuentes", subtitle: "Encuentre respuestas a las preguntas más comunes",
      notFoundTitle: "¿No encontró una respuesta?", notFoundSubtitle: "Nuestro equipo de soporte está aquí para ayudar", contactBtn: "Contáctenos",
      faqs: [
        { q: "¿Cómo empiezo a invertir en CashGold?", a: "¡Es simple! Cree una cuenta gratuita, realice un depósito mínimo de $10 en USDT TRC20 y comience a invertir. Una vez validado su depósito por nuestro equipo, puede crear su primera inversión y empezar a ganar 5% por día." },
        { q: "¿Cuál es el rendimiento diario?", a: "Todos los niveles VIP ofrecen un rendimiento garantizado del 5% diario sobre su monto invertido. Este rendimiento se calcula automáticamente y se añade a su saldo disponible." },
        { q: "¿Cuál es la inversión mínima?", a: "La inversión mínima es de $10, que corresponde al nivel VIP 1. Puede invertir más para acceder a niveles VIP superiores." },
        { q: "¿Cuáles son los diferentes niveles VIP?", a: "Hay 5 niveles VIP: VIP 1 ($10-$99), VIP 2 ($100-$499), VIP 3 ($500-$999), VIP 4 ($1,000-$4,999) y VIP 5 ($5,000+). Todos ofrecen el mismo rendimiento del 5% diario." },
        { q: "¿Cómo puedo depositar fondos?", a: "Aceptamos depósitos en USDT TRC20. Una vez conectado, vaya a la pestaña 'Depositar', copie la dirección de depósito, envíe sus USDT desde su billetera y luego envíe el monto y el hash de transacción (opcional). Su depósito será validado por un administrador." },
        { q: "¿Cuánto tarda la validación de un depósito?", a: "Los depósitos son validados manualmente por nuestro equipo en un máximo de 12 horas. Nos esforzamos por procesar todas las solicitudes lo más rápido posible." },
        { q: "¿Cómo retiro mis ganancias?", a: "Vaya a la pestaña 'Retirar' en su panel, ingrese el monto deseado (mínimo $10) y su dirección de billetera USDT TRC20. Los retiros se procesan entre 30 minutos y 24 horas." },
        { q: "¿Hay comisiones de retiro?", a: "No, no cobramos comisiones de retiro. El monto que solicita es el que recibirá en su billetera." },
        { q: "¿Puedo detener una inversión?", a: "Sí, puede detener una inversión activa en cualquier momento. Su capital invertido y las ganancias generadas se devuelven inmediatamente a su saldo disponible." },
        { q: "¿Cómo funciona el programa de referidos?", a: "Recibe un enlace de referido único. ¡Compártalo con sus amigos! Cuando se registren y realicen un depósito, recibe el 5% de su monto depositado como bono inmediato." },
        { q: "¿Están seguros mis fondos?", a: "Absolutamente. Utilizamos cifrado SSL de nivel bancario y protocolos de seguridad avanzados para proteger sus fondos y datos personales." },
        { q: "¿Puedo tener varias cuentas?", a: "No, cada usuario solo puede tener una cuenta en la plataforma. Las cuentas múltiples están prohibidas y pueden resultar en suspensión." },
        { q: "¿Cómo contacto al soporte?", a: "Nuestro equipo de soporte está disponible 24/7. Puede contactarnos a través del formulario de contacto o por correo a support@cashgold.com. Generalmente respondemos en 24 horas." }
      ]
    },
    aboutPage: {
      title: "Acerca de", titleGold: "CashGold",
      missionTitle: "Nuestra Misión", missionText: "CashGold nació de la visión de democratizar el acceso a oportunidades de inversión de alta calidad. Nuestra misión es brindar a todos, independientemente de su experiencia financiera o capital inicial, la posibilidad de hacer crecer su dinero de forma segura y transparente.",
      visionTitle: "Nuestra Visión", visionText: "Aspiramos a convertirnos en la plataforma de inversión en línea de referencia, reconocida por su fiabilidad, transparencia y rendimientos constantes. Nuestro compromiso es construir una comunidad de inversores prósperos que alcancen sus objetivos financieros a través de nuestros servicios.",
      whyTitle: "¿Por qué CashGold?",
      whyItems: [
        { bold: "Rendimientos garantizados", text: "5% de ganancia diaria en todas sus inversiones" },
        { bold: "Inversión accesible", text: "Comience con solo $10" },
        { bold: "Seguridad máxima", text: "Protección SSL y cifrado de nivel bancario" },
        { bold: "Retiros rápidos", text: "Acceda a sus fondos cuando quiera" },
        { bold: "Soporte 24/7", text: "Nuestro equipo siempre está aquí para ayudarle" }
      ],
      valuesTitle: "Nuestros Valores",
      values: [
        { title: "Transparencia", text: "Comunicación clara y honesta con nuestros inversores" },
        { title: "Seguridad", text: "Máxima protección de sus fondos y datos" },
        { title: "Innovación", text: "Tecnología de vanguardia para una experiencia óptima" }
      ],
      ctaTitle: "¿Listo para comenzar su viaje con", ctaTitleGold: "CashGold", ctaBtn: "Crear Cuenta"
    },
    contactPage: {
      title: "Contacte a", titleGold: "CashGold", subtitle: "Nuestro equipo está aquí para responder todas sus preguntas",
      formTitle: "Envíenos un mensaje", name: "Nombre completo", namePlaceholder: "Su nombre", email: "Correo Electrónico", emailPlaceholder: "su@email.com",
      subject: "Asunto", subjectPlaceholder: "Asunto de su mensaje", message: "Mensaje", messagePlaceholder: "Su mensaje...", sendBtn: "Enviar Mensaje",
      emailTitle: "Correo", emailResponse: "Respuesta en 24h", hoursTitle: "Horario", hoursValue: "Soporte 24/7", hoursSub: "Siempre disponibles para usted",
      locationTitle: "Ubicación", locationValue: "Servicio en línea mundial", locationSub: "Accesible desde cualquier lugar",
      helpTitle: "¿Necesita ayuda inmediata?", helpText: "Consulte nuestra página de FAQ para respuestas rápidas a preguntas comunes.", viewFaqBtn: "Ver FAQ"
    }
  },

  ar: {
    common: {
      backHome: "العودة للرئيسية", loading: "جار التحميل...", copy: "نسخ", copied: "تم النسخ إلى الحافظة!",
      yes: "نعم", no: "لا", day: "يوم", vip: "VIP", admin: "المشرف", balance: "الرصيد", invested: "المستثمر", user: "المستخدم",
      noDeposits: "لا توجد إيداعات", noWithdrawals: "لا توجد سحوبات", noUsers: "لا يوجد مستخدمون", withdrawAddress: "عنوان السحب:",
      createAccount: "إنشاء حساب", contactBtn: "اتصل بنا"
    },
    toast: {
      depositSubmitted: "تم إرسال طلب الإيداع! في انتظار موافقة المشرف.", depositError: "خطأ في الإيداع",
      withdrawSubmitted: "تم إرسال طلب السحب!", withdrawError: "خطأ في السحب",
      investCreated: "تم إنشاء الاستثمار! مستوى VIP:", investError: "خطأ في الاستثمار",
      investStopped: "تم إيقاف الاستثمار وإعادة رأس المال!", stopConfirm: "هل أنت متأكد أنك تريد إيقاف هذا الاستثمار؟",
      loginSuccess: "تم تسجيل الدخول بنجاح!", adminLoginSuccess: "تم تسجيل دخول المشرف بنجاح!", loginError: "خطأ في تسجيل الدخول",
      registerSuccess: "🎉 تم إنشاء الحساب! تمت إضافة مكافأة 6$! مرحباً بك في CashGold.", registerError: "خطأ في التسجيل",
      passwordMismatch: "كلمات المرور غير متطابقة", passwordTooShort: "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل (حروف وأرقام)",
      depositApproved: "تمت الموافقة على الإيداع!", depositRejected: "تم رفض الإيداع", rejectConfirm: "هل أنت متأكد أنك تريد رفض هذا الإيداع؟",
      withdrawCompleted: "تم إكمال السحب!", userSuspended: "تم تعليق المستخدم", suspendConfirm: "هل أنت متأكد أنك تريد تعليق هذا المستخدم؟",
      userActivated: "تم تنشيط المستخدم", accessDenied: "تم رفض الوصول. مطلوب صلاحيات المشرف.", addressCopied: "تم نسخ العنوان!",
      error: "خطأ", contactSent: "تم إرسال الرسالة! سنرد عليك قريباً."
    },
    faqPage: {
      title: "الأسئلة", titleGold: "الشائعة", subtitle: "اعثر على إجابات لأكثر الأسئلة شيوعاً",
      notFoundTitle: "لم تجد إجابة؟", notFoundSubtitle: "فريق الدعم لدينا هنا لمساعدتك", contactBtn: "اتصل بنا",
      faqs: [
        { q: "كيف أبدأ الاستثمار في CashGold؟", a: "الأمر بسيط! أنشئ حساباً مجانياً، وقم بإيداع 10$ كحد أدنى بعملة USDT TRC20، وابدأ الاستثمار. بمجرد التحقق من إيداعك من قبل فريقنا، يمكنك إنشاء استثمارك الأول وبدء ربح 5% يومياً." },
        { q: "ما هو العائد اليومي؟", a: "توفر جميع مستويات VIP عائداً مضموناً بنسبة 5% يومياً على مبلغك المستثمر. يُحسب هذا العائد تلقائياً ويُضاف إلى رصيدك المتاح." },
        { q: "ما هو الحد الأدنى للاستثمار؟", a: "الحد الأدنى للاستثمار هو 10$، وهو ما يقابل مستوى VIP 1. يمكنك استثمار المزيد للوصول إلى مستويات VIP أعلى." },
        { q: "ما هي مستويات VIP المختلفة؟", a: "هناك 5 مستويات VIP: VIP 1 ($10-$99)، VIP 2 ($100-$499)، VIP 3 ($500-$999)، VIP 4 ($1,000-$4,999)، وVIP 5 ($5,000+). جميعها توفر نفس العائد اليومي 5%." },
        { q: "كيف يمكنني إيداع الأموال؟", a: "نقبل الإيداعات بعملة USDT TRC20. بعد تسجيل الدخول، اذهب إلى تبويب 'إيداع'، وانسخ عنوان الإيداع، وأرسل USDT من محفظتك، ثم قدّم المبلغ وتجزئة المعاملة (اختياري). سيتم التحقق من إيداعك من قبل المشرف." },
        { q: "كم يستغرق التحقق من الإيداع؟", a: "يتم التحقق من الإيداعات يدوياً من قبل فريقنا خلال 12 ساعة كحد أقصى. نسعى لمعالجة جميع الطلبات بأسرع وقت ممكن." },
        { q: "كيف أسحب أرباحي؟", a: "اذهب إلى تبويب 'سحب' في لوحة التحكم، وأدخل المبلغ المطلوب (الحد الأدنى 10$) وعنوان محفظتك USDT TRC20. تتم معالجة السحوبات خلال 30 دقيقة إلى 24 ساعة." },
        { q: "هل هناك رسوم سحب؟", a: "لا، نحن لا نفرض رسوم سحب. المبلغ الذي تطلبه هو المبلغ الذي ستستلمه في محفظتك." },
        { q: "هل يمكنني إيقاف استثمار؟", a: "نعم، يمكنك إيقاف استثمار نشط في أي وقت. سيتم إرجاع رأس المال المستثمر والأرباح المحققة فوراً إلى رصيدك المتاح." },
        { q: "كيف يعمل برنامج الإحالة؟", a: "تحصل على رابط إحالة فريد. شاركه مع أصدقائك! عندما يسجلون ويقومون بإيداع، تحصل على 5% من مبلغ إيداعهم كمكافأة فورية." },
        { q: "هل أموالي آمنة؟", a: "بالتأكيد. نستخدم تشفير SSL على مستوى البنوك وبروتوكولات أمان متقدمة لحماية أموالك وبياناتك الشخصية." },
        { q: "هل يمكنني امتلاك عدة حسابات؟", a: "لا، يمكن لكل مستخدم امتلاك حساب واحد فقط على المنصة. الحسابات المتعددة محظورة وقد تؤدي إلى التعليق." },
        { q: "كيف أتواصل مع الدعم؟", a: "فريق الدعم لدينا متاح 24/7. يمكنك التواصل معنا عبر نموذج الاتصال أو بالبريد support@cashgold.com. عادة نرد خلال 24 ساعة." }
      ]
    },
    aboutPage: {
      title: "عن", titleGold: "CashGold",
      missionTitle: "مهمتنا", missionText: "وُلدت CashGold من رؤية دمقرطة الوصول إلى فرص الاستثمار عالية الجودة. مهمتنا هي منح الجميع، بغض النظر عن خبرتهم المالية أو رأس مالهم الأولي، القدرة على تنمية أموالهم بأمان وشفافية.",
      visionTitle: "رؤيتنا", visionText: "نطمح لأن نصبح منصة الاستثمار الإلكترونية المرجعية، المعروفة بموثوقيتها وشفافيتها وعوائدها الثابتة. التزامنا هو بناء مجتمع من المستثمرين الناجحين الذين يحققون أهدافهم المالية من خلال خدماتنا.",
      whyTitle: "لماذا CashGold؟",
      whyItems: [
        { bold: "عوائد مضمونة", text: "5% ربح يومي على جميع استثماراتك" },
        { bold: "استثمار في المتناول", text: "ابدأ بـ 10$ فقط" },
        { bold: "أمان أقصى", text: "حماية SSL وتشفير على مستوى البنوك" },
        { bold: "سحب سريع", text: "الوصول إلى أموالك متى شئت" },
        { bold: "دعم 24/7", text: "فريقنا دائماً هنا لمساعدتك" }
      ],
      valuesTitle: "قيمنا",
      values: [
        { title: "الشفافية", text: "تواصل واضح وصادق مع مستثمرينا" },
        { title: "الأمان", text: "حماية قصوى لأموالك وبياناتك" },
        { title: "الابتكار", text: "تقنيات متطورة لتجربة مثالية" }
      ],
      ctaTitle: "هل أنت مستعد لبدء رحلتك مع", ctaTitleGold: "CashGold", ctaBtn: "إنشاء حساب"
    },
    contactPage: {
      title: "اتصل بـ", titleGold: "CashGold", subtitle: "فريقنا هنا للإجابة على جميع أسئلتك",
      formTitle: "أرسل لنا رسالة", name: "الاسم الكامل", namePlaceholder: "اسمك", email: "البريد الإلكتروني", emailPlaceholder: "your@email.com",
      subject: "الموضوع", subjectPlaceholder: "موضوع رسالتك", message: "الرسالة", messagePlaceholder: "رسالتك...", sendBtn: "إرسال الرسالة",
      emailTitle: "البريد الإلكتروني", emailResponse: "الرد خلال 24 ساعة", hoursTitle: "ساعات العمل", hoursValue: "دعم 24/7", hoursSub: "متاحون دائماً لك",
      locationTitle: "الموقع", locationValue: "خدمة عبر الإنترنت عالمياً", locationSub: "متاح من أي مكان",
      helpTitle: "تحتاج مساعدة فورية؟", helpText: "راجع صفحة الأسئلة الشائعة للحصول على إجابات سريعة.", viewFaqBtn: "عرض الأسئلة الشائعة"
    }
  },

  zh: {
    common: {
      backHome: "返回主页", loading: "加载中...", copy: "复制", copied: "已复制到剪贴板！",
      yes: "是", no: "否", day: "天", vip: "VIP", admin: "管理", balance: "余额", invested: "已投资", user: "用户",
      noDeposits: "没有存款", noWithdrawals: "没有提款", noUsers: "没有用户", withdrawAddress: "提款地址：",
      createAccount: "创建账户", contactBtn: "联系我们"
    },
    toast: {
      depositSubmitted: "存款请求已提交！等待管理员批准。", depositError: "存款错误",
      withdrawSubmitted: "提款请求已提交！", withdrawError: "提款错误",
      investCreated: "投资已创建！VIP级别：", investError: "投资错误",
      investStopped: "投资已停止，本金已返还！", stopConfirm: "您确定要停止此投资吗？",
      loginSuccess: "登录成功！", adminLoginSuccess: "管理员登录成功！", loginError: "登录错误",
      registerSuccess: "🎉 账户已创建！已添加$6奖金！欢迎来到CashGold。", registerError: "注册错误",
      passwordMismatch: "密码不匹配", passwordTooShort: "密码至少需要8个字符（字母和数字）",
      depositApproved: "存款已批准！", depositRejected: "存款已拒绝", rejectConfirm: "您确定要拒绝此存款吗？",
      withdrawCompleted: "提款已完成！", userSuspended: "用户已暂停", suspendConfirm: "您确定要暂停此用户吗？",
      userActivated: "用户已激活", accessDenied: "访问被拒绝。需要管理员权限。", addressCopied: "地址已复制！",
      error: "错误", contactSent: "消息已发送！我们会尽快回复您。"
    },
    faqPage: {
      title: "常见", titleGold: "问题", subtitle: "查找最常见问题的答案",
      notFoundTitle: "没有找到答案？", notFoundSubtitle: "我们的支持团队随时为您提供帮助", contactBtn: "联系我们",
      faqs: [
        { q: "如何在CashGold上开始投资？", a: "很简单！创建一个免费账户，用USDT TRC20存入最低$10，然后开始投资。一旦您的存款经我们团队验证，您就可以创建第一笔投资并开始每天赚取5%。" },
        { q: "每日回报是多少？", a: "所有VIP级别对您的投资金额提供保证的每日5%回报。此回报会自动计算并添加到您的可用余额中。" },
        { q: "最低投资额是多少？", a: "最低投资额为$10，对应VIP 1级别。您可以投资更多以获得更高的VIP级别。" },
        { q: "有哪些不同的VIP级别？", a: "共有5个VIP级别：VIP 1（$10-$99）、VIP 2（$100-$499）、VIP 3（$500-$999）、VIP 4（$1,000-$4,999）和VIP 5（$5,000+）。全部提供相同的每日5%回报。" },
        { q: "我如何存入资金？", a: "我们接受USDT TRC20存款。登录后，进入'存款'选项卡，复制存款地址，从您的钱包发送USDT，然后提交金额和交易哈希（可选）。您的存款将由管理员验证。" },
        { q: "存款验证需要多长时间？", a: "存款由我们的团队手动验证，最长12小时。我们努力尽快处理所有请求。" },
        { q: "如何提取我的收益？", a: "进入仪表板中的'提款'选项卡，输入所需金额（最低$10）和您的USDT TRC20钱包地址。提款在30分钟到24小时内处理。" },
        { q: "有提款费用吗？", a: "没有，我们不收取提款费用。您请求的金额就是您将在钱包中收到的金额。" },
        { q: "我可以停止投资吗？", a: "可以，您可以随时停止活跃的投资。您投资的本金和产生的利润会立即返还到您的可用余额。" },
        { q: "推荐计划如何运作？", a: "您会获得一个唯一的推荐链接。与您的朋友分享！当他们注册并存款时，您将获得其存款金额的5%作为即时奖金。" },
        { q: "我的资金安全吗？", a: "绝对安全。我们使用银行级SSL加密和先进的安全协议来保护您的资金和个人数据。" },
        { q: "我可以拥有多个账户吗？", a: "不可以，每个用户在平台上只能拥有一个账户。禁止多个账户，可能导致暂停。" },
        { q: "如何联系客服？", a: "我们的支持团队24/7可用。您可以通过联系表格或发送邮件至support@cashgold.com联系我们。我们通常在24小时内回复。" }
      ]
    },
    aboutPage: {
      title: "关于", titleGold: "CashGold",
      missionTitle: "我们的使命", missionText: "CashGold诞生于让高质量投资机会普及化的愿景。我们的使命是让每个人，无论其财务经验或起始资本如何，都能安全透明地增值资金。",
      visionTitle: "我们的愿景", visionText: "我们立志成为标杆性的在线投资平台，以其可靠性、透明度和稳定回报著称。我们承诺建立一个繁荣的投资者社区，通过我们的服务实现他们的财务目标。",
      whyTitle: "为什么选择CashGold？",
      whyItems: [
        { bold: "保证回报", text: "所有投资每日5%利润" },
        { bold: "投资门槛低", text: "仅需$10即可开始" },
        { bold: "最高安全性", text: "SSL保护和银行级加密" },
        { bold: "快速提款", text: "随时访问您的资金" },
        { bold: "24/7支持", text: "我们的团队随时为您提供帮助" }
      ],
      valuesTitle: "我们的价值观",
      values: [
        { title: "透明", text: "与投资者清晰诚实的沟通" },
        { title: "安全", text: "最大程度保护您的资金和数据" },
        { title: "创新", text: "尖端技术带来最佳体验" }
      ],
      ctaTitle: "准备好开始您的旅程了吗", ctaTitleGold: "CashGold", ctaBtn: "创建账户"
    },
    contactPage: {
      title: "联系", titleGold: "CashGold", subtitle: "我们的团队随时回答您的所有问题",
      formTitle: "给我们发消息", name: "全名", namePlaceholder: "您的姓名", email: "电子邮件", emailPlaceholder: "your@email.com",
      subject: "主题", subjectPlaceholder: "您的消息主题", message: "消息", messagePlaceholder: "您的消息...", sendBtn: "发送消息",
      emailTitle: "电子邮件", emailResponse: "24小时内回复", hoursTitle: "时间", hoursValue: "24/7支持", hoursSub: "始终为您服务",
      locationTitle: "位置", locationValue: "全球在线服务", locationSub: "随处可访问",
      helpTitle: "需要即时帮助？", helpText: "查看我们的FAQ页面获取常见问题的快速答案。", viewFaqBtn: "查看FAQ"
    }
  },

  de: {
    common: {
      backHome: "Zurück zur Startseite", loading: "Wird geladen...", copy: "Kopieren", copied: "In die Zwischenablage kopiert!",
      yes: "Ja", no: "Nein", day: "Tag", vip: "VIP", admin: "Admin", balance: "Guthaben", invested: "Investiert", user: "Benutzer",
      noDeposits: "Keine Einzahlungen", noWithdrawals: "Keine Abhebungen", noUsers: "Keine Benutzer", withdrawAddress: "Auszahlungsadresse:",
      createAccount: "Konto Erstellen", contactBtn: "Kontaktieren Sie uns"
    },
    toast: {
      depositSubmitted: "Einzahlungsanfrage gesendet! Warten auf Admin-Genehmigung.", depositError: "Einzahlungsfehler",
      withdrawSubmitted: "Abhebungsanfrage gesendet!", withdrawError: "Abhebungsfehler",
      investCreated: "Investition erstellt! VIP-Level:", investError: "Investitionsfehler",
      investStopped: "Investition gestoppt und Kapital zurückgegeben!", stopConfirm: "Sind Sie sicher, dass Sie diese Investition stoppen möchten?",
      loginSuccess: "Anmeldung erfolgreich!", adminLoginSuccess: "Admin-Anmeldung erfolgreich!", loginError: "Anmeldefehler",
      registerSuccess: "🎉 Konto erstellt! $6 Bonus hinzugefügt! Willkommen bei CashGold.", registerError: "Registrierungsfehler",
      passwordMismatch: "Passwörter stimmen nicht überein", passwordTooShort: "Das Passwort muss mindestens 8 Zeichen enthalten (Buchstaben und Zahlen)",
      depositApproved: "Einzahlung genehmigt!", depositRejected: "Einzahlung abgelehnt", rejectConfirm: "Sind Sie sicher, dass Sie diese Einzahlung ablehnen möchten?",
      withdrawCompleted: "Abhebung abgeschlossen!", userSuspended: "Benutzer gesperrt", suspendConfirm: "Sind Sie sicher, dass Sie diesen Benutzer sperren möchten?",
      userActivated: "Benutzer aktiviert", accessDenied: "Zugriff verweigert. Admin-Rechte erforderlich.", addressCopied: "Adresse kopiert!",
      error: "Fehler", contactSent: "Nachricht gesendet! Wir melden uns bald bei Ihnen."
    },
    faqPage: {
      title: "Häufig gestellte", titleGold: "Fragen", subtitle: "Finden Sie Antworten auf die häufigsten Fragen",
      notFoundTitle: "Keine Antwort gefunden?", notFoundSubtitle: "Unser Support-Team hilft Ihnen gerne", contactBtn: "Kontaktieren Sie uns",
      faqs: [
        { q: "Wie beginne ich mit dem Investieren bei CashGold?", a: "Ganz einfach! Erstellen Sie ein kostenloses Konto, tätigen Sie eine Mindesteinzahlung von $10 in USDT TRC20 und beginnen Sie zu investieren. Sobald Ihre Einzahlung von unserem Team validiert wurde, können Sie Ihre erste Investition erstellen und täglich 5% verdienen." },
        { q: "Wie hoch ist die tägliche Rendite?", a: "Alle VIP-Stufen bieten eine garantierte tägliche Rendite von 5% auf Ihren investierten Betrag. Diese Rendite wird automatisch berechnet und Ihrem verfügbaren Guthaben gutgeschrieben." },
        { q: "Wie hoch ist die Mindestinvestition?", a: "Die Mindestinvestition beträgt $10, was VIP-Stufe 1 entspricht. Sie können mehr investieren, um höhere VIP-Stufen zu erreichen." },
        { q: "Was sind die verschiedenen VIP-Stufen?", a: "Es gibt 5 VIP-Stufen: VIP 1 ($10-$99), VIP 2 ($100-$499), VIP 3 ($500-$999), VIP 4 ($1.000-$4.999) und VIP 5 ($5.000+). Alle bieten die gleiche tägliche Rendite von 5%." },
        { q: "Wie kann ich Gelder einzahlen?", a: "Wir akzeptieren Einzahlungen in USDT TRC20. Gehen Sie nach dem Anmelden zum Reiter 'Einzahlen', kopieren Sie die Einzahlungsadresse, senden Sie Ihre USDT aus Ihrer Wallet und übermitteln Sie dann den Betrag und den Transaktions-Hash (optional). Ihre Einzahlung wird von einem Administrator validiert." },
        { q: "Wie lange dauert die Validierung einer Einzahlung?", a: "Einzahlungen werden von unserem Team manuell innerhalb von maximal 12 Stunden validiert. Wir bemühen uns, alle Anfragen so schnell wie möglich zu bearbeiten." },
        { q: "Wie hebe ich meine Gewinne ab?", a: "Gehen Sie zum Reiter 'Abheben' in Ihrem Dashboard, geben Sie den gewünschten Betrag (mindestens $10) und Ihre USDT TRC20-Wallet-Adresse ein. Abhebungen werden innerhalb von 30 Minuten bis 24 Stunden bearbeitet." },
        { q: "Gibt es Abhebungsgebühren?", a: "Nein, wir erheben keine Abhebungsgebühren. Der angeforderte Betrag ist der Betrag, den Sie in Ihrer Wallet erhalten." },
        { q: "Kann ich eine Investition stoppen?", a: "Ja, Sie können eine aktive Investition jederzeit stoppen. Ihr investiertes Kapital und die erzielten Gewinne werden sofort Ihrem verfügbaren Guthaben gutgeschrieben." },
        { q: "Wie funktioniert das Empfehlungsprogramm?", a: "Sie erhalten einen einzigartigen Empfehlungslink. Teilen Sie ihn mit Ihren Freunden! Wenn sie sich registrieren und eine Einzahlung tätigen, erhalten Sie 5% ihres eingezahlten Betrags als sofortigen Bonus." },
        { q: "Sind meine Gelder sicher?", a: "Absolut. Wir verwenden SSL-Verschlüsselung auf Bankniveau und fortschrittliche Sicherheitsprotokolle, um Ihre Gelder und persönlichen Daten zu schützen." },
        { q: "Kann ich mehrere Konten haben?", a: "Nein, jeder Benutzer darf nur ein Konto auf der Plattform haben. Mehrere Konten sind verboten und können zu einer Sperrung führen." },
        { q: "Wie kontaktiere ich den Support?", a: "Unser Support-Team ist rund um die Uhr verfügbar. Sie können uns über das Kontaktformular oder per E-Mail an support@cashgold.com erreichen. Wir antworten in der Regel innerhalb von 24 Stunden." }
      ]
    },
    aboutPage: {
      title: "Über", titleGold: "CashGold",
      missionTitle: "Unsere Mission", missionText: "CashGold entstand aus der Vision, den Zugang zu hochwertigen Investitionsmöglichkeiten zu demokratisieren. Unsere Mission ist es, jedem – unabhängig von seiner finanziellen Erfahrung oder seinem Startkapital – die Möglichkeit zu geben, sein Geld sicher und transparent zu vermehren.",
      visionTitle: "Unsere Vision", visionText: "Wir streben danach, die führende Online-Investitionsplattform zu werden, bekannt für ihre Zuverlässigkeit, Transparenz und konstanten Renditen. Unser Engagement ist der Aufbau einer Gemeinschaft erfolgreicher Investoren, die durch unsere Dienste ihre finanziellen Ziele erreichen.",
      whyTitle: "Warum CashGold?",
      whyItems: [
        { bold: "Garantierte Renditen", text: "5% täglicher Gewinn auf alle Ihre Investitionen" },
        { bold: "Zugängliche Investition", text: "Beginnen Sie mit nur $10" },
        { bold: "Maximale Sicherheit", text: "SSL-Schutz und Verschlüsselung auf Bankniveau" },
        { bold: "Schnelle Abhebungen", text: "Greifen Sie jederzeit auf Ihre Gelder zu" },
        { bold: "24/7 Support", text: "Unser Team ist immer für Sie da" }
      ],
      valuesTitle: "Unsere Werte",
      values: [
        { title: "Transparenz", text: "Klare und ehrliche Kommunikation mit unseren Investoren" },
        { title: "Sicherheit", text: "Maximaler Schutz Ihrer Gelder und Daten" },
        { title: "Innovation", text: "Modernste Technologie für ein optimales Erlebnis" }
      ],
      ctaTitle: "Bereit, Ihre Reise zu beginnen mit", ctaTitleGold: "CashGold", ctaBtn: "Konto Erstellen"
    },
    contactPage: {
      title: "Kontaktieren Sie", titleGold: "CashGold", subtitle: "Unser Team beantwortet gerne alle Ihre Fragen",
      formTitle: "Senden Sie uns eine Nachricht", name: "Vollständiger Name", namePlaceholder: "Ihr Name", email: "E-Mail", emailPlaceholder: "ihre@email.com",
      subject: "Betreff", subjectPlaceholder: "Betreff Ihrer Nachricht", message: "Nachricht", messagePlaceholder: "Ihre Nachricht...", sendBtn: "Nachricht Senden",
      emailTitle: "E-Mail", emailResponse: "Antwort innerhalb von 24h", hoursTitle: "Öffnungszeiten", hoursValue: "24/7 Support", hoursSub: "Immer für Sie da",
      locationTitle: "Standort", locationValue: "Globaler Online-Service", locationSub: "Von überall erreichbar",
      helpTitle: "Sofortige Hilfe benötigt?", helpText: "Besuchen Sie unsere FAQ-Seite für schnelle Antworten auf häufige Fragen.", viewFaqBtn: "FAQ Ansehen"
    }
  }
};
