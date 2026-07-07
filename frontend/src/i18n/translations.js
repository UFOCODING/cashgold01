import { pageTranslations } from './translationsPages';

const base = {
  fr: {
    // Navigation
    nav: {
      home: "Accueil",
      about: "À propos",
      faq: "FAQ",
      contact: "Contact",
      login: "Connexion",
      register: "Inscription",
      dashboard: "Tableau de bord",
      admin: "Admin",
      logout: "Déconnexion",
      userDashboard: "Dashboard Utilisateur"
    },
    
    // Hero Section
    hero: {
      title: "Investissez dans votre",
      titleGold: "Avenir Doré",
      subtitle: "Plateforme d'investissement en ligne sécurisée avec des rendements quotidiens garantis de 5%",
      startInvesting: "Commencer à investir",
      learnMore: "En savoir plus",
      dailyReturn: "Rendement quotidien",
      minInvestment: "Investissement minimum",
      support: "Support client"
    },
    
    // VIP Levels
    vip: {
      title: "Niveaux",
      titleGold: "VIP",
      subtitle: "Choisissez votre niveau d'investissement",
      perDay: "par jour"
    },
    
    // Features
    features: {
      title: "Pourquoi",
      titleGold: "CashGold",
      security: {
        title: "Sécurité maximale",
        desc: "Protection SSL, 2FA et cryptage de niveau bancaire pour vos fonds"
      },
      profits: {
        title: "Profits garantis",
        desc: "Recevez 5% de rendement quotidien sur tous vos investissements"
      },
      withdrawal: {
        title: "Retraits instantanés",
        desc: "Retirez vos gains à tout moment via USDT TRC20"
      }
    },
    
    // CTA
    cta: {
      title: "Prêt à commencer votre",
      titleGold: "voyage d'investissement",
      subtitle: "Rejoignez des milliers d'investisseurs qui font fructifier leur argent avec CashGold",
      button: "Créer un compte gratuit"
    },
    
    // Auth
    auth: {
      loginTitle: "Connexion",
      loginSubtitle: "Accédez à votre tableau de bord",
      registerTitle: "Inscription",
      registerSubtitle: "Créez votre compte d'investissement",
      email: "Email",
      username: "Nom d'utilisateur",
      password: "Mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      referralCode: "Code de parrainage (optionnel)",
      signIn: "Se connecter",
      signUp: "S'inscrire",
      noAccount: "Pas encore de compte ?",
      haveAccount: "Déjà un compte ?",
      backHome: "Retour à l'accueil"
    },
    
    // Dashboard
    dashboard: {
      hello: "Bonjour,",
      availableBalance: "Solde disponible",
      investedBalance: "Solde investi",
      totalProfits: "Profits totaux",
      vipLevel: "Niveau VIP",
      tabs: {
        invest: "Investir",
        deposit: "Déposer",
        withdraw: "Retirer",
        history: "Historique",
        referral: "Parrainage"
      },
      invest: {
        title: "Créer un investissement",
        subtitle: "Investissez votre solde et gagnez 5% par jour",
        amount: "Montant à investir",
        min: "Minimum $10",
        button: "Investir maintenant",
        active: "Mes investissements actifs",
        noActive: "Aucun investissement actif",
        earned: "Gagné",
        stop: "Arrêter"
      },
      deposit: {
        title: "Déposer des fonds",
        subtitle: "Envoyez des USDT TRC20 à l'adresse ci-dessous",
        address: "Adresse de dépôt (USDT TRC20)",
        copy: "Copier",
        amount: "Montant déposé",
        txHash: "Hash de transaction (optionnel)",
        button: "Soumettre le dépôt",
        history: "Historique des dépôts",
        noDeposits: "Aucun dépôt"
      },
      withdraw: {
        title: "Retirer des fonds",
        subtitle: "Retirez votre solde en USDT TRC20",
        amount: "Montant à retirer",
        available: "Disponible",
        wallet: "Adresse de portefeuille (USDT TRC20)",
        button: "Demander un retrait",
        history: "Historique des retraits",
        noWithdrawals: "Aucun retrait"
      },
      referral: {
        title: "Programme de parrainage",
        subtitle: "Gagnez 5% sur les dépôts de vos filleuls",
        yourLink: "Votre lien de parrainage",
        myReferrals: "Mes filleuls",
        noReferrals: "Aucun filleul pour le moment",
        bonusEarned: "Bonus gagné"
      },
      status: {
        pending: "En attente",
        approved: "Approuvé",
        rejected: "Rejeté",
        completed: "Complété",
        processing: "En traitement"
      }
    },
    
    // Admin
    admin: {
      title: "CashGold Admin",
      totalUsers: "Utilisateurs totaux",
      totalDeposits: "Dépôts totaux",
      totalWithdrawals: "Retraits totaux",
      platformProfit: "Profit plateforme",
      tabs: {
        deposits: "Dépôts",
        withdrawals: "Retraits",
        users: "Utilisateurs"
      },
      deposits: {
        title: "Gestion des dépôts",
        approve: "Approuver",
        reject: "Rejeter",
        user: "Utilisateur"
      },
      withdrawals: {
        title: "Gestion des retraits",
        complete: "Marquer comme complété"
      },
      users: {
        title: "Gestion des utilisateurs",
        balance: "Solde",
        invested: "Investi",
        suspend: "Suspendre",
        activate: "Activer",
        active: "Actif",
        suspended: "Suspendu"
      }
    },
    
    // Footer
    footer: {
      tagline: "Investissez intelligemment, gagnez quotidiennement",
      quickLinks: "Liens rapides",
      legal: "Légal",
      terms: "Conditions d'utilisation",
      privacy: "Politique de confidentialité",
      contactUs: "Formulaire de contact",
      rights: "Tous droits réservés"
    }
  },
  
  en: {
    nav: {
      home: "Home",
      about: "About",
      faq: "FAQ",
      contact: "Contact",
      login: "Login",
      register: "Sign Up",
      dashboard: "Dashboard",
      admin: "Admin",
      logout: "Logout",
      userDashboard: "User Dashboard"
    },
    
    hero: {
      title: "Invest in your",
      titleGold: "Golden Future",
      subtitle: "Secure online investment platform with guaranteed daily returns of 5%",
      startInvesting: "Start Investing",
      learnMore: "Learn More",
      dailyReturn: "Daily Return",
      minInvestment: "Minimum Investment",
      support: "Customer Support"
    },
    
    vip: {
      title: "VIP",
      titleGold: "Levels",
      subtitle: "Choose your investment level",
      perDay: "per day"
    },
    
    features: {
      title: "Why",
      titleGold: "CashGold",
      security: {
        title: "Maximum Security",
        desc: "SSL protection, 2FA and bank-level encryption for your funds"
      },
      profits: {
        title: "Guaranteed Profits",
        desc: "Receive 5% daily return on all your investments"
      },
      withdrawal: {
        title: "Instant Withdrawals",
        desc: "Withdraw your earnings anytime via USDT TRC20"
      }
    },
    
    cta: {
      title: "Ready to start your",
      titleGold: "investment journey",
      subtitle: "Join thousands of investors growing their wealth with CashGold",
      button: "Create Free Account"
    },
    
    auth: {
      loginTitle: "Login",
      loginSubtitle: "Access your dashboard",
      registerTitle: "Sign Up",
      registerSubtitle: "Create your investment account",
      email: "Email",
      username: "Username",
      password: "Password",
      confirmPassword: "Confirm Password",
      referralCode: "Referral Code (optional)",
      signIn: "Sign In",
      signUp: "Sign Up",
      noAccount: "Don't have an account?",
      haveAccount: "Already have an account?",
      backHome: "Back to Home"
    },
    
    dashboard: {
      hello: "Hello,",
      availableBalance: "Available Balance",
      investedBalance: "Invested Balance",
      totalProfits: "Total Profits",
      vipLevel: "VIP Level",
      tabs: {
        invest: "Invest",
        deposit: "Deposit",
        withdraw: "Withdraw",
        history: "History",
        referral: "Referral"
      },
      invest: {
        title: "Create Investment",
        subtitle: "Invest your balance and earn 5% daily",
        amount: "Amount to invest",
        min: "Minimum $10",
        button: "Invest Now",
        active: "My Active Investments",
        noActive: "No active investments",
        earned: "Earned",
        stop: "Stop"
      },
      deposit: {
        title: "Deposit Funds",
        subtitle: "Send USDT TRC20 to the address below",
        address: "Deposit Address (USDT TRC20)",
        copy: "Copy",
        amount: "Deposited Amount",
        txHash: "Transaction Hash (optional)",
        button: "Submit Deposit",
        history: "Deposit History",
        noDeposits: "No deposits"
      },
      withdraw: {
        title: "Withdraw Funds",
        subtitle: "Withdraw your balance in USDT TRC20",
        amount: "Amount to withdraw",
        available: "Available",
        wallet: "Wallet Address (USDT TRC20)",
        button: "Request Withdrawal",
        history: "Withdrawal History",
        noWithdrawals: "No withdrawals"
      },
      referral: {
        title: "Referral Program",
        subtitle: "Earn 5% on your referrals' deposits",
        yourLink: "Your Referral Link",
        myReferrals: "My Referrals",
        noReferrals: "No referrals yet",
        bonusEarned: "Bonus Earned"
      },
      status: {
        pending: "Pending",
        approved: "Approved",
        rejected: "Rejected",
        completed: "Completed",
        processing: "Processing"
      }
    },
    
    admin: {
      title: "CashGold Admin",
      totalUsers: "Total Users",
      totalDeposits: "Total Deposits",
      totalWithdrawals: "Total Withdrawals",
      platformProfit: "Platform Profit",
      tabs: {
        deposits: "Deposits",
        withdrawals: "Withdrawals",
        users: "Users"
      },
      deposits: {
        title: "Deposit Management",
        approve: "Approve",
        reject: "Reject",
        user: "User"
      },
      withdrawals: {
        title: "Withdrawal Management",
        complete: "Mark as Completed"
      },
      users: {
        title: "User Management",
        balance: "Balance",
        invested: "Invested",
        suspend: "Suspend",
        activate: "Activate",
        active: "Active",
        suspended: "Suspended"
      }
    },
    
    footer: {
      tagline: "Invest smartly, earn daily",
      quickLinks: "Quick Links",
      legal: "Legal",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
      contactUs: "Contact Form",
      rights: "All rights reserved"
    }
  },
  
  es: {
    nav: {
      home: "Inicio",
      about: "Acerca de",
      faq: "FAQ",
      contact: "Contacto",
      login: "Iniciar Sesión",
      register: "Registrarse",
      dashboard: "Panel",
      admin: "Admin",
      logout: "Cerrar Sesión",
      userDashboard: "Panel de Usuario"
    },
    
    hero: {
      title: "Invierte en tu",
      titleGold: "Futuro Dorado",
      subtitle: "Plataforma de inversión en línea segura con rendimientos diarios garantizados del 5%",
      startInvesting: "Comenzar a Invertir",
      learnMore: "Saber Más",
      dailyReturn: "Rendimiento Diario",
      minInvestment: "Inversión Mínima",
      support: "Soporte al Cliente"
    },
    
    vip: {
      title: "Niveles",
      titleGold: "VIP",
      subtitle: "Elija su nivel de inversión",
      perDay: "por día"
    },
    
    features: {
      title: "Por qué",
      titleGold: "CashGold",
      security: {
        title: "Seguridad Máxima",
        desc: "Protección SSL, 2FA y encriptación de nivel bancario para sus fondos"
      },
      profits: {
        title: "Ganancias Garantizadas",
        desc: "Reciba 5% de rendimiento diario en todas sus inversiones"
      },
      withdrawal: {
        title: "Retiros Instantáneos",
        desc: "Retire sus ganancias en cualquier momento vía USDT TRC20"
      }
    },
    
    cta: {
      title: "Listo para comenzar su",
      titleGold: "viaje de inversión",
      subtitle: "Únase a miles de inversores que hacen crecer su dinero con CashGold",
      button: "Crear Cuenta Gratis"
    },
    
    auth: {
      loginTitle: "Iniciar Sesión",
      loginSubtitle: "Acceda a su panel",
      registerTitle: "Registrarse",
      registerSubtitle: "Cree su cuenta de inversión",
      email: "Correo Electrónico",
      username: "Nombre de Usuario",
      password: "Contraseña",
      confirmPassword: "Confirmar Contraseña",
      referralCode: "Código de Referido (opcional)",
      signIn: "Iniciar Sesión",
      signUp: "Registrarse",
      noAccount: "¿No tiene cuenta?",
      haveAccount: "¿Ya tiene cuenta?",
      backHome: "Volver al Inicio"
    },
    
    dashboard: {
      hello: "Hola,",
      availableBalance: "Saldo Disponible",
      investedBalance: "Saldo Invertido",
      totalProfits: "Ganancias Totales",
      vipLevel: "Nivel VIP",
      tabs: {
        invest: "Invertir",
        deposit: "Depositar",
        withdraw: "Retirar",
        history: "Historial",
        referral: "Referidos"
      },
      invest: {
        title: "Crear Inversión",
        subtitle: "Invierta su saldo y gane 5% diario",
        amount: "Monto a invertir",
        min: "Mínimo $10",
        button: "Invertir Ahora",
        active: "Mis Inversiones Activas",
        noActive: "Sin inversiones activas",
        earned: "Ganado",
        stop: "Detener"
      },
      deposit: {
        title: "Depositar Fondos",
        subtitle: "Envíe USDT TRC20 a la dirección a continuación",
        address: "Dirección de Depósito (USDT TRC20)",
        copy: "Copiar",
        amount: "Monto Depositado",
        txHash: "Hash de Transacción (opcional)",
        button: "Enviar Depósito",
        history: "Historial de Depósitos",
        noDeposits: "Sin depósitos"
      },
      withdraw: {
        title: "Retirar Fondos",
        subtitle: "Retire su saldo en USDT TRC20",
        amount: "Monto a retirar",
        available: "Disponible",
        wallet: "Dirección de Billetera (USDT TRC20)",
        button: "Solicitar Retiro",
        history: "Historial de Retiros",
        noWithdrawals: "Sin retiros"
      },
      referral: {
        title: "Programa de Referidos",
        subtitle: "Gane 5% en los depósitos de sus referidos",
        yourLink: "Su Enlace de Referido",
        myReferrals: "Mis Referidos",
        noReferrals: "Sin referidos aún",
        bonusEarned: "Bono Ganado"
      },
      status: {
        pending: "Pendiente",
        approved: "Aprobado",
        rejected: "Rechazado",
        completed: "Completado",
        processing: "Procesando"
      }
    },
    
    admin: {
      title: "Admin CashGold",
      totalUsers: "Usuarios Totales",
      totalDeposits: "Depósitos Totales",
      totalWithdrawals: "Retiros Totales",
      platformProfit: "Ganancia de la Plataforma",
      tabs: {
        deposits: "Depósitos",
        withdrawals: "Retiros",
        users: "Usuarios"
      },
      deposits: {
        title: "Gestión de Depósitos",
        approve: "Aprobar",
        reject: "Rechazar",
        user: "Usuario"
      },
      withdrawals: {
        title: "Gestión de Retiros",
        complete: "Marcar como Completado"
      },
      users: {
        title: "Gestión de Usuarios",
        balance: "Saldo",
        invested: "Invertido",
        suspend: "Suspender",
        activate: "Activar",
        active: "Activo",
        suspended: "Suspendido"
      }
    },
    
    footer: {
      tagline: "Invierta inteligentemente, gane diariamente",
      quickLinks: "Enlaces Rápidos",
      legal: "Legal",
      terms: "Términos de Servicio",
      privacy: "Política de Privacidad",
      contactUs: "Formulario de Contacto",
      rights: "Todos los derechos reservados"
    }
  },
  
  ar: {
    nav: {
      home: "الرئيسية",
      about: "عن",
      faq: "الأسئلة",
      contact: "اتصل",
      login: "تسجيل الدخول",
      register: "التسجيل",
      dashboard: "لوحة التحكم",
      admin: "المشرف",
      logout: "تسجيل الخروج",
      userDashboard: "لوحة المستخدم"
    },
    
    hero: {
      title: "استثمر في",
      titleGold: "مستقبلك الذهبي",
      subtitle: "منصة استثمار آمنة عبر الإنترنت بعوائد يومية مضمونة 5٪",
      startInvesting: "ابدأ الاستثمار",
      learnMore: "اعرف المزيد",
      dailyReturn: "العائد اليومي",
      minInvestment: "الحد الأدنى للاستثمار",
      support: "دعم العملاء"
    },
    
    vip: {
      title: "مستويات",
      titleGold: "VIP",
      subtitle: "اختر مستوى الاستثمار الخاص بك",
      perDay: "في اليوم"
    },
    
    features: {
      title: "لماذا",
      titleGold: "CashGold",
      security: {
        title: "أمان أقصى",
        desc: "حماية SSL و 2FA وتشفير على مستوى البنوك لأموالك"
      },
      profits: {
        title: "أرباح مضمونة",
        desc: "احصل على عائد يومي 5٪ على جميع استثماراتك"
      },
      withdrawal: {
        title: "سحب فوري",
        desc: "اسحب أرباحك في أي وقت عبر USDT TRC20"
      }
    },
    
    cta: {
      title: "جاهز لبدء",
      titleGold: "رحلة الاستثمار الخاصة بك",
      subtitle: "انضم إلى آلاف المستثمرين الذين ينمون ثرواتهم مع CashGold",
      button: "إنشاء حساب مجاني"
    },
    
    auth: {
      loginTitle: "تسجيل الدخول",
      loginSubtitle: "الوصول إلى لوحة التحكم",
      registerTitle: "التسجيل",
      registerSubtitle: "أنشئ حساب استثمار",
      email: "البريد الإلكتروني",
      username: "اسم المستخدم",
      password: "كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      referralCode: "رمز الإحالة (اختياري)",
      signIn: "تسجيل الدخول",
      signUp: "التسجيل",
      noAccount: "ليس لديك حساب؟",
      haveAccount: "لديك حساب بالفعل؟",
      backHome: "العودة للرئيسية"
    },
    
    dashboard: {
      hello: "مرحباً،",
      availableBalance: "الرصيد المتاح",
      investedBalance: "الرصيد المستثمر",
      totalProfits: "إجمالي الأرباح",
      vipLevel: "مستوى VIP",
      tabs: {
        invest: "استثمر",
        deposit: "إيداع",
        withdraw: "سحب",
        history: "التاريخ",
        referral: "الإحالات"
      },
      invest: {
        title: "إنشاء استثمار",
        subtitle: "استثمر رصيدك واربح 5٪ يومياً",
        amount: "المبلغ للاستثمار",
        min: "الحد الأدنى 10$",
        button: "استثمر الآن",
        active: "استثماراتي النشطة",
        noActive: "لا توجد استثمارات نشطة",
        earned: "المكتسب",
        stop: "إيقاف"
      },
      deposit: {
        title: "إيداع الأموال",
        subtitle: "أرسل USDT TRC20 إلى العنوان أدناه",
        address: "عنوان الإيداع (USDT TRC20)",
        copy: "نسخ",
        amount: "المبلغ المودع",
        txHash: "تجزئة المعاملة (اختياري)",
        button: "إرسال الإيداع",
        history: "سجل الإيداعات",
        noDeposits: "لا توجد إيداعات"
      },
      withdraw: {
        title: "سحب الأموال",
        subtitle: "اسحب رصيدك في USDT TRC20",
        amount: "المبلغ للسحب",
        available: "متاح",
        wallet: "عنوان المحفظة (USDT TRC20)",
        button: "طلب سحب",
        history: "سجل السحوبات",
        noWithdrawals: "لا توجد سحوبات"
      },
      referral: {
        title: "برنامج الإحالة",
        subtitle: "اربح 5٪ على إيداعات إحالاتك",
        yourLink: "رابط الإحالة الخاص بك",
        myReferrals: "إحالاتي",
        noReferrals: "لا توجد إحالات بعد",
        bonusEarned: "المكافأة المكتسبة"
      },
      status: {
        pending: "قيد الانتظار",
        approved: "موافق عليه",
        rejected: "مرفوض",
        completed: "مكتمل",
        processing: "قيد المعالجة"
      }
    },
    
    admin: {
      title: "مشرف CashGold",
      totalUsers: "إجمالي المستخدمين",
      totalDeposits: "إجمالي الإيداعات",
      totalWithdrawals: "إجمالي السحوبات",
      platformProfit: "ربح المنصة",
      tabs: {
        deposits: "الإيداعات",
        withdrawals: "السحوبات",
        users: "المستخدمين"
      },
      deposits: {
        title: "إدارة الإيداعات",
        approve: "موافقة",
        reject: "رفض",
        user: "المستخدم"
      },
      withdrawals: {
        title: "إدارة السحوبات",
        complete: "وضع علامة مكتمل"
      },
      users: {
        title: "إدارة المستخدمين",
        balance: "الرصيد",
        invested: "المستثمر",
        suspend: "تعليق",
        activate: "تنشيط",
        active: "نشط",
        suspended: "معلق"
      }
    },
    
    footer: {
      tagline: "استثمر بذكاء، اربح يومياً",
      quickLinks: "روابط سريعة",
      legal: "قانوني",
      terms: "شروط الخدمة",
      privacy: "سياسة الخصوصية",
      contactUs: "نموذج الاتصال",
      rights: "جميع الحقوق محفوظة"
    }
  },
  
  zh: {
    nav: {
      home: "主页",
      about: "关于",
      faq: "常见问题",
      contact: "联系",
      login: "登录",
      register: "注册",
      dashboard: "仪表板",
      admin: "管理",
      logout: "登出",
      userDashboard: "用户仪表板"
    },
    
    hero: {
      title: "投资您的",
      titleGold: "黄金未来",
      subtitle: "安全的在线投资平台，每日保证回报5％",
      startInvesting: "开始投资",
      learnMore: "了解更多",
      dailyReturn: "每日回报",
      minInvestment: "最低投资",
      support: "客户支持"
    },
    
    vip: {
      title: "VIP",
      titleGold: "级别",
      subtitle: "选择您的投资级别",
      perDay: "每天"
    },
    
    features: {
      title: "为什么选择",
      titleGold: "CashGold",
      security: {
        title: "最高安全性",
        desc: "为您的资金提供SSL保护、2FA和银行级加密"
      },
      profits: {
        title: "保证利润",
        desc: "所有投资每日获得5％回报"
      },
      withdrawal: {
        title: "即时提款",
        desc: "随时通过USDT TRC20提取您的收益"
      }
    },
    
    cta: {
      title: "准备开始您的",
      titleGold: "投资之旅",
      subtitle: "加入成千上万通过CashGold增长财富的投资者",
      button: "创建免费账户"
    },
    
    auth: {
      loginTitle: "登录",
      loginSubtitle: "访问您的仪表板",
      registerTitle: "注册",
      registerSubtitle: "创建您的投资账户",
      email: "电子邮件",
      username: "用户名",
      password: "密码",
      confirmPassword: "确认密码",
      referralCode: "推荐代码（可选）",
      signIn: "登录",
      signUp: "注册",
      noAccount: "还没有账户？",
      haveAccount: "已有账户？",
      backHome: "返回主页"
    },
    
    dashboard: {
      hello: "你好，",
      availableBalance: "可用余额",
      investedBalance: "投资余额",
      totalProfits: "总利润",
      vipLevel: "VIP级别",
      tabs: {
        invest: "投资",
        deposit: "存款",
        withdraw: "提款",
        history: "历史",
        referral: "推荐"
      },
      invest: {
        title: "创建投资",
        subtitle: "投资您的余额并每天赚取5％",
        amount: "投资金额",
        min: "最低 $10",
        button: "立即投资",
        active: "我的活跃投资",
        noActive: "没有活跃投资",
        earned: "赚取",
        stop: "停止"
      },
      deposit: {
        title: "存款",
        subtitle: "发送USDT TRC20到以下地址",
        address: "存款地址 (USDT TRC20)",
        copy: "复制",
        amount: "存款金额",
        txHash: "交易哈希（可选）",
        button: "提交存款",
        history: "存款历史",
        noDeposits: "没有存款"
      },
      withdraw: {
        title: "提款",
        subtitle: "以USDT TRC20提取您的余额",
        amount: "提款金额",
        available: "可用",
        wallet: "钱包地址 (USDT TRC20)",
        button: "请求提款",
        history: "提款历史",
        noWithdrawals: "没有提款"
      },
      referral: {
        title: "推荐计划",
        subtitle: "从推荐人的存款中赚取5％",
        yourLink: "您的推荐链接",
        myReferrals: "我的推荐",
        noReferrals: "暂无推荐",
        bonusEarned: "赚取奖金"
      },
      status: {
        pending: "待处理",
        approved: "已批准",
        rejected: "已拒绝",
        completed: "已完成",
        processing: "处理中"
      }
    },
    
    admin: {
      title: "CashGold 管理",
      totalUsers: "总用户数",
      totalDeposits: "总存款",
      totalWithdrawals: "总提款",
      platformProfit: "平台利润",
      tabs: {
        deposits: "存款",
        withdrawals: "提款",
        users: "用户"
      },
      deposits: {
        title: "存款管理",
        approve: "批准",
        reject: "拒绝",
        user: "用户"
      },
      withdrawals: {
        title: "提款管理",
        complete: "标记为已完成"
      },
      users: {
        title: "用户管理",
        balance: "余额",
        invested: "已投资",
        suspend: "暂停",
        activate: "激活",
        active: "活跃",
        suspended: "已暂停"
      }
    },
    
    footer: {
      tagline: "智能投资，每日收益",
      quickLinks: "快速链接",
      legal: "法律",
      terms: "服务条款",
      privacy: "隐私政策",
      contactUs: "联系表格",
      rights: "版权所有"
    }
  },
  
  de: {
    nav: {
      home: "Startseite",
      about: "Über uns",
      faq: "FAQ",
      contact: "Kontakt",
      login: "Anmelden",
      register: "Registrieren",
      dashboard: "Dashboard",
      admin: "Admin",
      logout: "Abmelden",
      userDashboard: "Benutzer-Dashboard"
    },
    
    hero: {
      title: "Investieren Sie in Ihre",
      titleGold: "Goldene Zukunft",
      subtitle: "Sichere Online-Investitionsplattform mit garantierten täglichen Renditen von 5%",
      startInvesting: "Jetzt Investieren",
      learnMore: "Mehr Erfahren",
      dailyReturn: "Tägliche Rendite",
      minInvestment: "Mindestinvestition",
      support: "Kundensupport"
    },
    
    vip: {
      title: "VIP",
      titleGold: "Stufen",
      subtitle: "Wählen Sie Ihr Investitionsniveau",
      perDay: "pro Tag"
    },
    
    features: {
      title: "Warum",
      titleGold: "CashGold",
      security: {
        title: "Maximale Sicherheit",
        desc: "SSL-Schutz, 2FA und Verschlüsselung auf Bankniveau für Ihre Gelder"
      },
      profits: {
        title: "Garantierte Gewinne",
        desc: "Erhalten Sie 5% tägliche Rendite auf alle Ihre Investitionen"
      },
      withdrawal: {
        title: "Sofortige Auszahlungen",
        desc: "Heben Sie Ihre Gewinne jederzeit über USDT TRC20 ab"
      }
    },
    
    cta: {
      title: "Bereit, Ihre",
      titleGold: "Investitionsreise zu beginnen",
      subtitle: "Schließen Sie sich Tausenden von Investoren an, die mit CashGold ihr Vermögen vermehren",
      button: "Kostenloses Konto Erstellen"
    },
    
    auth: {
      loginTitle: "Anmelden",
      loginSubtitle: "Zugriff auf Ihr Dashboard",
      registerTitle: "Registrieren",
      registerSubtitle: "Erstellen Sie Ihr Investitionskonto",
      email: "E-Mail",
      username: "Benutzername",
      password: "Passwort",
      confirmPassword: "Passwort Bestätigen",
      referralCode: "Empfehlungscode (optional)",
      signIn: "Anmelden",
      signUp: "Registrieren",
      noAccount: "Noch kein Konto?",
      haveAccount: "Haben Sie bereits ein Konto?",
      backHome: "Zurück zur Startseite"
    },
    
    dashboard: {
      hello: "Hallo,",
      availableBalance: "Verfügbares Guthaben",
      investedBalance: "Investiertes Guthaben",
      totalProfits: "Gesamtgewinne",
      vipLevel: "VIP-Level",
      tabs: {
        invest: "Investieren",
        deposit: "Einzahlen",
        withdraw: "Abheben",
        history: "Verlauf",
        referral: "Empfehlung"
      },
      invest: {
        title: "Investition Erstellen",
        subtitle: "Investieren Sie Ihr Guthaben und verdienen Sie täglich 5%",
        amount: "Investitionsbetrag",
        min: "Mindestens $10",
        button: "Jetzt Investieren",
        active: "Meine Aktiven Investitionen",
        noActive: "Keine aktiven Investitionen",
        earned: "Verdient",
        stop: "Stoppen"
      },
      deposit: {
        title: "Geld Einzahlen",
        subtitle: "Senden Sie USDT TRC20 an die untenstehende Adresse",
        address: "Einzahlungsadresse (USDT TRC20)",
        copy: "Kopieren",
        amount: "Eingezahlter Betrag",
        txHash: "Transaktionshash (optional)",
        button: "Einzahlung Einreichen",
        history: "Einzahlungsverlauf",
        noDeposits: "Keine Einzahlungen"
      },
      withdraw: {
        title: "Geld Abheben",
        subtitle: "Heben Sie Ihr Guthaben in USDT TRC20 ab",
        amount: "Abhebungsbetrag",
        available: "Verfügbar",
        wallet: "Wallet-Adresse (USDT TRC20)",
        button: "Abhebung Anfordern",
        history: "Abhebungsverlauf",
        noWithdrawals: "Keine Abhebungen"
      },
      referral: {
        title: "Empfehlungsprogramm",
        subtitle: "Verdienen Sie 5% auf die Einzahlungen Ihrer Empfehlungen",
        yourLink: "Ihr Empfehlungslink",
        myReferrals: "Meine Empfehlungen",
        noReferrals: "Noch keine Empfehlungen",
        bonusEarned: "Verdiente Boni"
      },
      status: {
        pending: "Ausstehend",
        approved: "Genehmigt",
        rejected: "Abgelehnt",
        completed: "Abgeschlossen",
        processing: "In Bearbeitung"
      }
    },
    
    admin: {
      title: "CashGold Admin",
      totalUsers: "Gesamtbenutzer",
      totalDeposits: "Gesamteinzahlungen",
      totalWithdrawals: "Gesamtabhebungen",
      platformProfit: "Plattformgewinn",
      tabs: {
        deposits: "Einzahlungen",
        withdrawals: "Abhebungen",
        users: "Benutzer"
      },
      deposits: {
        title: "Einzahlungsverwaltung",
        approve: "Genehmigen",
        reject: "Ablehnen",
        user: "Benutzer"
      },
      withdrawals: {
        title: "Abhebungsverwaltung",
        complete: "Als Abgeschlossen Markieren"
      },
      users: {
        title: "Benutzerverwaltung",
        balance: "Guthaben",
        invested: "Investiert",
        suspend: "Sperren",
        activate: "Aktivieren",
        active: "Aktiv",
        suspended: "Gesperrt"
      }
    },
    
    footer: {
      tagline: "Intelligent investieren, täglich verdienen",
      quickLinks: "Schnelllinks",
      legal: "Rechtliches",
      terms: "Nutzungsbedingungen",
      privacy: "Datenschutz",
      contactUs: "Kontaktformular",
      rights: "Alle Rechte vorbehalten"
    }
  }
};

export const translations = Object.fromEntries(
  Object.entries(base).map(([lang, val]) => [lang, { ...val, ...(pageTranslations[lang] || {}) }])
);
