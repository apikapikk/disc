'use client'

import { useRef, useState } from 'react'

function randNum(length: number) {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10)
  }
  return result
}

function generateToken() {
  return `${randNum(4)}-${randNum(4)}-${randNum(4)}-${randNum(4)}-${randNum(4)}`
}

function generateRef() {
  const prefix = new Date().toISOString().slice(2, 10).replace(/-/g, '')
  const middle = Date.now().toString()
  const random = randNum(32 - (prefix.length + middle.length))
  return (prefix + middle + random).slice(0, 32)
}

function formatRp(num: number) {
  return num.toLocaleString('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

function formatKwh(value: string) {
  const num = parseFloat(value)
  if (isNaN(num)) return ''
  return num.toLocaleString('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// 🔥 FIX TANGGAL (manual parsing, no Date bug)
function formatTanggal(value: string) {
  if (!value) return ''

  const [datePart, timePart] = value.split('T')
  if (!datePart || !timePart) return ''

  const [year, month, day] = datePart.split('-')
  const [hour, minute] = timePart.split(':')

  // generate detik biar keliatan real
  const second = new Date().getSeconds().toString().padStart(2, '0')

  return `${day}/${month}/${year} ${hour}:${minute}:${second}`
}

export default function Home() {
  const [nama, setNama] = useState('')
  const [kwh, setKwh] = useState('')

  // ✅ default langsung ke sekarang
  const [tanggal, setTanggal] = useState(
    new Date().toISOString().slice(0,16)
  )

  const [token, setToken] = useState('')
  const [ref, setRef] = useState('')

  const strukRef = useRef<HTMLDivElement>(null)

  const handleGenerate = async () => {
    const newToken = generateToken()
    const newRef = generateRef()

    setToken(newToken)
    setRef(newRef)

    setTimeout(async () => {
      if (!strukRef.current) return

      const html2pdf = (await import('html2pdf.js')).default

      html2pdf()
        .set({
          margin: 10,
          filename: 'struk-pln.pdf',
          html2canvas: { scale: 2 },
          jsPDF: { orientation: 'landscape' }
        })
        .from(strukRef.current)
        .save()
    }, 100)
  }

  const total = 100000
  const admin = 1600
  const ppj = 4546
  const tokenRp = total - ppj

  return (
    <main style={{ padding: 20, background: '#f3f4f6', minHeight: '100vh' }}>

      {/* FONT */}
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
      <link href="https://fonts.googleapis.com/css2?family=Courier+Prime&display=swap" rel="stylesheet"/>

      <h2>Generator Struk PLN</h2>
      <p style={{ marginBottom: 20, color: '#555' }}>
        Isi data lalu klik Download PDF
      </p>

      {/* FORM */}
      <div style={{
        background: 'white',
        padding: 20,
        borderRadius: 10,
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        width: 350,
        marginBottom: 30
      }}>
        <label><b>Nama Pelanggan</b></label>
        <input
          placeholder="Contoh: Budi Santoso"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          style={{ width: '100%', margin: '5px 0 15px', padding: 8 }}
        />

        <label><b>Jumlah KWH</b></label>
        <input
          type="text"
          placeholder="Contoh: 29,80"
          value={kwh}
          onChange={(e) => {
            const value = e.target.value.replace(',', '.')
            setKwh(value)
          }}
          style={{ width: '100%', margin: '5px 0 15px', padding: 8 }}
        />

        <label><b>Tanggal Bayar</b></label>
        <input
          type="datetime-local"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          style={{ width: '100%', margin: '5px 0 15px', padding: 8 }}
        />

        <button
          onClick={handleGenerate}
          style={{
            width: '100%',
            padding: 10,
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer'
          }}
        >
          Download PDF
        </button>
      </div>

      {/* STRUK */}
      <div
        ref={strukRef}
        style={{
          padding: 20,
          fontFamily: 'Courier Prime, monospace',
          background: 'white',
          width: '900px',
          lineHeight: 1.3,
          fontSize: 13
        }}
      >
        <h3 style={{ textAlign: 'center', marginBottom: 15 }}>
          STRUK BUKTI PEMBELIAN PLN PRABAYAR
        </h3>

        <div className="grid4">
          <div>NO METER</div><div>: 32166085228</div>
          <div>TGL BAYAR</div><div>: {formatTanggal(tanggal)}</div>

          <div>NAMA</div><div>: {nama}</div>
          <div>ADMIN BANK</div><div>: Rp {formatRp(admin)}</div>

          <div>TARIF/DAYA</div><div>: R1/</div>
          <div>METERAI</div><div>: Rp 0,00</div>

          <div>MKM REFF</div><div>: {ref}</div>
          <div>PPJ</div><div>: Rp {formatRp(ppj)}</div>
        </div>

        <div className="divider" />

        <div className="grid4">
          <div>RP BAYAR</div><div>: Rp {formatRp(total)}</div>
          <div>ANGSURAN</div><div>: Rp 0,00</div>
        </div>

        <div className="grid-right">
          <div>RP TOKEN</div><div>: Rp {formatRp(tokenRp)}</div>
          <div>JML KWH</div><div>: {formatKwh(kwh)}</div>
        </div>

        <div className="divider" />

        <h2 style={{ textAlign: 'center', marginTop: 10 }}>
          TOKEN : {token}
        </h2>

        <p style={{ textAlign: 'center', marginTop: 10 }}>TERIMA KASIH</p>
        <p style={{ textAlign: 'center', fontSize: 12 }}>
          "Rincian tagihan dapat dilihat di www.pln.co.id atau PLN terdekat"
        </p>
        <p style={{ textAlign: 'center' }}>
          INFORMASI HUB : 123
        </p>
      </div>

      <style jsx>{`
        .grid4 {
          display: grid;
          grid-template-columns: 120px 200px 120px 200px;
          row-gap: 6px;
        }

        .grid-right {
          display: grid;
          grid-template-columns: 120px 200px;
          width: fit-content;
          margin-left: auto;
          row-gap: 6px;
        }

        .divider {
          border-top: 1px solid black;
          margin: 10px 0;
        }
      `}</style>
    </main>
  )
}