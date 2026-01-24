"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {paymentApi} from "@/lib/payment";

interface BankTransferFormProps {
    amount: number;
    planType: string;
}

const BANKS = [
    { code: "004", name: "KB국민" },
    { code: "088", name: "신한" },
    { code: "020", name: "우리" },
    { code: "011", name: "NH농협" },
    { code: "003", name: "IBK기업" },
    { code: "081", name: "하나" },
    { code: "090", name: "카카오뱅크" },
    { code: "092", name: "토스뱅크" },
];

export default function BankTransferForm({ amount, planType }: BankTransferFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [bankCode, setBankCode] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [depositorName, setDepositorName] = useState("");

    const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Only digits
        if (value.length <= 14) {
            setAccountNumber(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!bankCode) throw new Error("은행을 선택해주세요.");
            if (accountNumber.length < 10) throw new Error("계좌번호를 올바르게 입력해주세요 (10~14자리).");
            if (!depositorName.trim()) throw new Error("예금주명을 입력해주세요.");

            await paymentApi.requestBankTransfer({
                bankCode,
                accountNumber,
                depositorName,
                amount,
                planType
            });

            alert("계좌이체 요청이 성공적으로 완료되었습니다!");
            router.push("/");

        } catch (err: any) {
            console.error("Bank Transfer Failed:", err);
            setError(err.message || "계좌이체에 실패했습니다.");
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
                <label className="label mb-1.5 block text-sm font-medium text-muted-foreground">은행 선택</label>
                <select
                    className="input w-full"
                    value={bankCode}
                    onChange={(e) => setBankCode(e.target.value)}
                    style={{ height: '2.8rem', fontSize: '0.9rem' }}
                >
                    <option value="">은행을 선택하세요</option>
                    {BANKS.map(bank => (
                        <option key={bank.code} value={bank.code}>{bank.name}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label className="label mb-1.5 block text-sm font-medium text-muted-foreground">계좌 번호</label>
                <input
                    type="text"
                    className="input w-full"
                    placeholder="'-' 없이 숫자만 입력"
                    value={accountNumber}
                    onChange={handleAccountNumberChange}
                    style={{ height: '2.8rem', fontSize: '0.9rem' }}
                />
            </div>

            <div className="form-group">
                <label className="label mb-1.5 block text-sm font-medium text-muted-foreground">예금주 명</label>
                <input
                    type="text"
                    className="input w-full"
                    placeholder="성함을 입력하세요"
                    value={depositorName}
                    onChange={(e) => setDepositorName(e.target.value)}
                    style={{ height: '2.8rem', fontSize: '0.9rem' }}
                />
            </div>

            <button
                type="submit"
                className="btn btn-primary w-full"
                style={{ height: '3rem', marginTop: '1rem', fontSize: '1rem', fontWeight: 600 }}
                disabled={loading}
            >
                {loading ? "처리 중..." : `${amount.toLocaleString()}원 이체하기`}
            </button>
        </form>
    );
}
