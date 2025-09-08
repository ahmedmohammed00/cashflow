
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, ShoppingCart, Tag, Laptop, PackagePlus, TrendingUp } from 'lucide-react';
import Image from 'next/image';
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
      <div className="bg-card p-6 rounded-lg shadow-sm animate-fade-in-up" style={{ animationDelay: `${delay}ms`}}>
        <Icon className="h-10 w-10 text-primary mb-4" />
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
  );
}

export default function HomePage() {
  return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          {/* Hero Section */}
          <section className="w-full py-20 md:py-32 lg:py-40 bg-card">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-center">
                <div className="space-y-4 animate-fade-in-up">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-right">
                    نظام نقاط البيع الأمثل لنمو أعمالك
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl text-right">
                    CashFlow POS هو الحل الشامل لإدارة المبيعات والمخزون والعملاء. ابدأ بسهولة، وقم بالبيع بذكاء، وحقق النمو بشكل أسرع.
                  </p>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row justify-end">
                    <Button asChild size="lg">
                      <Link href="/pos">
                        اذهب إلى نقاط البيع
                        <ArrowRight className="mr-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href="/admin/dashboard">
                        لوحة تحكم المسؤول
                      </Link>
                    </Button>
                  </div>
                </div>
                {/*
                <Image
                    src="https://picsum.photos/800/600"
                    width="800"
                    height="600"
                    alt="Hero"
                    data-ai-hint="business dashboard"
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full animate-fade-in"
                />
                */}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm animate-fade-in">
                    الميزات الرئيسية
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl animate-fade-in-up" style={{ animationDelay: '100ms'}}>
                    كل ما تحتاجه في مكان واحد
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-fade-in-up" style={{ animationDelay: '200ms'}}>
                    من إدارة المنتجات إلى تحليل المبيعات، يوفر لك CashFlow POS الأدوات التي تحتاجها للنجاح.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
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
          <section className="w-full py-12 md:py-24 lg:py-32 bg-card">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm animate-fade-in">
                    كيف يعمل
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl animate-fade-in-up" style={{ animationDelay: '100ms'}}>
                    ابدأ في 3 خطوات بسيطة
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-fade-in-up" style={{ animationDelay: '200ms'}}>
                    تم تصميم CashFlow POS ليكون سهل الاستخدام وبديهيًا.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid items-start gap-8 sm:max-w-4xl md:grid-cols-3 md:gap-12 lg:max-w-5xl">
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
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl animate-fade-in-up">
                    أسئلة شائعة
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-fade-in-up" style={{ animationDelay: '100ms'}}>
                    هل لديك أسئلة؟ لدينا إجابات. إذا لم تجد ما تبحث عنه، فلا تتردد في التواصل معنا.
                  </p>
                </div>
              </div>
              <div className="mx-auto max-w-3xl w-full animate-fade-in-up" style={{ animationDelay: '200ms'}}>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>هل CashFlow POS مناسب لعملي الصغير؟</AccordionTrigger>
                    <AccordionContent>
                      بالتأكيد! تم تصميم CashFlow POS ليناسب الشركات من جميع الأحجام. واجهتنا سهلة الاستخدام وميزاتنا القوية تجعله مثاليًا للشركات الصغيرة التي تتطلع إلى تبسيط عملياتها.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>ما هي طرق الدفع التي تدعمونها؟</AccordionTrigger>
                    <AccordionContent>
                      يدعم نظام نقاط البيع حاليًا مدفوعات البطاقات والنقد. نحن نعمل على إضافة المزيد من خيارات الدفع في المستقبل.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>هل يمكنني تتبع المخزون باستخدام هذا النظام؟</AccordionTrigger>
                    <AccordionContent>
                      نعم، توفر لوحة تحكم المسؤول لدينا أدوات شاملة لإدارة المنتجات والمخزون. يمكنك إضافة منتجات جديدة وتحديث الكميات وتتبع مستويات المخزون بسهولة.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>هل يوجد تطبيق للهاتف المحمول؟</AccordionTrigger>
                    <AccordionContent>
                      في الوقت الحالي، تم تحسين واجهة نقاط البيع لدينا للأجهزة اللوحية وأجهزة الكمبيوتر المكتبية. تم تصميم لوحة تحكم المسؤول لتكون متجاوبة مع الأجهزة المحمولة لتتمكن من إدارة عملك أثناء التنقل.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </section>
        </main>

        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} CashFlow POS. جميع الحقوق محفوظة.
          </p>
        </footer>
      </div>
  );
}
