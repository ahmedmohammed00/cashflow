import { Smartphone, ShieldAlert } from 'lucide-react';


export function UnauthenticatedMessage() {
    return (
        <div className="flex flex-col items-center justify-center h-[80vh]">
            <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">تسجيل الدخول مطلوب</h2>
            <p className="text-gray-600 mb-4">يرجى تسجيل الدخول للوصول إلى نقطة البيع</p>
        </div>
    );
}

export function MobileUnsupportedMessage() {
    return (
        <div className="md:hidden flex flex-col items-center justify-center h-[calc(100vh-4rem)] text-center p-4">
            <Smartphone className="h-16 w-16 mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">
                واجهة نقاط البيع غير متاحة على الهاتف المحمول
            </h2>
            <p className="text-muted-foreground">
                يرجى استخدام جهاز لوحي أو كمبيوتر مكتبي للوصول إلى هذه الصفحة.
            </p>
        </div>
    );
}