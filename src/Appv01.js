import React, { useState } from 'react';
import { FileText, BookOpen, PlusCircle, Download, Brain, CheckCircle, Info } from 'lucide-react';

const RPPAdminApp = () => {
  const [activeTab, setActiveTab] = useState('input');
  const [materiData, setMateriData] = useState({
    judul: '',
    kelas: '',
    semester: '',
    alokasi_waktu: '',
    kompetensi_dasar: '',
    indikator: '',
    materi_pokok: '',
    metode: 'Problem Based Learning',
    media: '',
    sumber_belajar: ''
  });
  const [generatedRPP, setGeneratedRPP] = useState('');
  const [generatedSoal, setGeneratedSoal] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setMateriData(prev => ({ ...prev, [field]: value }));
  };

  const generateRPP = () => {
    setIsLoading(true);
    setTimeout(() => {
      const rpp = `
RENCANA PELAKSANAAN PEMBELAJARAN (RPP)
KURIKULUM DEEP LEARNING

Mata Pelajaran: ${materiData.judul}
Kelas/Semester: ${materiData.kelas}/${materiData.semester}
Alokasi Waktu: ${materiData.alokasi_waktu}

A. KOMPETENSI DASAR
${materiData.kompetensi_dasar}

B. INDIKATOR PENCAPAIAN KOMPETENSI
${materiData.indikator}

C. TUJUAN PEMBELAJARAN
Setelah mengikuti pembelajaran, peserta didik diharapkan dapat:
1. Memahami konsep dasar ${materiData.materi_pokok}
2. Menganalisis penerapan ${materiData.materi_pokok} dalam konteks nyata
3. Mengevaluasi implementasi ${materiData.materi_pokok}
4. Merancang solusi menggunakan ${materiData.materi_pokok}

D. MATERI PEMBELAJARAN
${materiData.materi_pokok}

E. METODE PEMBELAJARAN
- ${materiData.metode}
- Diskusi kolaboratif
- Praktik hands-on
- Project-based learning

F. MEDIA DAN SUMBER BELAJAR
Media: ${materiData.media}
Sumber: ${materiData.sumber_belajar}

G. LANGKAH-LANGKAH PEMBELAJARAN

1. Kegiatan Pendahuluan (15 menit)
   - Apersepsi dan motivasi
   - Penyampaian tujuan pembelajaran
   - Pre-assessment

2. Kegiatan Inti (60 menit)
   - Eksplorasi konsep ${materiData.materi_pokok}
   - Elaborasi melalui praktik
   - Konfirmasi dan penguatan

3. Kegiatan Penutup (15 menit)
   - Refleksi pembelajaran
   - Evaluasi
   - Tindak lanjut

H. PENILAIAN
- Penilaian Sikap: Observasi selama pembelajaran
- Penilaian Pengetahuan: Tes tertulis dan lisan
- Penilaian Keterampilan: Praktik dan project
      `;
      setGeneratedRPP(rpp);
      setIsLoading(false);
    }, 2000);
  };

  const generateSoal = () => {
    setIsLoading(true);
    setTimeout(() => {
      const soal = [
        {
          no: 1,
          tipe: 'Pilihan Ganda',
          pertanyaan: `Apa yang dimaksud dengan ${materiData.materi_pokok}?`,
          pilihan: [
            'A. Metode pembelajaran tradisional',
            'B. Teknik analisis data menggunakan neural network berlapis',
            'C. Sistem database relasional',
            'D. Algoritma sorting sederhana'
          ],
          jawaban: 'B'
        },
        {
          no: 2,
          tipe: 'Essay',
          pertanyaan: `Jelaskan penerapan ${materiData.materi_pokok} dalam kehidupan sehari-hari dan berikan 3 contoh konkret!`,
          jawaban: 'Jawaban harus mencakup penjelasan konsep dan 3 contoh aplikasi nyata'
        },
        {
          no: 3,
          tipe: 'Praktik',
          pertanyaan: `Buatlah implementasi sederhana dari ${materiData.materi_pokok} menggunakan Python!`,
          jawaban: 'Kode program yang dapat dijalankan dengan penjelasan setiap bagian'
        },
        {
          no: 4,
          tipe: 'Analisis',
          pertanyaan: `Bandingkan kelebihan dan kekurangan ${materiData.materi_pokok} dengan metode konvensional!`,
          jawaban: 'Analisis komprehensif dengan tabel perbandingan'
        },
        {
          no: 5,
          tipe: 'Pilihan Ganda',
          pertanyaan: `Manakah yang BUKAN merupakan karakteristik ${materiData.materi_pokok}?`,
          pilihan: [
            'A. Memiliki multiple layers',
            'B. Menggunakan backpropagation',
            'C. Tidak memerlukan data training',
            'D. Dapat melakukan feature extraction otomatis'
          ],
          jawaban: 'C'
        }
      ];
      setGeneratedSoal(soal);
      setIsLoading(false);
    }, 1500);
  };

  const downloadRPP = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedRPP], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `RPP_${materiData.judul}_${materiData.kelas}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadSoal = () => {
    let soalText = 'BANK SOAL - ' + materiData.judul + '\n\n';
    generatedSoal.forEach(soal => {
      soalText += `${soal.no}. [${soal.tipe}] ${soal.pertanyaan}\n`;
      if (soal.pilihan) {
        soal.pilihan.forEach(pilihan => soalText += `   ${pilihan}\n`);
      }
      soalText += `   Jawaban: ${soal.jawaban}\n\n`;
    });
    
    const element = document.createElement('a');
    const file = new Blob([soalText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Soal_${materiData.judul}_${materiData.kelas}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8" />
              <div>
                <h1 className="text-3xl font-bold">Aplikasi Administrasi RPP</h1>
                <p className="text-blue-100">Kurikulum Deep Learning - Generator RPP & Soal Otomatis</p>
              </div>
            </div>
            <div className="text-right text-blue-100 text-sm">
              <p>Version 1.0</p>
              <p>© 2025 EduTech Solutions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('input')}
              className={`flex items-center space-x-2 px-6 py-4 font-medium ${
                activeTab === 'input' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <PlusCircle className="w-5 h-5" />
              <span>Input Materi</span>
            </button>
            <button
              onClick={() => setActiveTab('rpp')}
              className={`flex items-center space-x-2 px-6 py-4 font-medium ${
                activeTab === 'rpp' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Generate RPP</span>
            </button>
            <button
              onClick={() => setActiveTab('soal')}
              className={`flex items-center space-x-2 px-6 py-4 font-medium ${
                activeTab === 'soal' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Generate Soal</span>
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`flex items-center space-x-2 px-6 py-4 font-medium ${
                activeTab === 'about' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Info className="w-5 h-5" />
              <span>About</span>
            </button>
          </div>
        </div>

        {/* Input Materi Tab */}
        {activeTab === 'input' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Input Data Materi Pembelajaran</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Judul Materi</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Deep Learning Fundamentals"
                  value={materiData.judul}
                  onChange={(e) => handleInputChange('judul', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kelas</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={materiData.kelas}
                  onChange={(e) => handleInputChange('kelas', e.target.value)}
                >
                  <option value="">Pilih Kelas</option>
                  <option value="X">X</option>
                  <option value="XI">XI</option>
                  <option value="XII">XII</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={materiData.semester}
                  onChange={(e) => handleInputChange('semester', e.target.value)}
                >
                  <option value="">Pilih Semester</option>
                  <option value="1">Ganjil</option>
                  <option value="2">Genap</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alokasi Waktu</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2 x 45 menit"
                  value={materiData.alokasi_waktu}
                  onChange={(e) => handleInputChange('alokasi_waktu', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Kompetensi Dasar</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Memahami konsep dan penerapan deep learning dalam pemecahan masalah..."
                  value={materiData.kompetensi_dasar}
                  onChange={(e) => handleInputChange('kompetensi_dasar', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Indikator Pencapaian</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Siswa dapat menjelaskan konsep neural network, mengimplementasikan algoritma..."
                  value={materiData.indikator}
                  onChange={(e) => handleInputChange('indikator', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Materi Pokok</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                  placeholder="Neural Networks, Backpropagation, Convolutional Neural Networks..."
                  value={materiData.materi_pokok}
                  onChange={(e) => handleInputChange('materi_pokok', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Metode Pembelajaran</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={materiData.metode}
                  onChange={(e) => handleInputChange('metode', e.target.value)}
                >
                  <option value="Problem Based Learning">Problem Based Learning</option>
                  <option value="Project Based Learning">Project Based Learning</option>
                  <option value="Discovery Learning">Discovery Learning</option>
                  <option value="Inquiry Learning">Inquiry Learning</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Media Pembelajaran</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Laptop, Proyektor, Python, TensorFlow..."
                  value={materiData.media}
                  onChange={(e) => handleInputChange('media', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sumber Belajar</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                  placeholder="Deep Learning Book by Ian Goodfellow, Coursera Deep Learning Course..."
                  value={materiData.sumber_belajar}
                  onChange={(e) => handleInputChange('sumber_belajar', e.target.value)}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>Data materi siap untuk generate RPP dan Soal</span>
              </div>
            </div>
          </div>
        )}
        

        {/* Generate RPP Tab */}
        {activeTab === 'rpp' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Generate RPP Otomatis</h2>
              <div className="space-x-3">
                <button
                  onClick={generateRPP}
                  disabled={isLoading || !materiData.judul}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center space-x-2"
                >
                  <Brain className="w-5 h-5" />
                  <span>{isLoading ? 'Generating...' : 'Generate RPP'}</span>
                </button>
                {generatedRPP && (
                  <button
                    onClick={downloadRPP}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download RPP</span>
                  </button>
                )}
              </div>
            </div>
            
            {isLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Sedang generate RPP...</p>
              </div>
            )}
            
            {generatedRPP && !isLoading && (
              <div className="bg-gray-50 rounded-lg p-6">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">{generatedRPP}</pre>
              </div>
            )}
            
            {!generatedRPP && !isLoading && (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Klik tombol "Generate RPP" untuk membuat RPP otomatis</p>
                <p className="text-sm mt-2">Pastikan data materi sudah diisi lengkap</p>
              </div>
            )}
          </div>
        )}

        {/* Generate Soal Tab */}
        {activeTab === 'soal' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Generate Bank Soal Otomatis</h2>
              <div className="space-x-3">
                <button
                  onClick={generateSoal}
                  disabled={isLoading || !materiData.judul}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 flex items-center space-x-2"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>{isLoading ? 'Generating...' : 'Generate Soal'}</span>
                </button>
                {generatedSoal.length > 0 && (
                  <button
                    onClick={downloadSoal}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Soal</span>
                  </button>
                )}
              </div>
            </div>
            
            {isLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Sedang generate bank soal...</p>
              </div>
            )}
            
            {generatedSoal.length > 0 && !isLoading && (
              <div className="space-y-6">
                {generatedSoal.map((soal, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">Soal {soal.no}</h3>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {soal.tipe}
                      </span>
                    </div>
                    <p className="text-gray-800 mb-4">{soal.pertanyaan}</p>
                    {soal.pilihan && (
                      <div className="mb-4">
                        {soal.pilihan.map((pilihan, idx) => (
                          <p key={idx} className="text-gray-700 ml-4">{pilihan}</p>
                        ))}
                      </div>
                    )}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-green-800">Jawaban: {soal.jawaban}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {generatedSoal.length === 0 && !isLoading && (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Klik tombol "Generate Soal" untuk membuat bank soal otomatis</p>
                <p className="text-sm mt-2">Soal akan disesuaikan dengan materi yang diinput</p>
              </div>
            )}
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <Brain className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Aplikasi Administrasi RPP</h2>
                <p className="text-xl text-gray-600">Kurikulum Deep Learning - Generator RPP & Soal Otomatis</p>
                <p className="text-lg text-blue-600 mt-2">Version 1.0</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Tentang Aplikasi</h3>
                  <p className="text-gray-700 mb-4">
                    Aplikasi Administrasi RPP adalah solusi digital untuk membantu guru dalam menyusun Rencana Pelaksanaan Pembelajaran (RPP) dan bank soal secara otomatis. Aplikasi ini dirancang khusus untuk kurikulum Deep Learning dengan teknologi AI yang canggih.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>Generate RPP otomatis</span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>Bank soal beragam (PG, Essay, Praktik)</span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>Export dokumen siap pakai</span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>Interface user-friendly</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Informasi Pengembang</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-gray-700">Dikembangkan oleh:</p>
                      <p className="text-blue-600 font-medium">EduTech Solutions</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Teknologi:</p>
                      <p className="text-gray-600">React.js, AI-Powered Generation</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Target Pengguna:</p>
                      <p className="text-gray-600">Guru, Pendidik, Institusi Pendidikan</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Kategori:</p>
                      <p className="text-gray-600">Educational Technology</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-bold text-blue-800 mb-3">Hak Cipta & Lisensi</h3>
                <div className="text-sm text-blue-700 space-y-2">
                  <p>© 2025 EduTech Solutions. All rights reserved.</p>
                  <p>
                    Aplikasi ini dilindungi oleh hak cipta dan undang-undang kekayaan intelektual. 
                    Dilarang menyalin, mendistribusikan, atau memodifikasi tanpa izin tertulis dari pemilik.
                  </p>
                  <p className="font-semibold">
                    License: Educational Use Only - Not for Commercial Distribution
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Disclaimer:</strong> Aplikasi ini masih dalam tahap pengembangan. 
                  Hasil generate RPP dan soal sebaiknya direview dan disesuaikan dengan kebutuhan spesifik sekolah dan kurikulum yang berlaku.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Brain className="w-6 h-6" />
              <div>
                <p className="font-semibold">Aplikasi Administrasi RPP</p>
                <p className="text-sm text-gray-400">Kurikulum Deep Learning</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400">
                © 2025 EduTech Solutions. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Version 1.0 | Educational Technology Platform
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RPPAdminApp;