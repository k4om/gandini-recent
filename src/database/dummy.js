import bcrypt from 'bcryptjs'

/**
 * "N days ago at HH:00 UTC" in the same format SQLite's CURRENT_TIMESTAMP uses
 * ("YYYY-MM-DD HH:MM:SS"), so seeded dates sort correctly next to articles
 * that get published later through the admin page.
 */
function ago(days, hour = 3) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - days);
    d.setUTCHours(hour, 0, 0, 0);
    return d.toISOString().slice(0, 19).replace('T', ' ');
}

function init(db) {

    const users = [
        {
            identifier: '23010001',
            nis: 23010001,
            name: 'Ahmad Fauzan',
            role: 'STUDENT',
            is_admin: 0,
            can_write: 0
        },
        {
            identifier: '23010002',
            nis: 23010002,
            name: 'Budi Santoso',
            role: 'STUDENT',
            is_admin: 0,
            can_write: 1
        },
        {
            identifier: '23010003',
            nis: 23010003,
            name: 'Citra Lestari',
            role: 'STUDENT',
            is_admin: 0,
            can_write: 1
        },
        {
            identifier: '23010004',
            nis: 23010004,
            name: 'Dimas Pratama',
            role: 'STUDENT',
            is_admin: 0,
            can_write: 0
        },
        {
            identifier: 'guru.rina',
            nis: null,
            name: 'Bu Rina',
            role: 'TEACHER',
            is_admin: 0,
            can_write: 1
        },
        {
            identifier: 'guru.andi',
            nis: null,
            name: 'Pak Andi',
            role: 'TEACHER',
            is_admin: 1,
            can_write: 1
        }
    ];


    const insertUser = db.prepare(`
        INSERT OR IGNORE INTO users (
            identifier,
            nis,
            name,
            role,
            is_admin,
            can_write,
            password_hash
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);


    for (const user of users) {
        insertUser.run(
            user.identifier,
            user.nis,
            user.name,
            user.role,
            user.is_admin,
            user.can_write,
            bcrypt.hashSync('password', 10)
        );
    }


    const usersDb = db.prepare(`
        SELECT id, identifier
        FROM users
    `).all();


    const findUser = (identifier) =>
        usersDb.find(
            x => x.identifier === identifier
        );


    // Newest first. `published` is null for drafts.
    const articles = [
        {
            author: '23010003',
            title: 'Kerja Bakti Akhir Pekan Bersihkan Lingkungan Sekolah',
            slug: 'kerja-bakti-bersihkan-lingkungan-sekolah',
            content: [
                'Sabtu pagi lalu, ratusan siswa dan guru berkumpul di halaman sekolah untuk kerja bakti. Setiap kelas mendapat area masing-masing, mulai dari taman depan, selokan samping lapangan, sampai dinding belakang kantin.',
                'Kegiatan berlangsung dua jam dan ditutup dengan sarapan bersama. Panitia berharap kebiasaan ini berlanjut setiap bulan agar lingkungan sekolah tetap bersih dan nyaman dipakai belajar.'
            ].join('\n\n'),
            status: 'PUBLISHED',
            published: ago(1, 2)
        },
        {
            author: '23010002',
            title: 'Tim Basket Putra Melaju ke Final Antar-SMA',
            slug: 'tim-basket-putra-melaju-ke-final',
            content: [
                'Tim basket putra sekolah memastikan tempat di partai final turnamen antar-SMA setelah menang tipis 54-51 di semifinal. Gol penentu datang dari tembakan tiga angka pada menit terakhir.',
                'Final akan digelar akhir pekan depan di GOR kota. Panitia mengajak seluruh siswa datang memberi dukungan. Info penjualan tiket dan jadwal bus suporter akan diumumkan di mading.'
            ].join('\n\n'),
            status: 'PUBLISHED',
            published: ago(2, 6)
        },
        {
            author: 'guru.rina',
            title: 'Persiapan Olimpiade Sains Sekolah',
            slug: 'persiapan-olimpiade-sains',
            content: [
                'Tim sekolah sedang melakukan persiapan untuk olimpiade sains tingkat daerah. Latihan intensif dilakukan tiga kali seminggu sepulang sekolah di laboratorium IPA.',
                'Para peserta dibimbing langsung oleh guru mata pelajaran dan alumni yang pernah meraih medali. Selain soal-soal latihan, mereka juga belajar mengatur waktu dan tetap tenang saat kompetisi.'
            ].join('\n\n'),
            status: 'PUBLISHED',
            published: ago(3, 4)
        },
        {
            author: 'guru.andi',
            title: 'Laboratorium Komputer Baru Resmi Digunakan',
            slug: 'laboratorium-komputer-baru-resmi-digunakan',
            content: [
                'Laboratorium komputer baru dengan 36 unit perangkat resmi dibuka untuk kegiatan belajar. Ruangan ini dilengkapi pendingin udara, jaringan internet yang lebih stabil, dan meja yang lebih nyaman.',
                'Jadwal pemakaian akan diatur per kelas agar semua siswa mendapat giliran. Di luar jam pelajaran, lab dapat dipakai untuk ekstrakurikuler dengan izin guru pembina.'
            ].join('\n\n'),
            status: 'PUBLISHED',
            published: ago(4, 3)
        },
        {
            author: 'guru.rina',
            title: 'Jadwal Ujian Semester Genap',
            slug: 'jadwal-ujian-semester-genap',
            content: [
                'Berikut jadwal ujian semester genap tahun ajaran ini. Ujian berlangsung selama enam hari dengan dua mata pelajaran setiap harinya.',
                'Siswa diminta datang 15 menit sebelum ujian dimulai dan membawa kartu ujian. Perangkat elektronik tidak diperkenankan masuk ke ruang ujian. Jadwal lengkap ditempel di papan pengumuman setiap kelas.'
            ].join('\n\n'),
            status: 'PUBLISHED',
            published: ago(6, 1)
        },
        {
            author: '23010002',
            title: 'Juara Pertama Lomba Debat Bahasa Inggris Tingkat Kota',
            slug: 'juara-lomba-debat-bahasa-inggris',
            content: [
                'Tim debat sekolah membawa pulang piala juara pertama dalam lomba debat bahasa Inggris tingkat kota. Mereka mengalahkan delapan sekolah lain dan menang telak di babak final.',
                'Menurut para peserta, kunci kemenangan adalah latihan rutin setiap Jumat dan kebiasaan membaca berita internasional. Tahun depan mereka siap mewakili sekolah di tingkat provinsi.'
            ].join('\n\n'),
            status: 'PUBLISHED',
            published: ago(7, 5)
        },
        {
            author: 'guru.andi',
            title: 'Pengumuman Libur Nasional',
            slug: 'pengumuman-libur-nasional',
            content: [
                'Sekolah akan mengikuti jadwal libur nasional. Kegiatan belajar mengajar diliburkan dan akan dilanjutkan sesuai kalender pendidikan.',
                'Siswa yang memiliki tugas atau kegiatan ekstrakurikuler pada hari tersebut diminta menghubungi guru pembina masing-masing untuk penjadwalan ulang.'
            ].join('\n\n'),
            status: 'PUBLISHED',
            published: ago(9, 2)
        },
        {
            author: '23010003',
            title: 'Pekan Literasi, Perpustakaan Buka Sampai Sore',
            slug: 'pekan-literasi-perpustakaan-buka-sampai-sore',
            content: [
                'Selama Pekan Literasi, perpustakaan sekolah buka sampai pukul empat sore. Ada bazar buku murah, lomba resensi, dan sesi membaca bersama di taman baca.',
                'Siswa yang meminjam lima buku atau lebih akan masuk undian hadiah. Pustakawan juga menerima sumbangan buku layak baca dari siswa dan orang tua.'
            ].join('\n\n'),
            status: 'PUBLISHED',
            published: ago(10, 3)
        },
        {
            author: 'guru.andi',
            title: 'Pembagian Rapor Semester Ganjil',
            slug: 'pembagian-rapor-semester-ganjil',
            content: [
                'Rapor semester ganjil akan dibagikan langsung kepada orang tua atau wali murid. Pertemuan diadakan di kelas masing-masing dan dipandu wali kelas.',
                'Orang tua yang berhalangan hadir dapat mengirim perwakilan dengan surat kuasa. Wali kelas juga siap berdiskusi tentang perkembangan belajar dan rencana semester berikutnya.'
            ].join('\n\n'),
            status: 'PUBLISHED',
            published: ago(12, 1)
        },
        {
            author: '23010002',
            title: 'Workshop Coding untuk Pemula Bersama Alumni',
            slug: 'workshop-coding-pemula-bersama-alumni',
            content: [
                'Ekstrakurikuler komputer mengadakan workshop coding gratis untuk pemula. Pematerinya adalah alumni yang kini bekerja sebagai pengembang perangkat lunak.',
                'Peserta belajar membuat halaman web sederhana dari nol dan boleh membawa laptop sendiri. Kuota terbatas 30 orang, pendaftaran lewat pembina ekstrakurikuler.'
            ].join('\n\n'),
            status: 'PUBLISHED',
            published: ago(13, 4)
        },
        {
            author: 'guru.rina',
            title: 'Tips Belajar Efektif Menjelang Ujian',
            slug: 'tips-belajar-efektif-menjelang-ujian',
            content: [
                'Menjelang ujian, banyak siswa belajar semalaman dan justru kelelahan. Cobalah membagi materi menjadi bagian kecil, lalu belajar 25 menit dengan jeda lima menit di antaranya.',
                'Tidur cukup juga sama pentingnya dengan membaca ulang catatan. Otak merapikan ingatan saat kita tidur, jadi jangan korbankan jam istirahat demi satu bab tambahan.'
            ].join('\n\n'),
            status: 'PUBLISHED',
            published: ago(15, 2)
        },
        {
            author: 'guru.andi',
            title: 'Hasil Seleksi Paskibra Diumumkan',
            slug: 'hasil-seleksi-paskibra-diumumkan',
            content: [
                'Seleksi anggota Paskibra tahun ini diikuti 48 siswa dan menghasilkan 24 anggota terpilih. Penilaian mencakup baris-berbaris, kebugaran jasmani, dan wawancara.',
                'Anggota baru akan mengikuti latihan dasar setiap Selasa dan Kamis sore. Siswa yang belum lolos tetap bisa mencoba lagi pada seleksi berikutnya.'
            ].join('\n\n'),
            status: 'PUBLISHED',
            published: ago(17, 3)
        },
        {
            author: '23010003',
            title: 'Pameran Karya Seni Siswa Kelas XI',
            slug: 'pameran-karya-seni-siswa-kelas-xi',
            content: [
                'Lorong utama sekolah berubah menjadi galeri dadakan. Puluhan lukisan, patung tanah liat, dan karya fotografi hasil kerja siswa kelas XI dipajang selama tiga hari.',
                'Pengunjung dapat memberi suara untuk karya favorit. Karya dengan suara terbanyak akan dipajang permanen di ruang tamu sekolah.'
            ].join('\n\n'),
            status: 'PUBLISHED',
            published: ago(19, 5)
        },
        {
            author: 'guru.rina',
            title: 'Kantin Sehat, Menu Baru dan Aturan Gula',
            slug: 'kantin-sehat-menu-baru',
            content: [
                'Kantin sekolah memperkenalkan menu baru yang lebih sehat, antara lain nasi sayur, buah potong, dan jus tanpa tambahan gula. Harga tetap terjangkau dan porsinya cukup untuk siswa yang aktif.',
                'Minuman kemasan bergula tinggi kini dibatasi. Pengurus kantin menerima saran menu lewat kotak masukan di dekat kasir.'
            ].join('\n\n'),
            status: 'PUBLISHED',
            published: ago(21, 2)
        },
        {
            author: 'guru.andi',
            title: 'Informasi Study Tour: Jadwal dan Persyaratan',
            slug: 'informasi-study-tour',
            content: [
                'Study tour kelas XI direncanakan berlangsung empat hari tiga malam. Rute meliputi kunjungan ke museum, pusat kerajinan, dan satu perguruan tinggi negeri.',
                'Orang tua diminta mengisi formulir persetujuan dan melunasi biaya sebelum batas yang ditentukan. Rapat dengan orang tua akan diadakan di aula sekolah untuk menjelaskan rincian biaya dan tata tertib.'
            ].join('\n\n'),
            status: 'PUBLISHED',
            published: ago(24, 1)
        },
        {
            author: '23010002',
            title: 'Festival Musik Sekolah Tampilkan Delapan Band',
            slug: 'festival-musik-sekolah-delapan-band',
            content: [
                'Delapan band siswa tampil di panggung festival musik sekolah. Aliran yang dibawakan beragam, dari pop dan rock sampai akustik dan musik daerah.',
                'Penonton memenuhi lapangan hingga sore. Band terbaik pilihan juri akan tampil lagi pada acara perpisahan akhir tahun.'
            ].join('\n\n'),
            status: 'PUBLISHED',
            published: ago(26, 8)
        },
        {
            author: '23010003',
            title: 'Pemilihan Ketua OSIS Periode Baru',
            slug: 'pemilihan-ketua-osis-periode-baru',
            content: [
                'Tiga pasangan calon ketua dan wakil ketua OSIS menyampaikan visi dan misi di depan seluruh siswa. Mereka membawa program mulai dari perbaikan fasilitas sampai kegiatan sosial rutin.',
                'Pemungutan suara dilakukan secara langsung di kelas masing-masing dan dihitung terbuka oleh panitia. Hasilnya diumumkan di hari yang sama.'
            ].join('\n\n'),
            status: 'PUBLISHED',
            published: ago(29, 2)
        },
        {
            author: 'guru.rina',
            title: 'Lomba Kebersihan Kelas Bulan Ini',
            slug: 'lomba-kebersihan-kelas-bulan-ini',
            content: [
                'Setiap kelas ikut serta dalam lomba kebersihan dan keindahan kelas. Penilaian dilakukan tanpa pemberitahuan oleh tim guru, mencakup kerapian meja, kebersihan lantai, dan hiasan dinding.',
                'Kelas dengan nilai tertinggi mendapat piala bergilir dan hak memilih lagu pengiring upacara selama satu bulan.'
            ].join('\n\n'),
            status: 'PUBLISHED',
            published: ago(32, 3)
        },
        {
            author: 'guru.andi',
            title: 'Persiapan Peringatan Hari Sumpah Pemuda',
            slug: 'persiapan-peringatan-hari-sumpah-pemuda',
            content: [
                'Sekolah menyiapkan rangkaian kegiatan menyambut Hari Sumpah Pemuda, antara lain upacara bendera, lomba pidato, dan pentas seni budaya daerah. Setiap kelas mewakili satu daerah.',
                'Siswa diminta mengenakan pakaian adat pada hari puncak. Pembina OSIS menerima pendaftaran peserta lomba sampai akhir pekan ini.'
            ].join('\n\n'),
            status: 'PUBLISHED',
            published: ago(35, 1)
        },
        {
            author: '23010003',
            title: 'Bank Sampah Sekolah Kurangi Penggunaan Plastik',
            slug: 'bank-sampah-sekolah-kurangi-plastik',
            content: [
                'Bank sampah yang dikelola siswa kini menerima botol plastik, kardus, dan kertas bekas. Setiap setoran dicatat dan dapat ditukar dengan alat tulis atau potongan uang kas kelas.',
                'Dalam sebulan terkumpul lebih dari 80 kilogram sampah yang bisa didaur ulang. Pengelola mengajak semua siswa membawa botol minum sendiri dari rumah.'
            ].join('\n\n'),
            status: 'PUBLISHED',
            published: ago(38, 4)
        },
        {
            author: 'guru.rina',
            title: 'Seminar Kesehatan Remaja: Pentingnya Tidur Cukup',
            slug: 'seminar-kesehatan-remaja-tidur-cukup',
            content: [
                'Dokter dari puskesmas setempat mengisi seminar kesehatan bagi siswa kelas X. Topik utamanya adalah pentingnya tidur cukup, yaitu sekitar delapan sampai sepuluh jam bagi remaja.',
                'Siswa juga diajak mengurangi layar gawai satu jam sebelum tidur. Di akhir sesi, peserta mendapat panduan sederhana untuk mencatat kebiasaan tidur selama dua minggu.'
            ].join('\n\n'),
            status: 'PUBLISHED',
            published: ago(41, 2)
        },
        {
            author: 'guru.andi',
            title: 'Pendaftaran Ekstrakurikuler Semester Baru Dibuka',
            slug: 'pendaftaran-ekstrakurikuler-semester-baru',
            content: [
                'Pendaftaran ekstrakurikuler semester baru telah dibuka. Pilihan yang tersedia antara lain basket, futsal, paduan suara, jurnalistik, robotik, dan pramuka.',
                'Setiap siswa dapat memilih maksimal dua kegiatan. Formulir tersedia di ruang OSIS dan harus dikembalikan kepada pembina sebelum batas waktu yang ditentukan.'
            ].join('\n\n'),
            status: 'PUBLISHED',
            published: ago(44, 1)
        },
        {
            author: '23010002',
            title: 'Siswa Kelas X Juara Lomba Cerdas Cermat',
            slug: 'siswa-kelas-x-juara-cerdas-cermat',
            content: [
                'Tiga siswa kelas X meraih juara pertama lomba cerdas cermat antar-sekolah. Soal yang diajukan mencakup pengetahuan umum, sejarah, dan matematika dasar.',
                'Mereka mengaku rutin berlatih bersama di perpustakaan setiap istirahat siang. Sekolah memberi apresiasi berupa beasiswa buku untuk satu semester.'
            ].join('\n\n'),
            status: 'PUBLISHED',
            published: ago(48, 5)
        },
        {
            author: 'guru.rina',
            title: 'Perpustakaan Digital Kini Bisa Diakses dari Rumah',
            slug: 'perpustakaan-digital-bisa-diakses-dari-rumah',
            content: [
                'Siswa kini dapat membaca ratusan buku elektronik dari rumah melalui perpustakaan digital sekolah. Cukup masuk dengan akun yang dibagikan wali kelas.',
                'Koleksi mencakup buku pelajaran, novel, dan majalah ilmiah populer. Pustakawan akan menambah judul baru setiap bulan berdasarkan usulan siswa.'
            ].join('\n\n'),
            status: 'PUBLISHED',
            published: ago(52, 3)
        },

        // Drafts (not shown publicly until an admin publishes them)
        {
            author: '23010003',
            title: 'Kegiatan Bakti Sosial OSIS',
            slug: 'kegiatan-bakti-sosial-osis',
            content: 'OSIS mengadakan kegiatan bakti sosial bersama warga sekitar.',
            status: 'DRAFT',
            published: null
        },
        {
            author: 'guru.andi',
            title: 'Rencana Penyesuaian Jam Pelajaran Hari Jumat',
            slug: 'rencana-penyesuaian-jam-pelajaran-jumat',
            content: [
                'Sekolah sedang membahas penyesuaian jam pelajaran pada hari Jumat agar siswa punya waktu cukup untuk ibadah dan kegiatan ekstrakurikuler.',
                'Usulan ini masih dalam pembahasan dan belum final. Pengumuman resmi akan menyusul setelah rapat dewan guru.'
            ].join('\n\n'),
            status: 'DRAFT',
            published: null
        }
    ];


    const insertArticle = db.prepare(`
        INSERT OR IGNORE INTO articles (
            author_id,
            title,
            slug,
            content,
            status,
            published_at
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `);


    for (const article of articles) {

        const author = findUser(article.author);

        if (!author)
            continue;

        insertArticle.run(
            author.id,
            article.title,
            article.slug,
            article.content,
            article.status,
            article.published
        );
    }


    const articlesDb = db.prepare(`
        SELECT id, slug
        FROM articles
    `).all();


    const findArticle = (slug) =>
        articlesDb.find(
            x => x.slug === slug
        );


    // days = how long ago the comment was posted
    const comments = [
        { slug: 'persiapan-olimpiade-sains', user: '23010001', days: 3, content: 'Semoga tim sekolah menang!' },
        { slug: 'persiapan-olimpiade-sains', user: 'guru.rina', days: 2, content: 'Tetap semangat belajar.' },
        { slug: 'persiapan-olimpiade-sains', user: '23010004', days: 2, content: 'Boleh ikut latihan juga nggak, Bu?' },

        { slug: 'tim-basket-putra-melaju-ke-final', user: '23010001', days: 2, content: 'Kami pasti datang mendukung di final!' },
        { slug: 'tim-basket-putra-melaju-ke-final', user: '23010004', days: 1, content: 'Tembakan tiga angkanya keren banget.' },
        { slug: 'tim-basket-putra-melaju-ke-final', user: 'guru.andi', days: 1, content: 'Bus suporter sudah kami siapkan. Info lengkap menyusul.' },

        { slug: 'jadwal-ujian-semester-genap', user: '23010003', days: 5, content: 'Terima kasih infonya, Bu. Jadwalnya sudah saya catat.' },
        { slug: 'jadwal-ujian-semester-genap', user: '23010004', days: 5, content: 'Semangat ujian semuanya!' },

        { slug: 'juara-lomba-debat-bahasa-inggris', user: 'guru.rina', days: 6, content: 'Selamat untuk tim debat. Kalian membanggakan sekolah.' },
        { slug: 'juara-lomba-debat-bahasa-inggris', user: '23010001', days: 6, content: 'Keren! Tahun depan aku mau ikut seleksi.' },

        { slug: 'laboratorium-komputer-baru-resmi-digunakan', user: '23010002', days: 3, content: 'Akhirnya ada lab yang nyaman. Terima kasih, Pak.' },

        { slug: 'pekan-literasi-perpustakaan-buka-sampai-sore', user: '23010004', days: 9, content: 'Bazar bukunya kapan dimulai, ya?' },
        { slug: 'pekan-literasi-perpustakaan-buka-sampai-sore', user: '23010003', days: 9, content: 'Mulai hari Senin. Kami tunggu di perpustakaan!' },

        { slug: 'tips-belajar-efektif-menjelang-ujian', user: '23010001', days: 14, content: 'Tips tidur cukupnya benar-benar kepakai, Bu.' },

        { slug: 'bank-sampah-sekolah-kurangi-plastik', user: 'guru.andi', days: 37, content: 'Inisiatif yang bagus. Sekolah mendukung penuh.' }
    ];


    const insertComment = db.prepare(`
        INSERT INTO comments (
            article_id,
            user_id,
            content,
            created_at
        )
        VALUES (?, ?, ?, ?)
    `);


    for (const comment of comments) {

        const article = findArticle(comment.slug);
        const user = findUser(comment.user);

        if (!article || !user)
            continue;

        insertComment.run(
            article.id,
            user.id,
            comment.content,
            ago(comment.days, 6)
        );
    }

}


export default {
    init
};