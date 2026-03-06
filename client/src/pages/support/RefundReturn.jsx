import React from 'react';

export default function RefundReturn() {
    return (
        <div className="bg-[#f1f3f6] min-h-screen py-8 md:py-12">
            <div className="max-w-[1000px] mx-auto bg-white p-6 md:p-10 rounded-lg shadow-sm border border-gray-100">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 border-b pb-4">Return & Refund Policy</h1>

                <div className="space-y-8 text-gray-700 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">Return Window</h2>
                        <p>
                            Customers can request a return within <strong>7 days of delivery</strong>. We accept returns primarily if the product received is defective, damaged during transit, or significantly different from what was described.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">Product Conditions for Return</h2>
                        <ul className="list-disc list-inside space-y-2 ml-2">
                            <li>The item must be unused, unwashed, and in its original retail condition.</li>
                            <li>All accompanying tags, warranty cards, manuals, and accessories must be intact and returned together.</li>
                            <li>The original packaging box must not be tampered with or extensively damaged.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">Non-Returnable Items</h2>
                        <p>Please note that the following categories are strictly non-returnable unless received with a manufacturing defect:</p>
                        <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
                            <li>Personal hygiene products</li>
                            <li>Customized or built-to-order furniture</li>
                            <li>Items explicitly marked as 'Non-Returnable' on the product details page</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">Replacement Policy</h2>
                        <p>If an exact replacement is available in our inventory, a replacement will be issued instead of a refund for defective items. If the stock is unavailable, a full refund will be processed.</p>
                    </section>

                    <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">Refund Process</h2>
                        <p className="mb-2">Once your returned item is received and undergoes a quality inspection, we will notify you of the approval or rejection of your refund prompt.</p>
                        <p>Approved refunds are processed back to the original method of online payment or to your provided bank account (for COD orders) within <strong>5 to 7 business days</strong>.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
