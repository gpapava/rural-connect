# Translation review needed — Turkish, Latvian, Norwegian

These locale files (`messages/tr.json`, `messages/lv.json`, `messages/no.json`) were produced by an AI translator as part of the full i18n pass. **Greek, Spanish and Italian were done with confidence; TR/LV/NO need a native-speaker proofread.**

Check especially: ICU plural forms `{count, plural, one {…} other {…}}` (Turkish has no plural noun inflection so both forms are intentionally identical; Latvian needs the `one`/`other` split reviewed, and ideally a `zero` form added), placeholders like `{name}` / `{number}` / `{date}` must stay intact, and the `<b>…</b>` markup in a few strings.

| Key | English | Turkish | Latvian | Norwegian |
|-----|---------|---------|---------|-----------|
| `meta.description` | Empowering NEET youth in rural areas through digital counseling and skills development | Kırsal bölgelerdeki NEET gençlerini dijital danışmanlık ve beceri geliştirme yoluyla güçlendirmek | Stiprināt NEET jauniešus lauku apvidos, izmantojot digitālo konsultēšanu un prasmju attīstību | Styrke NEET-ungdom i rurale områder gjennom digital veiledning og kompetanseutvikling |
| `common.appName` | RURAL-CONNECT | RURAL-CONNECT | RURAL-CONNECT | RURAL-CONNECT |
| `common.loading` | Loading... | Yükleniyor... | Ielādē... | Laster... |
| `common.save` | Save | Kaydet | Saglabāt | Lagre |
| `common.saveChanges` | Save Changes | Değişiklikleri Kaydet | Saglabāt izmaiņas | Lagre endringer |
| `common.saving` | Saving… | Kaydediliyor… | Saglabā… | Lagrer… |
| `common.saved` | Saved! | Kaydedildi! | Saglabāts! | Lagret! |
| `common.creating` | Creating… | Oluşturuluyor… | Izveido… | Oppretter… |
| `common.cancel` | Cancel | İptal | Atcelt | Avbryt |
| `common.delete` | Delete | Sil | Dzēst | Slett |
| `common.edit` | Edit | Düzenle | Rediģēt | Rediger |
| `common.remove` | Remove | Kaldır | Noņemt | Fjern |
| `common.close` | Close | Kapat | Aizvērt | Lukk |
| `common.back` | Back | Geri | Atpakaļ | Tilbake |
| `common.next` | Next | İleri | Tālāk | Neste |
| `common.previous` | Previous | Önceki | Iepriekšējais | Forrige |
| `common.submit` | Submit | Gönder | Iesniegt | Send inn |
| `common.confirm` | Confirm | Onayla | Apstiprināt | Bekreft |
| `common.yes` | Yes | Evet | Jā | Ja |
| `common.no` | No | Hayır | Nē | Nei |
| `common.search` | Search | Ara | Meklēt | Søk |
| `common.filter` | Filter | Filtrele | Filtrēt | Filtrer |
| `common.export` | Export | Dışa Aktar | Eksportēt | Eksporter |
| `common.share` | Share | Paylaş | Kopīgot | Del |
| `common.download` | Download | İndir | Lejupielādēt | Last ned |
| `common.upload` | Upload | Yükle | Augšupielādēt | Last opp |
| `common.view` | View | Görüntüle | Skatīt | Vis |
| `common.optional` | optional | isteğe bağlı | neobligāts | valgfritt |
| `common.learnMore` | Learn More | Daha fazla bilgi | Uzzināt vairāk | Lær mer |
| `common.getStarted` | Get Started | Başlayın | Sākt | Kom i gang |
| `common.viewAll` | View All | Tümünü görüntüle | Skatīt visu | Vis alle |
| `common.noData` | No data available | Kullanılabilir veri yok | Nav pieejamu datu | Ingen data tilgjengelig |
| `common.error` | An error occurred | Bir hata oluştu | Radās kļūda | Det oppstod en feil |
| `common.somethingWentWrong` | Something went wrong. | Bir şeyler ters gitti. | Kaut kas nogāja greizi. | Noe gikk galt. |
| `common.tryAgain` | Please try again. | Lütfen tekrar deneyin. | Lūdzu, mēģiniet vēlreiz. | Vennligst prøv igjen. |
| `common.success` | Success | Başarılı | Veiksmīgi | Vellykket |
| `common.required` | This field is required | Bu alan zorunludur | Šis lauks ir obligāts | Dette feltet er obligatorisk |
| `common.invalidEmail` | Invalid email address | Geçersiz e-posta adresi | Nederīga e-pasta adrese | Ugyldig e-postadresse |
| `common.language` | Language | Dil | Valoda | Språk |
| `common.hide` | Hide | Gizle | Slēpt | Skjul |
| `common.show` | Show | Göster | Rādīt | Vis |
| `common.countries.NO` | Norway | Norveç | Norvēģija | Norge |
| `common.countries.GR` | Greece | Yunanistan | Grieķija | Hellas |
| `common.countries.TR` | Turkey | Türkiye | Turcija | Tyrkia |
| `common.countries.LV` | Latvia | Letonya | Latvija | Latvia |
| `common.countries.ES` | Spain | İspanya | Spānija | Spania |
| `common.countries.IT` | Italy | İtalya | Itālija | Italia |
| `common.countries.EU` | European Union | Avrupa Birliği | Eiropas Savienība | Den europeiske union |
| `common.roles.ADMIN` | Admin | Yönetici | Administrators | Administrator |
| `common.roles.COUNSELOR` | Counsellor | Danışman | Konsultants | Veileder |
| `common.roles.NEET_USER` | NEET User | NEET Kullanıcı | NEET lietotājs | NEET-bruker |
| `common.languages.en` | English | İngilizce | Angļu | Engelsk |
| `common.languages.el` | Greek | Yunanca | Grieķu | Gresk |
| `common.languages.tr` | Turkish | Türkçe | Turku | Tyrkisk |
| `common.languages.lv` | Latvian | Letonca | Latviešu | Latvisk |
| `common.languages.es` | Spanish | İspanyolca | Spāņu | Spansk |
| `common.languages.it` | Italian | İtalyanca | Itāļu | Italiensk |
| `common.languages.no` | Norwegian | Norveççe | Norvēģu | Norsk |
| `stages.stageLabel` | Stage {number} | Aşama {number} | {number}. posms | Trinn {number} |
| `stages.names.1` | Learning the Platform | Platformu Öğrenme | Platformas apguve | Bli kjent med plattformen |
| `stages.names.2` | Previous Experience | Önceki Deneyim | Iepriekšējā pieredze | Tidligere erfaring |
| `stages.names.3` | Why You Need an Opportunity | Neden Bir Fırsata İhtiyacınız Var | Kāpēc jums nepieciešama iespēja | Hvorfor du trenger en mulighet |
| `stages.names.4` | Confidence & Orientation | Özgüven ve Yönlendirme | Pašpārliecība un orientācija | Selvtillit og orientering |
| `stages.names.5` | Career Opportunities | Kariyer Fırsatları | Karjeras iespējas | Karrieremuligheter |
| `nav.home` | Home | Ana Sayfa | Sākums | Hjem |
| `nav.dashboard` | Dashboard | Panel | Panelis | Oversikt |
| `nav.counseling` | Counseling Session | Danışmanlık Oturumu | Konsultāciju sesija | Veiledningsøkt |
| `nav.portfolio` | Digital Portfolio | Dijital Portfolyo | Digitālais portfolio | Digital portefølje |
| `nav.library` | E-Library & Modules | E-Kütüphane & Modüller | E-bibliotēka un moduļi | E-bibliotek og moduler |
| `nav.laborMarket` | Labor Market Links | İş Gücü Piyasası Bağlantıları | Darba tirgus saites | Arbeidsmarkedslenker |
| `nav.myProfile` | My Profile | Profilim | Mans profils | Min profil |
| `nav.logout` | Log Out | Çıkış Yap | Izrakstīties | Logg ut |
| `nav.settings` | Settings | Ayarlar | Iestatījumi | Innstillinger |
| `nav.admin` | Admin Panel | Yönetici Paneli | Administratora panelis | Administrasjonspanel |
| `nav.scheduleSession` | Schedule Session | Oturum Planla | Ieplānot sesiju | Planlegg økt |
| `nav.adminUsers` | User Management | Kullanıcı Yönetimi | Lietotāju pārvaldība | Brukeradministrasjon |
| `nav.adminJobs` | Job Openings | İş İlanları | Darba piedāvājumi | Jobbstillinger |
| `auth.login` | Log In | Giriş Yap | Pieteikties | Logg inn |
| `auth.logout` | Log Out | Çıkış Yap | Izrakstīties | Logg ut |
| `auth.email` | Email address | E-posta adresi | E-pasta adrese | E-postadresse |
| `auth.password` | Password | Şifre | Parole | Passord |
| `auth.loginTitle` | Welcome back | Tekrar hoş geldiniz | Laipni lūdzam atpakaļ | Velkommen tilbake |
| `auth.loginSubtitle` | Sign in to your RURAL-CONNECT account | RURAL-CONNECT hesabınıza giriş yapın | Pierakstieties savā RURAL-CONNECT kontā | Logg inn på RURAL-CONNECT-kontoen din |
| `auth.forgotPassword` | Forgot password? | Şifrenizi mi unuttunuz? | Aizmirsāt paroli? | Glemt passord? |
| `auth.noAccount` | Don't have an account? | Hesabınız yok mu? | Nav konta? | Har du ikke en konto? |
| `auth.contactAdmin` | Contact your counselor or administrator | Danışmanınızla veya yöneticinizle iletişime geçin | Sazinieties ar savu konsultantu vai administratoru | Kontakt veilederen eller administratoren din |
| `auth.registerLink` | Create an account | Hesap oluştur | Izveidot kontu | Opprett en konto |
| `auth.invalidCredentials` | Invalid email or password | Geçersiz e-posta veya şifre | Nederīgs e-pasts vai parole | Ugyldig e-post eller passord |
| `auth.loginError` | Login failed. Please try again. | Giriş başarısız oldu. Lütfen tekrar deneyin. | Pieteikšanās neizdevās. Lūdzu, mēģiniet vēlreiz. | Innlogging mislyktes. Vennligst prøv igjen. |
| `auth.loggingIn` | Signing in... | Giriş yapılıyor... | Notiek pierakstīšanās... | Logger inn... |
| `auth.registerTitle` | Create your account | Hesabınızı oluşturun | Izveidojiet savu kontu | Opprett kontoen din |
| `auth.registerSubtitle` | Join RURAL-CONNECT as a NEET user from a rural area | Kırsal bir bölgeden NEET kullanıcısı olarak RURAL-CONNECT'e katılın | Pievienojieties RURAL-CONNECT kā NEET lietotājs no lauku apvidus | Bli med i RURAL-CONNECT som NEET-bruker fra et ruralt område |
| `auth.register` | Create Account | Hesap Oluştur | Izveidot kontu | Opprett konto |
| `auth.registering` | Creating account... | Hesap oluşturuluyor... | Notiek konta izveide... | Oppretter konto... |
| `auth.registerError` | Registration failed. Please try again. | Kayıt başarısız oldu. Lütfen tekrar deneyin. | Reģistrācija neizdevās. Lūdzu, mēģiniet vēlreiz. | Registrering mislyktes. Vennligst prøv igjen. |
| `auth.fullName` | Full name | Ad Soyad | Pilns vārds | Fullt navn |
| `auth.fullNamePlaceholder` | Your full name | Adınız ve soyadınız | Jūsu pilns vārds | Ditt fulle navn |
| `auth.country` | Country | Ülke | Valsts | Land |
| `auth.selectCountry` | Select your country | Ülkenizi seçin | Izvēlieties savu valsti | Velg landet ditt |
| `auth.confirmPassword` | Confirm password | Şifreyi onayla | Apstipriniet paroli | Bekreft passord |
| `auth.passwordHint` | Minimum 8 characters | En az 8 karakter | Vismaz 8 rakstzīmes | Minst 8 tegn |
| `auth.passwordMismatch` | Passwords do not match | Şifreler eşleşmiyor | Paroles nesakrīt | Passordene stemmer ikke overens |
| `auth.alreadyHaveAccount` | Already have an account? | Zaten bir hesabınız var mı? | Jums jau ir konts? | Har du allerede en konto? |
| `auth.neetDeclarationText` | I declare that I am a young person (aged 15–29) who is Not in Employment, Education or Training (NEET), living in a rural area. I understand that this platform is designed to support NEET youth in rural communities across Europe. | İstihdamda, Eğitimde veya Öğretimde Olmayan (NEET) ve kırsal bir bölgede yaşayan bir genç (15-29 yaş arası) olduğumu beyan ederim. Bu platformun Avrupa'daki kırsal topluluklardaki NEET gençlerini desteklemek için tasarlandığını anlıyorum. | Apliecinu, ka esmu jaunietis (vecumā no 15 līdz 29 gadiem), kas nav nodarbināts, neizglītojas un neapgūst arodu (NEET) un dzīvo lauku apvidū. Es saprotu, ka šī platforma ir izstrādāta, lai atbalstītu NEET jauniešus lauku kopienās visā Eiropā. | Jeg erklærer at jeg er en ung person (i alderen 15–29 år) som ikke er i arbeid, utdanning eller opplæring (NEET) og bor i et ruralt område. Jeg forstår at denne plattformen er utformet for å støtte NEET-ungdom i rurale samfunn i hele Europa. |
| `auth.neetDeclarationRequired` | You must confirm your NEET status to register. | Kaydolmak için NEET durumunuzu onaylamanız gerekir. | Lai reģistrētos, jums jāapstiprina savs NEET statuss. | Du må bekrefte NEET-statusen din for å registrere deg. |
| `auth.registerTooltip` | Registration is open to young people (15–29) who are Not in Employment, Education or Training (NEET) and live in a rural area. | Kayıt, İstihdamda, Eğitimde veya Öğretimde Olmayan (NEET) ve kırsal bir bölgede yaşayan gençlere (15-29 yaş) açıktır. | Reģistrācija ir pieejama jauniešiem (15–29 gadi), kas nav nodarbināti, neizglītojas un neapgūst arodu (NEET) un dzīvo lauku apvidū. | Registrering er åpen for unge (15–29 år) som ikke er i arbeid, utdanning eller opplæring (NEET) og bor i et ruralt område. |
| `auth.gdprConsentText` | I consent to the processing of my personal data by RURAL-CONNECT for the purpose of providing counselling and employment support services, in accordance with the General Data Protection Regulation (GDPR). My data will be used solely for platform services and will not be shared with third parties without my consent. | RURAL-CONNECT tarafından, Genel Veri Koruma Yönetmeliği (GDPR) uyarınca danışmanlık ve istihdam desteği hizmetleri sunmak amacıyla kişisel verilerimin işlenmesine izin veriyorum. Verilerim yalnızca platform hizmetleri için kullanılacak ve rızam olmadan üçüncü taraflarla paylaşılmayacaktır. | Es piekrītu, ka RURAL-CONNECT apstrādā manus personas datus, lai sniegtu konsultēšanas un nodarbinātības atbalsta pakalpojumus saskaņā ar Vispārīgo datu aizsardzības regulu (VDAR). Mani dati tiks izmantoti tikai platformas pakalpojumiem un netiks kopīgoti ar trešajām pusēm bez manas piekrišanas. | Jeg samtykker til at RURAL-CONNECT behandler mine personopplysninger med det formål å tilby veilednings- og sysselsettingsstøttetjenester, i samsvar med personvernforordningen (GDPR). Mine data vil kun brukes til plattformtjenester og vil ikke deles med tredjeparter uten mitt samtykke. |
| `auth.gdprConsentRequired` | You must accept the data processing consent to register. | Kaydolmak için veri işleme onayını kabul etmelisiniz. | Lai reģistrētos, jums jāpiekrīt datu apstrādes piekrišanai. | Du må godta samtykket til databehandling for å registrere deg. |
| `auth.brandTagline` | Empowering Rural Youth | Kırsal Gençliği Güçlendirmek | Stiprinām lauku jauniešus | Styrker rural ungdom |
| `auth.brandDescription` | Supporting NEET young people in rural communities across Europe through digital counseling, skills development, and employment pathways. | Avrupa'daki kırsal topluluklardaki NEET gençlerini dijital danışmanlık, beceri geliştirme ve istihdam yolları aracılığıyla destekliyoruz. | Atbalstām NEET jauniešus lauku kopienās visā Eiropā, izmantojot digitālo konsultēšanu, prasmju attīstību un nodarbinātības iespējas. | Vi støtter NEET-ungdom i rurale samfunn i hele Europa gjennom digital veiledning, kompetanseutvikling og veier til sysselsetting. |
| `auth.statCountries` | Countries | Ülke | Valstis | Land |
| `auth.statUsersHelped` | Users Helped | Yardım Edilen Kullanıcı | Atbalstītie lietotāji | Brukere hjulpet |
| `auth.statSupport` | Support | Destek | Atbalsts | Støtte |
| `auth.registerBrandTitle` | Join Rural-Connect | Rural-Connect'e Katılın | Pievienojieties Rural-Connect | Bli med i Rural-Connect |
| `auth.registerBrandDescription` | Create your account and start accessing digital counseling, skills development, and employment pathways designed for NEET youth in rural communities. | Hesabınızı oluşturun ve kırsal topluluklardaki NEET gençleri için tasarlanmış dijital danışmanlık, beceri geliştirme ve istihdam yollarına erişmeye başlayın. | Izveidojiet savu kontu un sāciet piekļūt digitālajai konsultēšanai, prasmju attīstībai un nodarbinātības iespējām, kas paredzētas NEET jauniešiem lauku kopienās. | Opprett kontoen din og få tilgang til digital veiledning, kompetanseutvikling og veier til sysselsetting utformet for NEET-ungdom i rurale samfunn. |
| `auth.benefitCounseling` | Digital counseling sessions with expert advisors | Uzman danışmanlarla dijital danışmanlık oturumları | Digitālās konsultāciju sesijas ar pieredzējušiem konsultantiem | Digitale veiledningsøkter med erfarne rådgivere |
| `auth.benefitElearning` | E-learning modules to develop new skills | Yeni beceriler geliştirmek için e-öğrenme modülleri | E-mācību moduļi jaunu prasmju attīstīšanai | E-læringsmoduler for å utvikle nye ferdigheter |
| `auth.benefitPortfolio` | Build your digital portfolio | Dijital portfolyonuzu oluşturun | Izveidojiet savu digitālo portfolio | Bygg din digitale portefølje |
| `auth.benefitJobs` | Connect with employment opportunities | İstihdam fırsatlarıyla bağlantı kurun | Sazinieties ar nodarbinātības iespējām | Koble deg til sysselsettingsmuligheter |
| `auth.demoAccounts` | Demo Accounts | Demo Hesapları | Demonstrācijas konti | Demokontoer |
| `auth.employerPrompt` | Are you an employer? | İşveren misiniz? | Vai esat darba devējs? | Er du en arbeidsgiver? |
| `auth.employerLink` | Post a job opening | Bir iş ilanı yayınlayın | Publicēt darba piedāvājumu | Legg ut en jobbstilling |
| `auth.genericError` | Something went wrong. Please try again. | Bir şeyler ters gitti. Lütfen tekrar deneyin. | Kaut kas nogāja greizi. Lūdzu, mēģiniet vēlreiz. | Noe gikk galt. Vennligst prøv igjen. |
| `invite.badge` | Counsellor Invitation | Danışman Daveti | Konsultanta uzaicinājums | Veilederinvitasjon |
| `invite.completeRegistration` | Complete your registration | Kaydınızı tamamlayın | Pabeidziet reģistrāciju | Fullfør registreringen din |
| `invite.invitedAsCounsellor` | You've been invited to join as a counsellor. | Danışman olarak katılmaya davet edildiniz. | Jūs esat uzaicināts pievienoties kā konsultants. | Du har blitt invitert til å bli med som veileder. |
| `invite.emailLabel` | Email address | E-posta adresi | E-pasta adrese | E-postadresse |
| `invite.emailHint` | This is the email your invitation was sent to. | Bu, davetinizin gönderildiği e-posta adresidir. | Šī ir e-pasta adrese, uz kuru tika nosūtīts jūsu uzaicinājums. | Dette er e-postadressen invitasjonen din ble sendt til. |
| `invite.fullName` | Full name | Ad Soyad | Pilns vārds | Fullt navn |
| `invite.fullNamePlaceholder` | Your full name | Adınız ve soyadınız | Jūsu pilns vārds | Ditt fulle navn |
| `invite.password` | Password | Şifre | Parole | Passord |
| `invite.passwordHint` | Minimum 8 characters. | En az 8 karakter. | Vismaz 8 rakstzīmes. | Minst 8 tegn. |
| `invite.confirmPassword` | Confirm password | Şifreyi onayla | Apstipriniet paroli | Bekreft passord |
| `invite.creatingAccount` | Creating account… | Hesap oluşturuluyor… | Notiek konta izveide… | Oppretter konto… |
| `invite.submit` | Complete Registration | Kaydı Tamamla | Pabeigt reģistrāciju | Fullfør registrering |
| `invite.passwordMismatch` | Passwords do not match. | Şifreler eşleşmiyor. | Paroles nesakrīt. | Passordene stemmer ikke overens. |
| `invite.registrationFailed` | Registration failed. Please try again. | Kayıt başarısız oldu. Lütfen tekrar deneyin. | Reģistrācija neizdevās. Lūdzu, mēģiniet vēlreiz. | Registrering mislyktes. Vennligst prøv igjen. |
| `invite.genericError` | Something went wrong. Please try again. | Bir şeyler ters gitti. Lütfen tekrar deneyin. | Kaut kas nogāja greizi. Lūdzu, mēģiniet vēlreiz. | Noe gikk galt. Vennligst prøv igjen. |
| `invite.invalidTitle` | Invalid Invite | Geçersiz Davet | Nederīgs uzaicinājums | Ugyldig invitasjon |
| `invite.brandWelcome` | Welcome, Counsellor | Hoş geldiniz, Danışman | Laipni lūdzam, konsultant! | Velkommen, veileder |
| `invite.brandDescription` | You have been invited to join RURAL-CONNECT as a counsellor. Complete your registration to start supporting NEET youth in rural communities across Europe. | RURAL-CONNECT'e danışman olarak katılmaya davet edildiniz. Avrupa'daki kırsal topluluklardaki NEET gençlerini desteklemeye başlamak için kaydınızı tamamlayın. | Jūs esat uzaicināts pievienoties RURAL-CONNECT kā konsultants. Pabeidziet reģistrāciju, lai sāktu atbalstīt NEET jauniešus lauku kopienās visā Eiropā. | Du har blitt invitert til å bli med i RURAL-CONNECT som veileder. Fullfør registreringen din for å begynne å støtte NEET-ungdom i rurale samfunn i hele Europa. |
| `dashboard.greeting` | Welcome back, {name} | Tekrar hoş geldiniz, {name} | Laipni lūdzam atpakaļ, {name} | Velkommen tilbake, {name} |
| `dashboard.focusToday` | Here's what you need to focus on today. | Bugün odaklanmanız gerekenler. | Lūk, kam šodien jāpievērš uzmanība. | Her er det du bør fokusere på i dag. |
| `dashboard.nextStep` | Next step | Sonraki adım | Nākamais solis | Neste steg |
| `dashboard.actionNeeded` | Action needed | İşlem gerekli | Nepieciešama rīcība | Handling kreves |
| `dashboard.sessionInvitation` | Session Invitation | Oturum Daveti | Sesijas uzaicinājums | Øktinvitasjon |
| `dashboard.invitedYou` | <b>{name}</b> has invited you to a counselling session. | <b>{name}</b> sizi bir danışmanlık oturumuna davet etti. | <b>{name}</b> jūs uzaicināja uz konsultāciju sesiju. | <b>{name}</b> har invitert deg til en veiledningsøkt. |
| `dashboard.accept` | Accept | Kabul Et | Pieņemt | Godta |
| `dashboard.decline` | Decline | Reddet | Noraidīt | Avslå |
| `dashboard.today` | Today | Bugün | Šodien | I dag |
| `dashboard.sessionTodayTitle` | You have a session today! | Bugün bir oturumunuz var! | Šodien jums ir sesija! | Du har en økt i dag! |
| `dashboard.sessionTomorrowTitle` | Session tomorrow | Yarın oturum | Sesija rīt | Økt i morgen |
| `dashboard.withCounsellor` | With <b>{name}</b> | <b>{name}</b> ile | Ar <b>{name}</b> | Med <b>{name}</b> |
| `dashboard.joinSession` | Join Session | Oturuma Katıl | Pievienoties sesijai | Bli med i økten |
| `dashboard.upcomingSession` | Upcoming session | Yaklaşan oturum | Gaidāmā sesija | Kommende økt |
| `dashboard.viewCounsellingSession` | View Counselling Session | Danışmanlık Oturumunu Görüntüle | Skatīt konsultāciju sesiju | Vis veiledningsøkt |
| `dashboard.continueJourney` | Continue your journey | Yolculuğunuza devam edin | Turpiniet savu ceļu | Fortsett reisen din |
| `dashboard.currentlyOn` | Currently on | Şu anda | Pašlaik | Nå på |
| `dashboard.stageLine` | Stage {number} — {name} | Aşama {number} — {name} | {number}. posms — {name} | Trinn {number} — {name} |
| `dashboard.goToCounselling` | Go to Counselling | Danışmanlığa Git | Doties uz konsultēšanu | Gå til veiledning |
| `dashboard.almostThere` | Almost there! | Neredeyse tamam! | Gandrīz gatavs! | Nesten der! |
| `dashboard.journeyComplete` | Journey complete | Yolculuk tamamlandı | Ceļš pabeigts | Reisen er fullført |
| `dashboard.journeyCompleteBody` | You've completed all 5 stages of the counselling programme. Your counsellor will review and issue your Certificate of Attendance shortly. | Danışmanlık programının 5 aşamasını da tamamladınız. Danışmanınız kısa süre içinde Katılım Belgenizi inceleyecek ve düzenleyecek. | Jūs esat pabeidzis visus 5 konsultēšanas programmas posmus. Jūsu konsultants drīzumā pārskatīs un izsniegs jūsu Apmeklējuma apliecību. | Du har fullført alle de 5 trinnene i veiledningsprogrammet. Veilederen din vil snart gjennomgå og utstede ditt deltakerbevis. |
| `dashboard.awaitingApproval` | Awaiting counsellor approval | Danışman onayı bekleniyor | Gaida konsultanta apstiprinājumu | Venter på veileders godkjenning |
| `dashboard.congratulations` | Congratulations! | Tebrikler! | Apsveicam! | Gratulerer! |
| `dashboard.earnedCertificate` | You earned your certificate | Belgenizi kazandınız | Jūs nopelnījāt savu apliecību | Du har opptjent beviset ditt |
| `dashboard.earnedCertificateBody` | You've successfully completed the full RURAL-CONNECT counselling programme. Your Certificate of Attendance is ready to download. | RURAL-CONNECT danışmanlık programının tamamını başarıyla tamamladınız. Katılım Belgeniz indirilmeye hazır. | Jūs veiksmīgi pabeidzāt visu RURAL-CONNECT konsultēšanas programmu. Jūsu Apmeklējuma apliecība ir gatava lejupielādei. | Du har fullført hele RURAL-CONNECT-veiledningsprogrammet med suksess. Ditt deltakerbevis er klart for nedlasting. |
| `dashboard.viewDownloadCertificate` | View & Download Certificate | Belgeyi Görüntüle ve İndir | Skatīt un lejupielādēt apliecību | Vis og last ned bevis |
| `dashboard.gettingStarted` | Getting started | Başlarken | Sākam | Kom i gang |
| `dashboard.journeyAboutToBegin` | Your journey is about to begin | Yolculuğunuz başlamak üzere | Jūsu ceļš gatavojas sākties | Reisen din er i ferd med å begynne |
| `dashboard.justStartedBody` | Your account is set up. Your counsellor will schedule your first session — you'll see it here as soon as it's ready. | Hesabınız kuruldu. Danışmanınız ilk oturumunuzu planlayacak — hazır olur olmaz burada göreceksiniz. | Jūsu konts ir izveidots. Jūsu konsultants ieplānos jūsu pirmo sesiju — jūs to redzēsiet šeit, tiklīdz tā būs gatava. | Kontoen din er satt opp. Veilederen din vil planlegge din første økt — du vil se den her så snart den er klar. |
| `dashboard.openCounsellingPage` | Open Counselling Page | Danışmanlık Sayfasını Aç | Atvērt konsultēšanas lapu | Åpne veiledningssiden |
| `dashboard.stagesProgress` | {completed}/5 stages | {completed}/5 aşama | {completed}/5 posmi | {completed}/5 trinn |
| `dashboard.tiles.learning` | Learning | Öğrenme | Mācīšanās | Læring |
| `dashboard.tiles.modulesDone` | {completed}/{total} modules done | {completed}/{total} modül tamamlandı | {completed}/{total} moduļi pabeigti | {completed}/{total} moduler fullført |
| `dashboard.tiles.exploreModules` | Explore modules | Modülleri keşfet | Izpētīt moduļus | Utforsk moduler |
| `dashboard.tiles.myProfile` | My Profile | Profilim | Mans profils | Min profil |
| `dashboard.tiles.profileComplete` | Complete ✓ | Tamamlandı ✓ | Pabeigts ✓ | Fullført ✓ |
| `dashboard.tiles.profileNeedsUpdating` | Needs updating | Güncelleme gerekiyor | Nepieciešama atjaunināšana | Trenger oppdatering |
| `dashboard.tiles.done` | Done | Tamam | Gatavs | Ferdig |
| `dashboard.tiles.todo` | To do | Yapılacak | Jādara | Å gjøre |
| `dashboard.tiles.jobOpenings` | Job Openings | İş İlanları | Darba piedāvājumi | Jobbstillinger |
| `dashboard.tiles.findOpportunities` | Find opportunities | Fırsatları bul | Atrast iespējas | Finn muligheter |
| `dashboard.tiles.browse` | Browse | Göz at | Pārlūkot | Bla gjennom |
| `counseling.title` | Counseling Session | Danışmanlık Oturumu | Konsultāciju sesija | Veiledningsøkt |
| `counseling.withUser` | With {name} | {name} ile | Ar {name} | Med {name} |
| `counseling.counsellingUser` | Counselling {name} | {name} için danışmanlık | {name} konsultēšana | Veiledning av {name} |
| `counseling.journeyPill` | {completed} / 5 stages complete | {completed} / 5 aşama tamamlandı | {completed} / 5 posmi pabeigti | {completed} / 5 trinn fullført |
| `counseling.online` | Online | Çevrimiçi | Tiešsaistē | Tilkoblet |
| `counseling.typing` | {name} is typing… | {name} yazıyor… | {name} raksta… | {name} skriver… |
| `counseling.attachFile` | Attach file | Dosya ekle | Pievienot failu | Legg ved fil |
| `counseling.uploading` | Uploading… | Yükleniyor… | Augšupielādē… | Laster opp… |
| `counseling.close` | Close | Kapat | Aizvērt | Lukk |
| `counseling.waitingAccept` | Waiting for session to be accepted | Oturumun kabul edilmesi bekleniyor | Gaida sesijas pieņemšanu | Venter på at økten skal godtas |
| `counseling.currentSession` | Current Session | Mevcut Oturum | Pašreizējā sesija | Nåværende økt |
| `counseling.noMessagesInSession` | No messages in this session | Bu oturumda mesaj yok | Šajā sesijā nav ziņu | Ingen meldinger i denne økten |
| `counseling.noPairTitle` | No Active Session | Aktif Oturum Yok | Nav aktīvas sesijas | Ingen aktiv økt |
| `counseling.noPairBody` | You don't have any active or upcoming counseling sessions. Contact your counselor to schedule one. | Aktif veya yaklaşan bir danışmanlık oturumunuz yok. Bir oturum planlamak için danışmanınızla iletişime geçin. | Jums nav aktīvu vai gaidāmu konsultāciju sesiju. Sazinieties ar savu konsultantu, lai ieplānotu vienu. | Du har ingen aktive eller kommende veiledningsøkter. Kontakt veilederen din for å planlegge en. |
| `counseling.chat.title` | Chat | Sohbet | Tērzēšana | Chat |
| `counseling.chat.placeholder` | Type a message... | Bir mesaj yazın... | Ierakstiet ziņu... | Skriv en melding... |
| `counseling.chat.send` | Send | Gönder | Sūtīt | Send |
| `counseling.chat.noMessages` | No messages yet. Start the conversation! | Henüz mesaj yok. Konuşmayı başlatın! | Vēl nav ziņu. Sāciet sarunu! | Ingen meldinger ennå. Start samtalen! |
| `counseling.video.title` | Video Call | Görüntülü Görüşme | Videozvans | Videosamtale |
| `counseling.video.join` | Join Video Call | Görüntülü Görüşmeye Katıl | Pievienoties videozvanam | Bli med i videosamtalen |
| `counseling.video.placeholder` | Video session will appear here | Video oturumu burada görünecek | Video sesija parādīsies šeit | Videoøkten vil vises her |
| `counseling.video.notStarted` | Video session has not started yet | Video oturumu henüz başlamadı | Video sesija vēl nav sākusies | Videoøkten har ikke startet ennå |
| `counseling.notes.title` | Session Notes | Oturum Notları | Sesijas piezīmes | Øktnotater |
| `counseling.notes.placeholder` | Enter session notes... | Oturum notlarını girin... | Ievadiet sesijas piezīmes... | Skriv inn øktnotater... |
| `counseling.notes.actionPlan` | Action Plan | Eylem Planı | Rīcības plāns | Handlingsplan |
| `counseling.notes.actionPlanPlaceholder` | Enter action items... | Eylem maddelerini girin... | Ievadiet veicamos uzdevumus... | Skriv inn handlingspunkter... |
| `counseling.notes.save` | Save Notes | Notları Kaydet | Saglabāt piezīmes | Lagre notater |
| `counseling.notes.saved` | Notes saved | Notlar kaydedildi | Piezīmes saglabātas | Notater lagret |
| `counseling.files.title` | Shared Files | Paylaşılan Dosyalar | Kopīgotie faili | Delte filer |
| `counseling.files.upload` | Upload File | Dosya Yükle | Augšupielādēt failu | Last opp fil |
| `counseling.files.noFiles` | No files shared yet | Henüz paylaşılan dosya yok | Vēl nav kopīgotu failu | Ingen filer delt ennå |
| `counseling.files.download` | Download | İndir | Lejupielādēt | Last ned |
| `counseling.session.pending` | Pending | Beklemede | Gaida | Venter |
| `counseling.session.scheduled` | Scheduled | Planlandı | Ieplānots | Planlagt |
| `counseling.session.inProgress` | In Progress | Devam Ediyor | Norisinās | Pågår |
| `counseling.session.completed` | Completed | Tamamlandı | Pabeigts | Fullført |
| `counseling.session.cancelled` | Cancelled | İptal Edildi | Atcelts | Avlyst |
| `counseling.stageStatus.locked` | Locked | Kilitli | Bloķēts | Låst |
| `counseling.stageStatus.active` | Active | Aktif | Aktīvs | Aktiv |
| `counseling.stageStatus.completed` | Completed | Tamamlandı | Pabeigts | Fullført |
| `counseling.stage.notReached` | Stage not yet reached | Aşamaya henüz ulaşılmadı | Posms vēl nav sasniegts | Trinnet er ikke nådd ennå |
| `counseling.stage.unlockHint` | Complete the previous stage to unlock this one. | Bunun kilidini açmak için önceki aşamayı tamamlayın. | Pabeidziet iepriekšējo posmu, lai atbloķētu šo. | Fullfør det forrige trinnet for å låse opp dette. |
| `counseling.stage.summary` | Stage Summary | Aşama Özeti | Posma kopsavilkums | Trinnsammendrag |
| `counseling.stage.saved` | Saved | Kaydedildi | Saglabāts | Lagret |
| `counseling.stage.saveSummary` | Save Summary | Özeti Kaydet | Saglabāt kopsavilkumu | Lagre sammendrag |
| `counseling.stage.summaryPlaceholder` | Write a summary for this stage — key observations, progress made, outcomes... | Bu aşama için bir özet yazın — temel gözlemler, kaydedilen ilerleme, sonuçlar... | Uzrakstiet šī posma kopsavilkumu — galvenie novērojumi, panāktais progress, rezultāti... | Skriv et sammendrag for dette trinnet — viktige observasjoner, fremgang, resultater... |
| `counseling.stage.noSummary` | No summary written yet for this stage. | Bu aşama için henüz özet yazılmadı. | Šim posmam vēl nav uzrakstīts kopsavilkums. | Det er ikke skrevet noe sammendrag for dette trinnet ennå. |
| `counseling.stage.noSessions` | No sessions scheduled for this stage yet. | Bu aşama için henüz oturum planlanmadı. | Šim posmam vēl nav ieplānotu sesiju. | Ingen økter er planlagt for dette trinnet ennå. |
| `counseling.stage.previousSessions` | Previous Sessions in This Stage | Bu Aşamadaki Önceki Oturumlar | Iepriekšējās sesijas šajā posmā | Tidligere økter i dette trinnet |
| `counseling.stage.sessions` | Sessions | Oturumlar | Sesijas | Økter |
| `counseling.stage.confirmComplete` | Mark this stage as complete and unlock the next one? | Bu aşamayı tamamlandı olarak işaretleyip bir sonrakinin kilidini açmak istiyor musunuz? | Atzīmēt šo posmu kā pabeigtu un atbloķēt nākamo? | Merke dette trinnet som fullført og låse opp det neste? |
| `counseling.stage.completeHint` | When you're satisfied with the progress in this stage, mark it complete to unlock the next stage. | Bu aşamadaki ilerlemeden memnun olduğunuzda, bir sonraki aşamanın kilidini açmak için tamamlandı olarak işaretleyin. | Kad esat apmierināts ar šī posma progresu, atzīmējiet to kā pabeigtu, lai atbloķētu nākamo posmu. | Når du er fornøyd med fremgangen i dette trinnet, merk det som fullført for å låse opp det neste trinnet. |
| `counseling.stage.finalHint` | This is the final stage. Mark it complete when the full counselling journey is done. | Bu son aşamadır. Tüm danışmanlık yolculuğu bittiğinde tamamlandı olarak işaretleyin. | Šis ir pēdējais posms. Atzīmējiet to kā pabeigtu, kad viss konsultēšanas ceļš ir noslēdzies. | Dette er det siste trinnet. Merk det som fullført når hele veiledningsreisen er ferdig. |
| `counseling.stage.completing` | Completing… | Tamamlanıyor… | Pabeidz… | Fullfører… |
| `counseling.stage.completeAndUnlock` | Complete Stage {number} & Unlock Next | Aşama {number}'i Tamamla ve Sonrakini Aç | Pabeigt {number}. posmu un atbloķēt nākamo | Fullfør trinn {number} og lås opp neste |
| `counseling.stage.completeJourney` | Complete Counselling Journey | Danışmanlık Yolculuğunu Tamamla | Pabeigt konsultēšanas ceļu | Fullfør veiledningsreisen |
| `counseling.stage.statusLine` | {status} · {count, plural, one {# session} other {# sessions}} | {status} · {count, plural, one {# oturum} other {# oturum}} | {status} · {count, plural, one {# sesija} other {# sesijas}} | {status} · {count, plural, one {# økt} other {# økter}} |
| `counseling.stage.historyLine` | {status} · {count, plural, one {# message} other {# messages}} | {status} · {count, plural, one {# mesaj} other {# mesaj}} | {status} · {count, plural, one {# ziņa} other {# ziņas}} | {status} · {count, plural, one {# melding} other {# meldinger}} |
| `counseling.journey.title` | Counselling Journey | Danışmanlık Yolculuğu | Konsultēšanas ceļš | Veiledningsreise |
| `counseling.journey.stagesComplete` | {completed} / 5 stages complete | {completed} / 5 aşama tamamlandı | {completed} / 5 posmi pabeigti | {completed} / 5 trinn fullført |
| `counseling.journey.earnBanner` | Complete all 5 stages to earn your Certificate of Attendance | Katılım Belgenizi kazanmak için 5 aşamanın tamamını tamamlayın | Pabeidziet visus 5 posmus, lai nopelnītu savu Apmeklējuma apliecību | Fullfør alle de 5 trinnene for å opptjene ditt deltakerbevis |
| `counseling.journey.earnBannerBody` | Finish every stage of the counselling journey and your counsellor will issue you a personalised certificate — official proof of your commitment and progress. | Danışmanlık yolculuğunun her aşamasını bitirin ve danışmanınız size kişiselleştirilmiş bir belge düzenlesin — bağlılığınızın ve ilerlemenizin resmi kanıtı. | Pabeidziet katru konsultēšanas ceļa posmu, un jūsu konsultants izsniegs jums personalizētu apliecību — oficiālu apliecinājumu jūsu apņēmībai un progresam. | Fullfør hvert trinn i veiledningsreisen, så vil veilederen din utstede et personlig bevis til deg — offisielt bevis på ditt engasjement og din fremgang. |
| `counseling.journey.ofFive` | of 5 | / 5 | no 5 | av 5 |
| `counseling.journey.certReady` | Certificate of Attendance is ready! | Katılım Belgesi hazır! | Apmeklējuma apliecība ir gatava! | Deltakerbeviset er klart! |
| `counseling.journey.issuedOn` | Issued on {date} | {date} tarihinde düzenlendi | Izsniegts {date} | Utstedt {date} |
| `counseling.journey.viewDownload` | View & Download Certificate | Belgeyi Görüntüle ve İndir | Skatīt un lejupielādēt apliecību | Vis og last ned bevis |
| `counseling.journey.counsellorCanIssue` | All 5 stages are complete — you can now issue the Certificate of Attendance. | 5 aşamanın tamamı tamamlandı — artık Katılım Belgesini düzenleyebilirsiniz. | Visi 5 posmi ir pabeigti — tagad varat izsniegt Apmeklējuma apliecību. | Alle de 5 trinnene er fullført — du kan nå utstede deltakerbeviset. |
| `counseling.journey.confirmIssue` | I confirm that <b>{name}</b> has successfully completed all five counselling stages and is entitled to a Certificate of Attendance. | <b>{name}</b>'in beş danışmanlık aşamasının tamamını başarıyla tamamladığını ve Katılım Belgesi almaya hak kazandığını onaylıyorum. | Apliecinu, ka <b>{name}</b> ir veiksmīgi pabeidzis visus piecus konsultēšanas posmus un ir tiesīgs saņemt Apmeklējuma apliecību. | Jeg bekrefter at <b>{name}</b> har fullført alle de fem veiledningstrinnene med suksess og har rett til et deltakerbevis. |
| `counseling.journey.issuing` | Issuing… | Düzenleniyor… | Izsniedz… | Utsteder… |
| `counseling.journey.issueCert` | Issue Certificate of Attendance | Katılım Belgesi Düzenle | Izsniegt Apmeklējuma apliecību | Utsted deltakerbevis |
| `counseling.journey.issueFailed` | Failed to issue certificate | Belge düzenlenemedi | Neizdevās izsniegt apliecību | Kunne ikke utstede bevis |
| `counseling.journey.neetWaiting` | Journey complete! Your certificate is awaiting counsellor approval. | Yolculuk tamamlandı! Belgeniz danışman onayını bekliyor. | Ceļš pabeigts! Jūsu apliecība gaida konsultanta apstiprinājumu. | Reisen er fullført! Beviset ditt venter på veileders godkjenning. |
| `portfolio.title` | Digital Portfolio | Dijital Portfolyo | Digitālais portfolio | Digital portefølje |
| `portfolio.contact.title` | Contact Information | İletişim Bilgileri | Kontaktinformācija | Kontaktinformasjon |
| `portfolio.contact.name` | Full Name | Ad Soyad | Pilns vārds | Fullt navn |
| `portfolio.contact.email` | Email | E-posta | E-pasts | E-post |
| `portfolio.contact.phone` | Phone | Telefon | Tālrunis | Telefon |
| `portfolio.contact.address` | Address | Adres | Adrese | Adresse |
| `portfolio.contact.linkedin` | LinkedIn Profile | LinkedIn Profili | LinkedIn profils | LinkedIn-profil |
| `portfolio.contact.phonePlaceholder` | +XX XXX XXX XXXX | +XX XXX XXX XXXX | +XX XXX XXX XXXX | +XX XXX XXX XXXX |
| `portfolio.contact.addressPlaceholder` | City, Country | Şehir, Ülke | Pilsēta, valsts | By, land |
| `portfolio.contact.linkedinPlaceholder` | https://linkedin.com/in/username | https://linkedin.com/in/kullaniciadi | https://linkedin.com/in/lietotajvards | https://linkedin.com/in/brukernavn |
| `portfolio.summary.title` | Personal Summary | Kişisel Özet | Personīgais kopsavilkums | Personlig sammendrag |
| `portfolio.summary.placeholder` | Write a brief summary about yourself... | Kendiniz hakkında kısa bir özet yazın... | Uzrakstiet īsu kopsavilkumu par sevi... | Skriv et kort sammendrag om deg selv... |
| `portfolio.qualifications.title` | Qualifications & Education | Nitelikler ve Eğitim | Kvalifikācijas un izglītība | Kvalifikasjoner og utdanning |
| `portfolio.qualifications.add` | Add Qualification | Nitelik Ekle | Pievienot kvalifikāciju | Legg til kvalifikasjon |
| `portfolio.qualifications.institution` | Institution | Kurum | Iestāde | Institusjon |
| `portfolio.qualifications.completedOn` | Completed on | Tamamlanma tarihi | Pabeigts | Fullført |
| `portfolio.qualifications.inProgress` | In Progress | Devam Ediyor | Norisinās | Pågår |
| `portfolio.qualifications.completed` | Completed | Tamamlandı | Pabeigts | Fullført |
| `portfolio.qualifications.notStarted` | Not Started | Başlamadı | Nav sākts | Ikke startet |
| `portfolio.qualifications.newTitle` | New Qualification | Yeni Nitelik | Jauna kvalifikācija | Ny kvalifikasjon |
| `portfolio.qualifications.fieldTitle` | Title | Başlık | Nosaukums | Tittel |
| `portfolio.qualifications.fieldStatus` | Status | Durum | Statuss | Status |
| `portfolio.qualifications.fieldCompletionDate` | Completion Date | Tamamlanma Tarihi | Pabeigšanas datums | Fullføringsdato |
| `portfolio.qualifications.titlePlaceholder` | e.g. Upper Secondary School Certificate | ör. Lise Diploması | piem., Vidusskolas atestāts | f.eks. vitnemål fra videregående skole |
| `portfolio.qualifications.institutionPlaceholder` | e.g. Rural High School | ör. Kırsal Lise | piem., Lauku vidusskola | f.eks. rural videregående skole |
| `portfolio.qualifications.titleRequired` | Title is required. | Başlık zorunludur. | Nosaukums ir obligāts. | Tittel er obligatorisk. |
| `portfolio.qualifications.empty` | No qualifications added yet | Henüz nitelik eklenmedi | Vēl nav pievienotu kvalifikāciju | Ingen kvalifikasjoner lagt til ennå |
| `portfolio.qualifications.confirmRemove` | Remove this qualification? | Bu nitelik kaldırılsın mı? | Noņemt šo kvalifikāciju? | Fjerne denne kvalifikasjonen? |
| `portfolio.skills.title` | Skills | Beceriler | Prasmes | Ferdigheter |
| `portfolio.skills.placeholder` | List your skills... | Becerilerinizi listeleyin... | Uzskaitiet savas prasmes... | List opp ferdighetene dine... |
| `portfolio.targetSector.title` | Target Sector | Hedef Sektör | Mērķa nozare | Målsektor |
| `portfolio.targetSector.placeholder` | e.g. Agriculture, Technology, Healthcare | ör. Tarım, Teknoloji, Sağlık | piem., lauksaimniecība, tehnoloģijas, veselības aprūpe | f.eks. landbruk, teknologi, helse |
| `portfolio.neetStatus.title` | Current Status | Mevcut Durum | Pašreizējais statuss | Nåværende status |
| `portfolio.neetStatus.placeholder` | Describe your current employment situation | Mevcut istihdam durumunuzu açıklayın | Aprakstiet savu pašreizējo nodarbinātības situāciju | Beskriv din nåværende sysselsettingssituasjon |
| `portfolio.actions.title` | Portfolio Actions | Portfolyo İşlemleri | Portfolio darbības | Porteføljehandlinger |
| `portfolio.actions.export` | Export PDF | PDF Dışa Aktar | Eksportēt PDF | Eksporter PDF |
| `portfolio.actions.share` | Share Portfolio | Portfolyoyu Paylaş | Kopīgot portfolio | Del portefølje |
| `portfolio.actions.print` | Print | Yazdır | Drukāt | Skriv ut |
| `portfolio.actions.lastUpdated` | Last updated | Son güncelleme | Pēdējoreiz atjaunināts | Sist oppdatert |
| `portfolio.completion.title` | Profile Completion | Profil Tamamlama | Profila aizpildīšana | Profilfullføring |
| `portfolio.completion.personalSummary` | Personal Summary | Kişisel Özet | Personīgais kopsavilkums | Personlig sammendrag |
| `portfolio.completion.contactInfo` | Contact Info | İletişim Bilgileri | Kontaktinformācija | Kontaktinformasjon |
| `portfolio.completion.targetSector` | Target Sector | Hedef Sektör | Mērķa nozare | Målsektor |
| `portfolio.completion.skills` | Skills | Beceriler | Prasmes | Ferdigheter |
| `portfolio.completion.qualifications` | Qualifications | Nitelikler | Kvalifikācijas | Kvalifikasjoner |
| `portfolio.counselorFeedback.title` | Counselor Feedback | Danışman Geri Bildirimi | Konsultanta atsauksmes | Tilbakemelding fra veileder |
| `portfolio.counselorFeedback.noFeedback` | No feedback yet from your counselor | Danışmanınızdan henüz geri bildirim yok | Vēl nav atsauksmju no jūsu konsultanta | Ingen tilbakemelding fra veilederen din ennå |
| `portfolio.counselorFeedback.from` | From {name} | {name} tarafından | No {name} | Fra {name} |
| `portfolio.counselorFeedback.actionPlan` | Action Plan: | Eylem Planı: | Rīcības plāns: | Handlingsplan: |
| `library.title` | E-Library & Modules | E-Kütüphane & Modüller | E-bibliotēka un moduļi | E-bibliotek og moduler |
| `library.subtitle` | Enhance your skills with our learning modules | Öğrenme modüllerimizle becerilerinizi geliştirin | Uzlabojiet savas prasmes ar mūsu mācību moduļiem | Forbedre ferdighetene dine med læringsmodulene våre |
| `library.overallProgress` | Overall Progress | Genel İlerleme | Kopējais progress | Samlet fremgang |
| `library.noModules` | No modules found for this category | Bu kategori için modül bulunamadı | Šai kategorijai nav atrasti moduļi | Ingen moduler funnet for denne kategorien |
| `library.categories.all` | All Categories | Tüm Kategoriler | Visas kategorijas | Alle kategorier |
| `library.categories.digitalSkills` | Digital Skills | Dijital Beceriler | Digitālās prasmes | Digitale ferdigheter |
| `library.categories.careerDevelopment` | Career Development | Kariyer Gelişimi | Karjeras attīstība | Karriereutvikling |
| `library.categories.lifeSkills` | Life Skills | Yaşam Becerileri | Dzīves prasmes | Livsferdigheter |
| `library.categories.entrepreneurship` | Entrepreneurship | Girişimcilik | Uzņēmējdarbība | Entreprenørskap |
| `library.categories.agriculture` | Agriculture | Tarım | Lauksaimniecība | Landbruk |
| `library.module.duration` | min | dk | min | min |
| `library.module.start` | Start Module | Modülü Başlat | Sākt moduli | Start modul |
| `library.module.continue` | Continue | Devam Et | Turpināt | Fortsett |
| `library.module.review` | Review | Gözden Geçir | Pārskatīt | Gjennomgå |
| `library.module.completed` | Completed | Tamamlandı | Pabeigts | Fullført |
| `library.module.inProgress` | In Progress | Devam Ediyor | Norisinās | Pågår |
| `library.module.notStarted` | Not Started | Başlamadı | Nav sākts | Ikke startet |
| `library.progress.title` | Your Progress | İlerlemeniz | Jūsu progress | Din fremgang |
| `library.progress.completed` | Completed | Tamamlandı | Pabeigts | Fullført |
| `library.progress.inProgress` | In Progress | Devam Ediyor | Norisinās | Pågår |
| `library.progress.notStarted` | Not Started | Başlamadı | Nav sākts | Ikke startet |
| `module.backToLibrary` | Back to Library | Kütüphaneye Dön | Atpakaļ uz bibliotēku | Tilbake til biblioteket |
| `module.noLessons` | No lessons available for this module yet. | Bu modül için henüz ders yok. | Šim modulim vēl nav pieejamu nodarbību. | Ingen leksjoner tilgjengelig for denne modulen ennå. |
| `module.topics` | Topics | Konular | Tēmas | Emner |
| `module.lessons` | Lessons | Dersler | Nodarbības | Leksjoner |
| `module.other` | Other | Diğer | Citas | Annet |
| `module.previous` | Previous | Önceki | Iepriekšējā | Forrige |
| `module.next` | Next | İleri | Nākamā | Neste |
| `module.markComplete` | Mark complete | Tamamlandı olarak işaretle | Atzīmēt kā pabeigtu | Merk som fullført |
| `module.markAsComplete` | Mark as complete | Tamamlandı olarak işaretle | Atzīmēt kā pabeigtu | Merk som fullført |
| `module.openInNewTab` | Open in new tab | Yeni sekmede aç | Atvērt jaunā cilnē | Åpne i ny fane |
| `module.pdfDocument` | PDF Document | PDF Belgesi | PDF dokuments | PDF-dokument |
| `module.scormContent` | SCORM Content | SCORM İçeriği | SCORM saturs | SCORM-innhold |
| `module.invalidVideoUrl` | Invalid video URL. | Geçersiz video URL'si. | Nederīgs video URL. | Ugyldig video-URL. |
| `module.types.reading` | Reading | Okuma | Lasīšana | Lesing |
| `module.types.pdf` | PDF | PDF | PDF | PDF |
| `module.types.video` | Video | Video | Video | Video |
| `module.types.quiz` | Quiz | Test | Tests | Quiz |
| `module.types.scorm` | SCORM | SCORM | SCORM | SCORM |
| `module.quiz.invalidData` | Quiz data is invalid. | Test verileri geçersiz. | Testa dati nav derīgi. | Quiz-dataene er ugyldige. |
| `module.quiz.perfectScore` | Perfect score! | Mükemmel puan! | Nevainojams rezultāts! | Perfekt resultat! |
| `module.quiz.scoreLine` | {score} / {total} correct | {score} / {total} doğru | {score} / {total} pareizas | {score} / {total} riktige |
| `module.quiz.completed` | You've completed this quiz! | Bu testi tamamladınız! | Jūs pabeidzāt šo testu! | Du har fullført denne quizen! |
| `module.quiz.reviewAndRetry` | Review the highlighted answers and try again. | Vurgulanan cevapları gözden geçirin ve tekrar deneyin. | Pārskatiet izceltās atbildes un mēģiniet vēlreiz. | Gå gjennom de uthevede svarene og prøv igjen. |
| `module.quiz.tryAgain` | Try again | Tekrar dene | Mēģināt vēlreiz | Prøv igjen |
| `module.quiz.submitAnswers` | Submit answers | Cevapları gönder | Iesniegt atbildes | Send inn svar |
| `module.quiz.selectMatch` | Select match… | Eşleşme seçin… | Izvēlieties atbilstību… | Velg treff… |
| `module.quiz.questionType.trueFalse` | True / False | Doğru / Yanlış | Patiess / Nepatiess | Sann / Usann |
| `module.quiz.questionType.matching` | Matching | Eşleştirme | Saskaņošana | Sammenkobling |
| `module.quiz.questionType.multipleChoice` | Multiple choice | Çoktan seçmeli | Vairākas izvēles | Flervalg |
| `module.quiz.true` | True | Doğru | Patiess | Sann |
| `module.quiz.false` | False | Yanlış | Nepatiess | Usann |
| `certificate.printSave` | Print / Save as PDF | Yazdır / PDF Olarak Kaydet | Drukāt / Saglabāt kā PDF | Skriv ut / Lagre som PDF |
| `certificate.downloadPdf` | Download PDF | PDF İndir | Lejupielādēt PDF | Last ned PDF |
| `certificate.printHint` | In the print dialog, choose "Save as PDF" and set paper to A4 Landscape for best results. | Yazdırma iletişim kutusunda, en iyi sonuç için "PDF Olarak Kaydet" seçeneğini seçin ve kağıdı A4 Yatay olarak ayarlayın. | Drukāšanas dialoglodziņā izvēlieties "Saglabāt kā PDF" un iestatiet papīru uz A4 ainavas orientāciju labākam rezultātam. | I utskriftsdialogen velger du "Lagre som PDF" og setter papir til A4 liggende for best resultat. |
| `certificate.brandSubtitle` | EMPOWERING NEET YOUTH IN RURAL COMMUNITIES | KIRSAL TOPLULUKLARDAKİ NEET GENÇLERİ GÜÇLENDİRMEK | STIPRINĀM NEET JAUNIEŠUS LAUKU KOPIENĀS | STYRKER NEET-UNGDOM I RURALE SAMFUNN |
| `certificate.erasmusProgramme` | ERASMUS+ PROGRAMME | ERASMUS+ PROGRAMI | ERASMUS+ PROGRAMMA | ERASMUS+-PROGRAMMET |
| `certificate.coFunded` | CO-FUNDED BY THE EUROPEAN UNION | AVRUPA BİRLİĞİ TARAFINDAN EŞ FİNANSE EDİLMİŞTİR | LĪDZFINANSĒ EIROPAS SAVIENĪBA | MEDFINANSIERT AV DEN EUROPEISKE UNION |
| `certificate.certifyThat` | This is to certify that | Bu belge şunu tasdik eder: | Ar šo tiek apliecināts, ka | Dette bekrefter at |
| `certificate.bodyText` | has successfully completed the <b>RURAL-CONNECT Counselling Programme</b>, a structured five-stage journey of personal development and employment support for NEET youth in rural communities across Europe. | <b>RURAL-CONNECT Danışmanlık Programı</b>'nı, Avrupa'daki kırsal topluluklardaki NEET gençleri için kişisel gelişim ve istihdam desteği içeren yapılandırılmış beş aşamalı bir yolculuğu başarıyla tamamlamıştır. | ir veiksmīgi pabeidzis <b>RURAL-CONNECT konsultēšanas programmu</b> — strukturētu piecu posmu ceļu personīgajai attīstībai un nodarbinātības atbalstam NEET jauniešiem lauku kopienās visā Eiropā. | har fullført <b>RURAL-CONNECT-veiledningsprogrammet</b> med suksess, en strukturert reise i fem trinn med personlig utvikling og sysselsettingsstøtte for NEET-ungdom i rurale samfunn i hele Europa. |
| `certificate.dateOfIssue` | Date of Issue | Düzenlenme Tarihi | Izsniegšanas datums | Utstedelsesdato |
| `certificate.programmeCounsellor` | Programme Counsellor | Program Danışmanı | Programmas konsultants | Programveileder |
| `certificate.footerProject` | ruralconnect-app.eu · Erasmus+ Project 2024–2027 | ruralconnect-app.eu · Erasmus+ Projesi 2024–2027 | ruralconnect-app.eu · Erasmus+ projekts 2024–2027 | ruralconnect-app.eu · Erasmus+-prosjekt 2024–2027 |
| `certificate.footerIssued` | This certificate is issued upon successful completion of all five counselling stages. | Bu belge, beş danışmanlık aşamasının tamamının başarıyla tamamlanması üzerine düzenlenir. | Šī apliecība tiek izsniegta pēc visu piecu konsultēšanas posmu veiksmīgas pabeigšanas. | Dette beviset utstedes ved vellykket fullføring av alle de fem veiledningstrinnene. |
| `certificate.footerCoFunded` | Co-funded by the European Union | Avrupa Birliği tarafından eş finanse edilmiştir | Līdzfinansē Eiropas Savienība | Medfinansiert av Den europeiske union |
| `notifications.title` | Notifications | Bildirimler | Paziņojumi | Varsler |
| `notifications.empty` | No notifications | Bildirim yok | Nav paziņojumu | Ingen varsler |
| `notifications.accept` | Accept | Kabul Et | Pieņemt | Godta |
| `notifications.decline` | Decline | Reddet | Noraidīt | Avslå |
| `jobPost.pageTitle` | Post a Job Opening | Bir İş İlanı Yayınlayın | Publicēt darba piedāvājumu | Legg ut en jobbstilling |
| `jobPost.pageSubtitle` | Reach NEET youth in rural communities across Europe. Your job opening will be reviewed and published on the Rural-Connect platform. | Avrupa'daki kırsal topluluklardaki NEET gençlerine ulaşın. İş ilanınız incelenecek ve Rural-Connect platformunda yayınlanacaktır. | Sasniedziet NEET jauniešus lauku kopienās visā Eiropā. Jūsu darba piedāvājums tiks pārskatīts un publicēts Rural-Connect platformā. | Nå NEET-ungdom i rurale samfunn i hele Europa. Jobbstillingen din vil bli gjennomgått og publisert på Rural-Connect-plattformen. |
| `jobPost.submittedTitle` | Job Opening Submitted! | İş İlanı Gönderildi! | Darba piedāvājums iesniegts! | Jobbstilling sendt inn! |
| `jobPost.submittedBody` | Your job opening has been submitted for review. Once approved by our team, it will appear in the Rural-Connect Labor Market section visible to all users. | İş ilanınız inceleme için gönderildi. Ekibimiz tarafından onaylandıktan sonra, tüm kullanıcılara görünür olan Rural-Connect İş Gücü Piyasası bölümünde görünecektir. | Jūsu darba piedāvājums ir iesniegts pārskatīšanai. Kad mūsu komanda to apstiprinās, tas parādīsies Rural-Connect Darba tirgus sadaļā, kas redzama visiem lietotājiem. | Jobbstillingen din er sendt inn for gjennomgang. Når den er godkjent av teamet vårt, vil den vises i Rural-Connect-arbeidsmarkedsdelen som er synlig for alle brukere. |
| `jobPost.submitAnother` | Submit another opening | Başka bir ilan gönder | Iesniegt citu piedāvājumu | Send inn en ny stilling |
| `jobPost.jobDetails` | Job Details | İş Ayrıntıları | Darba informācija | Jobbdetaljer |
| `jobPost.jobTitle` | Job Title | İş Unvanı | Darba nosaukums | Stillingstittel |
| `jobPost.jobTitlePlaceholder` | e.g. Agricultural Worker, IT Support Technician | ör. Tarım İşçisi, BT Destek Teknisyeni | piem., lauksaimniecības darbinieks, IT atbalsta tehniķis | f.eks. landbruksarbeider, IT-støttetekniker |
| `jobPost.company` | Company / Organisation | Şirket / Kuruluş | Uzņēmums / Organizācija | Bedrift / Organisasjon |
| `jobPost.companyPlaceholder` | Your company name | Şirketinizin adı | Jūsu uzņēmuma nosaukums | Bedriftens navn |
| `jobPost.country` | Country | Ülke | Valsts | Land |
| `jobPost.selectCountry` | Select country | Ülke seçin | Izvēlieties valsti | Velg land |
| `jobPost.location` | Location / City | Konum / Şehir | Atrašanās vieta / Pilsēta | Sted / By |
| `jobPost.locationPlaceholder` | e.g. Athens, Rural Attica | ör. Atina, Kırsal Attika | piem., Atēnas, lauku Atika | f.eks. Athen, rurale Attika |
| `jobPost.description` | Job Description | İş Tanımı | Darba apraksts | Stillingsbeskrivelse |
| `jobPost.descriptionPlaceholder` | Describe the role, responsibilities, requirements, and what you offer... | Rolü, sorumlulukları, gereksinimleri ve sunduklarınızı açıklayın... | Aprakstiet lomu, pienākumus, prasības un to, ko piedāvājat... | Beskriv rollen, ansvarsområdene, kravene og hva du tilbyr... |
| `jobPost.contactInformation` | Contact Information | İletişim Bilgileri | Kontaktinformācija | Kontaktinformasjon |
| `jobPost.contactName` | Contact Name | İletişim Adı | Kontaktpersonas vārds | Kontaktnavn |
| `jobPost.contactNamePlaceholder` | Your name or HR contact | Adınız veya İK iletişim kişisi | Jūsu vārds vai personāla kontaktpersona | Ditt navn eller HR-kontakt |
| `jobPost.contactEmail` | Contact Email | İletişim E-postası | Kontakta e-pasts | Kontakt-e-post |
| `jobPost.contactEmailPlaceholder` | hr@yourcompany.com | ik@sirketiniz.com | hr@jususnemums.com | hr@dinbedrift.com |
| `jobPost.website` | Company Website | Şirket Web Sitesi | Uzņēmuma tīmekļa vietne | Bedriftens nettsted |
| `jobPost.websitePlaceholder` | https://www.yourcompany.com | https://www.sirketiniz.com | https://www.jususnemums.com | https://www.dinbedrift.com |
| `jobPost.notice` | Your job opening will be reviewed by our team before it appears publicly. We aim to review submissions within 2 business days. Only opportunities suitable for NEET youth in rural areas will be approved. | İş ilanınız herkese açık olarak görünmeden önce ekibimiz tarafından incelenecektir. Başvuruları 2 iş günü içinde incelemeyi hedefliyoruz. Yalnızca kırsal bölgelerdeki NEET gençlere uygun fırsatlar onaylanacaktır. | Jūsu darba piedāvājums pirms publiskošanas tiks pārskatīts mūsu komandā. Mūsu mērķis ir pārskatīt iesniegumus 2 darba dienu laikā. Tiks apstiprinātas tikai NEET jauniešiem lauku apvidos piemērotas iespējas. | Jobbstillingen din vil bli gjennomgått av teamet vårt før den vises offentlig. Vi tar sikte på å gjennomgå innsendinger innen 2 virkedager. Bare muligheter som er egnet for NEET-ungdom i rurale områder, vil bli godkjent. |
| `jobPost.submitting` | Submitting… | Gönderiliyor… | Iesniedz… | Sender inn… |
| `jobPost.submit` | Submit Job Opening | İş İlanını Gönder | Iesniegt darba piedāvājumu | Send inn jobbstilling |
| `jobPost.submissionFailed` | Submission failed. Please try again. | Gönderim başarısız oldu. Lütfen tekrar deneyin. | Iesniegšana neizdevās. Lūdzu, mēģiniet vēlreiz. | Innsending mislyktes. Vennligst prøv igjen. |
| `jobPost.genericError` | Something went wrong. Please try again. | Bir şeyler ters gitti. Lütfen tekrar deneyin. | Kaut kas nogāja greizi. Lūdzu, mēģiniet vēlreiz. | Noe gikk galt. Vennligst prøv igjen. |
| `jobPost.requiredMark` | * | * | * | * |
| `schedule.title` | Schedule Video Session | Görüntülü Oturum Planla | Ieplānot video sesiju | Planlegg videoøkt |
| `schedule.subtitle` | Select a student, choose a date and time, and send them an invitation. | Bir öğrenci seçin, bir tarih ve saat belirleyin ve ona bir davet gönderin. | Izvēlieties studentu, izvēlieties datumu un laiku un nosūtiet viņam uzaicinājumu. | Velg en student, velg en dato og et tidspunkt, og send dem en invitasjon. |
| `schedule.selectStudent` | Select Student | Öğrenci Seç | Izvēlēties studentu | Velg student |
| `schedule.myStudentsOnly` | My Students Only | Yalnızca Öğrencilerim | Tikai mani studenti | Bare mine studenter |
| `schedule.searchPlaceholder` | Search by name or email... | İsim veya e-posta ile ara... | Meklēt pēc vārda vai e-pasta... | Søk etter navn eller e-post... |
| `schedule.loadingStudents` | Loading students... | Öğrenciler yükleniyor... | Ielādē studentus... | Laster studenter... |
| `schedule.noStudents` | No students found | Öğrenci bulunamadı | Nav atrasti studenti | Ingen studenter funnet |
| `schedule.dateTime` | Date & Time | Tarih ve Saat | Datums un laiks | Dato og tid |
| `schedule.date` | Date | Tarih | Datums | Dato |
| `schedule.time` | Time | Saat | Laiks | Tid |
| `schedule.note` | Note (optional) | Not (isteğe bağlı) | Piezīme (neobligāta) | Notat (valgfritt) |
| `schedule.notePlaceholder` | Add a note for the student about this session... | Bu oturum hakkında öğrenci için bir not ekleyin... | Pievienojiet piezīmi studentam par šo sesiju... | Legg til et notat til studenten om denne økten... |
| `schedule.cancel` | Cancel | İptal | Atcelt | Avbryt |
| `schedule.scheduling` | Scheduling... | Planlanıyor... | Plāno... | Planlegger... |
| `schedule.sendInvitation` | Send Invitation | Davet Gönder | Nosūtīt uzaicinājumu | Send invitasjon |
| `schedule.failed` | Failed to schedule session | Oturum planlanamadı | Neizdevās ieplānot sesiju | Kunne ikke planlegge økten |
| `schedule.failedRetry` | Failed to schedule session. Please try again. | Oturum planlanamadı. Lütfen tekrar deneyin. | Neizdevās ieplānot sesiju. Lūdzu, mēģiniet vēlreiz. | Kunne ikke planlegge økten. Vennligst prøv igjen. |
| `laborMarket.title` | Labor Market Links | İş Gücü Piyasası Bağlantıları | Darba tirgus saites | Arbeidsmarkedslenker |
| `laborMarket.subtitle` | Connect with employment agencies and job opportunities in your region | Bölgenizdeki iş bulma kurumları ve istihdam fırsatlarıyla bağlantı kurun | Sazinieties ar nodarbinātības aģentūrām un darba iespējām savā reģionā | Koble deg til arbeidsformidlinger og jobbmuligheter i din region |
| `laborMarket.goToJobs` | Go to Jobs | İş İlanlarına Git | Doties uz darba piedāvājumiem | Gå til jobber |
| `laborMarket.visitWebsite` | Visit Website | Web Sitesini Ziyaret Et | Apmeklēt tīmekļa vietni | Besøk nettstedet |
| `laborMarket.website` | Website | Web Sitesi | Tīmekļa vietne | Nettsted |
| `laborMarket.apply` | Apply | Başvur | Pieteikties | Søk |
| `laborMarket.allCountries` | All Countries | Tüm Ülkeler | Visas valstis | Alle land |
| `laborMarket.noLinks` | No links available for this region | Bu bölge için kullanılabilir bağlantı yok | Šim reģionam nav pieejamu saišu | Ingen lenker tilgjengelig for denne regionen |
| `laborMarket.postJob` | Post a Job Opening | Bir İş İlanı Yayınlayın | Publicēt darba piedāvājumu | Legg ut en jobbstilling |
| `laborMarket.tabAgencies` | Employment Agencies | İş Bulma Kurumları | Nodarbinātības aģentūras | Arbeidsformidlinger |
| `laborMarket.tabJobs` | Job Openings | İş İlanları | Darba piedāvājumi | Jobbstillinger |
| `laborMarket.searchAgencies` | Search agencies… | Kurumları ara… | Meklēt aģentūras… | Søk etter formidlinger… |
| `laborMarket.searchJobs` | Search job openings… | İş ilanlarını ara… | Meklēt darba piedāvājumus… | Søk etter jobbstillinger… |
| `laborMarket.agenciesFound` | {count, plural, one {# agency} other {# agencies}} found | {count, plural, one {# kurum bulundu} other {# kurum bulundu}} | atrasta {count, plural, one {# aģentūra} other {# aģentūras}} | {count, plural, one {# formidling funnet} other {# formidlinger funnet}} |
| `laborMarket.openingsFound` | {count, plural, one {# opening} other {# openings}} found | {count, plural, one {# ilan bulundu} other {# ilan bulundu}} | atrasts {count, plural, one {# piedāvājums} other {# piedāvājumi}} | {count, plural, one {# stilling funnet} other {# stillinger funnet}} |
| `laborMarket.agencyCount` | {count, plural, one {# agency} other {# agencies}} | {count, plural, one {# kurum} other {# kurum}} | {count, plural, one {# aģentūra} other {# aģentūras}} | {count, plural, one {# formidling} other {# formidlinger}} |
| `laborMarket.openingCount` | {count, plural, one {# opening} other {# openings}} | {count, plural, one {# ilan} other {# ilan}} | {count, plural, one {# piedāvājums} other {# piedāvājumi}} | {count, plural, one {# stilling} other {# stillinger}} |
| `laborMarket.noOpenings` | No job openings available yet. | Henüz kullanılabilir iş ilanı yok. | Vēl nav pieejamu darba piedāvājumu. | Ingen jobbstillinger tilgjengelig ennå. |
| `laborMarket.countries.NO` | Norway | Norveç | Norvēģija | Norge |
| `laborMarket.countries.GR` | Greece | Yunanistan | Grieķija | Hellas |
| `laborMarket.countries.TR` | Turkey | Türkiye | Turcija | Tyrkia |
| `laborMarket.countries.LV` | Latvia | Letonya | Latvija | Latvia |
| `laborMarket.countries.ES` | Spain | İspanya | Spānija | Spania |
| `laborMarket.countries.IT` | Italy | İtalya | Itālija | Italia |
| `laborMarket.countries.EU` | European Union | Avrupa Birliği | Eiropas Savienība | Den europeiske union |
| `admin.users.title` | User Management | Kullanıcı Yönetimi | Lietotāju pārvaldība | Brukeradministrasjon |
| `admin.users.registeredUsers` | {count, plural, one {# registered user} other {# registered users}} | {count, plural, one {# kayıtlı kullanıcı} other {# kayıtlı kullanıcı}} | {count, plural, one {# reģistrēts lietotājs} other {# reģistrēti lietotāji}} | {count, plural, one {# registrert bruker} other {# registrerte brukere}} |
| `admin.users.newUser` | New User | Yeni Kullanıcı | Jauns lietotājs | Ny bruker |
| `admin.users.inviteCounsellor` | Invite a Counsellor | Bir Danışman Davet Et | Uzaicināt konsultantu | Inviter en veileder |
| `admin.users.tokenLink` | Token link | Token bağlantısı | Marķiera saite | Token-lenke |
| `admin.users.inviteHint` | Enter a counsellor's email to generate a one-time invite link. Copy and send the link to them — it expires in 7 days. | Tek kullanımlık bir davet bağlantısı oluşturmak için bir danışmanın e-postasını girin. Bağlantıyı kopyalayıp gönderin — 7 gün içinde sona erer. | Ievadiet konsultanta e-pastu, lai izveidotu vienreizēju uzaicinājuma saiti. Kopējiet un nosūtiet viņam saiti — tā beidzas pēc 7 dienām. | Skriv inn e-postadressen til en veileder for å generere en engangsinvitasjonslenke. Kopier og send lenken til dem — den utløper om 7 dager. |
| `admin.users.emailRequired` | Email is required. | E-posta zorunludur. | E-pasts ir obligāts. | E-post er obligatorisk. |
| `admin.users.invitePlaceholder` | counsellor@example.com | danisman@ornek.com | konsultants@piemers.com | veileder@eksempel.com |
| `admin.users.generating` | Generating… | Oluşturuluyor… | Izveido… | Genererer… |
| `admin.users.generateLink` | Generate Link | Bağlantı Oluştur | Izveidot saiti | Generer lenke |
| `admin.users.used` | Used | Kullanıldı | Izmantots | Brukt |
| `admin.users.expired` | Expired | Süresi doldu | Beidzies | Utløpt |
| `admin.users.expiresOn` | Expires {date} | {date} tarihinde sona eriyor | Beidzas {date} | Utløper {date} |
| `admin.users.copyInviteLink` | Copy invite link | Davet bağlantısını kopyala | Kopēt uzaicinājuma saiti | Kopier invitasjonslenke |
| `admin.users.copied` | Copied! | Kopyalandı! | Nokopēts! | Kopiert! |
| `admin.users.copyLink` | Copy link | Bağlantıyı kopyala | Kopēt saiti | Kopier lenke |
| `admin.users.revoke` | Revoke | İptal Et | Atsaukt | Tilbakekall |
| `admin.users.createNewUser` | Create New User | Yeni Kullanıcı Oluştur | Izveidot jaunu lietotāju | Opprett ny bruker |
| `admin.users.fullName` | Full Name | Ad Soyad | Pilns vārds | Fullt navn |
| `admin.users.email` | Email | E-posta | E-pasts | E-post |
| `admin.users.password` | Password | Şifre | Parole | Passord |
| `admin.users.role` | Role | Rol | Loma | Rolle |
| `admin.users.country` | Country | Ülke | Valsts | Land |
| `admin.users.language` | Language | Dil | Valoda | Språk |
| `admin.users.namePlaceholder` | e.g. Maria Papadopoulou | ör. Maria Papadopoulou | piem., Maria Papadopoulou | f.eks. Maria Papadopoulou |
| `admin.users.emailPlaceholder` | user@example.com | kullanici@ornek.com | lietotajs@piemers.com | bruker@eksempel.com |
| `admin.users.passwordPlaceholder` | Min. 8 characters recommended | En az 8 karakter önerilir | Ieteicams vismaz 8 rakstzīmes | Minst 8 tegn anbefales |
| `admin.users.countryPlaceholder` | e.g. GR, NO, TR… | ör. GR, NO, TR… | piem., GR, NO, TR… | f.eks. GR, NO, TR… |
| `admin.users.createUser` | Create User | Kullanıcı Oluştur | Izveidot lietotāju | Opprett bruker |
| `admin.users.requiredFields` | Name, email and password are required. | Ad, e-posta ve şifre zorunludur. | Vārds, e-pasts un parole ir obligāti. | Navn, e-post og passord er obligatorisk. |
| `admin.users.confirmDelete` | Delete user "{name}"? This cannot be undone. | "{name}" kullanıcısı silinsin mi? Bu işlem geri alınamaz. | Dzēst lietotāju "{name}"? Šo darbību nevar atsaukt. | Slette brukeren "{name}"? Dette kan ikke angres. |
| `admin.users.couldNotDelete` | Could not delete user. | Kullanıcı silinemedi. | Neizdevās dzēst lietotāju. | Kunne ikke slette brukeren. |
| `admin.users.deleteUser` | Delete user | Kullanıcıyı sil | Dzēst lietotāju | Slett bruker |
| `admin.users.you` | (you) | (siz) | (jūs) | (deg) |
| `admin.users.colUser` | User | Kullanıcı | Lietotājs | Bruker |
| `admin.users.colRole` | Role | Rol | Loma | Rolle |
| `admin.users.colCountry` | Country | Ülke | Valsts | Land |
| `admin.users.colLanguage` | Language | Dil | Valoda | Språk |
| `admin.users.colJoined` | Joined | Katıldı | Pievienojās | Ble med |
| `admin.users.noUsers` | No users found. | Kullanıcı bulunamadı. | Nav atrasti lietotāji. | Ingen brukere funnet. |
| `admin.users.filterAll` | All ({count}) | Tümü ({count}) | Visi ({count}) | Alle ({count}) |
| `admin.users.filterAdmins` | Admins ({count}) | Yöneticiler ({count}) | Administratori ({count}) | Administratorer ({count}) |
| `admin.users.filterCounselors` | Counselors ({count}) | Danışmanlar ({count}) | Konsultanti ({count}) | Veiledere ({count}) |
| `admin.users.filterNeet` | NEET Users ({count}) | NEET Kullanıcılar ({count}) | NEET lietotāji ({count}) | NEET-brukere ({count}) |
| `admin.jobs.title` | Job Openings | İş İlanları | Darba piedāvājumi | Jobbstillinger |
| `admin.jobs.subtitle` | Review and approve employer-submitted job openings. | İşverenler tarafından gönderilen iş ilanlarını inceleyin ve onaylayın. | Pārskatiet un apstipriniet darba devēju iesniegtos darba piedāvājumus. | Gjennomgå og godkjenn jobbstillinger sendt inn av arbeidsgivere. |
| `admin.jobs.filterPending` | Pending ({count}) | Beklemede ({count}) | Gaida ({count}) | Venter ({count}) |
| `admin.jobs.filterApproved` | Approved ({count}) | Onaylandı ({count}) | Apstiprināti ({count}) | Godkjent ({count}) |
| `admin.jobs.filterRejected` | Rejected ({count}) | Reddedildi ({count}) | Noraidīti ({count}) | Avvist ({count}) |
| `admin.jobs.filterAll` | All ({count}) | Tümü ({count}) | Visi ({count}) | Alle ({count}) |
| `admin.jobs.empty` | No job openings in this category. | Bu kategoride iş ilanı yok. | Šajā kategorijā nav darba piedāvājumu. | Ingen jobbstillinger i denne kategorien. |
| `admin.jobs.statusPending` | Pending Review | İnceleme Bekleniyor | Gaida pārskatīšanu | Venter på gjennomgang |
| `admin.jobs.statusApproved` | Approved | Onaylandı | Apstiprināts | Godkjent |
| `admin.jobs.statusRejected` | Rejected | Reddedildi | Noraidīts | Avvist |
| `admin.jobs.note` | Note: {note} | Not: {note} | Piezīme: {note} | Notat: {note} |
| `admin.jobs.notePlaceholder` | Optional note to attach (e.g. rejection reason)... | Eklenecek isteğe bağlı not (ör. reddetme nedeni)... | Neobligāta pievienojamā piezīme (piem., noraidīšanas iemesls)... | Valgfritt notat å legge ved (f.eks. avvisningsgrunn)... |
| `admin.jobs.approve` | Approve | Onayla | Apstiprināt | Godkjenn |
| `admin.jobs.reject` | Reject | Reddet | Noraidīt | Avvis |
| `admin.jobs.revokeApproval` | Revoke approval | Onayı geri al | Atsaukt apstiprinājumu | Tilbakekall godkjenning |
| `admin.jobs.approveInstead` | Approve instead | Bunun yerine onayla | Tā vietā apstiprināt | Godkjenn i stedet |
| `admin.jobs.visitWebsite` | Visit website | Web sitesini ziyaret et | Apmeklēt tīmekļa vietni | Besøk nettstedet |
| `admin.jobs.delete` | Delete | Sil | Dzēst | Slett |
| `admin.jobs.confirmDelete` | Delete "{title}"? This cannot be undone. | "{title}" silinsin mi? Bu işlem geri alınamaz. | Dzēst "{title}"? Šo darbību nevar atsaukt. | Slette "{title}"? Dette kan ikke angres. |
| `admin.courses.title` | Course Management | Kurs Yönetimi | Kursu pārvaldība | Kursadministrasjon |
| `admin.courses.count` | {count, plural, one {# course} other {# courses}} in the library | kütüphanede {count, plural, one {# kurs} other {# kurs}} | bibliotēkā {count, plural, one {# kurss} other {# kursi}} | {count, plural, one {# kurs} other {# kurs}} i biblioteket |
| `admin.courses.newCourse` | New Course | Yeni Kurs | Jauns kurss | Nytt kurs |
| `admin.courses.titlePlaceholder` | Course title * | Kurs başlığı * | Kursa nosaukums * | Kurstittel * |
| `admin.courses.descriptionPlaceholder` | Description * | Açıklama * | Apraksts * | Beskrivelse * |
| `admin.courses.categoryPlaceholder` | Category (e.g. Digital Skills) | Kategori (ör. Dijital Beceriler) | Kategorija (piem., digitālās prasmes) | Kategori (f.eks. digitale ferdigheter) |
| `admin.courses.durationPlaceholder` | Duration (minutes) | Süre (dakika) | Ilgums (minūtes) | Varighet (minutter) |
| `admin.courses.creating` | Creating… | Oluşturuluyor… | Izveido… | Oppretter… |
| `admin.courses.createCourse` | Create Course | Kurs Oluştur | Izveidot kursu | Opprett kurs |
| `admin.courses.empty` | No courses yet. Create your first one. | Henüz kurs yok. İlkini oluşturun. | Vēl nav kursu. Izveidojiet savu pirmo. | Ingen kurs ennå. Opprett ditt første. |
| `admin.courses.minutes` | min | dk | min | min |
| `admin.courses.lessonsCount` | {count, plural, one {# lesson} other {# lessons}} | {count, plural, one {# ders} other {# ders}} | {count, plural, one {# nodarbība} other {# nodarbības}} | {count, plural, one {# leksjon} other {# leksjoner}} |
| `admin.courses.edit` | Edit | Düzenle | Rediģēt | Rediger |
| `admin.courses.confirmDelete` | Delete this course and all its lessons? | Bu kurs ve tüm dersleri silinsin mi? | Dzēst šo kursu un visas tā nodarbības? | Slette dette kurset og alle leksjonene? |
| `admin.courseEditor.backToCourses` | Back to Courses | Kurslara Dön | Atpakaļ uz kursiem | Tilbake til kurs |
| `admin.courseEditor.saving` | Saving… | Kaydediliyor… | Saglabā… | Lagrer… |
| `admin.courseEditor.cancel` | Cancel | İptal | Atcelt | Avbryt |
| `admin.courseEditor.save` | Save | Kaydet | Saglabāt | Lagre |
| `admin.courseEditor.saved` | Saved! | Kaydedildi! | Saglabāts! | Lagret! |
| `admin.courseEditor.saveChanges` | Save Changes | Değişiklikleri Kaydet | Saglabāt izmaiņas | Lagre endringer |
| `admin.courseEditor.courseDetails` | Course Details | Kurs Ayrıntıları | Kursa informācija | Kursdetaljer |
| `admin.courseEditor.courseTitlePlaceholder` | Course title | Kurs başlığı | Kursa nosaukums | Kurstittel |
| `admin.courseEditor.description` | Description | Açıklama | Apraksts | Beskrivelse |
| `admin.courseEditor.descriptionPlaceholder` | Add a course description… | Bir kurs açıklaması ekleyin… | Pievienojiet kursa aprakstu… | Legg til en kursbeskrivelse… |
| `admin.courseEditor.category` | Category | Kategori | Kategorija | Kategori |
| `admin.courseEditor.durationMinutes` | Duration (minutes) | Süre (dakika) | Ilgums (minūtes) | Varighet (minutter) |
| `admin.courseEditor.featuredImageUrl` | Featured Image URL | Öne Çıkan Görsel URL'si | Izceltā attēla URL | URL for fremhevet bilde |
| `admin.courseEditor.optional` | optional | isteğe bağlı | neobligāts | valgfritt |
| `admin.courseEditor.featuredImagePlaceholder` | https://example.com/image.jpg | https://ornek.com/gorsel.jpg | https://piemers.com/attels.jpg | https://eksempel.com/bilde.jpg |
| `admin.courseEditor.imagePreviewAlt` | Preview | Önizleme | Priekšskatījums | Forhåndsvisning |
| `admin.courseEditor.topics` | Topics ({count}) | Konular ({count}) | Tēmas ({count}) | Emner ({count}) |
| `admin.courseEditor.addTopic` | Add Topic | Konu Ekle | Pievienot tēmu | Legg til emne |
| `admin.courseEditor.noTopics` | No topics yet. Add topics to organise your course into sections. | Henüz konu yok. Kursunuzu bölümler halinde düzenlemek için konular ekleyin. | Vēl nav tēmu. Pievienojiet tēmas, lai organizētu kursu sadaļās. | Ingen emner ennå. Legg til emner for å organisere kurset i seksjoner. |
| `admin.courseEditor.topicTitlePlaceholder` | Topic title * | Konu başlığı * | Tēmas nosaukums * | Emnetittel * |
| `admin.courseEditor.topicDescription` | Description (optional) | Açıklama (isteğe bağlı) | Apraksts (neobligāts) | Beskrivelse (valgfritt) |
| `admin.courseEditor.topicDescriptionPlaceholder` | Add a topic description… | Bir konu açıklaması ekleyin… | Pievienojiet tēmas aprakstu… | Legg til en emnebeskrivelse… |
| `admin.courseEditor.saveTopic` | Save Topic | Konuyu Kaydet | Saglabāt tēmu | Lagre emne |
| `admin.courseEditor.confirmDeleteTopic` | Delete this topic? Its lessons will become unassigned. | Bu konu silinsin mi? Dersleri atanmamış duruma gelecek. | Dzēst šo tēmu? Tās nodarbības kļūs nepiešķirtas. | Slette dette emnet? Leksjonene blir uten tilordning. |
| `admin.courseEditor.confirmDeleteLesson` | Delete this lesson? | Bu ders silinsin mi? | Dzēst šo nodarbību? | Slette denne leksjonen? |
| `admin.courseEditor.editTopic` | Edit | Düzenle | Rediģēt | Rediger |
| `admin.courseEditor.deleteTopic` | Delete topic | Konuyu sil | Dzēst tēmu | Slett emne |
| `admin.courseEditor.lessons` | Lessons ({count}) | Dersler ({count}) | Nodarbības ({count}) | Leksjoner ({count}) |
| `admin.courseEditor.lessonsInTopic` | {count, plural, one {# lesson} other {# lessons}} | {count, plural, one {# ders} other {# ders}} | {count, plural, one {# nodarbība} other {# nodarbības}} | {count, plural, one {# leksjon} other {# leksjoner}} |
| `admin.courseEditor.addLesson` | Add Lesson | Ders Ekle | Pievienot nodarbību | Legg til leksjon |
| `admin.courseEditor.addLessonShort` | Add lesson | Ders ekle | Pievienot nodarbību | Legg til leksjon |
| `admin.courseEditor.newLesson` | New Lesson | Yeni Ders | Jauna nodarbība | Ny leksjon |
| `admin.courseEditor.noLessons` | No lessons yet. | Henüz ders yok. | Vēl nav nodarbību. | Ingen leksjoner ennå. |
| `admin.courseEditor.noLessonsInTopic` | No lessons in this topic yet. | Bu konuda henüz ders yok. | Šajā tēmā vēl nav nodarbību. | Ingen leksjoner i dette emnet ennå. |
| `admin.courseEditor.unassigned` | Unassigned | Atanmamış | Nepiešķirtas | Uten tilordning |
| `admin.courseEditor.lessonTitlePlaceholder` | Lesson title * | Ders başlığı * | Nodarbības nosaukums * | Leksjonstittel * |
| `admin.courseEditor.assignToTopic` | Assign to topic | Bir konuya ata | Piešķirt tēmai | Tilordne til emne |
| `admin.courseEditor.noTopicOption` | No topic (unassigned) | Konu yok (atanmamış) | Nav tēmas (nepiešķirta) | Ingen emne (uten tilordning) |
| `admin.courseEditor.contentType` | Content type | İçerik türü | Satura veids | Innholdstype |
| `admin.courseEditor.content` | Content | İçerik | Saturs | Innhold |
| `admin.courseEditor.lessonDescription` | Description | Açıklama | Apraksts | Beskrivelse |
| `admin.courseEditor.lessonDescriptionNote` | (optional — shown above the content) | (isteğe bağlı — içeriğin üstünde gösterilir) | (neobligāts — parādīts virs satura) | (valgfritt — vises over innholdet) |
| `admin.courseEditor.lessonDescriptionPlaceholder` | Add a description for this lesson… | Bu ders için bir açıklama ekleyin… | Pievienojiet šīs nodarbības aprakstu… | Legg til en beskrivelse for denne leksjonen… |
| `admin.courseEditor.moveUp` | Move up | Yukarı taşı | Pārvietot uz augšu | Flytt opp |
| `admin.courseEditor.moveDown` | Move down | Aşağı taşı | Pārvietot uz leju | Flytt ned |
| `admin.courseEditor.editLesson` | Edit | Düzenle | Rediģēt | Rediger |
| `admin.courseEditor.fillTitleContent` | Please fill in the title and content before saving. | Kaydetmeden önce başlığı ve içeriği doldurun. | Pirms saglabāšanas aizpildiet nosaukumu un saturu. | Fyll ut tittelen og innholdet før du lagrer. |
| `admin.courseEditor.saveLessonFailed` | Failed to save lesson. Please try again. | Ders kaydedilemedi. Lütfen tekrar deneyin. | Neizdevās saglabāt nodarbību. Lūdzu, mēģiniet vēlreiz. | Kunne ikke lagre leksjonen. Vennligst prøv igjen. |
| `admin.courseEditor.networkError` | Network error. Please try again. | Ağ hatası. Lütfen tekrar deneyin. | Tīkla kļūda. Lūdzu, mēģiniet vēlreiz. | Nettverksfeil. Vennligst prøv igjen. |
| `admin.courseEditor.uploading` | Uploading… | Yükleniyor… | Augšupielādē… | Laster opp… |
| `admin.courseEditor.uploadedSuccess` | {label} uploaded successfully | {label} başarıyla yüklendi | {label} veiksmīgi augšupielādēts | {label} lastet opp |
| `admin.courseEditor.clickToReplace` | Click or drag to replace | Değiştirmek için tıklayın veya sürükleyin | Noklikšķiniet vai velciet, lai aizstātu | Klikk eller dra for å erstatte |
| `admin.courseEditor.dragDrop` | Drag & drop your {label} here | {label} dosyanızı buraya sürükleyip bırakın | Velciet un nometiet savu {label} šeit | Dra og slipp {label} her |
| `admin.courseEditor.orClickBrowse` | or click to browse | veya göz atmak için tıklayın | vai noklikšķiniet, lai pārlūkotu | eller klikk for å bla gjennom |
| `admin.courseEditor.uploadFailed` | Upload failed | Yükleme başarısız | Augšupielāde neizdevās | Opplasting mislyktes |
| `admin.courseEditor.uploadFailedRetry` | Upload failed. Please try again. | Yükleme başarısız. Lütfen tekrar deneyin. | Augšupielāde neizdevās. Lūdzu, mēģiniet vēlreiz. | Opplasting mislyktes. Vennligst prøv igjen. |
| `admin.courseEditor.urlAutoFilled` | URL (auto-filled on upload) | URL (yüklemede otomatik doldurulur) | URL (aizpildās automātiski augšupielādes laikā) | URL (fylles ut automatisk ved opplasting) |
| `admin.courseEditor.testUrl` | Test URL | URL'yi Test Et | Pārbaudīt URL | Test URL |
| `admin.courseEditor.videoUrlPlaceholder` | Paste YouTube or Vimeo URL | YouTube veya Vimeo URL'sini yapıştırın | Ielīmējiet YouTube vai Vimeo URL | Lim inn YouTube- eller Vimeo-URL |
| `admin.courseEditor.pdfPlaceholder` | /pdfs/my-document.pdf | /pdfs/belgem.pdf | /pdfs/mans-dokuments.pdf | /pdfs/mitt-dokument.pdf |
| `admin.courseEditor.scormPlaceholder` | /scorm/my-course/index.html | /scorm/kursum/index.html | /scorm/mans-kurss/index.html | /scorm/mitt-kurs/index.html |
| `admin.courseEditor.types.TEXT` | Rich Text | Zengin Metin | Bagātināts teksts | Rik tekst |
| `admin.courseEditor.types.PDF` | PDF (link) | PDF (bağlantı) | PDF (saite) | PDF (lenke) |
| `admin.courseEditor.types.VIDEO` | Video (YouTube / Vimeo) | Video (YouTube / Vimeo) | Video (YouTube / Vimeo) | Video (YouTube / Vimeo) |
| `admin.courseEditor.types.QUIZ` | Quiz | Test | Tests | Quiz |
| `admin.courseEditor.types.SCORM` | SCORM Package | SCORM Paketi | SCORM pakotne | SCORM-pakke |
| `admin.quiz.addMultipleChoice` | Multiple choice | Çoktan seçmeli | Vairākas izvēles | Flervalg |
| `admin.quiz.addTrueFalse` | True / False | Doğru / Yanlış | Patiess / Nepatiess | Sann / Usann |
| `admin.quiz.addMatching` | Matching | Eşleştirme | Saskaņošana | Sammenkobling |
| `admin.quiz.question` | Question {number} | Soru {number} | {number}. jautājums | Spørsmål {number} |
| `admin.quiz.typeMultipleChoice` | Multiple Choice | Çoktan Seçmeli | Vairākas izvēles | Flervalg |
| `admin.quiz.typeTrueFalse` | True / False | Doğru / Yanlış | Patiess / Nepatiess | Sann / Usann |
| `admin.quiz.typeMatching` | Matching | Eşleştirme | Saskaņošana | Sammenkobling |
| `admin.quiz.questionPlaceholder` | Question text * | Soru metni * | Jautājuma teksts * | Spørsmålstekst * |
| `admin.quiz.optionPlaceholder` | Option {letter} | Seçenek {letter} | {letter} variants | Alternativ {letter} |
| `admin.quiz.markCorrect` | Mark as correct answer | Doğru cevap olarak işaretle | Atzīmēt kā pareizo atbildi | Merk som riktig svar |
| `admin.quiz.clickCircleHint` | Click the circle to mark the correct answer | Doğru cevabı işaretlemek için daireye tıklayın | Noklikšķiniet uz apļa, lai atzīmētu pareizo atbildi | Klikk på sirkelen for å merke det riktige svaret |
| `admin.quiz.true` | True | Doğru | Patiess | Sann |
| `admin.quiz.false` | False | Yanlış | Nepatiess | Usann |
| `admin.quiz.leftItem` | Left item | Sol öğe | Kreisais vienums | Venstre element |
| `admin.quiz.rightItemMatch` | Right item (match) | Sağ öğe (eşleşme) | Labais vienums (atbilstība) | Høyre element (treff) |
| `admin.quiz.leftItemPlaceholder` | Left item | Sol öğe | Kreisais vienums | Venstre element |
| `admin.quiz.rightItemPlaceholder` | Right item | Sağ öğe | Labais vienums | Høyre element |
| `admin.quiz.addPair` | Add pair | Çift ekle | Pievienot pāri | Legg til par |
| `admin.quiz.matchHint` | Students will match left items to right items | Öğrenciler sol öğeleri sağ öğelerle eşleştirecek | Studenti saskaņos kreisos vienumus ar labajiem | Studentene skal koble venstre elementer til høyre elementer |
| `editor.placeholder` | Write lesson content… | Ders içeriğini yazın… | Rakstiet nodarbības saturu… | Skriv leksjonsinnhold… |
| `editor.bold` | Bold | Kalın | Trekns | Fet |
| `editor.italic` | Italic | İtalik | Slīpraksts | Kursiv |
| `editor.underline` | Underline | Altı çizili | Pasvītrojums | Understreking |
| `editor.strikethrough` | Strikethrough | Üstü çizili | Pārsvītrojums | Gjennomstreking |
| `editor.heading2` | Heading 2 | Başlık 2 | Virsraksts 2 | Overskrift 2 |
| `editor.heading3` | Heading 3 | Başlık 3 | Virsraksts 3 | Overskrift 3 |
| `editor.bulletList` | Bullet list | Madde işaretli liste | Aizzīmju saraksts | Punktliste |
| `editor.orderedList` | Ordered list | Sıralı liste | Numurēts saraksts | Nummerert liste |
| `editor.alignLeft` | Align left | Sola hizala | Līdzināt pa kreisi | Venstrejuster |
| `editor.alignCenter` | Align center | Ortaya hizala | Līdzināt centrā | Midtstill |
| `editor.alignRight` | Align right | Sağa hizala | Līdzināt pa labi | Høyrejuster |
| `editor.insertLink` | Insert link | Bağlantı ekle | Ievietot saiti | Sett inn lenke |
| `editor.insertImage` | Insert image (URL) | Görsel ekle (URL) | Ievietot attēlu (URL) | Sett inn bilde (URL) |
| `editor.embedVideo` | Embed YouTube / Vimeo video | YouTube / Vimeo videosu göm | Iegult YouTube / Vimeo video | Bygg inn YouTube- / Vimeo-video |
| `editor.editHtmlSource` | Edit HTML source | HTML kaynağını düzenle | Rediģēt HTML avotu | Rediger HTML-kilde |
| `editor.applyHtml` | Apply HTML | HTML'yi Uygula | Lietot HTML | Bruk HTML |
| `editor.cancel` | Cancel | İptal | Atcelt | Avbryt |
| `editor.rawHtmlEditor` | Raw HTML editor | Ham HTML düzenleyici | Neapstrādāta HTML redaktors | Rå HTML-redigerer |
| `editor.promptUrl` | URL: | URL: | URL: | URL: |
| `editor.promptImageUrl` | Image URL: | Görsel URL'si: | Attēla URL: | Bilde-URL: |
| `editor.promptVideoUrl` | YouTube or Vimeo URL: | YouTube veya Vimeo URL'si: | YouTube vai Vimeo URL: | YouTube- eller Vimeo-URL: |
