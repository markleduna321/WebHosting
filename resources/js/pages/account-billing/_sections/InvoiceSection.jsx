import React from "react";

export default function InvoiceSection() {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      {/* Invoice Paper */}
      <div
        id="invoice"
        className="mx-auto w-full max-w-[850px] bg-white px-10 py-12 text-gray-900 shadow-sm"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-200 pb-8">
          {/* Company */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              <img
                src="/images/logo 3.png"
                alt="AsuraTech Solutions"
                className="h-12 w-12 object-contain"
              />

              <div>
                <h2 className="text-lg font-semibold tracking-tight">
                  CALEHO Solutions
                </h2>

                <p className="mt-1 text-[11px] leading-4 text-gray-500">
                  Lot 39, Garnet St. South Villa 3, Palampas
                  <br />
                  San Carlos City, Negros Occidental
                  <br />
                  Phone: +63 906-683-0934
                </p>
              </div>
            </div>
          </div>

          {/* Invoice Label */}
          <div className="text-right">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400">
              Invoice
            </p>

            <p className="mt-2 text-sm font-medium text-gray-700">
              INV-2025-08
            </p>
          </div>
        </div>

        {/* Invoice Information */}
        <div className="grid grid-cols-2 gap-10 py-8">
          {/* Bill To */}
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
              Bill To
            </p>

            <p className="text-sm font-medium">Wacky Hojilla</p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Brgy. 1, San Carlos City Neg.Occ
              <br />
              Any City, ST 12345
            </p>
          </div>

          {/* Date */}
          <div className="text-right">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
              Issue Date
            </p>

            <p className="text-sm font-medium">August 01, 2026</p>
          </div>
        </div>

        {/* Items */}
        <div>
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_130px_130px] border-y border-gray-200 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
            <span>Description</span>
            <span className="text-right">Price</span>
            <span className="text-right">Amount</span>
          </div>

          {/* Item */}
          <div className="grid grid-cols-[1fr_130px_130px] border-b border-gray-100 py-5 text-sm">
            <span className="text-gray-700">Student Pro</span>

            <span className="text-right text-gray-600">
              ₱ 199
            </span>

            <span className="text-right font-medium">
              ₱ 199
            </span>
          </div>
        </div>

        {/* Summary */}
        <div className="flex justify-end py-8">
          <div className="w-[260px]">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <span className="text-xs text-gray-500">Subtotal</span>
              <span className="text-sm">₱ 199</span>
            </div>

            <div className="flex items-center justify-between pt-5">
              <span className="text-sm font-semibold">Total</span>

              <span className="text-xl font-semibold tracking-tight">
                ₱ 199
              </span>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="grid grid-cols-2 gap-10 border-t border-gray-200 pt-8">
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
              Payment Information
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex gap-4">
                <span className="w-24 text-gray-400">Bank Name</span>
                <span className="font-medium">GCash</span>
              </div>

              <div className="flex gap-4">
                <span className="w-24 text-gray-400">Account</span>
                <span className="font-medium">********678</span>
              </div>
            </div>
          </div>

          {/* Thank You */}
          <div className="text-right">
            <p className="text-xs leading-5 text-gray-500">
              Thank you for choosing
              <br />
              <span className="font-medium text-gray-700">
                CALEHO Solutions.
              </span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 border-t border-gray-200 pt-5 text-center">
          <p className="text-[10px] text-gray-400">
            If you have any questions, please contact us at
            <span className="ml-1 text-gray-500">
              calehosolutions.com
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}