@php
    $money = fn ($value) => '₱'.number_format((float) $value, 2);
    $date = fn ($value) => $value ? \Illuminate\Support\Carbon::parse($value)->format('F d, Y') : '';
@endphp
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Payment received</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Inter', Arial, sans-serif; color: #1e293b;">
    <div style="display: none; max-height: 0; overflow: hidden;">
        Your {{ $planName }} plan is active. Invoice {{ $invoice['number'] }} is attached.
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 32px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
                    <tr>
                        <td style="background: linear-gradient(135deg, #2563eb, #0891b2); background-color: #2563eb; padding: 28px 32px; color: #ffffff;">
                            <p style="margin: 0; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; opacity: 0.85;">{{ $invoice['seller']['name'] }}</p>
                            <h1 style="margin: 8px 0 0; font-size: 22px; line-height: 28px;">Payment received — you're all set!</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 28px 32px 8px;">
                            <p style="margin: 0 0 14px; font-size: 15px; line-height: 22px;">Hi {{ $invoice['buyer']['name'] }},</p>
                            <p style="margin: 0 0 20px; font-size: 15px; line-height: 22px; color: #475569;">
                                Thanks for your payment. Your <strong style="color: #1e293b;">{{ $planName }}</strong> plan is now active.
                                Your invoice is attached to this email as a PDF.
                            </p>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e2e8f0; border-radius: 10px;">
                                <tr>
                                    <td style="padding: 16px 18px; border-bottom: 1px solid #e2e8f0;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="font-size: 12px; color: #64748b;">Invoice</td>
                                                <td align="right" style="font-size: 13px; font-weight: bold;">{{ $invoice['number'] }}</td>
                                            </tr>
                                            <tr>
                                                <td style="font-size: 12px; color: #64748b; padding-top: 6px;">Paid on</td>
                                                <td align="right" style="font-size: 13px; padding-top: 6px;">{{ $date($invoice['paid_at']) }}</td>
                                            </tr>
                                            <tr>
                                                <td style="font-size: 12px; color: #64748b; padding-top: 6px;">Paid via</td>
                                                <td align="right" style="font-size: 13px; padding-top: 6px;">{{ $invoice['payment_method'] }}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                @foreach ($invoice['items'] as $item)
                                    <tr>
                                        <td style="padding: 12px 18px; border-bottom: 1px solid #f1f5f9;">
                                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="font-size: 14px;">
                                                        {{ $item['description'] }}
                                                        @if ($item['detail'])
                                                            <span style="display: block; font-size: 12px; color: #94a3b8;">{{ $item['detail'] }}</span>
                                                        @endif
                                                    </td>
                                                    <td align="right" style="font-size: 14px; white-space: nowrap;">{{ $money($item['amount']) }}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                @endforeach
                                @if ($invoice['tax']['mode'] === 'vat')
                                    <tr>
                                        <td style="padding: 10px 18px 0;">
                                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="font-size: 12px; color: #64748b;">Vatable sales</td>
                                                    <td align="right" style="font-size: 12px; color: #64748b;">{{ $money($invoice['tax']['vatable_sales']) }}</td>
                                                </tr>
                                                <tr>
                                                    <td style="font-size: 12px; color: #64748b; padding-top: 4px;">VAT ({{ round($invoice['tax']['rate'] * 100) }}%, included)</td>
                                                    <td align="right" style="font-size: 12px; color: #64748b; padding-top: 4px;">{{ $money($invoice['tax']['vat_amount']) }}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                @endif
                                <tr>
                                    <td style="padding: 14px 18px 16px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="font-size: 15px; font-weight: bold;">Total paid</td>
                                                <td align="right" style="font-size: 18px; font-weight: bold;">{{ $money($invoice['total']) }}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            @if ($invoice['tax']['mode'] === 'non_vat')
                                <p style="margin: 12px 0 0; font-size: 11px; line-height: 16px; color: #94a3b8;">{{ $invoice['tax']['note'] }}</p>
                            @endif

                            <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 26px 0 10px;">
                                <tr>
                                    <td style="border-radius: 8px; background-color: #2563eb;">
                                        <a href="{{ $dashboardUrl }}" style="display: inline-block; padding: 12px 22px; font-size: 14px; font-weight: bold; color: #ffffff; text-decoration: none;">Go to your dashboard</a>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin: 0 0 24px; font-size: 13px; color: #64748b;">
                                You can also download this invoice anytime from
                                <a href="{{ $billingUrl }}" style="color: #2563eb;">Account &amp; Billing</a>.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 18px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 11px; line-height: 16px; color: #94a3b8;">
                            {{ $invoice['seller']['name'] }} · {{ $invoice['seller']['address'] }}<br>
                            Questions? Contact {{ $invoice['seller']['email'] }}.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
