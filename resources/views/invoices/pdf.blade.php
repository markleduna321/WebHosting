@php
    $money = fn ($value) => 'PHP '.number_format((float) $value, 2);
    $date = fn ($value) => $value ? \Illuminate\Support\Carbon::parse($value)->format('F d, Y') : '—';
@endphp
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $invoice['number'] }}</title>
    <style>
        * { box-sizing: border-box; }
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 11px; color: #1e293b; margin: 0; }
        .page { padding: 36px 40px; }
        table { width: 100%; border-collapse: collapse; }
        .muted { color: #64748b; }
        .label { font-size: 8px; letter-spacing: 1.5px; text-transform: uppercase; color: #94a3b8; font-weight: bold; }
        .right { text-align: right; }
        .header td { vertical-align: top; }
        .items th { font-size: 8px; letter-spacing: 1px; text-transform: uppercase; color: #94a3b8; text-align: left; padding: 8px 0; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; }
        .items td { padding: 10px 0; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
        .totals td { padding: 5px 0; }
        .grand td { border-top: 1px solid #cbd5e1; padding-top: 10px; font-size: 14px; font-weight: bold; }
        .paid { display: inline-block; padding: 3px 10px; border-radius: 10px; background: #dcfce7; color: #15803d; font-weight: bold; font-size: 9px; }
        .note { margin-top: 14px; padding: 8px 10px; background: #f8fafc; border: 1px solid #e2e8f0; font-size: 9px; color: #475569; }
    </style>
</head>
<body>
<div class="page">
    <table class="header">
        <tr>
            <td style="width: 60%;">
                <table>
                    <tr>
                        @if ($logo)
                            <td style="width: 56px;"><img src="{{ $logo }}" alt="" style="width: 48px;"></td>
                        @endif
                        <td>
                            <div style="font-size: 15px; font-weight: bold;">{{ $invoice['seller']['name'] }}</div>
                            <div class="muted" style="font-size: 9px; line-height: 13px; margin-top: 3px;">
                                {{ $invoice['seller']['address'] }}<br>
                                Phone: {{ $invoice['seller']['phone'] }} · {{ $invoice['seller']['email'] }}
                                @if ($invoice['seller']['tin'])
                                    <br>TIN: {{ $invoice['seller']['tin'] }}
                                @endif
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
            <td class="right">
                <div class="label">Invoice</div>
                <div style="font-size: 14px; font-weight: bold; margin-top: 4px;">{{ $invoice['number'] }}</div>
                <div style="margin-top: 8px;"><span class="paid">PAID</span></div>
            </td>
        </tr>
    </table>

    <table style="margin-top: 26px;">
        <tr>
            <td style="width: 50%; vertical-align: top;">
                <div class="label">Bill to</div>
                <div style="font-weight: bold; margin-top: 5px;">{{ $invoice['buyer']['name'] }}</div>
                <div class="muted">{{ $invoice['buyer']['email'] }}</div>
            </td>
            <td class="right" style="vertical-align: top;">
                <div class="label">Issue date</div>
                <div style="margin-top: 5px;">{{ $date($invoice['issued_at']) }}</div>
                <div class="label" style="margin-top: 10px;">Paid via</div>
                <div style="margin-top: 5px;">{{ $invoice['payment_method'] }} · {{ $date($invoice['paid_at']) }}</div>
            </td>
        </tr>
    </table>

    <table class="items" style="margin-top: 26px;">
        <thead>
            <tr>
                <th>Description</th>
                <th class="right" style="width: 50px;">Qty</th>
                <th class="right" style="width: 100px;">Unit price</th>
                <th class="right" style="width: 100px;">Amount</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($invoice['items'] as $item)
                <tr>
                    <td>
                        <div style="font-weight: bold;">{{ $item['description'] }}</div>
                        @if ($item['detail'])
                            <div class="muted" style="font-size: 9px;">{{ $item['detail'] }}</div>
                        @endif
                    </td>
                    <td class="right">{{ $item['quantity'] }}</td>
                    <td class="right">{{ $money($item['unit_amount']) }}</td>
                    <td class="right">{{ $money($item['amount']) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <table style="margin-top: 14px;">
        <tr>
            <td style="width: 55%;"></td>
            <td>
                <table class="totals">
                    <tr>
                        <td class="muted">Subtotal</td>
                        <td class="right">{{ $money($invoice['subtotal']) }}</td>
                    </tr>
                    @if ($invoice['tax']['mode'] === 'vat')
                        <tr>
                            <td class="muted">Vatable sales</td>
                            <td class="right">{{ $money($invoice['tax']['vatable_sales']) }}</td>
                        </tr>
                        <tr>
                            <td class="muted">VAT ({{ rtrim(rtrim(number_format($invoice['tax']['rate'] * 100, 2), '0'), '.') }}%, included)</td>
                            <td class="right">{{ $money($invoice['tax']['vat_amount']) }}</td>
                        </tr>
                    @endif
                    <tr class="grand">
                        <td>Total paid</td>
                        <td class="right">{{ $money($invoice['total']) }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    @if ($invoice['tax']['mode'] === 'non_vat')
        <div class="note">{{ $invoice['tax']['note'] }}</div>
    @endif

    <div style="margin-top: 40px; padding-top: 12px; border-top: 1px solid #e2e8f0; text-align: center;" class="muted">
        Thank you for choosing {{ $invoice['seller']['name'] }}. Questions? Contact {{ $invoice['seller']['email'] }}.
    </div>
</div>
</body>
</html>
