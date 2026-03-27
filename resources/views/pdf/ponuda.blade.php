<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Ponuda {{ $ponuda->broj_ponude }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
            line-height: 1.4;
            color: #333;
        }
        
        .container {
            padding: 20px 30px;
        }
        
        /* Header / Memorandum */
        .header {
            display: flex;
            justify-content: space-between;
            border-bottom: 3px solid #1e3a5f;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        
        .company-info {
            width: 60%;
        }
        
        .company-name {
            font-size: 16px;
            font-weight: bold;
            color: #1e3a5f;
            margin-bottom: 5px;
        }
        
        .company-details {
            font-size: 10px;
            color: #666;
        }
        
        .company-details p {
            margin: 2px 0;
        }
        
        .document-title {
            text-align: right;
            width: 40%;
        }
        
        .document-title h1 {
            font-size: 24px;
            color: #1e3a5f;
            text-transform: uppercase;
        }
        
        .document-number {
            font-size: 14px;
            color: #666;
            margin-top: 5px;
        }
        
        /* Client Section */
        .client-section {
            margin-bottom: 20px;
        }
        
        .section-title {
            font-size: 12px;
            font-weight: bold;
            color: #1e3a5f;
            margin-bottom: 8px;
            text-transform: uppercase;
        }
        
        .client-info {
            background: #f8f9fa;
            padding: 10px 15px;
            border-left: 3px solid #1e3a5f;
        }
        
        .client-name {
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .client-details p {
            margin: 2px 0;
            font-size: 10px;
            color: #555;
        }
        
        /* Meta Info */
        .meta-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        
        .meta-item {
            text-align: center;
        }
        
        .meta-label {
            font-size: 9px;
            color: #999;
            text-transform: uppercase;
        }
        
        .meta-value {
            font-size: 12px;
            font-weight: bold;
            color: #333;
        }
        
        /* Table */
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        
        .items-table th {
            background: #1e3a5f;
            color: white;
            padding: 10px 8px;
            text-align: left;
            font-size: 10px;
            text-transform: uppercase;
        }
        
        .items-table th.center,
        .items-table td.center {
            text-align: center;
        }
        
        .items-table th.right,
        .items-table td.right {
            text-align: right;
        }
        
        .items-table td {
            padding: 8px;
            border-bottom: 1px solid #e0e0e0;
            font-size: 10px;
        }
        
        .items-table tr:nth-child(even) {
            background: #f8f9fa;
        }
        
        .items-table .rb {
            width: 30px;
        }
        
        .items-table .naziv {
            width: 35%;
        }
        
        .items-table .jm {
            width: 50px;
        }
        
        .items-table .kolicina {
            width: 70px;
        }
        
        .items-table .cena {
            width: 100px;
        }
        
        .items-table .ukupno {
            width: 100px;
        }
        
        /* Totals */
        .totals-section {
            margin-left: auto;
            width: 300px;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .total-row.final {
            background: #1e3a5f;
            color: white;
            padding: 12px 15px;
            margin-top: 10px;
            font-size: 14px;
            font-weight: bold;
        }
        
        .total-label {
            font-weight: bold;
        }
        
        /* Notes */
        .notes-section {
            margin-top: 30px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 5px;
        }
        
        .notes-section h4 {
            font-size: 11px;
            color: #1e3a5f;
            margin-bottom: 8px;
        }
        
        .notes-section p {
            font-size: 10px;
            color: #555;
            margin: 5px 0;
        }
        
        /* PDV Note */
        .pdv-note {
            margin-top: 15px;
            padding: 10px;
            background: #fff3cd;
            border-left: 3px solid #ffc107;
            font-size: 9px;
            color: #856404;
        }
        
        /* Footer */
        .footer {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
        }
        
        .signature-box {
            width: 200px;
            text-align: center;
        }
        
        .signature-line {
            border-top: 1px solid #333;
            margin-top: 50px;
            padding-top: 5px;
            font-size: 9px;
            color: #666;
        }
        
        /* Page Number */
        .page-number {
            position: fixed;
            bottom: 20px;
            right: 30px;
            font-size: 9px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header / Memorandum -->
        <div class="header">
            <div class="company-info">
                <div class="company-name">{{ $company['naziv'] }}</div>
                <div class="company-details">
                    <p>{{ $company['adresa'] }}</p>
                    <p>PIB: {{ $company['pib'] }} | MB: {{ $company['mb'] }}</p>
                    <p>Tekući račun: {{ $company['tekuci_racun'] }}</p>
                    <p>Tel: {{ $company['telefon'] }} | Email: {{ $company['email'] }}</p>
                </div>
            </div>
            <div class="document-title">
                <h1>Ponuda</h1>
                <div class="document-number">Br: {{ $ponuda->broj_ponude }}</div>
            </div>
        </div>
        
        <!-- Client Info -->
        <div class="client-section">
            <div class="section-title">Podaci o klijentu</div>
            <div class="client-info">
                <div class="client-name">{{ $ponuda->klijent->naziv ?? 'N/A' }}</div>
                <div class="client-details">
                    @if($ponuda->klijent)
                        <p>{{ $ponuda->klijent->adresa ?? '' }} {{ $ponuda->klijent->grad ?? '' }}</p>
                        @if($ponuda->klijent->pib)
                            <p>PIB: {{ $ponuda->klijent->pib }} | MB: {{ $ponuda->klijent->maticni_broj ?? 'N/A' }}</p>
                        @endif
                    @endif
                </div>
            </div>
        </div>
        
        <!-- Meta Info -->
        <table style="width: 100%; margin-bottom: 20px;">
            <tr>
                <td style="text-align: center; width: 25%;">
                    <div class="meta-label">Datum ponude</div>
                    <div class="meta-value">{{ $ponuda->datum_ponude->format('d.m.Y.') }}</div>
                </td>
                <td style="text-align: center; width: 25%;">
                    <div class="meta-label">Rok važenja</div>
                    <div class="meta-value">{{ $ponuda->datum_vazenja ? $ponuda->datum_vazenja->format('d.m.Y.') : '15 dana' }}</div>
                </td>
                <td style="text-align: center; width: 25%;">
                    <div class="meta-label">Rok isporuke</div>
                    <div class="meta-value">{{ $ponuda->rok_isporuke ?? 'Po dogovoru' }}</div>
                </td>
                <td style="text-align: center; width: 25%;">
                    <div class="meta-label">Način plaćanja</div>
                    <div class="meta-value">{{ $ponuda->nacin_placanja ?? 'Po dogovoru' }}</div>
                </td>
            </tr>
        </table>
        
        <!-- Items Table -->
        <table class="items-table">
            <thead>
                <tr>
                    <th class="rb center">R.B.</th>
                    <th class="naziv">Naziv usluge</th>
                    <th class="jm center">J.M.</th>
                    <th class="kolicina center">Količina</th>
                    <th class="cena right">Cena po J.M.</th>
                    <th class="ukupno right">Ukupno</th>
                </tr>
            </thead>
            <tbody>
                @foreach($ponuda->stavke as $index => $stavka)
                <tr>
                    <td class="center">{{ $index + 1 }}</td>
                    <td>
                        {{ $stavka->naziv_usluge }}
                        @if($stavka->opis)
                            <br><small style="color: #666;">{{ $stavka->opis }}</small>
                        @endif
                    </td>
                    <td class="center">{{ $stavka->jedinica_mere }}</td>
                    <td class="center">{{ number_format($stavka->kolicina, 2, ',', '.') }}</td>
                    <td class="right">{{ number_format($stavka->cena_po_jm, 2, ',', '.') }} RSD</td>
                    <td class="right">{{ number_format($stavka->ukupna_cena_stavke, 2, ',', '.') }} RSD</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        
        <!-- Totals -->
        <div class="totals-section">
            <div class="total-row final">
                <span class="total-label">UKUPNO:</span>
                <span>{{ number_format($ponuda->ukupna_cena, 2, ',', '.') }} RSD</span>
            </div>
        </div>
        
        <!-- PDV Note -->
        @if($ponuda->napomena_pdv)
        <div class="pdv-note">
            {{ $ponuda->napomena_pdv }}
        </div>
        @endif
        
        <!-- Notes -->
        @if($ponuda->napomena)
        <div class="notes-section">
            <h4>Napomena:</h4>
            <p>{{ $ponuda->napomena }}</p>
        </div>
        @endif
        
        <!-- Footer / Signatures -->
        <div class="footer">
            <div class="signature-box">
                <div class="signature-line">Potpis klijenta</div>
            </div>
            <div class="signature-box">
                <div class="signature-line">Ponudu izdao: {{ $company['naziv'] }}</div>
            </div>
        </div>
    </div>
    
    <div class="page-number">
        Strana 1 od 1
    </div>
</body>
</html>

