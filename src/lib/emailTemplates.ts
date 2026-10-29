import type { MailMessage } from "@/lib/mail";

type Lang = "en" | "el" | "es" | "it" | "tr" | "lv" | "no";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function pick<T>(table: Record<Lang, T>, language: string): T {
  return table[(language in table ? language : "en") as Lang];
}

function layout(title: string, paragraphs: string[], button: { url: string; label: string }, footer: string) {
  const body = paragraphs.map((p) => `<p style="margin:0 0 14px;line-height:1.55">${p}</p>`).join("");
  return `<!doctype html><html><body style="margin:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#1f2937">
<div style="max-width:560px;margin:24px auto;background:#fff;border-radius:12px;overflow:hidden">
<div style="background:#0f3d47;color:#fff;padding:18px 24px;font-size:18px;font-weight:bold;letter-spacing:1px">RURAL-CONNECT</div>
<div style="padding:24px"><h2 style="margin:0 0 16px;font-size:20px">${title}</h2>${body}
<p style="margin:22px 0"><a href="${button.url}" style="background:#178593;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;display:inline-block;font-weight:bold">${button.label}</a></p>
<p style="margin:0;font-size:12px;color:#6b7280;line-height:1.5">${footer}</p></div></div></body></html>`;
}

// ---------------------------------------------------------------- NEET welcome

const WELCOME = {
  en: {
    subject: "Your RURAL-CONNECT account is ready",
    hi: (n: string) => `Hello ${n},`,
    p1: "You have been registered on RURAL-CONNECT, the distance counselling platform for young people.",
    p2: "You can now log in with these details:",
    email: "Email", password: "Temporary password",
    p3: "This password is temporary and for one-time use. The first time you log in, you will be asked to choose your own new password before you continue.",
    button: "Log in", footer: "If you were not expecting this email, you can ignore it.",
  },
  el: {
    subject: "Ο λογαριασμός σας στο RURAL-CONNECT είναι έτοιμος",
    hi: (n: string) => `Γεια σας ${n},`,
    p1: "Έχετε εγγραφεί στο RURAL-CONNECT, την πλατφόρμα εξ αποστάσεως συμβουλευτικής για νέους.",
    p2: "Μπορείτε τώρα να συνδεθείτε με τα παρακάτω στοιχεία:",
    email: "Email", password: "Προσωρινός κωδικός",
    p3: "Ο κωδικός αυτός είναι προσωρινός και μίας χρήσης. Την πρώτη φορά που θα συνδεθείτε, θα σας ζητηθεί να ορίσετε δικό σας νέο κωδικό πριν συνεχίσετε.",
    button: "Σύνδεση", footer: "Αν δεν περιμένατε αυτό το email, μπορείτε να το αγνοήσετε.",
  },
  es: {
    subject: "Tu cuenta de RURAL-CONNECT está lista",
    hi: (n: string) => `Hola ${n},`,
    p1: "Te hemos registrado en RURAL-CONNECT, la plataforma de orientación a distancia para jóvenes.",
    p2: "Ya puedes iniciar sesión con estos datos:",
    email: "Correo electrónico", password: "Contraseña temporal",
    p3: "Esta contraseña es temporal y de un solo uso. La primera vez que inicies sesión se te pedirá que elijas tu propia contraseña antes de continuar.",
    button: "Iniciar sesión", footer: "Si no esperabas este correo, puedes ignorarlo.",
  },
  it: {
    subject: "Il tuo account RURAL-CONNECT è pronto",
    hi: (n: string) => `Ciao ${n},`,
    p1: "Sei stato/a registrato/a su RURAL-CONNECT, la piattaforma di orientamento a distanza per i giovani.",
    p2: "Ora puoi accedere con questi dati:",
    email: "Email", password: "Password temporanea",
    p3: "Questa password è temporanea e monouso. Al primo accesso ti verrà chiesto di scegliere una nuova password personale prima di continuare.",
    button: "Accedi", footer: "Se non aspettavi questa email, puoi ignorarla.",
  },
  tr: {
    subject: "RURAL-CONNECT hesabınız hazır",
    hi: (n: string) => `Merhaba ${n},`,
    p1: "Gençlere yönelik uzaktan danışmanlık platformu RURAL-CONNECT'e kaydedildiniz.",
    p2: "Şu bilgilerle giriş yapabilirsiniz:",
    email: "E-posta", password: "Geçici şifre",
    p3: "Bu şifre geçicidir ve tek kullanımlıktır. İlk girişinizde devam etmeden önce kendi yeni şifrenizi belirlemeniz istenecektir.",
    button: "Giriş yap", footer: "Bu e-postayı beklemiyorsanız dikkate almayabilirsiniz.",
  },
  lv: {
    subject: "Jūsu RURAL-CONNECT konts ir gatavs",
    hi: (n: string) => `Sveiki, ${n}!`,
    p1: "Jūs esat reģistrēts(-a) RURAL-CONNECT — jauniešu attālinātās konsultēšanas platformā.",
    p2: "Tagad varat pieteikties ar šiem datiem:",
    email: "E-pasts", password: "Pagaidu parole",
    p3: "Šī parole ir pagaidu un vienreizlietojama. Pirmajā pieteikšanās reizē jums tiks lūgts izveidot savu jauno paroli, pirms turpināt.",
    button: "Pieteikties", footer: "Ja negaidījāt šo e-pastu, varat to ignorēt.",
  },
  no: {
    subject: "Din RURAL-CONNECT-konto er klar",
    hi: (n: string) => `Hei ${n},`,
    p1: "Du er registrert på RURAL-CONNECT, plattformen for veiledning på nett for unge.",
    p2: "Du kan nå logge inn med disse opplysningene:",
    email: "E-post", password: "Midlertidig passord",
    p3: "Dette passordet er midlertidig og til engangsbruk. Første gang du logger inn, blir du bedt om å velge ditt eget nye passord før du fortsetter.",
    button: "Logg inn", footer: "Hvis du ikke ventet denne e-posten, kan du se bort fra den.",
  },
} satisfies Record<Lang, unknown>;

export function neetWelcomeEmail(args: {
  name: string; email: string; password: string; language: string; loginUrl: string;
}): MailMessage {
  const t = pick(WELCOME, args.language);
  const n = esc(args.name);
  const html = layout(
    t.hi(n),
    [
      t.p1,
      t.p2,
      `<strong>${t.email}:</strong> ${esc(args.email)}<br><strong>${t.password}:</strong> <code style="background:#f3f4f6;padding:2px 6px;border-radius:4px;font-size:15px">${esc(args.password)}</code>`,
      t.p3,
    ],
    { url: args.loginUrl, label: t.button },
    t.footer
  );
  const text = `${t.hi(args.name)}\n\n${t.p1}\n${t.p2}\n${t.email}: ${args.email}\n${t.password}: ${args.password}\n\n${t.p3}\n\n${t.button}: ${args.loginUrl}\n\n${t.footer}`;
  return { to: args.email, subject: t.subject, html, text };
}

// ---------------------------------------------------------------- Counsellor invite

const INVITE = {
  en: {
    subject: "You're invited to join RURAL-CONNECT as a counsellor",
    hi: "Hello,",
    p1: "You have been invited to join RURAL-CONNECT as a counsellor, to support young people through distance counselling.",
    p2: "Click the button below to complete your registration. You will choose your name and password.",
    p3: (d: number) => `This link is personal and expires in ${d} days.`,
    button: "Complete my registration", footer: "If you were not expecting this invitation, you can ignore this email.",
  },
  el: {
    subject: "Σας προσκαλούμε στο RURAL-CONNECT ως σύμβουλο",
    hi: "Γεια σας,",
    p1: "Έχετε προσκληθεί να συμμετάσχετε στο RURAL-CONNECT ως σύμβουλος, για να στηρίζετε νέους μέσα από εξ αποστάσεως συμβουλευτική.",
    p2: "Πατήστε το παρακάτω κουμπί για να ολοκληρώσετε την εγγραφή σας. Θα επιλέξετε το όνομα και τον κωδικό σας.",
    p3: (d: number) => `Ο σύνδεσμος είναι προσωπικός και λήγει σε ${d} ημέρες.`,
    button: "Ολοκλήρωση εγγραφής", footer: "Αν δεν περιμένατε αυτή την πρόσκληση, μπορείτε να αγνοήσετε αυτό το email.",
  },
  es: {
    subject: "Te invitamos a unirte a RURAL-CONNECT como orientador/a",
    hi: "Hola,",
    p1: "Has sido invitado/a a unirte a RURAL-CONNECT como orientador/a para apoyar a jóvenes mediante orientación a distancia.",
    p2: "Haz clic en el botón para completar tu registro. Elegirás tu nombre y tu contraseña.",
    p3: (d: number) => `Este enlace es personal y caduca en ${d} días.`,
    button: "Completar mi registro", footer: "Si no esperabas esta invitación, puedes ignorar este correo.",
  },
  it: {
    subject: "Sei invitato/a a unirti a RURAL-CONNECT come orientatore/trice",
    hi: "Ciao,",
    p1: "Sei stato/a invitato/a a unirti a RURAL-CONNECT come orientatore/trice per sostenere i giovani attraverso l'orientamento a distanza.",
    p2: "Clicca sul pulsante per completare la registrazione. Sceglierai il tuo nome e la tua password.",
    p3: (d: number) => `Questo link è personale e scade tra ${d} giorni.`,
    button: "Completa la registrazione", footer: "Se non aspettavi questo invito, puoi ignorare questa email.",
  },
  tr: {
    subject: "RURAL-CONNECT'e danışman olarak davetlisiniz",
    hi: "Merhaba,",
    p1: "Gençleri uzaktan danışmanlıkla desteklemek üzere RURAL-CONNECT'e danışman olarak katılmaya davet edildiniz.",
    p2: "Kaydınızı tamamlamak için aşağıdaki düğmeye tıklayın. Adınızı ve şifrenizi kendiniz belirleyeceksiniz.",
    p3: (d: number) => `Bu bağlantı kişiseldir ve ${d} gün içinde sona erer.`,
    button: "Kaydımı tamamla", footer: "Bu daveti beklemiyorsanız bu e-postayı dikkate almayabilirsiniz.",
  },
  lv: {
    subject: "Jūs esat uzaicināts(-a) pievienoties RURAL-CONNECT kā konsultants(-e)",
    hi: "Sveiki!",
    p1: "Jūs esat uzaicināts(-a) pievienoties RURAL-CONNECT kā konsultants(-e), lai atbalstītu jauniešus attālinātās konsultēšanas ceļā.",
    p2: "Noklikšķiniet uz pogas zemāk, lai pabeigtu reģistrāciju. Jūs izvēlēsieties savu vārdu un paroli.",
    p3: (d: number) => `Šī saite ir personīga un beidzas pēc ${d} dienām.`,
    button: "Pabeigt reģistrāciju", footer: "Ja negaidījāt šo ielūgumu, varat ignorēt šo e-pastu.",
  },
  no: {
    subject: "Du er invitert til RURAL-CONNECT som veileder",
    hi: "Hei,",
    p1: "Du er invitert til å bli med i RURAL-CONNECT som veileder, for å støtte unge gjennom veiledning på nett.",
    p2: "Klikk på knappen under for å fullføre registreringen. Du velger selv navn og passord.",
    p3: (d: number) => `Denne lenken er personlig og utløper om ${d} dager.`,
    button: "Fullfør registreringen", footer: "Hvis du ikke ventet denne invitasjonen, kan du se bort fra denne e-posten.",
  },
} satisfies Record<Lang, unknown>;

export function counsellorInviteEmail(args: {
  email: string; language: string; inviteUrl: string; validDays: number;
}): MailMessage {
  const t = pick(INVITE, args.language);
  const html = layout(t.hi, [t.p1, t.p2, t.p3(args.validDays)], { url: args.inviteUrl, label: t.button }, t.footer);
  const text = `${t.hi}\n\n${t.p1}\n\n${t.p2}\n${args.inviteUrl}\n\n${t.p3(args.validDays)}\n\n${t.footer}`;
  return { to: args.email, subject: t.subject, html, text };
}
