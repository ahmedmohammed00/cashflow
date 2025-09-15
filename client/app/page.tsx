import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, ShoppingCart, Tag, Laptop, PackagePlus, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

function FeatureCard({
                       icon: Icon,
                       title,

                       description,
                       delay = 0
                     }: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay?: number;
}) {
  return (
      <div
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-default"
          style={{ animationDelay: `${delay}ms` }}
      >
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-primary/80 to-primary text-white mb-5">
          <Icon className="w-7 h-7" />
        </div>
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
      </div>
  );
}

export default function HomePage() {
  return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <main className="flex-1">
          {/* Hero Section */}
          <section className="w-full py-24 bg-gradient-to-r from-primary/20 to-primary/10">
            <div className="container max-w-4xl px-6 mx-auto text-right">
              <h1 className="text-5xl font-extrabold leading-tight mb-6 tracking-tight">
                نظام نقاط البيع الأمثل لنمو أعمالك
              </h1>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mb-10 leading-relaxed">
                CashFlow POS هو الحل الشامل لإدارة المبيعات والمخزون والعملاء. ابدأ بسهولة، وقم بالبيع بذكاء، وحقق النمو بشكل أسرع.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <Button asChild size="lg" className="flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <Link href="/pos" className="flex items-center">
                    اذهب إلى نقاط البيع
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="flex items-center justify-center border-gray-300 dark:border-gray-600 hover:border-primary hover:text-primary transition-colors duration-300">
                  <Link href="/admin/dashboard">
                    لوحة تحكم المسؤول
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="w-full py-20">
            <div className="container max-w-7xl px-6 mx-auto">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
                <div className="inline-block rounded-full bg-primary/20 px-4 py-1 text-primary font-semibold text-sm tracking-wide">
                  الميزات الرئيسية
                </div>
                <h2 className="text-4xl font-extrabold tracking-tight max-w-3xl">
                  كل ما تحتاجه في مكان واحد
                </h2>
                <p className="max-w-4xl text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  من إدارة المنتجات إلى تحليل المبيعات، يوفر لك CashFlow POS الأدوات التي تحتاجها للنجاح.
                </p>
              </div>
              <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
                <FeatureCard
                    icon={ShoppingCart}
                    title="إدارة المنتجات والمخزون"
                    description="أضف منتجاتك بسهولة، وتتبع مستويات المخزون، وقم بتنظيمها حسب الفئات لتبسيط عملياتك."
                    delay={300}
                />
                <FeatureCard
                    icon={Tag}
                    title="الكوبونات والعروض الترويجية"
                    description="أنشئ وأدر كوبونات الخصم لزيادة المبيعات ومكافأة عملائك الأوفياء."
                    delay={400}
                />
                <FeatureCard
                    icon={BarChart}
                    title="تحليلات وتقارير قوية"
                    description="احصل على رؤى قيمة حول أداء مبيعاتك ومنتجاتك الأكثر رواجًا من خلال لوحة تحكم سهلة الاستخدام."
                    delay={500}
                />
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="w-full py-20 bg-gradient-to-tr from-primary/10 to-primary/5">
            <div className="container max-w-7xl px-6 mx-auto">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
                <div className="inline-block rounded-full bg-primary/20 px-4 py-1 text-primary font-semibold text-sm tracking-wide">
                  كيف يعمل
                </div>
                <h2 className="text-4xl font-extrabold tracking-tight max-w-3xl">
                  ابدأ في 3 خطوات بسيطة
                </h2>
                <p className="max-w-4xl text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  تم تصميم CashFlow POS ليكون سهل الاستخدام وبديهيًا.
                </p>
              </div>
              <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
                <FeatureCard
                    icon={PackagePlus}
                    title="1. أضف منتجاتك"
                    description="ابدأ بإضافة منتجاتك إلى لوحة التحكم. قم بتنظيمها بالفئات والأسعار."
                    delay={300}
                />
                <FeatureCard
                    icon={Laptop}
                    title="2. ابدأ البيع"
                    description="استخدم واجهة نقاط البيع البديهية لدينا لمعالجة الطلبات بسرعة وكفاءة."
                    delay={400}
                />
                <FeatureCard
                    icon={TrendingUp}
                    title="3. تتبع نموك"
                    description="راقب مبيعاتك وأرباحك في الوقت الفعلي من خلال لوحة التحكم التحليلية."
                    delay={500}
                />
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="w-full py-20">
            <div className="container max-w-4xl px-6 mx-auto text-right">
              <h2 className="text-4xl font-extrabold tracking-tight mb-6">
                أسئلة شائعة
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
                هل لديك أسئلة؟ لدينا إجابات. إذا لم تجد ما تبحث عنه، فلا تتردد في التواصل معنا.
              </p>
              <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="item-1" className="border border-gray-200 dark:border-gray-700 rounded-lg">
                  <AccordionTrigger className="px-5 py-4 text-lg font-semibold hover:text-primary transition-colors">
                    هل CashFlow POS مناسب لعملي الصغير؟
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 text-gray-700 dark:text-gray-300 leading-relaxed">
                    بالتأكيد! تم تصميم CashFlow POS ليناسب الشركات من جميع الأحجام. واجهتنا سهلة الاستخدام وميزاتنا القوية تجعله مثاليًا للشركات الصغيرة التي تتطلع إلى تبسيط عملياتها.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border border-gray-200 dark:border-gray-700 rounded-lg">
                  <AccordionTrigger className="px-5 py-4 text-lg font-semibold hover:text-primary transition-colors">
                    ما هي طرق الدفع التي تدعمونها؟
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 text-gray-700 dark:text-gray-300 leading-relaxed">
                    يدعم نظام نقاط البيع حاليًا مدفوعات البطاقات والنقد. نحن نعمل على إضافة المزيد من خيارات الدفع في المستقبل.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="border border-gray-200 dark:border-gray-700 rounded-lg">
                  <AccordionTrigger className="px-5 py-4 text-lg font-semibold hover:text-primary transition-colors">
                    هل يمكنني تتبع المخزون باستخدام هذا النظام؟
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 text-gray-700 dark:text-gray-300 leading-relaxed">
                    نعم، توفر لوحة تحكم المسؤول لدينا أدوات شاملة لإدارة المنتجات والمخزون. يمكنك إضافة منتجات جديدة وتحديث الكميات وتتبع مستويات المخزون بسهولة.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4" className="border border-gray-200 dark:border-gray-700 rounded-lg">
                  <AccordionTrigger className="px-5 py-4 text-lg font-semibold hover:text-primary transition-colors">
                    هل يوجد تطبيق للهاتف المحمول؟
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 text-gray-700 dark:text-gray-300 leading-relaxed">
                    في الوقت الحالي، تم تحسين واجهة نقاط البيع لدينا للأجهزة اللوحية وأجهزة الكمبيوتر المكتبية. تم تصميم لوحة تحكم المسؤول لتكون متجاوبة مع الأجهزة المحمولة لتتمكن من إدارة عملك أثناء التنقل.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </section>
        </main>

        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center sm:text-left w-full sm:w-auto">
            &copy; {new Date().getFullYear()} CashFlow POS. جميع الحقوق محفوظة.
          </p>
        </footer>
      </div>
  );
}
