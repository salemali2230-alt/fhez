
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

// --- BUNDLED FROM types.ts ---
interface ExplanationContent {
  type: 'heading' | 'paragraph' | 'image' | 'list';
  content: string | string[];
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

interface MatchingGameItem {
  id: number;
  term: string;
  definition: string;
}

interface Chapter {
  id: number;
  title: string;
  explanation: ExplanationContent[];
  experiments: {
    id: number;
    title: string;
    description: string;
  }[];
  games: {
    quiz: QuizQuestion[];
    matching: MatchingGameItem[];
  };
}

type TabKey = 'explanation' | 'experiments' | 'games';


// --- BUNDLED FROM constants.ts ---
const chapters: Chapter[] = [
  {
    id: 1,
    title: 'الفصل الأول: الكهربائية الساكنة',
    explanation: [
      { type: 'heading', content: 'ما هي الكهربائية الساكنة؟' },
      { type: 'paragraph', content: 'هي ظاهرة تراكم الشحنات الكهربائية على أسطح الأجسام نتيجة للاحتكاك أو طرق أخرى. من الأمثلة الشائعة جذب قصاصات الورق الصغيرة بمشط بلاستيكي بعد دلكه بالشعر، أو التصاق بالون بالجدار بعد حكه بالصوف.' },
      { type: 'image', content: 'https://picsum.photos/600/300?random=1' },
      { type: 'heading', content: 'الشحنة الكهربائية' },
      { type: 'list', content: [
        'تتكون الذرة من إلكترونات سالبة الشحنة (-e)، بروتونات موجبة الشحنة (+p)، ونيوترونات متعادلة.',
        'الجسم المشحون بشحنة موجبة هو الذي فقد بعض من إلكتروناته، فأصبح عدد البروتونات أكبر.',
        'الجسم المشحون بشحنة سالبة هو الذي اكتسب إلكترونات إضافية، فأصبح عدد الإلكترونات أكبر.',
        'الشحنات المتشابهة تتنافر (موجب مع موجب)، والشحنات المختلفة تتجاذب (موجب مع سالب).'
      ]},
      { type: 'heading', content: 'طرق شحن الأجسام' },
      { type: 'list', content: [
        'الشحن بالدلك (الاحتكاك): مثل دلك ساق من الزجاج بالحرير، حيث تنتقل الإلكترونات من الزجاج إلى الحرير.',
        'الشحن بالتماس (التوصيل): ملامسة جسم مشحون لجسم آخر متعادل، فتنتقل إليه بعض الشحنات.',
        'الشحن بالحث (التأثير): تقريب جسم مشحون من موصل معزول دون ملامسته، مما يسبب إعادة توزيع شحنات الموصل.'
      ]},
      { type: 'image', content: 'https://picsum.photos/600/300?random=2' },
      { type: 'heading', content: 'الكشاف الكهربائي (Electroscope)'},
      { type: 'paragraph', content: 'جهاز يُستخدم للكشف عن وجود شحنة كهربائية على جسم ما ولمعرفة نوع الشحنة. يتكون من قرص معدني متصل بساق معدنية تنتهي بورقتين رقيقتين. عند ملامسة جسم مشحون للقرص، تنفرج الورقتان نتيجة تنافرهما لاكتسابهما نفس نوع الشحنة.'},
      { type: 'heading', content: 'الموصلات والعوازل' },
      { type: 'paragraph', content: 'الموصلات هي مواد تسمح للشحنات الكهربائية بالحركة خلالها بسهولة، مثل الفلزات (النحاس، الذهب، الألمونيوم). أما العوازل فهي مواد تقاوم حركة الشحنات خلالها، مثل الزجاج، البلاستيك، والخشب الجاف.' },
      { type: 'heading', content: 'أشباه الموصلات' },
      { type: 'paragraph', content: 'هي مواد لها خواص كهربائية بين الموصلات والعوازل، مثل السيليكون والجرمانيوم. يمكن التحكم في توصيلها للكهرباء، مما يجعلها أساس صناعة الإلكترونيات الحديثة مثل الترانزستورات والدوائر المتكاملة.'},
      { type: 'heading', content: 'قانون كولوم' },
      { type: 'paragraph', content: 'يصف هذا القانون القوة الكهربائية بين شحنتين. وتنص على أن القوة تتناسب طردياً مع حاصل ضرب مقدار الشحنتين، وعكسياً مع مربع المسافة بينهما. القوة تكون تجاذبية إذا كانت الشحنتان مختلفتين، وتنافرية إذا كانتا متشابهتين.' },
      { type: 'image', content: 'https://picsum.photos/600/300?random=3' },
      { type: 'heading', content: 'المجال الكهربائي' },
      { type: 'paragraph', content: 'هو الحيز المحيط بالشحنة الكهربائية والذي تظهر فيه آثار قوتها الكهربائية على أي شحنة أخرى تدخل هذا الحيز. يمكن تمثيله بخطوط وهمية تسمى خطوط المجال الكهربائي التي تخرج من الشحنة الموجبة وتدخل في الشحنة السالبة.'},
      { type: 'image', content: 'https://picsum.photos/600/300?random=4' },
      { type: 'heading', content: 'المكثفات الكهربائية' },
      { type: 'paragraph', content: 'المكثف هو جهاز يستخدم لتخزين الشحنة الكهربائية والطاقة. يتكون في أبسط أشكاله من لوحين موصلين متوازيين بينهما مادة عازلة. عند توصيله بمصدر جهد، يتراكم على أحد اللوحين شحنة موجبة وعلى الآخر شحنة سالبة مساوية لها في المقدار.' },
      { type: 'image', content: 'https://picsum.photos/600/300?random=5' },
      { type: 'heading', content: 'البرق: تفريغ كهربائي هائل' },
      { type: 'paragraph', content: 'يحدث البرق نتيجة تراكم شحنات هائلة في السحب بسبب احتكاك جزيئات الماء والجليد. عندما يصبح فرق الجهد كبيراً جداً بين سحابتين أو بين سحابة والأرض، يحدث تفريغ كهربائي على شكل شرارة ضخمة هي البرق.' },
      { type: 'heading', content: 'تطبيقات الكهربائية الساكنة' },
      { type: 'list', content: [
          'آلات التصوير (الفوتوكوبي): تستخدم شحنات ساكنة لجذب مسحوق الحبر إلى الورق.',
          'رش الدهان: يتم شحن قطرات الدهان بشحنة والجسم المراد طلاؤه بشحنة معاكسة لضمان التصاق جيد وتوزيع متساوٍ.',
          'مرشحات الهواء: تستخدم شحن جزيئات الغبار لترسيبها على صفائح مشحونة وإزالتها من الهواء.'
      ]},
      { type: 'heading', content: 'مخاطر الكهربائية الساكنة' },
      { type: 'paragraph', content: 'يمكن أن يكون التفريغ الكهربائي للكهرباء الساكنة خطيراً جداً. شرارة صغيرة قد تسبب اشتعال مواد قابلة للاشتعال مثل البنزين أو الغازات الصناعية. لذلك، يتم اتخاذ إجراءات وقائية مثل تأريض المركبات التي تنقل الوقود.'},
      { type: 'heading', content: 'قارورة ليدن (Leyden Jar)' },
      { type: 'paragraph', content: 'تعتبر من أقدم أشكال المكثفات الكهربائية، وهي جهاز بسيط كان يستخدم في التجارب الأولى لتخزين الشحنات الكهربائية الساكنة. ساعدت العلماء الأوائل على فهم طبيعة الكهرباء.' },
      { type: 'heading', content: 'الفرق بين الكهرباء الساكنة والتيارية' },
      { type: 'paragraph', content: 'الكهرباء الساكنة هي تراكم للشحنات في مكان ما، بينما الكهرباء التيارية هي سريان أو تدفق مستمر للشحنات عبر موصل، مثل التيار الذي يسري في أسلاك المنازل لتشغيل الأجهزة.'},
      { type: 'heading', content: 'مبدأ حفظ الشحنة' },
      { type: 'paragraph', content: 'ينص هذا المبدأ الأساسي على أن الشحنة الكهربائية لا تفنى ولا تستحدث من العدم، ولكن يمكن نقلها من جسم لآخر. في أي عملية في نظام معزول، يبقى المجموع الكلي للشحنات ثابتاً.' }
    ],
    experiments: [
      { id: 1, title: 'تجربة البالون وقصاصات الورق', description: 'قم بدلك البالون بقطعة صوف ثم قربه من قصاصات الورق ولاحظ ما يحدث.'},
      { id: 2, title: 'محاكاة الكشاف الكهربائي', description: 'قرّب ساقاً مشحونة من قرص الكشاف الكهربائي ولاحظ انفراج ورقتيه.'},
      { id: 3, title: 'تجربة الشحن بالحث', description: 'استخدم الساق المشحونة لشحن الكرة المعدنية بالحث. اتبع الخطوات لفصل الشحنات وترك الكرة بشحنة صافية.' },
      { id: 4, title: 'محاكاة قانون كولوم', description: 'تحكم في مقدار الشحنات والمسافة بينها ولاحظ كيف تتغير القوة الكهربائية.' },
    ],
    games: {
      quiz: [
        {
          question: 'الذرة المتعادلة هي ذرة:',
          options: ['لا تحمل مكوناتها أية شحنة', 'عدد إلكتروناتها يساوي عدد بروتوناتها', 'عدد إلكتروناتها أكبر من عدد بروتوناتها', 'عدد إلكتروناتها يساوي عدد نيوتروناتها'],
          correctAnswerIndex: 1
        },
        {
          question: 'يصير الجسم مشحوناً بشحنة موجبة إذا كانت بعض ذراته تمتلك:',
          options: ['عدد من الإلكترونات أكبر من عدد البروتونات', 'عدد من الإلكترونات أقل من عدد البروتونات', 'عدد من النيوترونات أكبر من عدد الإلكترونات'],
          correctAnswerIndex: 1
        },
        {
          question: 'عند تقريب جسم مشحون بشحنة سالبة من قرص كشاف كهربائي متصل بالأرض:',
          options: ['تنفرج ورقتا الكشاف لظهور شحنة سالبة عليهما', 'تنفرج ورقتا الكشاف لظهور شحنة موجبة عليهما', 'تبقى ورقتا الكشاف على انطباقهما', 'تتقارب الورقتان أكثر'],
          correctAnswerIndex: 2
        },
        {
          question: 'الشحنات الكهربائية المختلفة:',
          options: ['تتنافر مع بعضها', 'تتجاذب مع بعضها', 'لا تتفاعل مع بعضها', 'تتلاشى عند التقاءها'],
          correctAnswerIndex: 1
        },
        {
          question: 'أي من المواد التالية يعتبر عازلاً جيداً للكهرباء؟',
          options: ['النحاس', 'الزجاج', 'الألمونيوم', 'الماء المالح'],
          correctAnswerIndex: 1
        },
        {
          question: 'عملية شحن جسم متعادل عن طريق ملامسته لجسم آخر مشحون تسمى:',
          options: ['الشحن بالدلك', 'الشحن بالحث', 'الشحن بالتماس', 'التأريض'],
          correctAnswerIndex: 2
        },
        {
          question: 'حسب قانون كولوم، إذا تضاعفت المسافة بين شحنتين، فإن القوة الكهربائية بينهما:',
          options: ['تتضاعف مرتين', 'تقل إلى النصف', 'تقل إلى الربع', 'لا تتغير'],
          correctAnswerIndex: 2
        },
        {
          question: 'ما هو الجهاز المستخدم للكشف عن الشحنات الكهربائية؟',
          options: ['الأميتر', 'الفولتميتر', 'الكشاف الكهربائي', 'الأومميتر'],
          correctAnswerIndex: 2
        },
        {
          question: 'البرق هو مثال على ظاهرة:',
          options: ['المجال المغناطيسي', 'التيار المستمر', 'التفريغ الكهربائي', 'الرنين الصوتي'],
          correctAnswerIndex: 2
        },
        {
          question: 'في الشحن بالحث، الشحنة التي يكتسبها الجسم الموصل تكون:',
          options: ['مماثلة لشحنة الجسم المؤثر', 'مخالفة لشحنة الجسم المؤثر', 'متعادلة دائماً', 'تعتمد على حجم الجسم'],
          correctAnswerIndex: 1
        },
        {
          question: 'أي المواد التالية يعتبر موصلاً جيداً للكهرباء؟',
          options: ['البلاستيك', 'الخشب الجاف', 'الفضة', 'المطاط'],
          correctAnswerIndex: 2
        },
        {
          question: 'مبدأ حفظ الشحنة ينص على أن الشحنة:',
          options: ['يمكن أن تفنى', 'لا تفنى ولا تستحدث', 'تتكون فقط في الموصلات', 'تزداد مع مرور الوقت'],
          correctAnswerIndex: 1
        },
        {
          question: 'عند دلك ساق من البلاستيك بالصوف، فإن ساق البلاستيك تكتسب شحنة:',
          options: ['موجبة', 'سالبة', 'متعادلة', 'لا يمكن تحديدها'],
          correctAnswerIndex: 1
        },
        {
          question: 'الحيز المحيط بالشحنة والذي تظهر فيه آثار قوتها الكهربائية يسمى:',
          options: ['الجهد الكهربائي', 'التيار الكهربائي', 'المجال الكهربائي', 'المقاومة الكهربائية'],
          correctAnswerIndex: 2
        },
        {
          question: 'عندما يكتسب جسم إلكترونات، فإنه يصبح:',
          options: ['أثقل وزناً', 'ذا شحنة موجبة', 'ذا شحنة سالبة', 'متعادلاً'],
          correctAnswerIndex: 2
        },
        {
          question: 'تستخدم الكهرباء الساكنة في أي من التطبيقات التالية؟',
          options: ['تشغيل المحركات', 'آلات التصوير', 'الإضاءة المنزلية', 'التدفئة'],
          correctAnswerIndex: 1
        },
        {
          question: 'ماذا يحدث لورقتي الكشاف الكهربائي عند تقريب جسم مشحون منه دون ملامسته؟',
          options: ['لا يحدث شيء', 'تنطبقان على بعضهما', 'تنفرجان', 'تتجاذبان'],
          correctAnswerIndex: 2
        },
        {
          question: 'وحدة قياس الشحنة الكهربائية هي:',
          options: ['الأمبير', 'الفولت', 'الأوم', 'الكولوم'],
          correctAnswerIndex: 3
        },
        {
          question: 'لماذا يتم تأريض شاحنات نقل الوقود؟',
          options: ['لزيادة سرعتها', 'لتفريغ الشحنات الساكنة المتكونة بأمان', 'لشحن بطاريتها', 'لتحسين مظهرها'],
          correctAnswerIndex: 1
        },
        {
          question: 'شحنة الإلكترون هي:',
          options: ['موجبة', 'سالبة', 'متعادلة', 'متغيرة'],
          correctAnswerIndex: 1
        },
        {
          question: 'إذا كان لديك جسمان مشحونان بنفس نوع الشحنة، فإنهما:',
          options: ['يتجاذبان', 'يتنافران', 'لا يؤثران على بعضهما', 'يدوران حول بعضهما'],
          correctAnswerIndex: 1
        },
        {
          question: 'السيليكون يعتبر من:',
          options: ['الموصلات الفائقة', 'العوازل التامة', 'أشباه الموصلات', 'الغازات النبيلة'],
          correctAnswerIndex: 2
        },
        {
          question: 'عندما يفقد جسم متعادل إلكتروناً واحداً، فإن شحنته النهائية تكون:',
          options: ['متعادلة', 'سالبة بمقدار شحنة إلكترونين', 'موجبة بمقدار شحنة بروتون واحد', 'موجبة بمقدار شحنة إلكترونين'],
          correctAnswerIndex: 2
        },
        {
          question: 'في عملية الشحن بالحث، ماذا يحدث عند تأريض الموصل القريب من الجسم المشحون؟',
          options: ['تنتقل الشحنات من الجسم المشحون إلى الموصل', 'تتسرب الشحنات المقيدة إلى الأرض', 'تتسرب الشحنات الحرة إلى الأرض', 'لا يحدث شيء'],
          correctAnswerIndex: 2
        },
        {
          question: 'أي مما يلي ليس من طرق الشحن الكهربائي؟',
          options: ['الدلك', 'التوصيل', 'الحث', 'التسخين'],
          correctAnswerIndex: 3
        },
        {
          question: 'إذا زادت شحنة أحد جسمين إلى الضعف، فإن القوة الكهربائية بينهما:',
          options: ['تقل إلى النصف', 'تزداد إلى الضعف', 'تزداد أربع مرات', 'تبقى ثابتة'],
          correctAnswerIndex: 1
        },
        {
          question: 'تنجذب قصاصات الورق المتعادلة إلى مسطرة مشحونة بسبب:',
          options: ['قوة الجاذبية', 'الاستقطاب', 'المغناطيسية', 'التيار الكهربائي'],
          correctAnswerIndex: 1
        },
        {
          question: 'جهاز "قارورة ليدن" يستخدم لـ:',
          options: ['توليد الكهرباء', 'قياس التيار', 'تخزين الشحنات الكهربائية', 'قياس المقاومة'],
          correctAnswerIndex: 2
        },
        {
          question: 'التدفق المستمر للشحنات الكهربائية في موصل يسمى:',
          options: ['كهرباء ساكنة', 'جهد كهربائي', 'تيار كهربائي', 'مجال كهربائي'],
          correctAnswerIndex: 2
        },
        {
          question: 'عندما تلمس مقبض باب معدني وتشعر بصدمة خفيفة، يكون السبب هو:',
          options: ['تيار من مقبس قريب', 'تفريغ كهرباء ساكنة من جسمك', 'حرارة المقبض', 'مغناطيسية الباب'],
          correctAnswerIndex: 1
        }
      ],
      matching: [
        { id: 1, term: 'الشحنة الموجبة', definition: 'تحدث عندما تفقد الذرة إلكتروناً أو أكثر.' },
        { id: 2, term: 'الشحنة السالبة', definition: 'تحدث عندما تكتسب الذرة إلكتروناً أو أكثر.' },
        { id: 3, term: 'الموصل', definition: 'مادة تسمح بمرور الشحنات الكهربائية بسهولة.' },
        { id: 4, term: 'العازل', definition: 'مادة تقاوم مرور الشحنات الكهربائية.' },
        { id: 5, term: 'الشحن بالدلك', definition: 'شحن جسم عن طريق فركه بجسم آخر.' },
        { id: 6, term: 'الشحن بالحث', definition: 'شحن جسم عن بعد دون ملامسته.' },
        { id: 7, term: 'الكشاف الكهربائي', definition: 'جهاز للكشف عن وجود الشحنات الكهربائية.' },
        { id: 8, term: 'التأريض', definition: 'توصيل جسم بالأرض لتفريغ الشحنات الفائضة.' },
      ]
    }
  },
  {
    id: 2,
    title: 'الفصل الثاني: المغناطيسية (قريباً)',
    explanation: [],
    experiments: [],
    games: { quiz: [], matching: [] }
  }
];

// --- BUNDLED FROM components/icons/Icons.tsx ---
const LightningBoltIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

const BookOpenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const BeakerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.211 1.018l-2.43 3.965a2.25 2.25 0 01-1.72 1.052H4.5a2.25 2.25 0 01-2.25-2.25V6.354a2.25 2.25 0 012.25-2.25h5.25z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104c2.146 0 4.22.464 6.014 1.306m-6.014-1.306V1.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v1.229c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 019.75 3.104zM13.875 13.333a2.25 2.25 0 01-2.25-2.25V6.354c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v4.754a2.25 2.25 0 01-2.25 2.25h-1.125z" />
  </svg>
);

const PuzzleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.66.54-1.2 1.2-1.2h3.3c.66 0 1.2.54 1.2 1.2v3.3c0 .66-.54 1.2-1.2 1.2h-.675a.75.75 0 000 1.5h.675c.66 0 1.2.54 1.2 1.2v3.3c0 .66-.54 1.2-1.2 1.2h-3.3c-.66 0-1.2-.54-1.2-1.2v-3.3a.75.75 0 00-1.5 0v3.3c0 .66.54 1.2 1.2 1.2h3.3c.66 0 1.2-.54 1.2-1.2v-3.3a.75.75 0 00-1.5 0v-1.5h-1.5a.75.75 0 000 1.5h1.5v3.3c0 .66.54 1.2 1.2 1.2h3.3c.66 0 1.2-.54 1.2-1.2v-3.3a.75.75 0 000-1.5h-1.5a.75.75 0 00-1.5 0v1.5h-1.5v-1.5a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5h1.5v-1.5a.75.75 0 000-1.5h-1.5v-3.3c0-.66-.54-1.2-1.2-1.2h-3.3a.75.75 0 000 1.5h3.3c.66 0 1.2.54 1.2 1.2v.75a.75.75 0 001.5 0v-.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.087c0-.66.54-1.2 1.2-1.2h3.3c.66 0 1.2.54 1.2 1.2v3.3c0 .66-.54 1.2-1.2 1.2h-.675a.75.75 0 000 1.5h.675c.66 0 1.2.54 1.2 1.2v3.3c0 .66-.54 1.2-1.2 1.2h-3.3c-.66 0-1.2-.54-1.2-1.2v-3.3a.75.75 0 00-1.5 0v3.3c0 .66.54 1.2 1.2 1.2h3.3c.66 0 1.2-.54 1.2-1.2v-3.3a.75.75 0 00-1.5 0v-1.5H7.5a.75.75 0 000 1.5h.075v3.3c0 .66.54 1.2 1.2 1.2h3.3c.66 0 1.2-.54 1.2-1.2v-3.3a.75.75 0 000-1.5h-1.5a.75.75 0 00-1.5 0v1.5h-1.5v-1.5a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5h1.5v-1.5a.75.75 0 000-1.5H4.95v-3.3c0-.66.54-1.2 1.2-1.2h3.3a.75.75 0 000-1.5h-3.3c-.66 0-1.2.54-1.2 1.2v.75a.75.75 0 001.5 0v-.75z" />
  </svg>
);

const ArrowsRightLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h18m-7.5-12L21 9m0 0l-4.5 4.5M21 9H3" />
  </svg>
);

const ChevronDoubleRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 4.5l7.5 7.5-7.5 7.5m6-15l7.5 7.5-7.5 7.5" />
    </svg>
  );

// --- BUNDLED FROM components/ExplanationSection.tsx ---
interface ExplanationSectionProps {
  content: ExplanationContent[];
}

const ExplanationSection: React.FC<ExplanationSectionProps> = ({ content }) => {
  const slides = useMemo(() => {
    if (!content || content.length === 0) return [];

    const groupedSlides: ExplanationContent[][] = [];
    let currentSlide: ExplanationContent[] = [];

    content.forEach(item => {
      if (item.type === 'heading') {
        if (currentSlide.length > 0) {
          groupedSlides.push(currentSlide);
        }
        currentSlide = [item];
      } else {
        currentSlide.push(item);
      }
    });

    if (currentSlide.length > 0) {
      groupedSlides.push(currentSlide);
    }

    return groupedSlides;
  }, [content]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  if (slides.length === 0) {
    return <p className="text-center text-slate-400">لا يوجد محتوى شرح متاح لهذا الفصل.</p>;
  }

  const renderContentItem = (item: ExplanationContent, index: number) => {
    switch (item.type) {
      case 'heading':
        return <h3 key={index} className="text-2xl font-bold text-indigo-400 mt-6 border-b border-slate-700 pb-2">{item.content}</h3>;
      case 'paragraph':
        return <p key={index} className="text-slate-300 leading-relaxed text-lg">{item.content}</p>;
      case 'image':
        return <img key={index} src={item.content as string} alt="توضيح فيزيائي" className="rounded-lg shadow-xl mx-auto my-4 w-full max-w-xl" />;
      case 'list':
        return (
          <ul key={index} className="list-disc list-inside space-y-2 text-slate-300 text-lg">
            {(item.content as string[]).map((listItem, i) => (
              <li key={i}>{listItem}</li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div key={currentSlideIndex} className="space-y-6 animate-fade-in flex-1">
        {slides[currentSlideIndex].map(renderContentItem)}
      </div>
      
      <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-700">
        <button
          onClick={handlePrev}
          disabled={currentSlideIndex === 0}
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          السابق
        </button>
        <span className="text-slate-400 font-semibold">
          {currentSlideIndex + 1} / {slides.length}
        </span>
        <button
          onClick={handleNext}
          disabled={currentSlideIndex === slides.length - 1}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          التالي
        </button>
      </div>
    </div>
  );
};


// --- BUNDLED FROM components/ExperimentsSection.tsx ---
const BalloonExperiment: React.FC = () => {
    const [isCharged, setIsCharged] = useState(false);
    const [balloonPos, setBalloonPos] = useState({ x: 150, y: 50 });
    const [isDragging, setIsDragging] = useState(false);
    
    const balloonRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const initialPapersData = useMemo(() => Array.from({ length: 15 }, (_, i) => ({ 
        id: i, 
        x: Math.random() * 120, 
        y: Math.random() * 40,
        collected: false,
        stickPos: { x: 20 + Math.random() * 56, y: 20 + Math.random() * 92 }
    })), []);

    const [papers, setPapers] = useState(initialPapersData);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        setIsDragging(true);
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !balloonRef.current || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const balloonRect = balloonRef.current.getBoundingClientRect();

        let newX = e.clientX - containerRect.left - balloonRect.width / 2;
        let newY = e.clientY - containerRect.top - balloonRect.height / 2;

        newX = Math.max(0, Math.min(newX, containerRect.width - balloonRect.width));
        newY = Math.max(0, Math.min(newY, containerRect.height - balloonRect.height));

        setBalloonPos({ x: newX, y: newY });

        const woolRect = { x: 0, y: containerRef.current.offsetHeight - 160, width: 128, height: 160 };
        const isOverWool = 
            (newX + balloonRect.width) > woolRect.x &&
            newX < (woolRect.x + woolRect.width) &&
            (newY + balloonRect.height) > woolRect.y &&
            newY < (woolRect.y + woolRect.height);

        if (isOverWool) {
            if (!isCharged) setIsCharged(true);
        }

        if (isCharged) {
            const balloonCenterX = newX + balloonRect.width / 2;
            const balloonCenterY = newY + balloonRect.height / 2;

            setPapers(currentPapers => currentPapers.map(paper => {
                if (!paper.collected) {
                    const paperX = 250 + paper.x;
                    const paperY = containerRect.height - 70 + paper.y;
                    const distance = Math.sqrt(Math.pow(balloonCenterX - paperX, 2) + Math.pow(balloonCenterY - paperY, 2));
                    
                    if (distance < 90) { // Attraction radius
                        return { ...paper, collected: true };
                    }
                }
                return paper;
            }));
        }
    }, [isDragging, isCharged]);
    
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        const moveHandler = (e: MouseEvent) => handleMouseMove(e);
        const upHandler = () => handleMouseUp();

        if (isDragging) {
            window.addEventListener('mousemove', moveHandler);
            window.addEventListener('mouseup', upHandler);
        }
        return () => {
            window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('mouseup', upHandler);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const resetExperiment = () => {
        setIsCharged(false);
        setPapers(initialPapersData);
        setBalloonPos({ x: 150, y: 50 });
    };
    
    const collectedCount = papers.filter(p => p.collected).length;

    return (
        <div className="bg-slate-800 p-6 rounded-lg shadow-inner mt-4">
            <h4 className="text-xl font-bold text-indigo-400 mb-2">تجربة البالون وقصاصات الورق</h4>
            <p className="text-sm text-slate-400 mb-4">اسحب البالون وافركه فوق الصوف. ستلاحظ ظهور شحنات سالبة (-) عليه. ثم قربه من القصاصات وشاهدها تنجذب!</p>
            <div ref={containerRef} className="relative h-96 border border-dashed border-slate-600 rounded-lg p-4 flex justify-between items-end overflow-hidden select-none">
                <style>{`
                    @keyframes sparkle { 0% { transform: scale(1) rotate(0deg); opacity: 0.7; } 100% { transform: scale(2.5) rotate(90deg); opacity: 0; } }
                    .animate-sparkle { animation: sparkle 0.6s ease-out; }
                `}</style>
                <div className="w-32 h-40 bg-green-700 rounded-lg flex items-center justify-center text-center z-0">
                    <p className="font-bold text-lg">صوف</p>
                </div>
                
                {papers.map(paper => (
                    <div 
                        key={paper.id} 
                        className="absolute w-3 h-3 bg-white transform rotate-45 transition-all duration-300 ease-out z-20"
                        style={ paper.collected ? { left: balloonPos.x + paper.stickPos.x, top: balloonPos.y + paper.stickPos.y } : { left: 250 + paper.x, top: `calc(100% - 70px + ${paper.y}px)` } }
                    />
                ))}
                
                <div
                    ref={balloonRef}
                    className={`absolute w-24 h-32 rounded-full flex items-center justify-center text-black font-bold transition-all duration-300 z-10 ${isDragging ? 'cursor-grabbing scale-105' : 'cursor-grab'} ${isCharged ? 'bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.7)]' : 'bg-red-500'}`}
                    style={{ left: balloonPos.x, top: balloonPos.y }}
                    onMouseDown={handleMouseDown}
                >
                    {isCharged && Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="absolute text-white font-bold text-2xl select-none pointer-events-none" style={{ top: `${15 + Math.random() * 60}%`, left: `${15 + Math.random() * 60}%`}}>-</div>
                    ))}
                </div>
            </div>
            <div className="mt-4 flex justify-between items-center text-slate-400">
                <div>
                    <p>حالة البالون: {isCharged ? <span className="text-yellow-400 font-bold">مشحون</span> : 'غير مشحون'}</p>
                    <p>القصاصات الملتصقة: {collectedCount} / {papers.length}</p>
                </div>
                <button onClick={resetExperiment} className="px-4 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-semibold transition-colors">إعادة التجربة</button>
            </div>
        </div>
    );
};

const Charge: React.FC<{ type: 'p' | 'n', x: number, y: number }> = ({ type, x, y }) => (
    <div
        className={`absolute w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-sm transition-all duration-500 ease-in-out`}
        style={{
            left: `${x}px`,
            top: `${y}px`,
            transform: 'translate(-50%, -50%)', // Center the charge on the coordinates
            backgroundColor: type === 'p' ? 'rgba(239, 68, 68, 0.7)' : 'rgba(59, 130, 246, 0.7)',
            color: 'white',
            border: `1px solid ${type === 'p' ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.5)'}`
        }}
    >
        {type === 'p' ? '+' : '-'}
    </div>
);

const ElectroscopeExperiment: React.FC = () => {
    const [rodPos, setRodPos] = useState({ x: 20, y: 20 });
    const [isDragging, setIsDragging] = useState(false);
    const rodRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const initialCharges = useMemo(() => {
        const charges = [];
        // Generate 8 pairs of + and - charges
        for (let i = 0; i < 8; i++) {
            charges.push({ id: `p${i}`, type: 'p' as const, x: Math.random() * 30 + 175, y: Math.random() * 150 + 20 });
            charges.push({ id: `n${i}`, type: 'n' as const, x: Math.random() * 30 + 175, y: Math.random() * 150 + 20 });
        }
        return charges;
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        setIsDragging(true);
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !rodRef.current || !containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const rodRect = rodRef.current.getBoundingClientRect();
        let newX = e.clientX - containerRect.left - rodRect.width / 2;
        let newY = e.clientY - containerRect.top - rodRect.height / 2;
        newX = Math.max(0, Math.min(newX, containerRect.width - rodRect.width));
        newY = Math.max(0, Math.min(newY, containerRect.height - rodRect.height));
        setRodPos({ x: newX, y: newY });
    }, [isDragging]);
    
    const handleMouseUp = useCallback(() => setIsDragging(false), []);

    useEffect(() => {
        const moveHandler = (e: MouseEvent) => handleMouseMove(e);
        const upHandler = () => handleMouseUp();
        if (isDragging) {
            window.addEventListener('mousemove', moveHandler);
            window.addEventListener('mouseup', upHandler);
        }
        return () => {
            window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('mouseup', upHandler);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);
    
    const { leafAngle, isClose } = useMemo(() => {
        if (!containerRef.current || !rodRef.current) return { leafAngle: 2, isClose: false };
        const containerRect = containerRef.current.getBoundingClientRect();
        const electroscopeDiscX = containerRect.width / 2;
        const electroscopeDiscY = 50;
        const rodCenterX = rodPos.x + rodRef.current.offsetWidth / 2;
        const rodCenterY = rodPos.y + rodRef.current.offsetHeight / 2;
        const distance = Math.sqrt(Math.pow(rodCenterX - electroscopeDiscX, 2) + Math.pow(rodCenterY - electroscopeDiscY, 2));
        const maxAngle = 30;
        const maxDistance = 150;
        let angle = 2;
        if (distance < maxDistance) {
            angle = maxAngle * (1 - distance / maxDistance);
        }
        return { leafAngle: angle, isClose: angle > 5 };
    }, [rodPos]);

    const chargePositions = useMemo(() => {
        const discCenter = { x: 190, y: 30 };
        const leftLeafPos = { x: 180, y: 150 };
        const rightLeafPos = { x: 200, y: 150 };

        return initialCharges.map(charge => {
            if (isClose) {
                if (charge.type === 'n') { // Electrons are repelled
                    const isLeft = parseInt(charge.id.substring(1)) % 2 === 0;
                    return { ...charge, x: (isLeft ? leftLeafPos.x : rightLeafPos.x) + Math.random()*10 - 5, y: leftLeafPos.y + Math.random()*50 };
                } else { // Protons are attracted
                    return { ...charge, x: discCenter.x + Math.random()*40 - 20, y: discCenter.y + Math.random()*40 - 20 };
                }
            }
            // Neutral state: spread them out
            return { ...charge, x: discCenter.x + Math.random()*10 - 5, y: 80 + Math.random()*100 };
        });
    }, [isClose, initialCharges]);

    return (
        <div className="bg-slate-800 p-6 rounded-lg shadow-inner mt-4">
            <h4 className="text-xl font-bold text-indigo-400 mb-2">محاكاة الكشاف الكهربائي</h4>
            <p className="text-sm text-slate-400 mb-4">اسحب الساق المشحونة وقربها من قرص الكشاف. لاحظ كيف تبتعد الشحنات السالبة (-) وتتجمع في الورقتين، مسببة تنافرهما.</p>
            <div ref={containerRef} className="relative h-96 border border-dashed border-slate-600 rounded-lg p-4 flex justify-center items-center select-none overflow-hidden">
                
                {chargePositions.map(c => <Charge key={c.id} type={c.type} x={c.x} y={c.y} />)}

                <div className="relative w-40 h-64 flex flex-col items-center z-10">
                    <div className="w-20 h-5 bg-yellow-300/80 rounded-t-md z-10" /> 
                    <div className="w-2 h-24 bg-yellow-300/80" />
                    <div className="absolute bottom-0 w-32 h-32 border-2 border-slate-500 rounded-b-full rounded-t-lg bg-slate-900/30 backdrop-blur-sm"></div>
                    <div className="absolute" style={{top: '115px'}}>
                        <div className="absolute left-1/2 -ml-1 w-2 h-16 bg-yellow-500/80 origin-top transition-transform duration-300" style={{ transform: `rotate(-${leafAngle}deg)` }} />
                        <div className="absolute left-1/2 -ml-1 w-2 h-16 bg-yellow-500/80 origin-top transition-transform duration-300" style={{ transform: `rotate(${leafAngle}deg)` }} />
                    </div>
                </div>

                <div 
                    ref={rodRef}
                    className={`absolute w-40 h-8 bg-blue-500 rounded-full flex items-center justify-evenly text-white font-bold text-2xl transition-all duration-200 z-20 ${isDragging ? 'cursor-grabbing scale-105 shadow-2xl' : 'cursor-grab'}`}
                    style={{ left: rodPos.x, top: rodPos.y }}
                    onMouseDown={handleMouseDown}
                >
                    <span>-</span><span>-</span><span>-</span><span>-</span><span>-</span>
                </div>

            </div>
            <p className="mt-4 text-center text-slate-400 h-12 flex items-center justify-center transition-opacity">
                {isClose ? "تتنافر الإلكترونات (-) من الساق وتتجمع في الورقتين، فتكتسبان شحنة سالبة وتتنافران." : "الكشاف متعادل والورقتان منطبقتان."}
            </p>
        </div>
    );
};

const InductionSphereExperiment: React.FC = () => {
    const [rodPos, setRodPos] = useState({ x: 20, y: 130 });
    const [isDragging, setIsDragging] = useState(false);
    const rodRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [isGrounded, setIsGrounded] = useState(false);
    const [sphereIsCharged, setSphereIsCharged] = useState(false);
    const groundingTimer = useRef<number | null>(null);

    const initialCharges = useMemo(() => {
        const charges = [];
        for (let i = 0; i < 8; i++) {
            charges.push({ id: `p${i}`, type: 'p' as const });
            charges.push({ id: `n${i}`, type: 'n' as const });
        }
        return charges;
    }, []);

    const handleRodMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        setIsDragging(true);
    };

    const handleRodMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !rodRef.current || !containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const rodRect = rodRef.current.getBoundingClientRect();
        let newX = e.clientX - containerRect.left - rodRect.width / 2;
        let newY = e.clientY - containerRect.top - rodRect.height / 2;
        newX = Math.max(0, Math.min(newX, containerRect.width - rodRect.width));
        newY = Math.max(0, Math.min(newY, containerRect.height - rodRect.height));
        setRodPos({ x: newX, y: newY });
    }, [isDragging]);

    const handleRodMouseUp = useCallback(() => setIsDragging(false), []);

    useEffect(() => {
        const moveHandler = (e: MouseEvent) => handleRodMouseMove(e);
        const upHandler = () => handleRodMouseUp();
        if (isDragging) {
            window.addEventListener('mousemove', moveHandler);
            window.addEventListener('mouseup', upHandler);
        }
        return () => {
            window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('mouseup', upHandler);
        };
    }, [isDragging, handleRodMouseMove, handleRodMouseUp]);

    const rodIsClose = useMemo(() => {
        if (!containerRef.current || !rodRef.current) return false;
        const containerRect = containerRef.current.getBoundingClientRect();
        const sphereCenterX = containerRect.width / 2;
        const rodRightX = rodPos.x + rodRef.current.offsetWidth;
        const distance = sphereCenterX - rodRightX;
        return distance < 100;
    }, [rodPos]);

    const handleGroundMouseDown = () => {
        if (rodIsClose) {
            setIsGrounded(true);
            groundingTimer.current = window.setTimeout(() => {
                setSphereIsCharged(true);
            }, 400);
        }
    };
    const handleGroundMouseUp = () => {
        setIsGrounded(false);
        if (groundingTimer.current) {
            clearTimeout(groundingTimer.current);
        }
    };

    const resetExperiment = () => {
        setSphereIsCharged(false);
        setIsGrounded(false);
        setRodPos({ x: 20, y: 130 });
    };

    const chargePositions = useMemo(() => {
        const sphereCenter = { x: 88, y: 88 }; // Center of the 176x176 sphere div
        const sphereRadius = 75;

        let chargesToRender = initialCharges;
        if (sphereIsCharged) {
            chargesToRender = initialCharges.filter(c => c.type === 'p');
        }

        return chargesToRender.map(charge => {
            let angle, radius;
            const randomFactor = sphereRadius * (0.2 + Math.random() * 0.75);

            if (rodIsClose) {
                if (charge.type === 'p') {
                    // Attracted to the rod (left side)
                    angle = Math.PI + (Math.random() - 0.5) * (Math.PI / 1.5);
                    radius = randomFactor;
                } else { // 'n' charges are repelled (right side)
                    angle = (Math.random() - 0.5) * (Math.PI / 1.5);
                    radius = randomFactor;
                }
            } else { // Rod is far away, distribute evenly
                angle = Math.random() * 2 * Math.PI;
                radius = randomFactor;
            }
            
            // For grounded electrons, move them out of sight
            if (isGrounded && rodIsClose && charge.type === 'n') {
                return { ...charge, x: sphereCenter.x + sphereRadius + 50, y: sphereCenter.y, grounded: true };
            }

            return { ...charge, x: sphereCenter.x + Math.cos(angle) * radius, y: sphereCenter.y + Math.sin(angle) * radius, grounded: false };
        });
    }, [rodIsClose, isGrounded, sphereIsCharged, initialCharges]);
    
    let instruction = "قرّب الساق السالبة من الكرة المعدنية.";
    if (rodIsClose && !sphereIsCharged && !isGrounded) {
        instruction = "ممتاز! الآن المس الكرة لتفريغ الشحنات السالبة (اضغط باستمرار على زر 'تأريض الكرة').";
    } else if (isGrounded) {
        instruction = "يتم الآن تفريغ الشحنات السالبة... ارفع إصبعك (أوقف التأريض) قبل إبعاد الساق.";
    } else if (rodIsClose && sphereIsCharged && !isGrounded) {
        instruction = "أحسنت! الآن أبعد الساق لترى توزع الشحنة الموجبة الصافية على الكرة.";
    } else if (!rodIsClose && sphereIsCharged) {
        instruction = "نجحت! لقد تم شحن الكرة بشحنة موجبة عن طريق الحث.";
    }

    return (
        <div className="bg-slate-800 p-6 rounded-lg shadow-inner mt-4">
            <h4 className="text-xl font-bold text-indigo-400 mb-2">تجربة الشحن بالحث</h4>
            <p className="text-sm text-slate-400 mb-4">استخدم الساق المشحونة لشحن الكرة المعدنية بالحث. اتبع الخطوات لفصل الشحنات وترك الكرة بشحنة صافية.</p>
            <div ref={containerRef} className="relative h-96 border border-dashed border-slate-600 rounded-lg p-4 flex justify-center items-center select-none overflow-hidden">
                <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-44 h-44 bg-gray-400 rounded-full shadow-inner border-2 border-gray-300 relative overflow-hidden">
                    {chargePositions.map(c => (
                        <Charge key={c.id} type={c.type} x={c.x} y={c.y} />
                    ))}
                </div>
                
                {isGrounded && rodIsClose && (
                    <div className="absolute w-1 h-28 bg-cyan-400/70" style={{ left: 'calc(50% + 88px)', top: '170px' }} />
                )}

                <div 
                    ref={rodRef}
                    className={`absolute w-40 h-8 bg-blue-500 rounded-full flex items-center justify-evenly text-white font-bold text-2xl transition-all duration-200 z-20 ${isDragging ? 'cursor-grabbing scale-105 shadow-2xl' : 'cursor-grab'}`}
                    style={{ left: rodPos.x, top: rodPos.y }}
                    onMouseDown={handleRodMouseDown}
                >
                    <span>-</span><span>-</span><span>-</span><span>-</span><span>-</span>
                </div>
            </div>
             <div className="mt-4 flex justify-between items-center">
                 <p className="text-center text-amber-300 h-12 flex items-center justify-center transition-opacity text-sm sm:text-base w-2/3">
                    {instruction}
                </p>
                <div className="flex gap-2">
                    <button 
                        onMouseDown={handleGroundMouseDown} 
                        onMouseUp={handleGroundMouseUp}
                        onTouchStart={handleGroundMouseDown}
                        onTouchEnd={handleGroundMouseUp}
                        disabled={!rodIsClose || sphereIsCharged}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        تأريض الكرة
                    </button>
                    <button onClick={resetExperiment} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-semibold transition-colors">إعادة</button>
                </div>
            </div>
        </div>
    );
};

const CoulombsLawExperiment: React.FC = () => {
    const [q1, setQ1] = useState(5); // Positive charge
    const [q2, setQ2] = useState(-5); // Negative charge, but we use its absolute for force magnitude
    const [charge2Pos, setCharge2Pos] = useState({ x: 350, y: 150 });
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const charge2Ref = useRef<HTMLDivElement>(null);

    const charge1Pos = useMemo(() => ({ x: 100, y: 150 }), []);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (e.button !== 0) return;
        setIsDragging(true);
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !charge2Ref.current || !containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const chargeRect = charge2Ref.current.getBoundingClientRect();
        let newX = e.clientX - containerRect.left - chargeRect.width / 2;
        newX = Math.max(charge1Pos.x + 50, Math.min(newX, containerRect.width - chargeRect.width));
        setCharge2Pos({ x: newX, y: charge1Pos.y });
    }, [isDragging, charge1Pos]);

    const handleMouseUp = useCallback(() => setIsDragging(false), []);

    useEffect(() => {
        const moveHandler = (e: MouseEvent) => handleMouseMove(e);
        const upHandler = () => handleMouseUp();
        if (isDragging) {
            window.addEventListener('mousemove', moveHandler);
            window.addEventListener('mouseup', upHandler);
        }
        return () => {
            window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('mouseup', upHandler);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const { distance, force } = useMemo(() => {
        const K = 8.99 * Math.pow(10, 9); // Coulomb's constant
        const distPx = charge2Pos.x - charge1Pos.x;
        const distMeters = distPx / 1000; // Arbitrary scale: 1000px = 1m
        const q1Coulombs = q1 * 1e-6; // Convert µC to C
        const q2Coulombs = q2 * 1e-6; // Convert µC to C
        
        if (distMeters === 0) return { distance: 0, force: Infinity };
        
        const forceVal = (K * Math.abs(q1Coulombs * q2Coulombs)) / Math.pow(distMeters, 2);
        return { distance: distMeters, force: forceVal };
    }, [q1, q2, charge1Pos, charge2Pos]);

    return (
        <div className="bg-slate-800 p-6 rounded-lg shadow-inner mt-4">
            <h4 className="text-xl font-bold text-indigo-400 mb-2">محاكاة قانون كولوم</h4>
            <p className="text-sm text-slate-400 mb-4">
                القوة (F) بين شحنتين تتناسب طردياً مع حاصل ضرب مقدار الشحنتين (q1, q2) وعكسياً مع مربع المسافة (r) بينهما.
            </p>
            <div ref={containerRef} className="relative h-80 border border-dashed border-slate-600 rounded-lg p-4 flex items-center select-none overflow-hidden">
                <div 
                    className="absolute w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-lg"
                    style={{ left: charge1Pos.x - 20, top: charge1Pos.y - 20 }}
                >+</div>

                <div 
                    ref={charge2Ref}
                    className={`absolute w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                    style={{ left: charge2Pos.x - 20, top: charge2Pos.y - 20 }}
                    onMouseDown={handleMouseDown}
                >-</div>

                {/* Force Arrow */}
                <div 
                    className="absolute h-1 bg-yellow-400 origin-left transition-all"
                    style={{
                        left: charge1Pos.x,
                        top: charge1Pos.y,
                        width: `${Math.min(charge2Pos.x - charge1Pos.x - 20, 300)}px`,
                        transform: `scaleX(${Math.min(force / 1000, 1)})`,
                        opacity: 0.7
                    }}
                />
                 <div 
                    className="absolute h-1 bg-yellow-400 origin-right transition-all"
                    style={{
                        left: `${charge1Pos.x + 20}px`,
                        top: charge1Pos.y,
                        width: `${Math.min(charge2Pos.x - charge1Pos.x - 20, 300)}px`,
                        transform: `scaleX(${Math.min(force / 1000, 1)}) rotate(180deg)`,
                        opacity: 0.7
                    }}
                />

                {/* Distance line */}
                <div className="absolute w-full h-px bg-slate-600 border-t border-dashed" style={{ top: charge1Pos.y }} />
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-300">
                <div className="space-y-2">
                    <label htmlFor="q1">الشحنة الأولى (q1): {q1} µC</label>
                    <input type="range" id="q1" min="1" max="10" value={q1} onChange={(e) => setQ1(Number(e.target.value))} className="w-full" />
                </div>
                <div className="space-y-2">
                    <label htmlFor="q2">الشحنة الثانية (q2): {q2} µC</label>
                    <input type="range" id="q2" min="-10" max="-1" value={q2} onChange={(e) => setQ2(Number(e.target.value))} className="w-full" />
                </div>
                <div className="bg-slate-900/50 p-3 rounded-lg text-center">
                    <p className="text-sm text-slate-400">القوة المحسوبة (F)</p>
                    <p className="text-xl font-bold text-amber-400">{force.toExponential(2)} N</p>
                </div>
            </div>
        </div>
    );
};


interface ExperimentsSectionProps {
  experiments: { id: number; title: string; description: string }[];
}

const ExperimentsSection: React.FC<ExperimentsSectionProps> = ({ experiments }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {experiments.map((exp) => (
        <div key={exp.id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <h3 className="text-2xl font-bold text-indigo-400">{exp.title}</h3>
          <p className="text-slate-300 mt-2">{exp.description}</p>
          
          {exp.id === 1 && <BalloonExperiment />}
          {exp.id === 2 && <ElectroscopeExperiment />}
          {exp.id === 3 && <InductionSphereExperiment />}
          {exp.id === 4 && <CoulombsLawExperiment />}

        </div>
      ))}
    </div>
  );
};


// --- BUNDLED FROM components/GamesSection.tsx ---
const QuizGame: React.FC<{ quiz: QuizQuestion[] }> = ({ quiz }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = quiz[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswerIndex;
  
  const handleAnswer = (answerIndex: number) => {
    if (showFeedback) return;
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);
    if (answerIndex === currentQuestion.correctAnswerIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsFinished(false);
  };
  
  if(isFinished) {
    const percentage = Math.round((score / quiz.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-800 rounded-lg animate-fade-in text-center">
        <h3 className="text-3xl font-bold text-white">انتهى الاختبار!</h3>
        <p className="text-xl text-slate-300 mt-4">
          نتيجتك النهائية هي: <span className="font-bold text-indigo-400">{score}</span> من <span className="font-bold">{quiz.length}</span>
        </p>
         <div className="w-full bg-slate-700 rounded-full h-4 mt-4 overflow-hidden">
            <div 
              className="bg-indigo-600 h-4 rounded-full transition-all duration-500" 
              style={{width: `${percentage}%`}}
            ></div>
        </div>
        <p className="text-2xl font-bold mt-2" style={{color: percentage > 60 ? '#34D399' : '#F87171'}}>{percentage}%</p>
        <button onClick={restartQuiz} className="mt-8 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
          إعادة الاختبار
        </button>
      </div>
    );
  }

  if (!currentQuestion) {
    return <p>لا توجد أسئلة متاحة.</p>;
  }
  
  return (
    <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-indigo-400">سؤال {currentQuestionIndex + 1} / {quiz.length}</h3>
            <p className="font-bold text-white">النتيجة: {score}</p>
        </div>
      <h4 className="text-2xl font-bold text-white mb-6">{currentQuestion.question}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          let buttonClass = 'bg-slate-700 hover:bg-slate-600';
          if (showFeedback && isSelected) {
            buttonClass = isCorrect ? 'bg-green-500' : 'bg-red-500';
          } else if (showFeedback && index === currentQuestion.correctAnswerIndex) {
            buttonClass = 'bg-green-500';
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showFeedback}
              className={`p-4 rounded-lg text-start font-medium transition-all duration-200 text-white ${buttonClass} ${!showFeedback ? 'cursor-pointer' : 'cursor-default'}`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {showFeedback && (
        <div className="mt-6 text-center">
          <p className={`text-xl font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? 'إجابة صحيحة!' : 'إجابة خاطئة!'}
          </p>
          <button onClick={handleNext} className="mt-4 px-8 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
            {currentQuestionIndex < quiz.length - 1 ? 'السؤال التالي' : 'عرض النتيجة'}
          </button>
        </div>
      )}
    </div>
  );
};

const MatchingGame: React.FC<{ items: MatchingGameItem[] }> = ({ items }) => {
    const [terms, setTerms] = useState<MatchingGameItem[]>([]);
    const [definitions, setDefinitions] = useState<MatchingGameItem[]>([]);
    const [matchedPairs, setMatchedPairs] = useState<Record<number, boolean>>({});
    const [draggedItemId, setDraggedItemId] = useState<number | null>(null);

    const shuffleArray = (array: MatchingGameItem[]) => [...array].sort(() => Math.random() - 0.5);

    const resetGame = useCallback(() => {
        setTerms(items);
        setDefinitions(shuffleArray(items));
        setMatchedPairs({});
    }, [items]);

    useEffect(() => {
        resetGame();
    }, [items, resetGame]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
        setDraggedItemId(id);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', id.toString());
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, termId: number) => {
        e.preventDefault();
        const definitionId = Number(e.dataTransfer.getData('text/plain'));
        if (termId === definitionId) {
            setMatchedPairs(prev => ({ ...prev, [termId]: true }));
        }
        setDraggedItemId(null);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); 
    };

    const allMatched = Object.keys(matchedPairs).length === items.length;

    if (allMatched) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-slate-800 rounded-lg animate-fade-in text-center">
                <h3 className="text-3xl font-bold text-green-400">أحسنت!</h3>
                <p className="text-xl text-slate-300 mt-4">لقد أكملت لعبة التوصيل بنجاح.</p>
                <button onClick={resetGame} className="mt-8 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                    إعادة اللعبة
                </button>
            </div>
        );
    }
    
    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-indigo-400">صل بين المفهوم والتعريف الصحيح</h3>
              <button onClick={resetGame} className="px-4 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-semibold transition-colors">إعادة</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Terms Column */}
                <div className="space-y-4">
                    {terms.map(term => (
                        <div
                            key={term.id}
                            onDrop={(e) => handleDrop(e, term.id)}
                            onDragOver={handleDragOver}
                            className={`p-4 rounded-lg text-white font-semibold transition-colors
                                ${matchedPairs[term.id] ? 'bg-green-600/50 border-green-500' : 'bg-slate-700 border-slate-600'}
                                border-2 border-dashed h-20 flex items-center justify-center`}
                        >
                            {matchedPairs[term.id] ? <del>{term.term}</del> : term.term}
                        </div>
                    ))}
                </div>
                {/* Definitions Column */}
                <div className="space-y-4">
                    {definitions.map(def => matchedPairs[def.id] ? (
                        <div key={def.id} className="p-4 rounded-lg bg-slate-800/50 text-slate-500 h-20 flex items-center">{def.definition}</div>
                    ) : (
                        <div
                            key={def.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, def.id)}
                            className={`p-4 rounded-lg bg-indigo-600 text-white cursor-grab active:cursor-grabbing transition-opacity
                                ${draggedItemId === def.id ? 'opacity-50' : 'opacity-100'} h-20 flex items-center`}
                        >
                            {def.definition}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

interface GamesSectionProps {
  quiz: QuizQuestion[];
  matching: MatchingGameItem[];
}

const GamesSection: React.FC<GamesSectionProps> = ({ quiz, matching }) => {
  const [activeGame, setActiveGame] = useState<'quiz' | 'matching'>('quiz');

  // Reset to quiz when chapter changes
  useEffect(() => {
    setActiveGame('quiz');
  }, [quiz, matching]);

  return (
    <div className="p-4 sm:p-6 bg-slate-800/50 rounded-lg border border-slate-700 animate-fade-in">
       <div className="flex items-center gap-4 mb-6 border-b border-slate-700 pb-4">
         <h3 className="text-xl font-bold text-white">اختر لعبة:</h3>
         <button onClick={() => setActiveGame('quiz')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${activeGame === 'quiz' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
           <PuzzleIcon className="w-5 h-5" />
           اختيار من متعدد
         </button>
         <button onClick={() => setActiveGame('matching')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${activeGame === 'matching' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
           <ArrowsRightLeftIcon className="w-5 h-5" />
           لعبة التوصيل
         </button>
       </div>
       
       {activeGame === 'quiz' && <QuizGame quiz={quiz} />}
       {activeGame === 'matching' && <MatchingGame items={matching} />}
    </div>
  );
};


// --- BUNDLED FROM components/ChapterContent.tsx ---
interface ChapterContentProps {
  chapter: Chapter;
}

const ChapterContent: React.FC<ChapterContentProps> = ({ chapter }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('explanation');

  const tabs = [
    { key: 'explanation', label: 'الشرح', icon: <BookOpenIcon className="w-5 h-5" /> },
    { key: 'experiments', label: 'التجارب', icon: <BeakerIcon className="w-5 h-5" /> },
    { key: 'games', label: 'ألعاب ومسابقات', icon: <PuzzleIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="flex flex-col md:h-full">
      <h2 className="text-3xl font-bold text-white mb-4 pb-4 border-b-2 border-slate-700">{chapter.title}</h2>
      
      <div className="flex items-center gap-2 border-b border-slate-700 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as TabKey)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 font-semibold transition-colors duration-200 border-b-2 ${
              activeTab === tab.key
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="md:flex-1 md:overflow-y-auto md:pr-2">
        {activeTab === 'explanation' && <ExplanationSection content={chapter.explanation} />}
        {activeTab === 'experiments' && <ExperimentsSection experiments={chapter.experiments} />}
        {activeTab === 'games' && <GamesSection quiz={chapter.games.quiz} matching={chapter.games.matching} />}
      </div>
    </div>
  );
};


// --- BUNDLED FROM components/Sidebar.tsx ---
interface SidebarProps {
  chapters: Chapter[];
  selectedChapterId: number;
  setSelectedChapterId: (id: number) => void;
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ chapters, selectedChapterId, setSelectedChapterId, isCollapsed }) => {
  return (
    <aside className={`bg-slate-800/50 border-s border-slate-700/50 flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-0 p-0 overflow-hidden' : 'w-64 p-4'}`}>
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <LightningBoltIcon className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-white">مختبر الفيزياء</h1>
      </div>
      <nav className="flex flex-col gap-2">
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            onClick={() => chapter.id < 2 && setSelectedChapterId(chapter.id)}
            disabled={chapter.id >= 2}
            className={`px-4 py-2 text-start rounded-lg transition-colors duration-200 ${
              selectedChapterId === chapter.id
                ? 'bg-indigo-600 text-white font-semibold shadow-lg'
                : 'text-slate-300 hover:bg-slate-700/50'
            } ${chapter.id >= 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {chapter.title}
          </button>
        ))}
      </nav>
      <div className="mt-auto text-center text-xs text-slate-500">
        <p>تصميم وتطوير بواسطة مهندس الواجهات الأمامية الخبير</p>
      </div>
    </aside>
  );
};


// --- BUNDLED FROM App.tsx ---
const App: React.FC = () => {
  const [selectedChapterId, setSelectedChapterId] = useState<number>(1);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const selectedChapter = chapters.find(c => c.id === selectedChapterId) as Chapter;

  return (
    <div className="flex h-screen bg-slate-900 text-slate-200 relative">
      <Sidebar 
        chapters={chapters} 
        selectedChapterId={selectedChapterId} 
        setSelectedChapterId={setSelectedChapterId}
        isCollapsed={isSidebarCollapsed}
      />
       <button
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className="absolute top-1/2 -translate-y-1/2 z-20 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-full p-1.5 transition-all duration-300 ease-in-out"
        style={{ right: isSidebarCollapsed ? '0.5rem' : 'calc(16rem - 20px)' }}
        aria-label={isSidebarCollapsed ? "إظهار اللوحة الجانبية" : "إخفاء اللوحة الجانبية"}
      >
        <ChevronDoubleRightIcon className={`w-6 h-6 text-slate-300 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
      </button>
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        {selectedChapter ? (
          <ChapterContent key={selectedChapter.id} chapter={selectedChapter} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-2xl text-slate-500">الرجاء اختيار فصل للبدء.</p>
          </div>
        )}
      </main>
    </div>
  );
};


// --- ORIGINAL index.tsx RENDER LOGIC ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);