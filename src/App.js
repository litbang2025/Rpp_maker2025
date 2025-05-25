import React, { useState } from 'react';
import { 
  FileText, 
  BookOpen, 
  PlusCircle, 
  Download, 
  Brain, 
  CheckCircle, 
  Info, 
  Upload,
  Table,
  FileType,
  FileInput
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, HeadingLevel, Table as DocxTable, TableRow, TableCell } from 'docx';

const RPPAdminApp = () => {
  // State management
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
    sumber_belajar: '',
    kurikulum: 'Kurikulum 2013' // New state for curriculum selection
  });
  const [generatedRPP, setGeneratedRPP] = useState('');
  const [generatedKisiKisi, setGeneratedKisiKisi] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [excelTemplate, setExcelTemplate] = useState(null);
  const [usageStats, setUsageStats] = useState({ rppGenerated: 0, kisiGenerated: 0 }); // State for usage stats

  // Handle input changes
  const handleInputChange = (field, value) => {
    setMateriData(prev => ({ ...prev, [field]: value }));
  };

  // Generate Excel Template
  const generateExcelTemplate = () => {
    const templateData = [
      {
        'Judul': 'Contoh Judul Materi',
        'Kelas': 'X',
        'Semester': '1',
        'Alokasi Waktu': '2 x 45 menit',
        'Kompetensi Dasar': '3.1 Memahami konsep dasar...',
        'Indikator': '3.1.1 Menjelaskan pengertian...\n3.1.2 Menganalisis komponen...',
        'Materi Pokok': 'Konsep Dasar, Prinsip Kerja',
        'Metode': 'Problem Based Learning',
        'Media': 'Laptop, Proyektor',
        'Sumber Belajar': 'Buku Teks, Internet'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    
    // Simpan template dalam state untuk preview
    const templateBlob = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    setExcelTemplate(templateBlob);
    
    // Download template
    XLSX.writeFile(workbook, 'Template_Input_Materi.xlsx');
  };

  // Import from Excel
  const importExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        if(jsonData.length > 0) {
          const mappedData = {
            judul: jsonData[0].Judul || jsonData[0].judul || '',
            kelas: jsonData[0].Kelas || jsonData[0].kelas || '',
            semester: jsonData[0].Semester || jsonData[0].semester || '',
            alokasi_waktu: jsonData[0]['Alokasi Waktu'] || jsonData[0].alokasi_waktu || '',
            kompetensi_dasar: jsonData[0]['Kompetensi Dasar'] || jsonData[0].kompetensi_dasar || '',
            indikator: jsonData[0].Indikator || jsonData[0].indikator || '',
            materi_pokok: jsonData[0]['Materi Pokok'] || jsonData[0].materi_pokok || '',
            metode: jsonData[0].Metode || jsonData[0].metode || 'Problem Based Learning',
            media: jsonData[0].Media || jsonData[0].media || '',
            sumber_belajar: jsonData[0]['Sumber Belajar'] || jsonData[0].sumber_belajar || '',
            kurikulum: jsonData[0].Kurikulum || 'Kurikulum 2013' // Default to 'Kurikulum 2013'
          };
          
          setMateriData(mappedData);
          alert('Data berhasil diimpor dari Excel!');
        }
      } catch (error) {
        alert('Error membaca file Excel: ' + error.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Export to Excel
  const exportExcel = () => {
    const exportData = [materiData];
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Materi');
    XLSX.writeFile(workbook, `Materi_${materiData.judul}.xlsx`);
  };

  // Generate RPP
  const generateRPP = () => {
    setIsLoading(true);
    setTimeout(() => {
      const rppTemplate = `
RENCANA PELAKSANAAN PEMBELAJARAN (RPP)
Satuan Pendidikan : ... Ibnu Hajar Boarding School
Mata Pelajaran    : ${materiData.judul}
Kelas/Semester    : ${materiData.kelas}/${materiData.semester}
Alokasi Waktu     : ${materiData.alokasi_waktu}
Kurikulum         : ${materiData.kurikulum} // Added curriculum info

A. Kompetensi Inti
1. Menghayati dan mengamalkan ajaran agama yang dianutnya
2. Mengembangkan perilaku (jujur, disiplin, tanggungjawab, peduli, santun)

B. Kompetensi Dasar
${materiData.kompetensi_dasar}

C. Indikator Pencapaian Kompetensi
${materiData.indikator}

D. Tujuan Pembelajaran
Setelah mengikuti proses pembelajaran, peserta didik dapat:
1. Memahami konsep dasar ${materiData.materi_pokok}
2. Menerapkan pengetahuan tentang ${materiData.materi_pokok}
3. Menganalisis kasus terkait ${materiData.materi_pokok}

E. Materi Pembelajaran
${materiData.materi_pokok}

F. Metode Pembelajaran
- ${materiData.metode}
- Diskusi kelompok
- Demonstrasi
- Praktikum

G. Media dan Sumber Belajar
1. Media : ${materiData.media}
2. Sumber Belajar : ${materiData.sumber_belajar}

H. Langkah-langkah Pembelajaran
1. Pendahuluan (15 menit)
   - Orientasi
   - Apersepsi
   - Motivasi

2. Inti (60 menit)
   - Eksplorasi
   - Elaborasi
   - Konfirmasi

3. Penutup (15 menit)
   - Refleksi
   - Evaluasi
   - Tindak lanjut

I. Penilaian Hasil Pembelajaran
1. Teknik Penilaian:
   - Observasi
   - Tes tertulis
   - Penugasan

2. Bentuk Instrumen:
   - Lembar pengamatan
   - Soal pilihan ganda
   - Soal uraian

3. Rubrik Penilaian:
   - Ketepatan konsep (40%)
   - Kreativitas (30%)
   - Kerjasama (30%)
      `;
      setGeneratedRPP(rppTemplate);
      setUsageStats(prev => ({ ...prev, rppGenerated: prev.rppGenerated + 1 })); // Update usage stats
      setIsLoading(false);
    }, 2000);
  };

  // Download RPP as text file
  const downloadRPP = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedRPP], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `RPP_${materiData.judul}_${materiData.kelas}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Download RPP as Word document
  const downloadRPPToWord = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: "RENCANA PELAKSANAAN PEMBELAJARAN (RPP)",
            heading: HeadingLevel.HEADING_1,
            alignment: 'center',
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: `Satuan Pendidikan : ... Ibnu Hajar Boarding School`,
            spacing: { after: 100 }
          }),
          new Paragraph({
            text: `Mata Pelajaran    : ${materiData.judul}`,
            spacing: { after: 100 }
          }),
          new Paragraph({
            text: `Kelas/Semester    : ${materiData.kelas}/${materiData.semester}`,
            spacing: { after: 100 }
          }),
          new Paragraph({
            text: `Alokasi Waktu     : ${materiData.alokasi_waktu}`,
            spacing: { after: 100 }
          }),
          new Paragraph({
            text: `Kurikulum         : ${materiData.kurikulum}`,
            spacing: { after: 200 }
          }),
          new Paragraph({ text: "A. Kompetensi Inti", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: "1. Menghayati dan mengamalkan ajaran agama yang dianutnya" }),
          new Paragraph({ text: "2. Mengembangkan perilaku (jujur, disiplin, tanggungjawab, peduli, santun)" }),
          new Paragraph({ text: "B. Kompetensi Dasar" }),
          new Paragraph({ text: materiData.kompetensi_dasar }),
          new Paragraph({ text: "C. Indikator Pencapaian Kompetensi" }),
          new Paragraph({ text: materiData.indikator }),
          new Paragraph({ text: "D. Tujuan Pembelajaran" }),
          new Paragraph({ text: `Setelah mengikuti proses pembelajaran, peserta didik dapat:` }),
          new Paragraph({ text: `1. Memahami konsep dasar ${materiData.materi_pokok}` }),
          new Paragraph({ text: `2. Menerapkan pengetahuan tentang ${materiData.materi_pokok}` }),
          new Paragraph({ text: `3. Menganalisis kasus terkait ${materiData.materi_pokok}` }),
          new Paragraph({ text: "E. Materi Pembelajaran" }),
          new Paragraph({ text: materiData.materi_pokok }),
          new Paragraph({ text: "F. Metode Pembelajaran" }),
          new Paragraph({ text: `- ${materiData.metode}` }),
          new Paragraph({ text: "G. Media dan Sumber Belajar" }),
          new Paragraph({ text: `1. Media : ${materiData.media}` }),
          new Paragraph({ text: `2. Sumber Belajar : ${materiData.sumber_belajar}` }),
          new Paragraph({ text: "H. Langkah-langkah Pembelajaran" }),
          new Paragraph({ text: "1. Pendahuluan (15 menit)\n   - Orientasi\n   - Apersepsi\n   - Motivasi" }),
          new Paragraph({ text: "2. Inti (60 menit)\n   - Eksplorasi\n   - Elaborasi\n   - Konfirmasi" }),
          new Paragraph({ text: "3. Penutup (15 menit)\n   - Refleksi\n   - Evaluasi\n   - Tindak lanjut" }),
          new Paragraph({ text: "I. Penilaian Hasil Pembelajaran" }),
          new Paragraph({ text: "1. Teknik Penilaian:\n   - Observasi\n   - Tes tertulis\n   - Penugasan" }),
          new Paragraph({ text: "2. Bentuk Instrumen:\n   - Lembar pengamatan\n   - Soal pilihan ganda\n   - Soal uraian" }),
          new Paragraph({ text: "3. Rubrik Penilaian:" }),
          new Paragraph({ text: "   - Ketepatan konsep (40%)\n   - Kreativitas (30%)\n   - Kerjasama (30%)" }),
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RPP_${materiData.judul}_${materiData.kelas}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate Kisi-Kisi
  const generateKisiKisi = () => {
    setIsLoading(true);
    setTimeout(() => {
      const indikatorArray = materiData.indikator
        .split('\n')
        .filter(i => i.trim())
        .map(i => i.replace(/^\d+[.)\s]*/, '').trim());

      const kisiKisi = indikatorArray.map((indikator, index) => {
        // Determine question type based on verb in indicator
        const verb = indikator.split(' ')[0].toLowerCase();
        let questionType = 'Pilihan Ganda';
        let exampleQuestion = '';
        let answerKey = '';

        if (verb.includes('menjelaskan') || verb.includes('mendeskripsikan')) {
          questionType = 'Uraian';
          exampleQuestion = `Jelaskan secara rinci tentang ${indikator.toLowerCase()}`;
          answerKey = 'Jawaban harus mencakup semua aspek yang diminta dalam indikator';
        } else if (verb.includes('menganalisis') || verb.includes('membandingkan')) {
          questionType = 'Analisis Kasus';
          exampleQuestion = `Berdasarkan kasus berikut, analisis ${indikator.toLowerCase()}`;
          answerKey = 'Analisis harus menunjukkan pemahaman mendalam';
        } else if (verb.includes('menerapkan') || verb.includes('menggunakan')) {
          questionType = 'Praktik';
          exampleQuestion = `Terapkan pengetahuan Anda tentang ${indikator.toLowerCase()} dalam situasi berikut`;
          answerKey = 'Penerapan harus sesuai dengan konsep yang diajarkan';
        } else {
          questionType = 'Pilihan Ganda';
          exampleQuestion = `Manakah yang paling tepat menggambarkan ${indikator.toLowerCase()}?`;
          answerKey = 'Pilihan yang paling komprehensif';
        }

        return {
          no: index + 1,
          kompetensi_dasar: materiData.kompetensi_dasar,
          materi: materiData.materi_pokok,
          indikator: indikator,
          bentuk_soal: questionType,
          contoh_soal: exampleQuestion,
          kunci_jawaban: answerKey,
          skor: 1,
          level: verb.includes('menganalisis') ? 'C4' : 
                verb.includes('menerapkan') ? 'C3' : 
                verb.includes('memahami') ? 'C2' : 'C1'
        };
      });

      setGeneratedKisiKisi(kisiKisi);
      setUsageStats(prev => ({ ...prev, kisiGenerated: prev.kisiGenerated + 1 })); // Update usage stats
      setIsLoading(false);
    }, 1500);
  };

  // Export Kisi-Kisi to Word
  const exportKisiKisiToWord = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: "KISI-KISI PENILAIAN",
            heading: HeadingLevel.HEADING_1,
            alignment: 'center',
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: `Mata Pelajaran: ${materiData.judul}`,
            spacing: { after: 100 }
          }),
          new Paragraph({
            text: `Kelas/Semester: ${materiData.kelas}/${materiData.semester}`,
            spacing: { after: 200 }
          }),
          new DocxTable({
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("No")], width: { size: 500 } }),
                  new TableCell({ children: [new Paragraph("Kompetensi Dasar")] }),
                  new TableCell({ children: [new Paragraph("Indikator")] }),
                  new TableCell({ children: [new Paragraph("Materi")] }),
                  new TableCell({ children: [new Paragraph("Bentuk Soal")], width: { size: 1500 } }),
                  new TableCell({ children: [new Paragraph("Contoh Soal")] }),
                  new TableCell({ children: [new Paragraph("Kunci Jawaban")] }),
                  new TableCell({ children: [new Paragraph("Level")], width: { size: 800 } }),
                  new TableCell({ children: [new Paragraph("Skor")], width: { size: 800 } })
                ],
                tableHeader: true
              }),
              ...generatedKisiKisi.map(item => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(item.no.toString())] }),
                  new TableCell({ children: [new Paragraph(item.kompetensi_dasar)] }),
                  new TableCell({ children: [new Paragraph(item.indikator)] }),
                  new TableCell({ children: [new Paragraph(item.materi)] }),
                  new TableCell({ children: [new Paragraph(item.bentuk_soal)] }),
                  new TableCell({ children: [new Paragraph(item.contoh_soal)] }),
                  new TableCell({ children: [new Paragraph(item.kunci_jawaban)] }),
                  new TableCell({ children: [new Paragraph(item.level)] }),
                  new TableCell({ children: [new Paragraph(item.skor.toString())] })
                ]
              }))
            ],
            width: { size: 100, type: 'pct' }
          })
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Kisi-Kisi_${materiData.judul}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Kisi-Kisi to Text
  const exportKisiKisiToText = () => {
    let textContent = `KISI-KISI PENILAIAN\n\n`;
    textContent += `Mata Pelajaran: ${materiData.judul}\n`;
    textContent += `Kelas/Semester: ${materiData.kelas}/${materiData.semester}\n\n`;
    
    textContent += 'No | Kompetensi Dasar | Indikator | Materi | Bentuk Soal | Contoh Soal | Kunci Jawaban | Level | Skor\n';
    textContent += '---|------------------|-----------|--------|-------------|-------------|---------------|-------|-----\n';
    
    generatedKisiKisi.forEach(item => {
      textContent += `${item.no} | ${item.kompetensi_dasar} | ${item.indikator} | ${item.materi} | ${item.bentuk_soal} | ${item.contoh_soal} | ${item.kunci_jawaban} | ${item.level} | ${item.skor}\n`;
    });

    const element = document.createElement('a');
    const file = new Blob([textContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Kisi-Kisi_${materiData.judul}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // UI Components
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
                <p className="text-blue-100">Generator RPP & Kisi-Kisi Penilaian</p>
              </div>
            </div>
            <div className="text-right text-blue-100 text-sm">
              <p>Version 2.1.0</p>
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
              onClick={() => setActiveTab('kisi')}
              className={`flex items-center space-x-2 px-6 py-4 font-medium ${
                activeTab === 'kisi' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Table className="w-5 h-5" />
              <span>Generate Kisi-Kisi</span>
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
              <span>Tentang</span>
            </button>
          </div>
        </div>

        {/* Input Materi Tab */}
        {activeTab === 'input' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Input Data Materi Pembelajaran</h2>
            
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-800">Template Excel</h3>
                  <p className="text-sm text-blue-600">Unduh template untuk memudahkan input data</p>
                </div>
                <button
                  onClick={generateExcelTemplate}
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 flex items-center space-x-2"
                >
                  <FileInput className="w-4 h-4" />
                  <span>Unduh Template</span>
                </button>
              </div>
            </div>
            
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
                  placeholder="3.1 Memahami konsep dasar neural network"
                  value={materiData.kompetensi_dasar}
                  onChange={(e) => handleInputChange('kompetensi_dasar', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Indikator Pencapaian</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                  placeholder="3.1.1 Menjelaskan pengertian neural network\n3.1.2 Menganalisis komponen dasar neural network"
                  value={materiData.indikator}
                  onChange={(e) => handleInputChange('indikator', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Gunakan baris baru untuk setiap indikator</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Materi Pokok</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Konsep dasar neural network, Arsitektur jaringan saraf"
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
                  placeholder="Laptop, Proyektor, Python"
                  value={materiData.media}
                  onChange={(e) => handleInputChange('media', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sumber Belajar</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                  placeholder="Buku Teks Deep Learning, Modul Pembelajaran"
                  value={materiData.sumber_belajar}
                  onChange={(e) => handleInputChange('sumber_belajar', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Kurikulum</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={materiData.kurikulum}
                  onChange={(e) => handleInputChange('kurikulum', e.target.value)}
                >
                  <option value="Kurikulum 2013">Kurikulum 2013</option>
                  <option value="Kurikulum Merdeka">Kurikulum Merdeka</option>
                  <option value="Kurikulum Nasional">Kurikulum Nasional</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>Data materi siap untuk generate RPP dan Kisi-Kisi</span>
              </div>
              <div className="space-x-3">
                <button
                  onClick={exportExcel}
                  disabled={!materiData.judul}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center space-x-2"
                >
                  <Table className="w-4 h-4" />
                  <span>Ekspor Excel</span>
                </button>
                <label className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Impor Excel</span>
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={importExcel}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Generate RPP Tab */}
        {activeTab === 'rpp' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Generate Rencana Pelaksanaan Pembelajaran</h2>
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
                  <>
                    <button
                      onClick={downloadRPP}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download RPP (Text)</span>
                    </button>
                    <button
                      onClick={downloadRPPToWord}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <FileType className="w-5 h-5" />
                      <span>Download RPP (Word)</span>
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {isLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Sedang menyusun RPP...</p>
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

        {/* Generate Kisi-Kisi Tab */}
        {activeTab === 'kisi' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Generate Kisi-Kisi Penilaian</h2>
              <div className="space-x-3">
                <button
                  onClick={generateKisiKisi}
                  disabled={isLoading || !materiData.judul}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 flex items-center space-x-2"
                >
                  <Table className="w-5 h-5" />
                  <span>{isLoading ? 'Generating...' : 'Generate Kisi-Kisi'}</span>
                </button>
                {generatedKisiKisi.length > 0 && (
                  <div className="flex space-x-3">
                    <button
                      onClick={exportKisiKisiToWord}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <FileType className="w-5 h-5" />
                      <span>Word</span>
                    </button>
                    <button
                      onClick={exportKisiKisiToText}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2"
                    >
                      <FileText className="w-5 h-5" />
                      <span>Text</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {isLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Sedang menyusun kisi-kisi penilaian...</p>
              </div>
            )}
            
            {generatedKisiKisi.length > 0 && !isLoading && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left border">No</th>
                      <th className="p-3 text-left border">Kompetensi Dasar</th>
                      <th className="p-3 text-left border">Indikator</th>
                      <th className="p-3 text-left border">Materi</th>
                      <th className="p-3 text-left border">Bentuk Soal</th>
                      <th className="p-3 text-left border">Contoh Soal</th>
                      <th className="p-3 text-left border">Kunci Jawaban</th>
                      <th className="p-3 text-left border">Level</th>
                      <th className="p-3 text-left border">Skor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generatedKisiKisi.map((kisi, index) => (
                      <tr key={index} className="hover:bg-gray-50 even:bg-gray-50">
                        <td className="p-3 border">{kisi.no}</td>
                        <td className="p-3 border">{kisi.kompetensi_dasar}</td>
                        <td className="p-3 border">{kisi.indikator}</td>
                        <td className="p-3 border">{kisi.materi}</td>
                        <td className="p-3 border">{kisi.bentuk_soal}</td>
                        <td className="p-3 border">{kisi.contoh_soal}</td>
                        <td className="p-3 border">{kisi.kunci_jawaban}</td>
                        <td className="p-3 border">{kisi.level}</td>
                        <td className="p-3 border">{kisi.skor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {generatedKisiKisi.length === 0 && !isLoading && (
              <div className="text-center py-12 text-gray-500">
                <Table className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Klik tombol "Generate Kisi-Kisi" untuk membuat instrumen penilaian</p>
                <p className="text-sm mt-2">Kisi-kisi akan disesuaikan dengan indikator yang diinput</p>
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
                <p className="text-xl text-gray-600">Generator RPP & Kisi-Kisi Penilaian Otomatis</p>
                <p className="text-lg text-blue-600 mt-2">Version 2.1.0</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Tentang Aplikasi</h3>
                  <p className="text-gray-700 mb-4">
                    Aplikasi ini membantu guru dalam menyusun perangkat pembelajaran secara otomatis dan terstandarisasi. Dengan teknologi canggih, proses administrasi pembelajaran menjadi lebih efisien.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>Generate RPP sesuai kurikulum</span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>Kisi-kisi penilaian otomatis</span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>Import/Export data Excel</span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>Export dokumen siap pakai</span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>Statistik penggunaan aplikasi</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Informasi Pengembang</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-gray-700">Pengembang:</p>
                      <p className="text-blue-600 font-medium">EduTech Innovation Team</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Teknologi Utama:</p>
                      <p className="text-gray-600">React.js, Node.js, AI Integration</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Lisensi:</p>
                      <p className="text-gray-600">MIT License - Open Source</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Kontak Support:</p>
                      <p className="text-gray-600">support@edutech.id</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Update Terakhir:</p>
                      <p className="text-gray-600">15 Oktober 2023</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-bold text-blue-800 mb-3">Kebijakan Penggunaan</h3>
                <div className="text-sm text-blue-700 space-y-2">
                  <p>1. Aplikasi ini ditujukan untuk kepentingan pendidikan non-komersial</p>
                  <p>2. Dilarang melakukan reverse engineering terhadap sistem</p>
                  <p>3. Data pengguna akan dienkripsi dan disimpan secara aman</p>
                  <p>4. Laporan bug dapat dikirimkan ke tim support</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>Versi Terbaru:</strong> Sistem telah diperbarui dengan fitur-fitur:
                  <ul className="list-disc pl-5 mt-2">
                    <li>Template Excel yang lebih intuitif</li>
                    <li>Format dokumen Word yang lebih profesional</li>
                    <li>Validasi data otomatis</li>
                    <li>Statistik penggunaan aplikasi</li>
                  </ul>
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
                <p className="font-semibold">EduTech RPP Generator</p>
                <p className="text-sm text-gray-400">Solusi Administrasi Pembelajaran Modern</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400">
                © 2023 EduTech Solutions. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Version 2.1.0 | Pendidikan Berkualitas untuk Semua
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RPPAdminApp;
