<?php

namespace App\Services;

class PaymentMethodRegistry
{
    public const QRPH = 'qrph';
    public const CARD = 'card';
    public const GCASH = 'gcash';
    public const MAYA = 'paymaya';
    public const GRABPAY = 'grab_pay';

    /**
     * Ids match PayMongo's payment method types so they can be passed through as-is.
     *
     * @var array<string, array{label: string, description: string, group: string, config: string|null}>
     */
    private const METHODS = [
        self::QRPH => [
            'label' => 'QR Ph',
            'description' => 'Scan with any bank or e-wallet app',
            'group' => 'qr',
            'config' => null,
        ],
        self::CARD => [
            'label' => 'Debit / Credit card',
            'description' => 'Visa · Mastercard',
            'group' => 'card',
            'config' => 'card',
        ],
        self::GCASH => [
            'label' => 'GCash',
            'description' => 'Pay from your GCash wallet',
            'group' => 'ewallet',
            'config' => 'gcash',
        ],
        self::MAYA => [
            'label' => 'Maya',
            'description' => 'Pay from your Maya wallet',
            'group' => 'ewallet',
            'config' => 'maya',
        ],
        self::GRABPAY => [
            'label' => 'GrabPay',
            'description' => 'Pay from your GrabPay wallet',
            'group' => 'ewallet',
            'config' => 'grabpay',
        ],
    ];

    /**
     * @return array<int, array{id: string, label: string, description: string, group: string, enabled: bool}>
     */
    public function all(): array
    {
        $methods = [];

        foreach (self::METHODS as $id => $method) {
            $methods[] = [
                'id' => $id,
                'label' => $method['label'],
                'description' => $method['description'],
                'group' => $method['group'],
                'enabled' => $this->isEnabled($id),
            ];
        }

        return $methods;
    }

    /**
     * @return array<int, string>
     */
    public function ids(): array
    {
        return array_keys(self::METHODS);
    }

    public function label(string $id): string
    {
        return self::METHODS[$id]['label'] ?? $id;
    }

    /**
     * @return array<int, string>
     */
    public function enabledIds(): array
    {
        return array_values(array_filter($this->ids(), fn (string $id) => $this->isEnabled($id)));
    }

    public function isEnabled(string $id): bool
    {
        if (! isset(self::METHODS[$id])) {
            return false;
        }

        $key = self::METHODS[$id]['config'];

        return $key === null || (bool) config("services.paymongo.methods.{$key}", false);
    }
}
