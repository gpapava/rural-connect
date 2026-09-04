/**
 * Seeds the six Turkish (tr) curriculum modules and their lessons.
 *
 * Idempotent: matched by (language "tr", title). If a module already exists it
 * is left untouched — delete it by hand first if you want to re-import.
 *
 * PDF and SCORM assets are already uploaded to the production server; the URLs
 * below point at them. Run with:  npx tsx prisma/add-turkish-modules.ts
 */
import { PrismaClient, LessonType } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

type LessonSeed = {
  type: LessonType;
  title: string;
  description: string | null;
  content: string;
};

type ModuleSeed = {
  order: number;
  title: string;
  description: string;
  lessons: LessonSeed[];
};

const quiz = (m: string) =>
  JSON.stringify(
    JSON.parse(readFileSync(join(__dirname, "turkish-quizzes", `${m}.json`), "utf8"))
  );

const modules: ModuleSeed[] = [
  {
    order: 1,
    title: "1. Zaman Yönetimi",
    description:
      "<p>Bu modül, kırsal bölgelerdeki genç NEET'lerin günlük yaşamları üzerindeki kontrolü yeniden ele almaları için kapsamlı bir yol haritası sunar. Yapılandırılmış istihdamın az olduğu ortamlarda zaman ya bir düşmana (yalıtılmışlığa ve kayıtsızlığa yol açarak) ya da stratejik bir müttefike dönüşebilir. Pasif var oluştan aktif öz-yönetime geçişi, kırsal ortamın kendine özgü lojistik ve psikolojik engellerine odaklanarak inceliyoruz.</p>",
    lessons: [
      {
        type: "PDF",
        title: "Ders Materyali – Zaman Yönetimi",
        description:
          "<p>Modül 1'in tam el kitabı. Dört alt üniteyi çalışın: Kırsal Zaman Paradoksu, SMART/PURE hedef belirleme, Eisenhower Matrisi ve ertelemeyle başa çıkma.</p>",
        content: "/api/uploads/pdfs/module-tr-1-time-management-1788510020956.pdf",
      },
      {
        type: "SCORM",
        title: "Etkileşimli Sunum – Zaman Yönetimi",
        description:
          "<p>Modül 1'in anahtar kavramları üzerinde etkileşimli bir gezinti. Slaytlar arasında kendi hızınızda ilerleyin.</p>",
        content: "/api/uploads/scorm/module-tr-1-time-management-presentation-1788510041481/index.html",
      },
      {
        type: "QUIZ",
        title: "Öz Değerlendirme Testi",
        description:
          "<p>Modül 1'i ne kadar anladığınızı kontrol edin. Çoktan seçmeli, doğru/yanlış ve eşleştirme soruları — istediğiniz kadar tekrar çözebilirsiniz.</p>",
        content: quiz("m1"),
      },
    ],
  },
  {
    order: 2,
    title: "2. Problem Çözme",
    description:
      "<p>Problemler hayatın bir parçasıdır — otobüsü kaçırmak, ay sonundan önce parasız kalmak, bir iş görüşmesinde ne söyleyeceğini bilememek. İyi haber şu ki, onlarla başa çıkmak öğrenebileceğiniz, uygulayabileceğiniz ve geliştirebileceğiniz bir beceridir. Bu modül, kırsal NEET'ler için pratik, gerçek yaşama dayalı bir yaklaşım benimser ve altı üniteyi ele alır: problem çözmenin aslında ne olduğu ve neden önemli olduğu, baskı altında karar verme, analiz tekniklerinden oluşan pratik bir araç seti, düşünme biçimimizi şekillendiren gizli güçler, problem çözerken beyninizin nasıl davrandığı ve neredeyse her duruma uygulayabileceğiniz beş adımlı tekrarlanabilir bir süreç.</p>",
    lessons: [
      {
        type: "PDF",
        title: "Ders Materyali – Problem Çözme",
        description:
          "<p>Modül 2'nin tam el kitabı. Altı üniteyi çalışın — problem çözme nedir ve neden önemlidir, karar verme, pratik analiz araçları, düşüncemizi şekillendiren önyargılar, beyin ve problem çözme ve beş adımlı problem çözme süreci.</p>",
        content: "/api/uploads/pdfs/module-tr-2-problem-solving-1788510022098.pdf",
      },
      {
        type: "SCORM",
        title: "Etkileşimli Sunum – Problem Çözme",
        description:
          "<p>Modül 2'nin anahtar kavramları üzerinde etkileşimli bir gezinti. Slaytlar arasında kendi hızınızda ilerleyin.</p>",
        content: "/api/uploads/scorm/module-tr-2-problem-solving-presentation-1788510045040/index.html",
      },
      {
        type: "QUIZ",
        title: "Öz Değerlendirme Testi",
        description:
          "<p>Anlayışınızı kontrol edin — çoktan seçmeli, doğru/yanlış ve eşleştirme soruları.</p>",
        content: quiz("m2"),
      },
    ],
  },
  {
    order: 3,
    title: "3. Takım Çalışması",
    description:
      "<p>Takım çalışması, herkesin kolay saydığı becerilerden biridir — insanları bir araya getirir, bir görev verirsiniz ve üstesinden geleceklerini düşünürsünüz. Bazen gelirler; çoğu zaman gelmezler ve kimse nedenini açıklamaz. Bu modül bir hikâyeyi izler: bir projeyi bitirmek için takım olmayı öğrenmesi gereken bir grup insan. Bir takımı bir gruptan gerçekte ne ayırdığını, iletişimi ve nerede aksadığını, iş birliği becerilerini, Tuckman'ın beş takım gelişim aşamasını, anlaşmazlıkları yapıcı biçimde ele almayı ve takımları üretken kılan alışkanlıkları ele alacaksınız. Yaklaşım baştan sona pratiktir — bir işte, bir topluluk projesinde, bir eğitimde veya başkalarıyla birlikte çalıştığınız her yerde kullanabileceğiniz araçlar.</p>",
    lessons: [
      {
        type: "PDF",
        title: "Ders Materyali – Takım Çalışması",
        description:
          "<p>Modül 3'ün tam el kitabı. Takımı altı alt ünite boyunca izleyin — takımlar ve gruplar, iletişim ve zorlukları, iş birliği becerileri, beş takım gelişim aşaması, anlaşmazlıkların yönetimi ve takımın üretkenliği ile başarısı.</p>",
        content: "/api/uploads/pdfs/module-tr-3-team-work-1788510024244.pdf",
      },
      {
        type: "SCORM",
        title: "Etkileşimli Sunum – Takım Çalışması",
        description:
          "<p>Modül 3'ün anahtar kavramları üzerinde etkileşimli bir gezinti. Slaytlar arasında kendi hızınızda ilerleyin.</p>",
        content: "/api/uploads/scorm/module-tr-3-team-work-presentation-1788510056861/index.html",
      },
      {
        type: "QUIZ",
        title: "Öz Değerlendirme Testi",
        description:
          "<p>Anahtar öğrenme noktalarını kontrol edin — çoktan seçmeli, doğru/yanlış ve bir eşleştirme sorusu.</p>",
        content: quiz("m3"),
      },
    ],
  },
  {
    order: 4,
    title: "4. İletişim",
    description:
      "<p>İletişim, bilgi aktarmaktan çok daha fazlasıdır — iş bulmak, destek istemek, öz güven geliştirmek ve başkalarıyla iyi geçinmek için temel bir beceridir. Bu modül onu, uygulayıp geliştirebileceğiniz öğrenilebilir davranışlar bütünü olarak ele alır. İletişim sürecini, sözlü, sözsüz ve paralel-sözel iletişim arasındaki farkı, aktif dinlemeyi, ihtiyaç ve sınırlarınızı saygılı biçimde ifade etmeyi, iddialılığı, yanlış anlamaları ve engelleri fark etmeyi, mesajınızı farklı muhataplara uyarlamayı ve profesyonel ile dijital ortamlarda iyi iletişim kurmayı ele alacaksınız — bir işverene mesaj yazmaktan bir iş görüşmesine veya grup çalışmasına kadar.</p>",
    lessons: [
      {
        type: "PDF",
        title: "Ders Materyali – İletişim",
        description:
          "<p>Modül 4'ün tam el kitabı — iletişim süreci, sözlü, sözsüz ve paralel-sözel iletişim, aktif dinleme, iddialılık ve sınırlar, iletişim engelleri, farklı muhataplara uyum sağlama ve profesyonel ile dijital iletişim.</p>",
        content: "/api/uploads/pdfs/module-tr-4-communication-1788510029813.pdf",
      },
      {
        type: "SCORM",
        title: "Etkileşimli Sunum – İletişim",
        description:
          "<p>Modül 4'ün anahtar kavramları üzerinde etkileşimli bir gezinti. Slaytlar arasında kendi hızınızda ilerleyin.</p>",
        content: "/api/uploads/scorm/module-tr-4-communication-presentation-1788510060612/index.html",
      },
      {
        type: "QUIZ",
        title: "Öz Değerlendirme Testi",
        description:
          "<p>Anlayışınızı kontrol edin — çoktan seçmeli, doğru/yanlış ve bir eşleştirme sorusu.</p>",
        content: quiz("m4"),
      },
    ],
  },
  {
    order: 5,
    title: "5. Temel Dijital Beceriler",
    description:
      "<p>Dijital araçları kullanabilmek artık isteğe bağlı değildir — bilgiye erişim, kurumlarla iletişim, belge hazırlama, çevrimiçi hizmetleri kullanma ve iş arama, hepsi temel bir dijital beceri düzeyine bağlıdır. Bu modül, öz güveni düşük olarak başlayanlar için uygulamalı, adım adım bir giriştir. Dijital cihazları ve temel bilgisayar kullanımını, dosya yönetimi ve düzenlemeyi, internet kullanımı ve aramayı, e-posta ve çevrimiçi iletişimi, basit belgeler oluşturmayı, çevrimiçi hizmetlere erişimi ve dijital teknolojinin güvenli ve sorumlu kullanımını ele alacaksınız.</p>",
    lessons: [
      {
        type: "PDF",
        title: "Ders Materyali – Temel Dijital Beceriler",
        description:
          "<p>Modül 5'in tam el kitabı — dijital cihazlar ve temel bilgisayar kullanımı, dosya yönetimi, internet kullanımı ve arama, e-posta ve çevrimiçi iletişim, belge oluşturma, çevrimiçi hizmetlere erişim ve dijital teknolojinin güvenli, sorumlu kullanımı.</p>",
        content: "/api/uploads/pdfs/module-tr-5-basic-it-skills-1788510030902.pdf",
      },
      {
        type: "SCORM",
        title: "Etkileşimli Sunum – Temel Dijital Beceriler",
        description:
          "<p>Modül 5'in anahtar kavramları üzerinde etkileşimli bir gezinti. Slaytlar arasında kendi hızınızda ilerleyin.</p>",
        content: "/api/uploads/scorm/module-tr-5-basic-it-skills-presentation-1788510062702/index.html",
      },
      {
        type: "QUIZ",
        title: "Öz Değerlendirme Testi",
        description:
          "<p>Anlayışınızı kontrol edin — çoktan seçmeli, doğru/yanlış ve bir eşleştirme sorusu.</p>",
        content: quiz("m5"),
      },
    ],
  },
  {
    order: 6,
    title: "6. Öz Farkındalık",
    description:
      "<p>Öz farkındalık, kendi düşüncelerinizi, duygularınızı, güçlü yönlerinizi, değerlerinizi ve davranış kalıplarınızı bilmek — ve bunların iş, öğrenme ve yaşamla ilgili seçimlerinizi nasıl şekillendirdiğini görmektir. Belirsizlik ve sınırlı fırsatlarla karşı karşıya olan kırsal bölgelerdeki gençler için, kendinden emin kararlar almanın pratik bir temelidir. Bu modül altı alt üniteden oluşur: öz farkındalığı anlama, duygular ve öz düzenleme, güçlü yönler, değerler ve motivasyon, iş piyasasında öz farkındalık, iletişim ve başkalarının bizi nasıl gördüğü ve öz farkındalığı eyleme dönüştürme.</p>",
    lessons: [
      {
        type: "PDF",
        title: "Ders Materyali – Öz Farkındalık",
        description:
          "<p>Modül 6'nın tam el kitabı — öz farkındalığı anlama, duygular ve öz düzenleme, güçlü yönler, değerler ve motivasyon, iş piyasasında öz farkındalık, iletişim ve dışsal öz farkındalık ve öz farkındalıktan eyleme geçiş.</p>",
        content: "/api/uploads/pdfs/module-tr-6-self-awareness-1788510031705.pdf",
      },
      {
        type: "SCORM",
        title: "Etkileşimli Sunum – Öz Farkındalık",
        description:
          "<p>Modül 6'nın anahtar kavramları üzerinde etkileşimli bir gezinti. Slaytlar arasında kendi hızınızda ilerleyin.</p>",
        content: "/api/uploads/scorm/module-tr-6-self-awareness-presentation-1788510073646/index.html",
      },
      {
        type: "QUIZ",
        title: "Öz Değerlendirme Testi",
        description:
          "<p>Anlayışınızı kontrol edin — çoktan seçmeli, doğru/yanlış ve bir eşleştirme sorusu.</p>",
        content: quiz("m6"),
      },
    ],
  },
];

async function main() {
  for (const m of modules) {
    const existing = await prisma.module.findFirst({
      where: { language: "tr", title: m.title },
    });
    if (existing) {
      console.log(`skip (exists): ${m.title} [${existing.id}]`);
      continue;
    }
    const created = await prisma.module.create({
      data: {
        title: m.title,
        description: m.description,
        category: "general",
        language: "tr",
        order: m.order,
        lessons: {
          create: m.lessons.map((l, i) => ({
            type: l.type,
            title: l.title,
            description: l.description,
            content: l.content,
            order: i + 1,
          })),
        },
      },
      include: { lessons: true },
    });
    console.log(`created: ${created.title} [${created.id}] with ${created.lessons.length} lessons`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
