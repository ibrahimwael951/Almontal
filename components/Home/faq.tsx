"use client";
import { Animate, opacity } from "@/Animate";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import BlurText from "../ui/BlurText";
import { motion } from "motion/react";
import { Button } from "../ui/button";

const faqs = [
  {
    question: "كم تستغرق مدة تصنيع وتسليم المطبخ؟",
    answer:
      "مدة التصنيع تختلف حسب حجم المطبخ ومستوى التخصيص، لكنها غالبًا تتراوح بين 20 إلى 35 يوم عمل من تاريخ تأكيد التصميم والدفعة المقدمة.",
  },
  {
    question: "هل يمكنني تصميم المطبخ حسب مساحتي بالضبط؟",
    answer:
      "بالتأكيد، فريقنا يقوم بمعاينة المكان وأخذ المقاسات بدقة، ثم نصمم لك مطبخًا يناسب مساحتك واحتياجاتك بشكل كامل قبل بدء التصنيع.",
  },
  {
    question: "ما هي الخامات المستخدمة في التصنيع؟",
    answer:
      "نستخدم خامات عالية الجودة مثل الألمونتال المقاوم للرطوبة والخدش، بالإضافة إلى خيارات من الخشب الطبيعي والرخام حسب رغبتك وميزانيتك.",
  },
  {
    question: "هل هناك ضمان على المنتجات؟",
    answer:
      "نعم، جميع منتجاتنا مشمولة بضمان يصل حتى 5 سنوات يغطي عيوب الصناعة والخامات، مع خدمة صيانة سريعة في حال احتجت لها.",
  },
  {
    question: "كيف يتم حساب السعر النهائي؟",
    answer:
      "السعر يعتمد على المساحة، نوع الخامة المختارة، التصميم، والإضافات مثل الإضاءة أو الرخام. نقدم لك عرض سعر تفصيلي ومجاني بعد المعاينة مباشرة.",
  },
  {
    question: "هل تقدمون خدمة التركيب أيضًا؟",
    answer:
      "نعم، فريق التركيب المتخصص لدينا يتولى عملية التركيب بالكامل بعد التصنيع، لضمان أعلى مستوى من الدقة والجودة في التنفيذ.",
  },
  {
    question: "هل يمكن الدفع على دفعات؟",
    answer:
      "نعم، نوفر نظام دفع مرن يبدأ بدفعة مقدمة عند تأكيد التصميم، ويتم تقسيم باقي المبلغ على دفعات تناسبك حتى موعد التسليم.",
  },
  {
    question: "هل تقومون بتنفيذ الحمامات وقطع الأخشاب المخصصة أيضًا؟",
    answer:
      "بالتأكيد، بجانب المطابخ نقدم تصميم وتصنيع وحدات الحمامات وقطع الأخشاب المخصصة مثل الأبواب والأرفف والطاولات بنفس مستوى الجودة.",
  },
  {
    question: "ماذا لو أردت تعديل التصميم بعد البدء في التصنيع؟",
    answer:
      "يفضل تأكيد التصميم النهائي قبل البدء، لكن في حال الحاجة لتعديل بسيط نحاول قدر الإمكان التنسيق معك، مع العلم أن بعض التعديلات قد تؤثر على المدة والسعر.",
  },
  {
    question: "في أي المناطق تقدمون خدماتكم؟",
    answer:
      "نقدم خدماتنا في جميع محافظات مصر، مع إمكانية المعاينة والتركيب حتى في المناطق البعيدة حسب الاتفاق المسبق.",
  },
];

const faq = () => {
  return (
    <section>
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
        <BlurText
          text="الأسئلة الشائعة"
          delay={150}
          animateBy="words"
          direction="top"
          className="font-nastaliq text-7xl font-normal tracking-tight"
        />
        <BlurText
          text="جمعنا لك أكثر الأسئلة التي قد تدور في بالك قبل التعامل معنا"
          delay={50}
          animateBy="words"
          direction="top"
          className="max-w-xl text-xl leading-loose text-foreground/60"
        />
      </div>
      <motion.div
        {...opacity}
        animate={{ ...Animate.animateonly }}
        transition={{ delay: 1, ...Animate.transition }}
        className="mx-auto mt-14 max-w-3xl"
      >
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              dir="rtl"
              key={index}
              value={`item-${index}`}
              className="rounded-xl border border-border/50 bg-background/40 px-6 mb-4 backdrop-blur-sm data-[state=open]:bg-background/60"
            >
              <AccordionTrigger className="text-right text-base font-medium text-foreground/90 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-right text-sm leading-loose text-foreground/60">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>

      <motion.div
        {...opacity}
        animate={{ ...Animate.animateonly }}
        transition={{ delay: 1.4, ...Animate.transition }}
        className="mx-auto mt-16 flex max-w-md flex-col items-center gap-4 text-center"
      >
        <p className="text-foreground/60">
          لم تجد إجابة لسؤالك؟ تواصل معنا مباشرة وسنكون سعداء بمساعدتك
        </p>
        <Button size="lg" link="/contact">
          تواصل معنا
        </Button>
      </motion.div>
    </section>
  );
};

export default faq;
