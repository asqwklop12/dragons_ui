"use client";

import {useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {paymentApi} from "@/lib/payment";

interface CardPaymentFormProps {
    amount: number;
    planType: string;
}

export default function CardPaymentForm({ amount, planType }: CardPaymentFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [cardParts, setCardParts] = useState(["", "", "", ""]);
    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    const [expiryMonth, setExpiryMonth] = useState("");
    const [expiryYear, setExpiryYear] = useState("");
    const [cvc, setCvc] = useState("");
    const [cardholderName, setCardholderName] = useState("");

    const handleCardPartChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 4) {
            const newParts = [...cardParts];
            newParts[index] = value;
            setCardParts(newParts);

            // Move to next input if 4 digits are entered
            if (value.length === 4 && index < 3) {
                inputRefs[index + 1].current?.focus();
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Move to previous input on backspace if current is empty
        if (e.key === "Backspace" && cardParts[index] === "" && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 3) {
            setCvc(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Validation
            const rawCardNumber = cardParts.join('');
            if (rawCardNumber.length < 16) throw new Error("카드번호 16자리를 모두 입력해주세요.");
            if (!expiryMonth || !expiryYear) throw new Error("유효기간을 입력해주세요.");
            if (cvc.length < 3) throw new Error("CVC 3자리를 입력해주세요.");
            if (!cardholderName.trim()) throw new Error("소유자명을 입력해주세요.");

            await paymentApi.requestCardPayment({
                cardNumber: rawCardNumber,
                expiryMonth: parseInt(expiryMonth, 10),
                expiryYear: parseInt(expiryYear, 10),
                cvc,
                cardholderName,
                amount,
                planType
            });

            alert("결제가 성공적으로 완료되었습니다!");
            router.push("/");

        } catch (err: any) {
            console.error("Card Payment Failed:", err);
            setError(err.message || "카드 결제에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div style={{ backgroundColor: 'hsl(var(--destruct) / 0.1)', color: 'hsl(var(--destruct))', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                    {error}
                </div>
            )}

            <div className="form-group">
                <label className="label mb-1.5 block text-sm font-medium text-muted-foreground">카드 번호</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                    {cardParts.map((part, index) => (
                        <input
                            key={index}
                            ref={inputRefs[index]}
                            type="text"
                            className="input text-center"
                            maxLength={4}
                            placeholder="0000"
                            value={part}
                            onChange={(e) => handleCardPartChange(index, e)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            style={{
                                height: '2.8rem',
                                fontSize: '1rem',
                                letterSpacing: '0.05rem',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: 'var(--radius-md)',
                                background: 'hsl(var(--surface))'
                            }}
                        />
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                    <label className="label mb-1.5 block text-sm font-medium text-muted-foreground">유효기간</label>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <select
                            className="input w-full"
                            value={expiryMonth}
                            onChange={(e) => setExpiryMonth(e.target.value)}
                            style={{ height: '2.8rem', fontSize: '0.9rem' }}
                        >
                            <option value="">월</option>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
                            ))}
                        </select>
                        <select
                            className="input w-full"
                            value={expiryYear}
                            onChange={(e) => setExpiryYear(e.target.value)}
                            style={{ height: '2.8rem', fontSize: '0.9rem' }}
                        >
                            <option value="">년도</option>
                            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="label mb-1.5 block text-sm font-medium text-muted-foreground">CVC</label>
                    <input
                        type="text"
                        className="input w-full text-center"
                        placeholder="123"
                        maxLength={3}
                        value={cvc}
                        onChange={handleCvcChange}
                        style={{ height: '2.8rem', fontSize: '1rem' }}
                    />
                </div>
            </div>

            <div className="form-group">
                <label className="label mb-1.5 block text-sm font-medium text-muted-foreground">카드 소유자명</label>
                <input
                    type="text"
                    className="input w-full"
                    placeholder="WANG GIL DONG"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    style={{ height: '2.8rem', fontSize: '0.9rem' }}
                />
            </div>

            <button
                type="submit"
                className="btn btn-primary w-full"
                style={{ height: '3rem', marginTop: '0.5rem', fontSize: '1rem', fontWeight: 600 }}
                disabled={loading}
            >
                {loading ? "결제 처리 중..." : `${amount.toLocaleString()}원 결제하기`}
            </button>
        </form>
    );
}
